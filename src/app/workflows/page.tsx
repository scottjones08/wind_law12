'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import {
  Workflow,
  Play,
  Pause,
  Settings,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Mail,
  MessageSquare,
  FileText,
  Calendar,
  Users,
  Bell,
  Zap,
  GitBranch,
  Target,
  MoreVertical,
  Copy,
  Trash2,
  Edit,
  Eye,
  TrendingUp,
  Activity,
  Timer,
  Repeat
} from 'lucide-react';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  triggers: string[];
  actions: string[];
  isActive: boolean;
  runsToday: number;
  totalRuns: number;
  successRate: number;
  lastRun: string | null;
  createdBy: string;
}

interface WorkflowRun {
  id: string;
  workflowName: string;
  triggeredBy: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  startTime: string;
  endTime: string | null;
  actionsCompleted: number;
  totalActions: number;
  caseName?: string;
}

interface AutomationTrigger {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

const mockWorkflows: WorkflowTemplate[] = [
  {
    id: '1',
    name: 'New Case Onboarding',
    description: 'Automatically sends welcome email, creates intake tasks, and schedules initial consultation',
    category: 'Intake',
    triggers: ['New case created'],
    actions: ['Send welcome email', 'Create intake checklist', 'Schedule consultation', 'Assign to team'],
    isActive: true,
    runsToday: 3,
    totalRuns: 156,
    successRate: 98.7,
    lastRun: '2024-01-15T14:30:00',
    createdBy: 'System'
  },
  {
    id: '2',
    name: 'Medical Records Follow-up',
    description: 'Sends automated follow-up requests for outstanding medical records',
    category: 'Medical Records',
    triggers: ['Medical records overdue by 14 days'],
    actions: ['Send follow-up letter', 'Create reminder task', 'Notify paralegal'],
    isActive: true,
    runsToday: 5,
    totalRuns: 89,
    successRate: 95.5,
    lastRun: '2024-01-15T12:00:00',
    createdBy: 'Sarah Attorney'
  },
  {
    id: '3',
    name: 'SOL Warning Alerts',
    description: 'Sends escalating alerts as statute of limitations approaches',
    category: 'Compliance',
    triggers: ['SOL 90 days away', 'SOL 60 days away', 'SOL 30 days away'],
    actions: ['Send email alert', 'Create urgent task', 'Notify supervising attorney'],
    isActive: true,
    runsToday: 1,
    totalRuns: 45,
    successRate: 100,
    lastRun: '2024-01-15T09:00:00',
    createdBy: 'System'
  },
  {
    id: '4',
    name: 'Client Check-in Sequence',
    description: 'Regular automated check-ins with clients to maintain communication',
    category: 'Client Communication',
    triggers: ['Every 14 days since last contact'],
    actions: ['Send check-in email', 'Send SMS reminder', 'Log communication'],
    isActive: true,
    runsToday: 8,
    totalRuns: 234,
    successRate: 97.4,
    lastRun: '2024-01-15T10:15:00',
    createdBy: 'Michael Paralegal'
  },
  {
    id: '5',
    name: 'Settlement Document Package',
    description: 'Generates and sends settlement documents when case settles',
    category: 'Settlements',
    triggers: ['Case status changed to Settled'],
    actions: ['Generate settlement statement', 'Create closing checklist', 'Send client notification', 'Schedule disbursement'],
    isActive: false,
    runsToday: 0,
    totalRuns: 67,
    successRate: 100,
    lastRun: '2024-01-10T16:45:00',
    createdBy: 'System'
  },
  {
    id: '6',
    name: 'Treatment Gap Alert',
    description: 'Alerts when client has gap in medical treatment',
    category: 'Medical',
    triggers: ['No treatment logged for 21 days'],
    actions: ['Send reminder to client', 'Create task for case manager', 'Log treatment gap'],
    isActive: true,
    runsToday: 2,
    totalRuns: 78,
    successRate: 94.9,
    lastRun: '2024-01-15T11:30:00',
    createdBy: 'Sarah Attorney'
  }
];

const mockWorkflowRuns: WorkflowRun[] = [
  { id: '1', workflowName: 'New Case Onboarding', triggeredBy: 'Case Created', status: 'success', startTime: '2024-01-15T14:30:00', endTime: '2024-01-15T14:30:45', actionsCompleted: 4, totalActions: 4, caseName: 'Johnson v. ABC Corp' },
  { id: '2', workflowName: 'Client Check-in Sequence', triggeredBy: 'Scheduled', status: 'running', startTime: '2024-01-15T14:28:00', endTime: null, actionsCompleted: 2, totalActions: 3, caseName: 'Multiple Cases' },
  { id: '3', workflowName: 'Medical Records Follow-up', triggeredBy: 'Records Overdue', status: 'success', startTime: '2024-01-15T12:00:00', endTime: '2024-01-15T12:01:15', actionsCompleted: 3, totalActions: 3, caseName: 'Chen v. XYZ Insurance' },
  { id: '4', workflowName: 'SOL Warning Alerts', triggeredBy: 'SOL 90 Days', status: 'success', startTime: '2024-01-15T09:00:00', endTime: '2024-01-15T09:00:30', actionsCompleted: 3, totalActions: 3, caseName: 'Rodriguez v. State Farm' },
  { id: '5', workflowName: 'Treatment Gap Alert', triggeredBy: 'No Treatment', status: 'failed', startTime: '2024-01-15T08:30:00', endTime: '2024-01-15T08:30:10', actionsCompleted: 1, totalActions: 3, caseName: 'Williams v. Metro Transit' },
  { id: '6', workflowName: 'New Case Onboarding', triggeredBy: 'Case Created', status: 'success', startTime: '2024-01-15T08:00:00', endTime: '2024-01-15T08:00:52', actionsCompleted: 4, totalActions: 4, caseName: 'Thompson v. GEICO' }
];

const triggerCategories = [
  {
    name: 'Case Events',
    triggers: [
      { id: '1', name: 'New case created', icon: 'Plus' },
      { id: '2', name: 'Case status changed', icon: 'GitBranch' },
      { id: '3', name: 'Case assigned to user', icon: 'Users' },
      { id: '4', name: 'Case type changed', icon: 'Target' }
    ]
  },
  {
    name: 'Time-Based',
    triggers: [
      { id: '5', name: 'SOL approaching', icon: 'AlertTriangle' },
      { id: '6', name: 'Task overdue', icon: 'Clock' },
      { id: '7', name: 'Days since last contact', icon: 'Timer' },
      { id: '8', name: 'Scheduled interval', icon: 'Repeat' }
    ]
  },
  {
    name: 'Document Events',
    triggers: [
      { id: '9', name: 'Document uploaded', icon: 'FileText' },
      { id: '10', name: 'Medical records received', icon: 'FileText' },
      { id: '11', name: 'Document signature completed', icon: 'CheckCircle' }
    ]
  },
  {
    name: 'Communication',
    triggers: [
      { id: '12', name: 'Email received', icon: 'Mail' },
      { id: '13', name: 'Client message received', icon: 'MessageSquare' },
      { id: '14', name: 'Phone call logged', icon: 'Phone' }
    ]
  }
];

const actionCategories = [
  {
    name: 'Communication',
    actions: [
      { id: '1', name: 'Send email', icon: 'Mail' },
      { id: '2', name: 'Send SMS', icon: 'MessageSquare' },
      { id: '3', name: 'Create notification', icon: 'Bell' },
      { id: '4', name: 'Send portal message', icon: 'Users' }
    ]
  },
  {
    name: 'Tasks',
    actions: [
      { id: '5', name: 'Create task', icon: 'CheckCircle' },
      { id: '6', name: 'Assign task', icon: 'Users' },
      { id: '7', name: 'Complete task', icon: 'CheckCircle' },
      { id: '8', name: 'Create reminder', icon: 'Clock' }
    ]
  },
  {
    name: 'Documents',
    actions: [
      { id: '9', name: 'Generate document', icon: 'FileText' },
      { id: '10', name: 'Request signature', icon: 'Edit' },
      { id: '11', name: 'Share to portal', icon: 'Users' }
    ]
  },
  {
    name: 'Calendar',
    actions: [
      { id: '12', name: 'Schedule appointment', icon: 'Calendar' },
      { id: '13', name: 'Send calendar invite', icon: 'Calendar' },
      { id: '14', name: 'Block time', icon: 'Clock' }
    ]
  }
];

export default function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState('workflows');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">Success</Badge>;
      case 'failed':
        return <Badge variant="danger">Failed</Badge>;
      case 'running':
        return <Badge variant="warning">Running</Badge>;
      case 'pending':
        return <Badge variant="default">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalRuns = mockWorkflowRuns.length;
  const successfulRuns = mockWorkflowRuns.filter(r => r.status === 'success').length;
  const activeWorkflows = mockWorkflows.filter(w => w.isActive).length;
  const timeSaved = 47; // hours this month

  const categories = ['All', 'Intake', 'Medical Records', 'Compliance', 'Client Communication', 'Settlements', 'Medical'];
  const filteredWorkflows = selectedCategory && selectedCategory !== 'All'
    ? mockWorkflows.filter(w => w.category === selectedCategory)
    : mockWorkflows;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workflow Automation</h1>
            <p className="text-gray-600">Automate repetitive tasks and streamline case management</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              View Logs
            </Button>
            <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Workflow
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-600 font-medium">Active Workflows</p>
                  <p className="text-3xl font-bold text-primary-700">{activeWorkflows}</p>
                </div>
                <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Workflow className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <p className="text-xs text-primary-600 mt-2">{mockWorkflows.length} total workflows</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Runs Today</p>
                  <p className="text-3xl font-bold text-green-700">{totalRuns}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Play className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">{successfulRuns} successful</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Success Rate</p>
                  <p className="text-3xl font-bold text-purple-700">97.2%</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-purple-600 mt-2">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600 font-medium">Time Saved</p>
                  <p className="text-3xl font-bold text-amber-700">{timeSaved}h</p>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <p className="text-xs text-amber-600 mt-2">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="runs">Recent Runs</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="mt-6">
            {/* Category Filter */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    (category === 'All' && !selectedCategory) || category === selectedCategory
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Workflows Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredWorkflows.map((workflow) => (
                <Card key={workflow.id} className={`${!workflow.isActive ? 'opacity-60' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                          workflow.isActive ? 'bg-primary-100' : 'bg-gray-100'
                        }`}>
                          <Workflow className={`h-5 w-5 ${workflow.isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                          <Badge variant={workflow.isActive ? 'success' : 'default'} className="mt-1">
                            {workflow.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{workflow.description}</p>

                    {/* Trigger & Actions */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-amber-500 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">TRIGGERS</p>
                          <p className="text-sm text-gray-700">{workflow.triggers.join(', ')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-primary-500 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">ACTIONS</p>
                          <p className="text-sm text-gray-700">{workflow.actions.join(' → ')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">
                          <span className="font-medium text-gray-700">{workflow.runsToday}</span> today
                        </span>
                        <span className="text-gray-500">
                          <span className="font-medium text-gray-700">{workflow.totalRuns}</span> total
                        </span>
                        <span className="text-gray-500">
                          <span className="font-medium text-green-600">{workflow.successRate}%</span> success
                        </span>
                      </div>
                      {workflow.isActive ? (
                        <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700">
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="runs" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Workflow Runs</CardTitle>
                  <div className="flex items-center gap-2">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option>All Workflows</option>
                      {mockWorkflows.map(w => (
                        <option key={w.id}>{w.name}</option>
                      ))}
                    </select>
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option>All Status</option>
                      <option>Success</option>
                      <option>Failed</option>
                      <option>Running</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Workflow</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Triggered By</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Case</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Status</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Progress</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Time</th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockWorkflowRuns.map((run) => (
                        <tr key={run.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center">
                                <Workflow className="h-4 w-4 text-primary-600" />
                              </div>
                              <span className="font-medium text-gray-900">{run.workflowName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{run.triggeredBy}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{run.caseName || '-'}</span>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(run.status)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    run.status === 'success' ? 'bg-green-500' :
                                    run.status === 'failed' ? 'bg-red-500' :
                                    'bg-primary-500'
                                  }`}
                                  style={{ width: `${(run.actionsCompleted / run.totalActions) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">
                                {run.actionsCompleted}/{run.totalActions}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{formatDate(run.startTime)}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Welcome Sequence', description: 'Send a series of welcome emails to new clients', category: 'Intake', icon: Mail },
                { name: 'Document Collection', description: 'Automated follow-ups for missing documents', category: 'Documents', icon: FileText },
                { name: 'Appointment Reminder', description: 'Send reminders before scheduled appointments', category: 'Calendar', icon: Calendar },
                { name: 'Case Status Update', description: 'Notify clients when case status changes', category: 'Communication', icon: Bell },
                { name: 'Lien Tracking', description: 'Monitor and alert on lien status changes', category: 'Billing', icon: AlertTriangle },
                { name: 'Settlement Follow-up', description: 'Post-settlement document and payment workflow', category: 'Settlements', icon: CheckCircle }
              ].map((template, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <template.icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                        <Badge variant="default" className="mt-2">{template.category}</Badge>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> Preview
                      </Button>
                      <Button size="sm">
                        <Copy className="h-4 w-4 mr-1" /> Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Workflow Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Create New Workflow</h3>
                <p className="text-sm text-gray-500">Build an automated workflow to streamline your practice</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Workflow Name</label>
                  <input
                    type="text"
                    placeholder="e.g., New Client Onboarding"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe what this workflow does..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Trigger</label>
                  <div className="space-y-4">
                    {triggerCategories.map((category) => (
                      <div key={category.name}>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-2">{category.name}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {category.triggers.map((trigger) => (
                            <button
                              key={trigger.id}
                              className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
                            >
                              <Zap className="h-4 w-4 text-amber-500" />
                              <span className="text-sm text-gray-700">{trigger.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Add Actions</label>
                  <div className="space-y-4">
                    {actionCategories.map((category) => (
                      <div key={category.name}>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-2">{category.name}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {category.actions.map((action) => (
                            <button
                              key={action.id}
                              className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
                            >
                              <ArrowRight className="h-4 w-4 text-primary-500" />
                              <span className="text-sm text-gray-700">{action.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button onClick={() => setShowCreateModal(false)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workflow
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
