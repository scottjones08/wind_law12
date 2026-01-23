'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { mockCases } from '@/lib/mock-data';
import { formatCurrency, formatDate, caseTypeLabels, cn } from '@/lib/utils';
import {
  FileText,
  Plus,
  Send,
  Download,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Wand2,
  Copy,
  Printer,
  History,
  MessageSquare,
  DollarSign,
  Calendar,
  User,
  Building2,
  FileCheck,
  ArrowRight,
  RefreshCw,
  Zap,
} from 'lucide-react';

// Mock demand letters
const mockDemands = [
  {
    id: '1',
    caseId: 'case1',
    caseNumber: 'WL-2024-0012',
    clientName: 'Michael Thompson',
    defendant: 'Interstate Trucking Co.',
    insuranceCompany: 'National Commercial Insurance',
    demandAmount: 450000,
    status: 'sent',
    createdAt: new Date('2024-12-01'),
    sentAt: new Date('2024-12-05'),
    responseDeadline: new Date('2024-12-20'),
    version: 2,
  },
  {
    id: '2',
    caseId: 'case3',
    caseNumber: 'WL-2024-0056',
    clientName: 'James Rodriguez',
    defendant: 'Thomas Miller',
    insuranceCompany: 'State Auto Insurance',
    demandAmount: 250000,
    status: 'draft',
    createdAt: new Date('2024-12-10'),
    version: 1,
  },
  {
    id: '3',
    caseId: 'case2',
    caseNumber: 'WL-2024-0034',
    clientName: 'Sarah Williams',
    defendant: 'Riverside Shopping Center LLC',
    insuranceCompany: 'Commercial Property Insurance',
    demandAmount: 175000,
    status: 'response_received',
    createdAt: new Date('2024-11-15'),
    sentAt: new Date('2024-11-18'),
    responseDeadline: new Date('2024-12-03'),
    responseAmount: 75000,
    version: 1,
  },
];

// Mock templates
const mockTemplates = [
  { id: '1', name: 'Auto Accident - Standard', type: 'auto_accident', uses: 45 },
  { id: '2', name: 'Truck Accident - Commercial', type: 'truck_accident', uses: 12 },
  { id: '3', name: 'Slip & Fall - Premises', type: 'slip_and_fall', uses: 23 },
  { id: '4', name: 'Motorcycle Accident', type: 'motorcycle_accident', uses: 8 },
  { id: '5', name: 'Wrongful Death', type: 'wrongful_death', uses: 5 },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  draft: { label: 'Draft', color: 'text-gray-600', bg: 'bg-gray-100', icon: Edit },
  ready: { label: 'Ready to Send', color: 'text-blue-600', bg: 'bg-blue-100', icon: FileCheck },
  sent: { label: 'Sent', color: 'text-purple-600', bg: 'bg-purple-100', icon: Send },
  response_received: { label: 'Response Received', color: 'text-green-600', bg: 'bg-green-100', icon: MessageSquare },
  expired: { label: 'Expired', color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle },
};

export default function DemandsPage() {
  const [showNewDemandModal, setShowNewDemandModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateWithAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowAIModal(false);
    }, 3000);
  };

  const stats = {
    total: mockDemands.length,
    drafts: mockDemands.filter(d => d.status === 'draft').length,
    pending: mockDemands.filter(d => d.status === 'sent').length,
    responded: mockDemands.filter(d => d.status === 'response_received').length,
    totalDemanded: mockDemands.reduce((sum, d) => sum + d.demandAmount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Demand Letters</h1>
          <p className="text-gray-500 mt-1">
            Generate, track, and manage demand letters with AI assistance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Sparkles className="w-4 h-4" />} onClick={() => setShowAIModal(true)}>
            AI Generate
          </Button>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowNewDemandModal(true)}>
            New Demand
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card>
          <CardBody className="py-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">Total Demands</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4 text-center">
            <p className="text-2xl font-bold text-gray-600">{stats.drafts}</p>
            <p className="text-sm text-gray-500">Drafts</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.pending}</p>
            <p className="text-sm text-gray-500">Awaiting Response</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.responded}</p>
            <p className="text-sm text-gray-500">Responses</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4 text-center">
            <p className="text-2xl font-bold text-primary-600">{formatCurrency(stats.totalDemanded)}</p>
            <p className="text-sm text-gray-500">Total Demanded</p>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <Tabs defaultValue="demands">
          <CardHeader className="pb-0 border-b border-gray-100">
            <TabsList>
              <TabsTrigger value="demands" icon={<FileText className="w-4 h-4" />}>
                Demand Letters
              </TabsTrigger>
              <TabsTrigger value="templates" icon={<Copy className="w-4 h-4" />}>
                Templates
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardBody className="p-0">
            <TabsContent value="demands" className="m-0">
              <div className="divide-y divide-gray-100">
                {mockDemands.map((demand) => {
                  const status = statusConfig[demand.status];
                  const StatusIcon = status.icon;
                  const daysUntilDeadline = demand.responseDeadline
                    ? Math.ceil((demand.responseDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    : null;

                  return (
                    <div key={demand.id} className="flex items-center gap-6 px-6 py-5 hover:bg-gray-50 transition-colors">
                      {/* Status Icon */}
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', status.bg)}>
                        <StatusIcon className={cn('w-6 h-6', status.color)} />
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-gray-900">{demand.caseNumber}</h4>
                          <Badge className={cn(status.bg, status.color)}>{status.label}</Badge>
                          {demand.version > 1 && (
                            <Badge variant="gray">v{demand.version}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">{demand.clientName} vs. {demand.defendant}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {demand.insuranceCompany}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Created {formatDate(demand.createdAt)}
                          </span>
                          {demand.sentAt && (
                            <span className="flex items-center gap-1">
                              <Send className="w-3 h-3" />
                              Sent {formatDate(demand.sentAt)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Demand Amount */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(demand.demandAmount)}</p>
                        {demand.responseAmount && (
                          <p className="text-sm text-orange-600 mt-0.5">
                            Offer: {formatCurrency(demand.responseAmount)}
                          </p>
                        )}
                      </div>

                      {/* Deadline */}
                      {daysUntilDeadline !== null && demand.status === 'sent' && (
                        <div className={cn(
                          'px-3 py-2 rounded-lg text-center',
                          daysUntilDeadline <= 3 ? 'bg-red-50' : 'bg-gray-50'
                        )}>
                          <p className={cn(
                            'text-lg font-bold',
                            daysUntilDeadline <= 3 ? 'text-red-600' : 'text-gray-900'
                          )}>
                            {daysUntilDeadline}d
                          </p>
                          <p className="text-xs text-gray-500">deadline</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        {demand.status === 'draft' && (
                          <Button variant="primary" size="sm" leftIcon={<Send className="w-3 h-3" />}>
                            Send
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="m-0 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockTemplates.map((template) => (
                  <Card key={template.id} hover className="border-2 border-gray-100 cursor-pointer">
                    <CardBody>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary-600" />
                        </div>
                        <Badge variant="gray">{template.uses} uses</Badge>
                      </div>
                      <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {caseTypeLabels[template.type as keyof typeof caseTypeLabels]}
                      </p>
                      <div className="flex items-center gap-2 mt-4">
                        <Button variant="secondary" size="sm" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button variant="primary" size="sm" className="flex-1">
                          Use Template
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}

                {/* Add Template */}
                <Card className="border-2 border-dashed border-gray-200 hover:border-primary-300 transition-colors cursor-pointer">
                  <CardBody className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-3">
                      <Plus className="w-6 h-6 text-primary-600" />
                    </div>
                    <p className="font-medium text-gray-900">Create Template</p>
                    <p className="text-sm text-gray-500 mt-1">Build a reusable template</p>
                  </CardBody>
                </Card>
              </div>
            </TabsContent>
          </CardBody>
        </Tabs>
      </Card>

      {/* New Demand Modal */}
      <Modal
        isOpen={showNewDemandModal}
        onClose={() => setShowNewDemandModal(false)}
        title="Create Demand Letter"
        size="lg"
      >
        <div className="space-y-4">
          <Select
            label="Case"
            options={mockCases.map(c => ({
              value: c.id,
              label: `${c.caseNumber} - ${c.client?.firstName} ${c.client?.lastName}`,
            }))}
            placeholder="Select case"
          />
          <Select
            label="Template"
            options={mockTemplates.map(t => ({ value: t.id, label: t.name }))}
            placeholder="Select template"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Demand Amount" type="number" placeholder="0" leftIcon={<DollarSign className="w-4 h-4" />} />
            <Input label="Response Deadline" type="date" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Instructions</label>
            <textarea
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg"
              rows={3}
              placeholder="Any special considerations..."
            />
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowNewDemandModal(false)}>Cancel</Button>
          <Button leftIcon={<Sparkles className="w-4 h-4" />}>Generate with AI</Button>
        </ModalFooter>
      </Modal>

      {/* AI Generate Modal */}
      <Modal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        title="AI Demand Letter Generator"
        size="lg"
      >
        {!isGenerating ? (
          <>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">AI-Powered Generation</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Our AI will analyze the case details, medical records, and damages to generate
                  a comprehensive demand letter tailored to maximize your settlement.
                </p>
              </div>

              <Select
                label="Select Case"
                options={mockCases.map(c => ({
                  value: c.id,
                  label: `${c.caseNumber} - ${c.client?.firstName} ${c.client?.lastName}`,
                }))}
                value={selectedCase}
                onChange={(e) => setSelectedCase(e.target.value)}
                placeholder="Choose a case"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Medical Expenses</p>
                  <p className="text-lg font-semibold text-gray-900">$85,000</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Lost Wages</p>
                  <p className="text-lg font-semibold text-gray-900">$45,000</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Other Damages</p>
                  <p className="text-lg font-semibold text-gray-900">$25,000</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">AI Suggested Demand</p>
                  <p className="text-lg font-bold text-green-700">$450,000</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tone & Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Professional', 'Assertive', 'Detailed'].map((tone) => (
                    <button
                      key={tone}
                      className="p-2 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors text-sm font-medium"
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowAIModal(false)}>Cancel</Button>
              <Button
                leftIcon={<Wand2 className="w-4 h-4" />}
                onClick={handleGenerateWithAI}
                disabled={!selectedCase}
              >
                Generate Demand Letter
              </Button>
            </ModalFooter>
          </>
        ) : (
          <div className="py-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Generating Your Demand Letter</h3>
            <p className="text-sm text-gray-500 mt-2">
              Analyzing case details and crafting your demand...
            </p>
            <div className="mt-6 flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
