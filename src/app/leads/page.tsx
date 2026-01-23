'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Select } from '@/components/ui/Select';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { mockLeads, mockUsers } from '@/lib/mock-data';
import {
  leadStatusConfig,
  caseTypeLabels,
  formatDate,
  formatRelativeTime,
  formatCurrency,
  formatPhone,
  cn,
} from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MoreHorizontal,
  MessageSquare,
} from 'lucide-react';
import type { LeadStatus } from '@/types';

const pipelineStages: LeadStatus[] = ['new', 'contacted', 'qualified', 'consultation_scheduled', 'retained'];

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline');
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  const filteredLeads = mockLeads.filter(lead => {
    const searchLower = searchQuery.toLowerCase();
    return (
      lead.firstName.toLowerCase().includes(searchLower) ||
      lead.lastName.toLowerCase().includes(searchLower) ||
      lead.phone.includes(searchQuery) ||
      (lead.email && lead.email.toLowerCase().includes(searchLower))
    );
  });

  const getLeadsByStatus = (status: LeadStatus) =>
    filteredLeads.filter(lead => lead.status === status);

  const leadStats = {
    new: mockLeads.filter(l => l.status === 'new').length,
    qualified: mockLeads.filter(l => l.status === 'qualified').length,
    scheduled: mockLeads.filter(l => l.status === 'consultation_scheduled').length,
    converted: mockLeads.filter(l => l.status === 'retained').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500 mt-1">
            Manage potential clients and track your intake pipeline.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowNewLeadModal(true)}>
          New Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardBody className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{leadStats.new}</p>
                <p className="text-sm text-gray-500">New Leads</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{leadStats.qualified}</p>
                <p className="text-sm text-gray-500">Qualified</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{leadStats.scheduled}</p>
                <p className="text-sm text-gray-500">Scheduled</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ArrowRight className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{leadStats.converted}</p>
                <p className="text-sm text-gray-500">Converted</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search and View Toggle */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search leads by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'pipeline' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('pipeline')}
              >
                Pipeline
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Pipeline View */}
      {viewMode === 'pipeline' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
          {pipelineStages.map((status) => {
            const statusConfig = leadStatusConfig[status];
            const leads = getLeadsByStatus(status);

            return (
              <div key={status} className="min-w-[280px]">
                <div className={cn('rounded-t-lg px-4 py-3', statusConfig.bgColor)}>
                  <div className="flex items-center justify-between">
                    <h3 className={cn('font-semibold text-sm', statusConfig.color)}>
                      {statusConfig.label}
                    </h3>
                    <span className={cn('text-sm font-bold', statusConfig.color)}>
                      {leads.length}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-b-lg p-3 min-h-[500px] space-y-3">
                  {leads.map((lead) => (
                    <Card
                      key={lead.id}
                      hover
                      className="cursor-pointer"
                    >
                      <CardBody className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </h4>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {caseTypeLabels[lead.caseType]}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Phone className="w-3.5 h-3.5" />
                            {formatPhone(lead.phone)}
                          </div>
                          {lead.estimatedValue && (
                            <div className="flex items-center gap-2 text-gray-500">
                              <DollarSign className="w-3.5 h-3.5" />
                              {formatCurrency(lead.estimatedValue)}
                            </div>
                          )}
                          {lead.followUpDate && (
                            <div className="flex items-center gap-2 text-orange-600">
                              <Clock className="w-3.5 h-3.5" />
                              Follow up {formatRelativeTime(lead.followUpDate)}
                            </div>
                          )}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {formatRelativeTime(lead.createdAt)}
                          </span>
                          {lead.assignedTo && (
                            <Avatar
                              firstName={mockUsers.find(u => u.id === lead.assignedTo)?.firstName || ''}
                              lastName={mockUsers.find(u => u.id === lead.assignedTo)?.lastName || ''}
                              size="xs"
                            />
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Lead</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Case Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Est. Value</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => {
                  const statusConfig = leadStatusConfig[lead.status];
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {lead.firstName} {lead.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-3.5 h-3.5" />
                            {formatPhone(lead.phone)}
                          </div>
                          {lead.email && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-3.5 h-3.5" />
                              {lead.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {caseTypeLabels[lead.caseType]}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn(statusConfig.bgColor, statusConfig.color)}>
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {lead.estimatedValue ? formatCurrency(lead.estimatedValue) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                        {lead.source.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <Phone className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <Mail className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* New Lead Modal */}
      <Modal
        isOpen={showNewLeadModal}
        onClose={() => setShowNewLeadModal(false)}
        title="Add New Lead"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" placeholder="Enter first name" />
            <Input label="Last Name" placeholder="Enter last name" />
            <Input label="Phone" placeholder="(804) 555-0123" />
            <Input label="Email" type="email" placeholder="email@example.com" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Case Type"
              options={Object.entries(caseTypeLabels).map(([value, label]) => ({ value, label }))}
              placeholder="Select case type"
            />
            <Select
              label="Source"
              options={[
                { value: 'website', label: 'Website' },
                { value: 'referral', label: 'Referral' },
                { value: 'google', label: 'Google' },
                { value: 'social_media', label: 'Social Media' },
                { value: 'tv_ad', label: 'TV Advertisement' },
                { value: 'walk_in', label: 'Walk-in' },
                { value: 'other', label: 'Other' },
              ]}
              placeholder="Select source"
            />
          </div>
          <Input label="Incident Date" type="date" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Incident Description
            </label>
            <textarea
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Brief description of the incident..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Estimated Value" type="number" placeholder="0" leftIcon={<span className="text-gray-400">$</span>} />
            <Select
              label="Assign To"
              options={mockUsers.filter(u => u.role === 'intake_specialist' || u.role === 'admin').map(u => ({
                value: u.id,
                label: `${u.firstName} ${u.lastName}`,
              }))}
              placeholder="Select team member"
            />
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowNewLeadModal(false)}>Cancel</Button>
          <Button>Add Lead</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
