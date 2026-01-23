'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { mockCases, mockMonthlyMetrics } from '@/lib/mock-data';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import {
  DollarSign,
  TrendingUp,
  FileText,
  CreditCard,
  Download,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Calculator,
  PiggyBank,
  Receipt,
  Percent,
} from 'lucide-react';

// Mock billing data
const mockSettlements = [
  {
    id: 's1',
    caseId: 'case5',
    caseNumber: 'WL-2023-0234',
    clientName: 'Robert Davis',
    grossAmount: 85000,
    attorneyFees: 28333,
    caseExpenses: 3500,
    medicalLiens: 15000,
    clientNet: 38167,
    date: new Date('2024-11-01'),
    status: 'disbursed',
  },
  {
    id: 's2',
    caseId: 'case1',
    caseNumber: 'WL-2024-0012',
    clientName: 'Michael Thompson',
    grossAmount: 450000,
    attorneyFees: 150000,
    caseExpenses: 12000,
    medicalLiens: 85000,
    clientNet: 203000,
    date: new Date('2024-12-15'),
    status: 'pending',
  },
];

const mockExpenses = [
  { id: 'e1', caseNumber: 'WL-2024-0012', description: 'Medical Records Fee', amount: 250, date: new Date('2024-12-01'), category: 'Records' },
  { id: 'e2', caseNumber: 'WL-2024-0012', description: 'Expert Witness Fee', amount: 5000, date: new Date('2024-11-15'), category: 'Expert' },
  { id: 'e3', caseNumber: 'WL-2024-0034', description: 'Court Filing Fee', amount: 350, date: new Date('2024-11-20'), category: 'Filing' },
  { id: 'e4', caseNumber: 'WL-2024-0056', description: 'Deposition Transcript', amount: 850, date: new Date('2024-12-05'), category: 'Deposition' },
  { id: 'e5', caseNumber: 'WL-2024-0012', description: 'Police Report Copy', amount: 25, date: new Date('2024-10-15'), category: 'Records' },
];

const mockTrustAccount = {
  balance: 125000,
  pendingDeposits: 450000,
  pendingDisbursements: 203000,
  lastUpdated: new Date('2024-12-15'),
};

export default function BillingPage() {
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);

  // Settlement calculator state
  const [calcGross, setCalcGross] = useState(100000);
  const [calcFeePercent, setCalcFeePercent] = useState(33.33);
  const [calcExpenses, setCalcExpenses] = useState(5000);
  const [calcLiens, setCalcLiens] = useState(20000);

  const calcFees = calcGross * (calcFeePercent / 100);
  const calcClientNet = calcGross - calcFees - calcExpenses - calcLiens;

  const totalRecovered = mockMonthlyMetrics.reduce((sum, m) => sum + m.revenue, 0);
  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Settlements</h1>
          <p className="text-gray-500 mt-1">
            Track settlements, expenses, and financial performance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Calculator className="w-4 h-4" />} onClick={() => setShowCalculatorModal(true)}>
            Settlement Calculator
          </Button>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowSettlementModal(true)}>
            Record Settlement
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRecovered)}</p>
                <p className="text-sm text-gray-500">Total Recovered (YTD)</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PiggyBank className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockTrustAccount.balance)}</p>
                <p className="text-sm text-gray-500">Trust Account Balance</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockTrustAccount.pendingDeposits)}</p>
                <p className="text-sm text-gray-500">Pending Settlements</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Receipt className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
                <p className="text-sm text-gray-500">Case Expenses (YTD)</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <Tabs defaultValue="settlements">
          <CardHeader className="pb-0">
            <TabsList>
              <TabsTrigger value="settlements" icon={<DollarSign className="w-4 h-4" />}>
                Settlements
              </TabsTrigger>
              <TabsTrigger value="expenses" icon={<Receipt className="w-4 h-4" />}>
                Expenses
              </TabsTrigger>
              <TabsTrigger value="trust" icon={<PiggyBank className="w-4 h-4" />}>
                Trust Account
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardBody>
            <TabsContent value="settlements" className="mt-4">
              <div className="space-y-4">
                {mockSettlements.map((settlement) => (
                  <div key={settlement.id} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-gray-900">{settlement.caseNumber}</h4>
                          <Badge variant={settlement.status === 'disbursed' ? 'success' : 'warning'}>
                            {settlement.status === 'disbursed' ? 'Disbursed' : 'Pending'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{settlement.clientName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(settlement.grossAmount)}
                        </p>
                        <p className="text-xs text-gray-400">{formatDate(settlement.date)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500">Attorney Fees (33.33%)</p>
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(settlement.attorneyFees)}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500">Case Expenses</p>
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(settlement.caseExpenses)}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500">Medical Liens</p>
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(settlement.medicalLiens)}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500">Client Net</p>
                        <p className="text-sm font-bold text-green-600">{formatCurrency(settlement.clientNet)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="expenses" className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">Case Expenses</h4>
                <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowExpenseModal(true)}>
                  Add Expense
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Case</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockExpenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{expense.caseNumber}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{expense.description}</td>
                        <td className="px-4 py-3">
                          <Badge variant="gray">{expense.category}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(expense.amount)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(expense.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="trust" className="mt-4">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Trust Account</h4>
                    <p className="text-sm text-gray-500">Last updated: {formatDate(mockTrustAccount.lastUpdated)}</p>
                  </div>
                  <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
                    Export Statement
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <PiggyBank className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(mockTrustAccount.balance)}</p>
                    <p className="text-sm text-gray-500 mt-1">Current Balance</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(mockTrustAccount.pendingDeposits)}</p>
                    <p className="text-sm text-gray-500 mt-1">Pending Deposits</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-3xl font-bold text-orange-600">{formatCurrency(mockTrustAccount.pendingDisbursements)}</p>
                    <p className="text-sm text-gray-500 mt-1">Pending Disbursements</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardBody>
        </Tabs>
      </Card>

      {/* Settlement Calculator Modal */}
      <Modal
        isOpen={showCalculatorModal}
        onClose={() => setShowCalculatorModal(false)}
        title="Settlement Calculator"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Gross Settlement Amount"
            type="number"
            value={calcGross}
            onChange={(e) => setCalcGross(Number(e.target.value))}
            leftIcon={<DollarSign className="w-4 h-4" />}
          />
          <Input
            label="Attorney Fee Percentage"
            type="number"
            value={calcFeePercent}
            onChange={(e) => setCalcFeePercent(Number(e.target.value))}
            rightIcon={<Percent className="w-4 h-4" />}
          />
          <Input
            label="Case Expenses"
            type="number"
            value={calcExpenses}
            onChange={(e) => setCalcExpenses(Number(e.target.value))}
            leftIcon={<DollarSign className="w-4 h-4" />}
          />
          <Input
            label="Medical Liens"
            type="number"
            value={calcLiens}
            onChange={(e) => setCalcLiens(Number(e.target.value))}
            leftIcon={<DollarSign className="w-4 h-4" />}
          />

          <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Gross Settlement</span>
              <span className="font-medium">{formatCurrency(calcGross)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Attorney Fees ({calcFeePercent}%)</span>
              <span className="font-medium text-red-600">-{formatCurrency(calcFees)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Case Expenses</span>
              <span className="font-medium text-red-600">-{formatCurrency(calcExpenses)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Medical Liens</span>
              <span className="font-medium text-red-600">-{formatCurrency(calcLiens)}</span>
            </div>
            <div className="flex justify-between text-lg pt-2 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Client Net</span>
              <span className="font-bold text-green-600">{formatCurrency(calcClientNet)}</span>
            </div>
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowCalculatorModal(false)}>Close</Button>
        </ModalFooter>
      </Modal>

      {/* Record Settlement Modal */}
      <Modal
        isOpen={showSettlementModal}
        onClose={() => setShowSettlementModal(false)}
        title="Record Settlement"
        size="lg"
      >
        <div className="space-y-4">
          <Select
            label="Case"
            options={mockCases.map(c => ({ value: c.id, label: `${c.caseNumber} - ${c.title}` }))}
            placeholder="Select case"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Gross Settlement" type="number" placeholder="0" leftIcon={<DollarSign className="w-4 h-4" />} />
            <Input label="Settlement Date" type="date" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Attorney Fees" type="number" placeholder="0" leftIcon={<DollarSign className="w-4 h-4" />} />
            <Input label="Case Expenses" type="number" placeholder="0" leftIcon={<DollarSign className="w-4 h-4" />} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Medical Liens" type="number" placeholder="0" leftIcon={<DollarSign className="w-4 h-4" />} />
            <Input label="Other Deductions" type="number" placeholder="0" leftIcon={<DollarSign className="w-4 h-4" />} />
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowSettlementModal(false)}>Cancel</Button>
          <Button>Record Settlement</Button>
        </ModalFooter>
      </Modal>

      {/* Add Expense Modal */}
      <Modal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="Add Expense"
      >
        <div className="space-y-4">
          <Select
            label="Case"
            options={mockCases.map(c => ({ value: c.id, label: c.caseNumber }))}
            placeholder="Select case"
          />
          <Input label="Description" placeholder="Expense description" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount" type="number" placeholder="0" leftIcon={<DollarSign className="w-4 h-4" />} />
            <Input label="Date" type="date" />
          </div>
          <Select
            label="Category"
            options={[
              { value: 'records', label: 'Medical Records' },
              { value: 'expert', label: 'Expert Witness' },
              { value: 'filing', label: 'Court Filing' },
              { value: 'deposition', label: 'Deposition' },
              { value: 'investigation', label: 'Investigation' },
              { value: 'other', label: 'Other' },
            ]}
            placeholder="Select category"
          />
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowExpenseModal(false)}>Cancel</Button>
          <Button>Add Expense</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
