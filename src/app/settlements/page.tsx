'use client';

import { useState, useMemo } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { mockCases } from '@/lib/mock-data';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import {
  Calculator,
  DollarSign,
  Plus,
  Minus,
  Percent,
  FileText,
  Download,
  Printer,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  PiggyBank,
  Receipt,
  Scale,
  Building2,
  Heart,
  Briefcase,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function SettlementsPage() {
  // Settlement Calculator State
  const [grossSettlement, setGrossSettlement] = useState(100000);
  const [attorneyFeePercent, setAttorneyFeePercent] = useState(33.33);
  const [feeType, setFeeType] = useState<'pre-litigation' | 'litigation'>('pre-litigation');

  // Liens
  const [liens, setLiens] = useState([
    { id: 1, name: 'VCU Health System', type: 'hospital', amount: 15000, negotiated: 10000, status: 'pending' },
    { id: 2, name: 'Medicare', type: 'medicare', amount: 5000, negotiated: 3500, status: 'confirmed' },
    { id: 3, name: 'Blue Cross Blue Shield', type: 'health_insurance', amount: 8000, negotiated: 4000, status: 'pending' },
  ]);

  // Case Expenses
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Medical Records Fees', amount: 250 },
    { id: 2, description: 'Police Report', amount: 25 },
    { id: 3, description: 'Expert Witness Fee', amount: 5000 },
    { id: 4, description: 'Court Filing Fee', amount: 350 },
  ]);

  const [showAddLien, setShowAddLien] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  // Calculations
  const calculations = useMemo(() => {
    const attorneyFee = grossSettlement * (attorneyFeePercent / 100);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalLiensOriginal = liens.reduce((sum, l) => sum + l.amount, 0);
    const totalLiensNegotiated = liens.reduce((sum, l) => sum + (l.negotiated || l.amount), 0);
    const lienSavings = totalLiensOriginal - totalLiensNegotiated;
    const clientNet = grossSettlement - attorneyFee - totalExpenses - totalLiensNegotiated;
    const firmRevenue = attorneyFee - totalExpenses;

    return {
      grossSettlement,
      attorneyFee,
      attorneyFeePercent,
      totalExpenses,
      totalLiensOriginal,
      totalLiensNegotiated,
      lienSavings,
      clientNet,
      firmRevenue,
      clientPercentage: (clientNet / grossSettlement) * 100,
    };
  }, [grossSettlement, attorneyFeePercent, liens, expenses]);

  const lienTypeConfig: Record<string, { label: string; color: string; icon: typeof Building2 }> = {
    hospital: { label: 'Hospital', color: 'text-red-600', icon: Building2 },
    medicare: { label: 'Medicare', color: 'text-blue-600', icon: Building2 },
    medicaid: { label: 'Medicaid', color: 'text-green-600', icon: Building2 },
    health_insurance: { label: 'Health Insurance', color: 'text-purple-600', icon: Heart },
    workers_comp: { label: "Workers' Comp", color: 'text-orange-600', icon: Briefcase },
    other: { label: 'Other', color: 'text-gray-600', icon: FileText },
  };

  const addLien = () => {
    setLiens([...liens, { id: Date.now(), name: '', type: 'hospital', amount: 0, negotiated: 0, status: 'pending' }]);
  };

  const removeLien = (id: number) => {
    setLiens(liens.filter(l => l.id !== id));
  };

  const addExpense = () => {
    setExpenses([...expenses, { id: Date.now(), description: '', amount: 0 }]);
  };

  const removeExpense = (id: number) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settlement Calculator</h1>
          <p className="text-gray-500 mt-1">
            Calculate settlements, track liens, and generate disbursement sheets.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Printer className="w-4 h-4" />}>
            Print
          </Button>
          <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
            Export PDF
          </Button>
          <Button leftIcon={<Send className="w-4 h-4" />}>
            Send to Client
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Input */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gross Settlement */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h2 className="font-semibold text-gray-900">Settlement Amount</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gross Settlement</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
                    <input
                      type="number"
                      value={grossSettlement}
                      onChange={(e) => setGrossSettlement(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 text-2xl font-bold bg-white border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Case</label>
                  <Select
                    options={mockCases.map(c => ({
                      value: c.id,
                      label: `${c.caseNumber} - ${c.client?.firstName} ${c.client?.lastName}`,
                    }))}
                    placeholder="Select case (optional)"
                    className="py-3"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Attorney Fees */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary-600" />
                <h2 className="font-semibold text-gray-900">Attorney Fees</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fee Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setFeeType('pre-litigation'); setAttorneyFeePercent(33.33); }}
                      className={cn(
                        'p-3 rounded-lg border-2 transition-all text-left',
                        feeType === 'pre-litigation'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <p className="font-semibold text-gray-900">Pre-Litigation</p>
                      <p className="text-sm text-gray-500">33.33%</p>
                    </button>
                    <button
                      onClick={() => { setFeeType('litigation'); setAttorneyFeePercent(40); }}
                      className={cn(
                        'p-3 rounded-lg border-2 transition-all text-left',
                        feeType === 'litigation'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <p className="font-semibold text-gray-900">Litigation</p>
                      <p className="text-sm text-gray-500">40%</p>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Percentage</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={attorneyFeePercent}
                      onChange={(e) => setAttorneyFeePercent(Number(e.target.value))}
                      step="0.01"
                      className="w-full pr-12 pl-4 py-3 text-lg font-semibold bg-white border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Fee Amount: <span className="font-semibold text-gray-900">{formatCurrency(calculations.attorneyFee)}</span>
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Liens */}
          <Card>
            <CardHeader action={
              <Button variant="secondary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={addLien}>
                Add Lien
              </Button>
            }>
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-purple-600" />
                <h2 className="font-semibold text-gray-900">Medical Liens</h2>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {liens.length === 0 ? (
                <div className="p-8 text-center">
                  <Receipt className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No liens added</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {liens.map((lien, idx) => {
                    const typeConfig = lienTypeConfig[lien.type] || lienTypeConfig.other;
                    const savings = lien.amount - (lien.negotiated || lien.amount);
                    const savingsPercent = lien.amount > 0 ? (savings / lien.amount) * 100 : 0;

                    return (
                      <div key={lien.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-4">
                            <input
                              type="text"
                              value={lien.name}
                              onChange={(e) => {
                                const updated = [...liens];
                                updated[idx].name = e.target.value;
                                setLiens(updated);
                              }}
                              placeholder="Lienholder name"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                            />
                          </div>
                          <div className="col-span-2">
                            <select
                              value={lien.type}
                              onChange={(e) => {
                                const updated = [...liens];
                                updated[idx].type = e.target.value;
                                setLiens(updated);
                              }}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm"
                            >
                              <option value="hospital">Hospital</option>
                              <option value="medicare">Medicare</option>
                              <option value="medicaid">Medicaid</option>
                              <option value="health_insurance">Health Ins.</option>
                              <option value="workers_comp">Workers&apos; Comp</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div className="col-span-2">
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                              <input
                                type="number"
                                value={lien.amount}
                                onChange={(e) => {
                                  const updated = [...liens];
                                  updated[idx].amount = Number(e.target.value);
                                  setLiens(updated);
                                }}
                                placeholder="Original"
                                className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm"
                              />
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                              <input
                                type="number"
                                value={lien.negotiated}
                                onChange={(e) => {
                                  const updated = [...liens];
                                  updated[idx].negotiated = Number(e.target.value);
                                  setLiens(updated);
                                }}
                                placeholder="Negotiated"
                                className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm bg-green-50"
                              />
                            </div>
                          </div>
                          <div className="col-span-1 text-center">
                            {savings > 0 && (
                              <span className="text-xs font-medium text-green-600">
                                -{savingsPercent.toFixed(0)}%
                              </span>
                            )}
                          </div>
                          <div className="col-span-1 text-right">
                            <button
                              onClick={() => removeLien(lien.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {liens.length > 0 && (
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Original Total:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(calculations.totalLiensOriginal)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Negotiated Total:</span>
                    <span className="font-medium text-green-600">{formatCurrency(calculations.totalLiensNegotiated)}</span>
                  </div>
                  {calculations.lienSavings > 0 && (
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Client Savings:</span>
                      <span className="font-bold text-green-600">+{formatCurrency(calculations.lienSavings)}</span>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Case Expenses */}
          <Card>
            <CardHeader action={
              <Button variant="secondary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={addExpense}>
                Add Expense
              </Button>
            }>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                <h2 className="font-semibold text-gray-900">Case Expenses</h2>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {expenses.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No expenses added</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {expenses.map((expense, idx) => (
                    <div key={expense.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                      <input
                        type="text"
                        value={expense.description}
                        onChange={(e) => {
                          const updated = [...expenses];
                          updated[idx].description = e.target.value;
                          setExpenses(updated);
                        }}
                        placeholder="Expense description"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                      />
                      <div className="relative w-32">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          value={expense.amount}
                          onChange={(e) => {
                            const updated = [...expenses];
                            updated[idx].amount = Number(e.target.value);
                            setExpenses(updated);
                          }}
                          className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => removeExpense(expense.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {expenses.length > 0 && (
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                  <span className="font-medium text-gray-600">Total Expenses:</span>
                  <span className="font-bold text-gray-900">{formatCurrency(calculations.totalExpenses)}</span>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Settlement Summary */}
          <Card className="sticky top-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                <h2 className="font-semibold">Settlement Summary</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {/* Gross */}
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-gray-300">Gross Settlement</span>
                <span className="text-2xl font-bold">{formatCurrency(calculations.grossSettlement)}</span>
              </div>

              {/* Deductions */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Attorney Fee ({calculations.attorneyFeePercent}%)</span>
                  <span className="text-red-400">-{formatCurrency(calculations.attorneyFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Case Expenses</span>
                  <span className="text-red-400">-{formatCurrency(calculations.totalExpenses)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Medical Liens</span>
                  <span className="text-red-400">-{formatCurrency(calculations.totalLiensNegotiated)}</span>
                </div>
                {calculations.lienSavings > 0 && (
                  <div className="flex justify-between text-sm bg-green-500/20 -mx-4 px-4 py-2 rounded">
                    <span className="text-green-300">Lien Negotiations Saved</span>
                    <span className="text-green-400 font-medium">+{formatCurrency(calculations.lienSavings)}</span>
                  </div>
                )}
              </div>

              {/* Client Net */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-300">Client Net Recovery</p>
                    <p className="text-xs text-gray-500">({calculations.clientPercentage.toFixed(1)}% of gross)</p>
                  </div>
                  <span className={cn(
                    'text-3xl font-bold',
                    calculations.clientNet >= 0 ? 'text-green-400' : 'text-red-400'
                  )}>
                    {formatCurrency(calculations.clientNet)}
                  </span>
                </div>
              </div>

              {/* Firm Revenue */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Firm Net Revenue</span>
                  <span className="text-lg font-semibold text-blue-400">{formatCurrency(calculations.firmRevenue)}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardBody className="space-y-3">
              <Button variant="primary" className="w-full" leftIcon={<FileText className="w-4 h-4" />}>
                Generate Disbursement Sheet
              </Button>
              <Button variant="secondary" className="w-full" leftIcon={<Send className="w-4 h-4" />}>
                Email to Client
              </Button>
              <Button variant="secondary" className="w-full" leftIcon={<Download className="w-4 h-4" />}>
                Download PDF
              </Button>
            </CardBody>
          </Card>

          {/* Info Box */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Virginia Fee Guidelines</p>
                <p className="text-xs text-blue-700 mt-1">
                  Standard contingency fees in Virginia are typically 33.33% for pre-litigation
                  cases and 40% for cases that go to litigation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
