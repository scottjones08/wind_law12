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
import { ProgressBar } from '@/components/ui/ProgressBar';
import { mockLeads, mockUsers } from '@/lib/mock-data';
import { caseTypeLabels, formatPhone, formatRelativeTime, formatCurrency, cn } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  FileText,
  Link2,
  Copy,
  ExternalLink,
  Zap,
  Target,
  TrendingUp,
  Users,
  Briefcase,
  Send,
  PhoneCall,
  Video,
  MoreHorizontal,
} from 'lucide-react';

// Mock intake forms
const intakeForms = [
  { id: '1', name: 'Auto Accident Intake', type: 'auto_accident', submissions: 145, conversionRate: 72, status: 'active' },
  { id: '2', name: 'Slip & Fall Intake', type: 'slip_and_fall', submissions: 67, conversionRate: 68, status: 'active' },
  { id: '3', name: 'Workplace Injury', type: 'workplace_injury', submissions: 34, conversionRate: 75, status: 'active' },
  { id: '4', name: 'Medical Malpractice', type: 'other', submissions: 12, conversionRate: 45, status: 'draft' },
];

// Enhanced leads with scoring
const enhancedLeads = mockLeads.map((lead, idx) => ({
  ...lead,
  score: [85, 72, 45, 92, 30][idx] || 50,
  responseTime: ['2 min', '15 min', '1 hour', '5 min', '2 days'][idx],
  touchpoints: [3, 2, 1, 4, 1][idx],
  lastContact: new Date(Date.now() - Math.random() * 86400000 * 7),
}));

export default function IntakePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewFormModal, setShowNewFormModal] = useState(false);
  const [showLeadDetail, setShowLeadDetail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('leads');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Hot';
    if (score >= 60) return 'Warm';
    if (score >= 40) return 'Cool';
    return 'Cold';
  };

  const stats = {
    newLeads: enhancedLeads.filter(l => l.status === 'new').length,
    avgResponseTime: '8 min',
    conversionRate: 68,
    totalValue: enhancedLeads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Intake Management</h1>
          <p className="text-gray-500 mt-1">
            Capture leads, qualify prospects, and convert to clients.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Link2 className="w-4 h-4" />}>
            Share Intake Form
          </Button>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowNewFormModal(true)}>
            New Lead
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardBody className="py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">New Leads Today</p>
                <p className="text-3xl font-bold mt-1">{stats.newLeads}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-blue-100 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+23% vs last week</span>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardBody className="py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Avg Response Time</p>
                <p className="text-3xl font-bold mt-1">{stats.avgResponseTime}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-green-100 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Within target</span>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardBody className="py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold mt-1">{stats.conversionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-purple-100 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+5% vs last month</span>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0">
          <CardBody className="py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Pipeline Value</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(stats.totalValue)}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-amber-100 text-sm">
              <ArrowRight className="w-4 h-4" />
              <span>Potential cases</span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <Tabs defaultValue="leads">
          <CardHeader className="pb-0 border-b border-gray-100">
            <div className="flex items-center justify-between w-full">
              <TabsList>
                <TabsTrigger value="leads" icon={<Users className="w-4 h-4" />}>
                  Active Leads ({enhancedLeads.length})
                </TabsTrigger>
                <TabsTrigger value="forms" icon={<FileText className="w-4 h-4" />}>
                  Intake Forms ({intakeForms.length})
                </TabsTrigger>
                <TabsTrigger value="automations" icon={<Zap className="w-4 h-4" />}>
                  Automations
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <TabsContent value="leads" className="m-0">
              <div className="divide-y divide-gray-100">
                {enhancedLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setShowLeadDetail(lead.id)}
                  >
                    {/* Lead Score */}
                    <div className={cn('w-14 h-14 rounded-xl flex flex-col items-center justify-center', getScoreColor(lead.score))}>
                      <span className="text-lg font-bold">{lead.score}</span>
                      <span className="text-[10px] font-medium uppercase">{getScoreLabel(lead.score)}</span>
                    </div>

                    {/* Lead Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{lead.firstName} {lead.lastName}</h4>
                        <Badge variant={lead.status === 'new' ? 'info' : lead.status === 'qualified' ? 'success' : 'gray'}>
                          {lead.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{caseTypeLabels[lead.caseType]}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {formatPhone(lead.phone)}
                        </span>
                        {lead.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Response: {lead.responseTime}
                        </span>
                      </div>
                    </div>

                    {/* Value & Actions */}
                    <div className="text-right">
                      {lead.estimatedValue && (
                        <p className="font-semibold text-gray-900">{formatCurrency(lead.estimatedValue)}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(lead.createdAt)}</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-gray-400 hover:text-blue-600">
                        <PhoneCall className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-green-50 rounded-lg transition-colors text-gray-400 hover:text-green-600">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors text-gray-400 hover:text-purple-600">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="forms" className="m-0 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {intakeForms.map((form) => (
                  <Card key={form.id} hover className="border-2 border-gray-100">
                    <CardBody>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{form.name}</h4>
                          <p className="text-sm text-gray-500">{caseTypeLabels[form.type as keyof typeof caseTypeLabels] || form.type}</p>
                        </div>
                        <Badge variant={form.status === 'active' ? 'success' : 'gray'}>
                          {form.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-gray-900">{form.submissions}</p>
                          <p className="text-xs text-gray-500">Submissions</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-green-600">{form.conversionRate}%</p>
                          <p className="text-xs text-gray-500">Conversion</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" className="flex-1" leftIcon={<Copy className="w-3 h-3" />}>
                          Copy Link
                        </Button>
                        <Button variant="secondary" size="sm" className="flex-1" leftIcon={<ExternalLink className="w-3 h-3" />}>
                          Preview
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}

                {/* Add New Form Card */}
                <Card className="border-2 border-dashed border-gray-200 hover:border-primary-300 transition-colors cursor-pointer">
                  <CardBody className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-3">
                      <Plus className="w-6 h-6 text-primary-600" />
                    </div>
                    <p className="font-medium text-gray-900">Create New Form</p>
                    <p className="text-sm text-gray-500 mt-1">Build a custom intake form</p>
                  </CardBody>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="automations" className="m-0 p-6">
              <div className="space-y-4">
                {[
                  { name: 'New Lead Welcome Email', trigger: 'When new lead is created', action: 'Send welcome email', enabled: true },
                  { name: 'Follow-up Reminder', trigger: '24 hours after no response', action: 'Create follow-up task', enabled: true },
                  { name: 'Lead Score Update', trigger: 'When lead interacts', action: 'Recalculate lead score', enabled: true },
                  { name: 'Hot Lead Alert', trigger: 'When score > 80', action: 'Send SMS to attorney', enabled: false },
                ].map((automation, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', automation.enabled ? 'bg-green-100' : 'bg-gray-200')}>
                        <Zap className={cn('w-5 h-5', automation.enabled ? 'text-green-600' : 'text-gray-400')} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{automation.name}</h4>
                        <p className="text-sm text-gray-500">
                          <span className="text-purple-600">{automation.trigger}</span>
                          {' → '}
                          <span className="text-blue-600">{automation.action}</span>
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={automation.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </TabsContent>
          </CardBody>
        </Tabs>
      </Card>

      {/* New Lead Modal */}
      <Modal
        isOpen={showNewFormModal}
        onClose={() => setShowNewFormModal(false)}
        title="Add New Lead"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" placeholder="John" />
            <Input label="Last Name" placeholder="Smith" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" placeholder="(804) 555-0123" />
            <Input label="Email" type="email" placeholder="john@email.com" />
          </div>
          <Select
            label="Case Type"
            options={Object.entries(caseTypeLabels).map(([value, label]) => ({ value, label }))}
            placeholder="Select case type"
          />
          <Input label="Incident Date" type="date" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Incident Description</label>
            <textarea
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Describe what happened..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Lead Source"
              options={[
                { value: 'website', label: 'Website' },
                { value: 'google', label: 'Google Ads' },
                { value: 'referral', label: 'Referral' },
                { value: 'tv', label: 'TV Advertisement' },
                { value: 'social', label: 'Social Media' },
              ]}
              placeholder="How did they find us?"
            />
            <Input label="Estimated Value" type="number" placeholder="0" />
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowNewFormModal(false)}>Cancel</Button>
          <Button>Add Lead</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
