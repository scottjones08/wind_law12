'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Select } from '@/components/ui/Select';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { mockClients, mockCases } from '@/lib/mock-data';
import { formatDate, formatRelativeTime, cn } from '@/lib/utils';
import {
  Send,
  Search,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  Plus,
  Inbox,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  User,
  Paperclip,
} from 'lucide-react';

// Mock communications
const mockCommunications = [
  {
    id: '1',
    clientId: 'c1',
    clientName: 'Michael Thompson',
    type: 'phone',
    direction: 'outbound',
    subject: 'Case Status Update Call',
    content: 'Called client to discuss the latest settlement offer from the insurance company. Client is reviewing the offer and will get back to us by end of week.',
    createdAt: new Date('2024-12-15T14:30:00'),
    createdBy: 'Ryan Wind',
    caseNumber: 'WL-2024-0012',
  },
  {
    id: '2',
    clientId: 'c2',
    clientName: 'Sarah Williams',
    type: 'email',
    direction: 'inbound',
    subject: 'Medical Records Follow-up',
    content: 'Client sent follow-up email asking about the status of medical records request from VCU Health System.',
    createdAt: new Date('2024-12-15T11:20:00'),
    createdBy: 'Sarah Mitchell',
    caseNumber: 'WL-2024-0034',
  },
  {
    id: '3',
    clientId: 'c3',
    clientName: 'James Rodriguez',
    type: 'text',
    direction: 'outbound',
    subject: 'Appointment Reminder',
    content: 'Sent text reminder for upcoming deposition preparation meeting scheduled for tomorrow.',
    createdAt: new Date('2024-12-14T16:45:00'),
    createdBy: 'Marcus Johnson',
    caseNumber: 'WL-2024-0056',
  },
  {
    id: '4',
    clientId: 'c1',
    clientName: 'Michael Thompson',
    type: 'email',
    direction: 'outbound',
    subject: 'Mediation Preparation Documents',
    content: 'Sent mediation brief and supporting documents for client review before upcoming mediation session.',
    createdAt: new Date('2024-12-14T10:15:00'),
    createdBy: 'Ryan Wind',
    caseNumber: 'WL-2024-0012',
    hasAttachment: true,
  },
  {
    id: '5',
    clientId: 'c4',
    clientName: 'Emily Chen',
    type: 'phone',
    direction: 'inbound',
    subject: 'Initial Consultation Call',
    content: 'Client called to discuss workplace injury and potential case. Scheduled in-person consultation for next week.',
    createdAt: new Date('2024-12-13T09:00:00'),
    createdBy: 'Jennifer Adams',
    caseNumber: 'WL-2024-0078',
  },
];

const typeConfig: Record<string, { icon: typeof Phone; label: string; color: string; bg: string }> = {
  phone: { icon: Phone, label: 'Phone', color: 'text-green-600', bg: 'bg-green-100' },
  email: { icon: Mail, label: 'Email', color: 'text-blue-600', bg: 'bg-blue-100' },
  text: { icon: MessageSquare, label: 'Text', color: 'text-purple-600', bg: 'bg-purple-100' },
  letter: { icon: FileText, label: 'Letter', color: 'text-orange-600', bg: 'bg-orange-100' },
};

export default function CommunicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedComm, setSelectedComm] = useState<typeof mockCommunications[0] | null>(null);

  const filteredCommunications = mockCommunications.filter(comm => {
    const matchesSearch =
      comm.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || comm.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: mockCommunications.length,
    phone: mockCommunications.filter(c => c.type === 'phone').length,
    email: mockCommunications.filter(c => c.type === 'email').length,
    text: mockCommunications.filter(c => c.type === 'text').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
          <p className="text-gray-500 mt-1">
            Track all client communications in one place.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowNewModal(true)}>
          Log Communication
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardBody className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Inbox className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.phone}</p>
                <p className="text-sm text-gray-500">Phone Calls</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.email}</p>
                <p className="text-sm text-gray-500">Emails</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.text}</p>
                <p className="text-sm text-gray-500">Text Messages</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search communications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <Select
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'phone', label: 'Phone' },
                { value: 'email', label: 'Email' },
                { value: 'text', label: 'Text' },
                { value: 'letter', label: 'Letter' },
              ]}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-40"
            />
          </div>
        </CardBody>
      </Card>

      {/* Communications List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2">
          <Card>
            <CardBody className="p-0">
              <div className="divide-y divide-gray-100">
                {filteredCommunications.map((comm) => {
                  const config = typeConfig[comm.type] || typeConfig.phone;
                  const IconComponent = config.icon;
                  const isSelected = selectedComm?.id === comm.id;

                  return (
                    <div
                      key={comm.id}
                      onClick={() => setSelectedComm(comm)}
                      className={cn(
                        'flex items-start gap-4 p-4 cursor-pointer transition-colors',
                        isSelected ? 'bg-primary-50' : 'hover:bg-gray-50'
                      )}
                    >
                      <div className={cn('p-2 rounded-lg flex-shrink-0', config.bg)}>
                        <IconComponent className={cn('w-5 h-5', config.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{comm.clientName}</span>
                          <Badge variant="gray">{comm.caseNumber}</Badge>
                          {comm.direction === 'inbound' ? (
                            <ArrowDownLeft className="w-4 h-4 text-blue-500" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-700 mt-0.5">{comm.subject}</p>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{comm.content}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span>{formatRelativeTime(comm.createdAt)}</span>
                          <span>by {comm.createdBy}</span>
                          {comm.hasAttachment && (
                            <span className="flex items-center gap-1">
                              <Paperclip className="w-3 h-3" />
                              Attachment
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Detail Panel */}
        <div>
          {selectedComm ? (
            <Card className="sticky top-6">
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Communication Details</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    firstName={selectedComm.clientName.split(' ')[0]}
                    lastName={selectedComm.clientName.split(' ')[1]}
                    size="lg"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{selectedComm.clientName}</p>
                    <Badge variant="gray">{selectedComm.caseNumber}</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={cn(typeConfig[selectedComm.type].bg, typeConfig[selectedComm.type].color)}>
                        {typeConfig[selectedComm.type].label}
                      </Badge>
                      <Badge variant={selectedComm.direction === 'inbound' ? 'info' : 'success'}>
                        {selectedComm.direction === 'inbound' ? 'Inbound' : 'Outbound'}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Subject</p>
                    <p className="text-sm font-medium text-gray-900">{selectedComm.subject}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Content</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">
                      {selectedComm.content}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm text-gray-900">{formatDate(selectedComm.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Logged By</p>
                      <p className="text-sm text-gray-900">{selectedComm.createdBy}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1" leftIcon={<Phone className="w-4 h-4" />}>
                    Call
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1" leftIcon={<Mail className="w-4 h-4" />}>
                    Email
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody className="py-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a communication to view details</p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {/* New Communication Modal */}
      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Log Communication"
        size="lg"
      >
        <div className="space-y-4">
          <Select
            label="Client"
            options={mockClients.map(c => ({
              value: c.id,
              label: `${c.firstName} ${c.lastName}`,
            }))}
            placeholder="Select client"
          />
          <Select
            label="Case"
            options={mockCases.map(c => ({
              value: c.id,
              label: c.caseNumber,
            }))}
            placeholder="Select case"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type"
              options={[
                { value: 'phone', label: 'Phone Call' },
                { value: 'email', label: 'Email' },
                { value: 'text', label: 'Text Message' },
                { value: 'letter', label: 'Letter' },
              ]}
              placeholder="Select type"
            />
            <Select
              label="Direction"
              options={[
                { value: 'inbound', label: 'Inbound (received)' },
                { value: 'outbound', label: 'Outbound (sent)' },
              ]}
              placeholder="Select direction"
            />
          </div>
          <Input label="Subject" placeholder="Brief subject line" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
            <textarea
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={4}
              placeholder="Details of the communication..."
            />
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowNewModal(false)}>Cancel</Button>
          <Button>Log Communication</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
