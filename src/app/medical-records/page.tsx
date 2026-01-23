'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { mockCases } from '@/lib/mock-data';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import {
  Plus,
  Search,
  FileText,
  Building2,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Upload,
  Send,
  RefreshCw,
  DollarSign,
  Activity,
  Stethoscope,
  Pill,
  Syringe,
  HeartPulse,
  ClipboardList,
  Filter,
  MoreHorizontal,
  ExternalLink,
} from 'lucide-react';

// Mock medical providers
const mockProviders = [
  {
    id: '1',
    name: 'VCU Health System',
    type: 'hospital',
    address: '1250 E Marshall St, Richmond, VA',
    phone: '(804) 828-9000',
    fax: '(804) 828-9001',
  },
  {
    id: '2',
    name: 'Bon Secours St. Mary\'s',
    type: 'hospital',
    address: '5801 Bremo Rd, Richmond, VA',
    phone: '(804) 285-2011',
    fax: '(804) 285-2012',
  },
  {
    id: '3',
    name: 'Richmond Orthopedic Associates',
    type: 'specialist',
    address: '7101 Jahnke Rd, Richmond, VA',
    phone: '(804) 320-1339',
    fax: '(804) 320-1340',
  },
  {
    id: '4',
    name: 'Commonwealth Physical Therapy',
    type: 'therapy',
    address: '4901 Libbie Mill E Blvd, Richmond, VA',
    phone: '(804) 977-2100',
    fax: '(804) 977-2101',
  },
];

// Mock medical record requests
const mockRecordRequests = [
  {
    id: '1',
    caseId: 'case1',
    caseNumber: 'WL-2024-0012',
    clientName: 'Michael Thompson',
    provider: mockProviders[0],
    status: 'received',
    requestedDate: new Date('2024-11-15'),
    receivedDate: new Date('2024-12-01'),
    billAmount: 2500,
    recordType: 'Complete Medical Records',
  },
  {
    id: '2',
    caseId: 'case1',
    caseNumber: 'WL-2024-0012',
    clientName: 'Michael Thompson',
    provider: mockProviders[2],
    status: 'pending',
    requestedDate: new Date('2024-12-05'),
    recordType: 'Orthopedic Evaluation',
  },
  {
    id: '3',
    caseId: 'case2',
    caseNumber: 'WL-2024-0034',
    clientName: 'Sarah Williams',
    provider: mockProviders[1],
    status: 'sent',
    requestedDate: new Date('2024-12-10'),
    recordType: 'ER Visit Records',
  },
  {
    id: '4',
    caseId: 'case3',
    caseNumber: 'WL-2024-0056',
    clientName: 'James Rodriguez',
    provider: mockProviders[3],
    status: 'overdue',
    requestedDate: new Date('2024-10-20'),
    recordType: 'Physical Therapy Notes',
  },
];

// Mock treatments
const mockTreatments = [
  {
    id: '1',
    caseId: 'case1',
    caseNumber: 'WL-2024-0012',
    clientName: 'Michael Thompson',
    date: new Date('2024-01-10'),
    provider: 'VCU Health ER',
    type: 'Emergency Room',
    description: 'Initial ER visit following accident',
    cost: 8500,
    status: 'billed',
  },
  {
    id: '2',
    caseId: 'case1',
    caseNumber: 'WL-2024-0012',
    clientName: 'Michael Thompson',
    date: new Date('2024-01-15'),
    provider: 'Richmond Orthopedic',
    type: 'Specialist Consult',
    description: 'Orthopedic evaluation for back injury',
    cost: 450,
    status: 'paid',
  },
  {
    id: '3',
    caseId: 'case1',
    caseNumber: 'WL-2024-0012',
    clientName: 'Michael Thompson',
    date: new Date('2024-02-01'),
    provider: 'Commonwealth PT',
    type: 'Physical Therapy',
    description: 'PT session 1 of 12',
    cost: 150,
    status: 'paid',
  },
  {
    id: '4',
    caseId: 'case3',
    caseNumber: 'WL-2024-0056',
    clientName: 'James Rodriguez',
    date: new Date('2024-02-05'),
    provider: 'VCU Health',
    type: 'Surgery',
    description: 'Knee arthroscopy',
    cost: 35000,
    status: 'lien',
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  received: { label: 'Received', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle },
  sent: { label: 'Request Sent', color: 'text-blue-700', bg: 'bg-blue-100', icon: Send },
  pending: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  overdue: { label: 'Overdue', color: 'text-red-700', bg: 'bg-red-100', icon: AlertCircle },
};

const treatmentStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  billed: { label: 'Billed', color: 'text-orange-700', bg: 'bg-orange-100' },
  paid: { label: 'Paid', color: 'text-green-700', bg: 'bg-green-100' },
  lien: { label: 'Lien', color: 'text-purple-700', bg: 'bg-purple-100' },
  pending: { label: 'Pending', color: 'text-gray-700', bg: 'bg-gray-100' },
};

export default function MedicalRecordsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showNewTreatmentModal, setShowNewTreatmentModal] = useState(false);

  const stats = {
    totalRequests: mockRecordRequests.length,
    pending: mockRecordRequests.filter(r => r.status === 'pending' || r.status === 'sent').length,
    received: mockRecordRequests.filter(r => r.status === 'received').length,
    overdue: mockRecordRequests.filter(r => r.status === 'overdue').length,
    totalBills: mockTreatments.reduce((sum, t) => sum + t.cost, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-500 mt-1">
            Track medical records requests, treatments, and bills.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Stethoscope className="w-4 h-4" />} onClick={() => setShowNewTreatmentModal(true)}>
            Log Treatment
          </Button>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowNewRequestModal(true)}>
            Request Records
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card>
          <CardBody className="py-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
            <p className="text-sm text-gray-500">Total Requests</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.received}</p>
            <p className="text-sm text-gray-500">Received</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            <p className="text-sm text-gray-500">Overdue</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalBills)}</p>
            <p className="text-sm text-gray-500">Total Medical Bills</p>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <Tabs defaultValue="requests">
          <CardHeader className="pb-0 border-b border-gray-100">
            <div className="flex items-center justify-between w-full">
              <TabsList>
                <TabsTrigger value="requests" icon={<FileText className="w-4 h-4" />}>
                  Record Requests
                </TabsTrigger>
                <TabsTrigger value="treatments" icon={<Activity className="w-4 h-4" />}>
                  Treatment Log
                </TabsTrigger>
                <TabsTrigger value="providers" icon={<Building2 className="w-4 h-4" />}>
                  Providers
                </TabsTrigger>
              </TabsList>
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                className="w-64"
              />
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <TabsContent value="requests" className="m-0">
              <div className="divide-y divide-gray-100">
                {mockRecordRequests.map((request) => {
                  const status = statusConfig[request.status];
                  const StatusIcon = status.icon;

                  return (
                    <div key={request.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', status.bg)}>
                        <StatusIcon className={cn('w-5 h-5', status.color)} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{request.provider.name}</h4>
                          <Badge className={cn(status.bg, status.color)}>{status.label}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{request.recordType}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                          <span>{request.caseNumber}</span>
                          <span>{request.clientName}</span>
                          <span>Requested: {formatDate(request.requestedDate)}</span>
                        </div>
                      </div>

                      {request.billAmount && (
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(request.billAmount)}</p>
                          <p className="text-xs text-gray-400">Bill Amount</p>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="treatments" className="m-0">
              <div className="divide-y divide-gray-100">
                {mockTreatments.map((treatment) => {
                  const status = treatmentStatusConfig[treatment.status];

                  return (
                    <div key={treatment.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <HeartPulse className="w-5 h-5 text-blue-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{treatment.type}</h4>
                          <Badge variant="gray">{treatment.provider}</Badge>
                          <Badge className={cn(status.bg, status.color)}>{status.label}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{treatment.description}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                          <span>{treatment.caseNumber}</span>
                          <span>{treatment.clientName}</span>
                          <span>{formatDate(treatment.date)}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(treatment.cost)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="providers" className="m-0 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockProviders.map((provider) => (
                  <Card key={provider.id} hover className="border-2 border-gray-100">
                    <CardBody>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                          <Badge variant="gray" className="mt-1">{provider.type}</Badge>
                          <div className="mt-3 space-y-1 text-sm text-gray-600">
                            <p>{provider.address}</p>
                            <p className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5" />
                              {provider.phone}
                            </p>
                            <p className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5" />
                              Fax: {provider.fax}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}

                {/* Add Provider */}
                <Card className="border-2 border-dashed border-gray-200 hover:border-primary-300 transition-colors cursor-pointer">
                  <CardBody className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-3">
                      <Plus className="w-6 h-6 text-primary-600" />
                    </div>
                    <p className="font-medium text-gray-900">Add Provider</p>
                    <p className="text-sm text-gray-500 mt-1">Add a new medical provider</p>
                  </CardBody>
                </Card>
              </div>
            </TabsContent>
          </CardBody>
        </Tabs>
      </Card>

      {/* New Request Modal */}
      <Modal
        isOpen={showNewRequestModal}
        onClose={() => setShowNewRequestModal(false)}
        title="Request Medical Records"
        size="lg"
      >
        <div className="space-y-4">
          <Select
            label="Case"
            options={mockCases.map(c => ({ value: c.id, label: `${c.caseNumber} - ${c.client?.firstName} ${c.client?.lastName}` }))}
            placeholder="Select case"
          />
          <Select
            label="Provider"
            options={mockProviders.map(p => ({ value: p.id, label: p.name }))}
            placeholder="Select provider"
          />
          <Select
            label="Record Type"
            options={[
              { value: 'complete', label: 'Complete Medical Records' },
              { value: 'er', label: 'ER Records Only' },
              { value: 'imaging', label: 'Imaging/Radiology' },
              { value: 'bills', label: 'Billing Records Only' },
              { value: 'specific', label: 'Specific Date Range' },
            ]}
            placeholder="Select record type"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date From" type="date" />
            <Input label="Date To" type="date" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes</label>
            <textarea
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg"
              rows={3}
              placeholder="Any specific instructions..."
            />
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowNewRequestModal(false)}>Cancel</Button>
          <Button leftIcon={<Send className="w-4 h-4" />}>Send Request</Button>
        </ModalFooter>
      </Modal>

      {/* New Treatment Modal */}
      <Modal
        isOpen={showNewTreatmentModal}
        onClose={() => setShowNewTreatmentModal(false)}
        title="Log Treatment"
        size="lg"
      >
        <div className="space-y-4">
          <Select
            label="Case"
            options={mockCases.map(c => ({ value: c.id, label: `${c.caseNumber} - ${c.client?.firstName} ${c.client?.lastName}` }))}
            placeholder="Select case"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Treatment Date" type="date" />
            <Select
              label="Treatment Type"
              options={[
                { value: 'er', label: 'Emergency Room' },
                { value: 'surgery', label: 'Surgery' },
                { value: 'specialist', label: 'Specialist Visit' },
                { value: 'pt', label: 'Physical Therapy' },
                { value: 'imaging', label: 'Imaging/X-Ray' },
                { value: 'other', label: 'Other' },
              ]}
              placeholder="Select type"
            />
          </div>
          <Select
            label="Provider"
            options={mockProviders.map(p => ({ value: p.id, label: p.name }))}
            placeholder="Select provider"
          />
          <Input label="Description" placeholder="Brief description of treatment" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Cost" type="number" placeholder="0.00" />
            <Select
              label="Status"
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'billed', label: 'Billed' },
                { value: 'paid', label: 'Paid' },
                { value: 'lien', label: 'Lien' },
              ]}
              placeholder="Select status"
            />
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowNewTreatmentModal(false)}>Cancel</Button>
          <Button>Log Treatment</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
