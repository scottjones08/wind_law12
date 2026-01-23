'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import {
  Users,
  FileText,
  MessageSquare,
  Calendar,
  Shield,
  Eye,
  Download,
  Upload,
  Bell,
  Settings,
  Lock,
  Smartphone,
  Mail,
  CheckCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Copy,
  RefreshCw,
  Send,
  Globe,
  Key,
  UserCheck,
  Activity
} from 'lucide-react';

interface PortalClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  caseNumber: string;
  portalStatus: 'active' | 'invited' | 'inactive' | 'locked';
  lastLogin: string | null;
  documentsViewed: number;
  messagesExchanged: number;
  tasksCompleted: number;
  pendingTasks: number;
  mfaEnabled: boolean;
}

interface PortalActivity {
  id: string;
  clientName: string;
  action: string;
  timestamp: string;
  type: 'login' | 'document' | 'message' | 'task' | 'upload';
  details?: string;
}

interface SharedDocument {
  id: string;
  name: string;
  type: string;
  sharedWith: string;
  sharedDate: string;
  viewCount: number;
  downloadCount: number;
  expiresAt: string | null;
}

const mockPortalClients: PortalClient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(804) 555-0123',
    caseNumber: 'CASE-2024-001',
    portalStatus: 'active',
    lastLogin: '2024-01-15T10:30:00',
    documentsViewed: 12,
    messagesExchanged: 8,
    tasksCompleted: 5,
    pendingTasks: 2,
    mfaEnabled: true
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '(804) 555-0456',
    caseNumber: 'CASE-2024-002',
    portalStatus: 'active',
    lastLogin: '2024-01-14T16:45:00',
    documentsViewed: 8,
    messagesExchanged: 15,
    tasksCompleted: 3,
    pendingTasks: 4,
    mfaEnabled: true
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '(804) 555-0789',
    caseNumber: 'CASE-2024-003',
    portalStatus: 'invited',
    lastLogin: null,
    documentsViewed: 0,
    messagesExchanged: 0,
    tasksCompleted: 0,
    pendingTasks: 3,
    mfaEnabled: false
  },
  {
    id: '4',
    name: 'David Thompson',
    email: 'david.t@email.com',
    phone: '(804) 555-0321',
    caseNumber: 'CASE-2024-004',
    portalStatus: 'inactive',
    lastLogin: '2024-01-01T09:00:00',
    documentsViewed: 4,
    messagesExchanged: 2,
    tasksCompleted: 1,
    pendingTasks: 5,
    mfaEnabled: false
  },
  {
    id: '5',
    name: 'Jennifer Williams',
    email: 'jennifer.w@email.com',
    phone: '(804) 555-0654',
    caseNumber: 'CASE-2024-005',
    portalStatus: 'locked',
    lastLogin: '2024-01-10T11:20:00',
    documentsViewed: 6,
    messagesExchanged: 4,
    tasksCompleted: 2,
    pendingTasks: 1,
    mfaEnabled: true
  }
];

const mockActivities: PortalActivity[] = [
  { id: '1', clientName: 'Sarah Johnson', action: 'Logged into portal', timestamp: '2024-01-15T10:30:00', type: 'login' },
  { id: '2', clientName: 'Sarah Johnson', action: 'Viewed document: Medical Records Summary', timestamp: '2024-01-15T10:32:00', type: 'document', details: 'Medical Records Summary.pdf' },
  { id: '3', clientName: 'Michael Chen', action: 'Sent message to attorney', timestamp: '2024-01-15T09:45:00', type: 'message' },
  { id: '4', clientName: 'Sarah Johnson', action: 'Completed task: Sign retainer agreement', timestamp: '2024-01-15T10:35:00', type: 'task' },
  { id: '5', clientName: 'Michael Chen', action: 'Uploaded document: Insurance card', timestamp: '2024-01-15T09:30:00', type: 'upload', details: 'insurance_card.jpg' },
  { id: '6', clientName: 'Sarah Johnson', action: 'Downloaded settlement proposal', timestamp: '2024-01-15T10:40:00', type: 'document' },
  { id: '7', clientName: 'Michael Chen', action: 'Logged into portal', timestamp: '2024-01-14T16:45:00', type: 'login' },
  { id: '8', clientName: 'David Thompson', action: 'Viewed case timeline', timestamp: '2024-01-14T14:20:00', type: 'document' }
];

const mockSharedDocuments: SharedDocument[] = [
  { id: '1', name: 'Retainer Agreement', type: 'PDF', sharedWith: 'Sarah Johnson', sharedDate: '2024-01-10', viewCount: 5, downloadCount: 2, expiresAt: null },
  { id: '2', name: 'Medical Records Summary', type: 'PDF', sharedWith: 'Sarah Johnson', sharedDate: '2024-01-12', viewCount: 3, downloadCount: 1, expiresAt: '2024-02-12' },
  { id: '3', name: 'Settlement Proposal', type: 'PDF', sharedWith: 'Michael Chen', sharedDate: '2024-01-14', viewCount: 8, downloadCount: 4, expiresAt: '2024-01-21' },
  { id: '4', name: 'Case Timeline', type: 'PDF', sharedWith: 'All Active Clients', sharedDate: '2024-01-08', viewCount: 15, downloadCount: 6, expiresAt: null },
  { id: '5', name: 'Insurance Correspondence', type: 'PDF', sharedWith: 'David Thompson', sharedDate: '2024-01-05', viewCount: 2, downloadCount: 0, expiresAt: '2024-02-05' }
];

export default function ClientPortalPage() {
  const [activeTab, setActiveTab] = useState('clients');
  const [selectedClient, setSelectedClient] = useState<PortalClient | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'invited':
        return <Badge variant="warning">Invited</Badge>;
      case 'inactive':
        return <Badge variant="default">Inactive</Badge>;
      case 'locked':
        return <Badge variant="danger">Locked</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'document':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'task':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'upload':
        return <Upload className="h-4 w-4 text-amber-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeClients = mockPortalClients.filter(c => c.portalStatus === 'active').length;
  const invitedClients = mockPortalClients.filter(c => c.portalStatus === 'invited').length;
  const totalDocumentsShared = mockSharedDocuments.length;
  const totalViews = mockSharedDocuments.reduce((sum, doc) => sum + doc.viewCount, 0);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Portal</h1>
            <p className="text-gray-600">Manage secure client access and communications</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Portal Settings
            </Button>
            <Button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Invite Client
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Active Users</p>
                  <p className="text-3xl font-bold text-green-700">{activeClients}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">{invitedClients} pending invitations</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Documents Shared</p>
                  <p className="text-3xl font-bold text-blue-700">{totalDocumentsShared}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">{totalViews} total views</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Messages Today</p>
                  <p className="text-3xl font-bold text-purple-700">12</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-purple-600 mt-2">3 awaiting response</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600 font-medium">Tasks Completed</p>
                  <p className="text-3xl font-bold text-amber-700">24</p>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <p className="text-xs text-amber-600 mt-2">This week by clients</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="clients">Portal Users</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
            <TabsTrigger value="documents">Shared Documents</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Client</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Case</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Status</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Last Login</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Engagement</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Security</th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockPortalClients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium">
                                {client.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{client.name}</p>
                                <p className="text-sm text-gray-500">{client.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-mono text-gray-600">{client.caseNumber}</span>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(client.portalStatus)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{formatDate(client.lastLogin)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1" title="Documents viewed">
                                <Eye className="h-4 w-4" /> {client.documentsViewed}
                              </span>
                              <span className="flex items-center gap-1" title="Messages">
                                <MessageSquare className="h-4 w-4" /> {client.messagesExchanged}
                              </span>
                              <span className="flex items-center gap-1" title="Tasks">
                                <CheckCircle className="h-4 w-4" /> {client.tasksCompleted}/{client.tasksCompleted + client.pendingTasks}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {client.mfaEnabled ? (
                              <span className="flex items-center gap-1 text-green-600 text-sm">
                                <Shield className="h-4 w-4" /> MFA Enabled
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-amber-600 text-sm">
                                <AlertTriangle className="h-4 w-4" /> No MFA
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm" title="Send message">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Resend invite">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              {client.portalStatus === 'locked' ? (
                                <Button variant="ghost" size="sm" title="Unlock account">
                                  <Lock className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button variant="ghost" size="sm" title="View details">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Portal Activity</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Log
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{activity.clientName}</span>
                          <span className="text-gray-600">{activity.action}</span>
                        </div>
                        {activity.details && (
                          <p className="text-sm text-gray-500 mt-1">{activity.details}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Shared Documents</CardTitle>
                  <Button className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Share Document
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Document</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Shared With</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Shared Date</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Views</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Downloads</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Expires</th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockSharedDocuments.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-red-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{doc.name}</p>
                                <p className="text-sm text-gray-500">{doc.type}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{doc.sharedWith}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{doc.sharedDate}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="flex items-center gap-1 text-sm text-gray-600">
                              <Eye className="h-4 w-4" /> {doc.viewCount}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="flex items-center gap-1 text-sm text-gray-600">
                              <Download className="h-4 w-4" /> {doc.downloadCount}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {doc.expiresAt ? (
                              <span className="text-sm text-amber-600">{doc.expiresAt}</span>
                            ) : (
                              <span className="text-sm text-gray-400">Never</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm" title="Copy link">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Revoke access">
                                <Lock className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary-600" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Require MFA</p>
                        <p className="text-sm text-gray-500">Enforce two-factor authentication for all clients</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Session Timeout</p>
                        <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
                      </div>
                    </div>
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Failed Login Lockout</p>
                        <p className="text-sm text-gray-500">Lock account after failed attempts</p>
                      </div>
                    </div>
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option>3 attempts</option>
                      <option>5 attempts</option>
                      <option>10 attempts</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">IP Restrictions</p>
                        <p className="text-sm text-gray-500">Limit access by IP address</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary-600" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-500">Notify clients via email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">SMS Notifications</p>
                        <p className="text-sm text-gray-500">Send text message alerts</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Document Alerts</p>
                        <p className="text-sm text-gray-500">Notify on new shared documents</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Appointment Reminders</p>
                        <p className="text-sm text-gray-500">Send upcoming appointment alerts</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Invite Client to Portal</h3>
                <p className="text-sm text-gray-500">Send a secure invitation to access the client portal</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Client</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option>Select a client...</option>
                    <option>New Client - Auto Accident</option>
                    <option>John Smith - Slip & Fall</option>
                    <option>Maria Garcia - Medical Malpractice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="client@email.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Personal Message (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Add a personal message to the invitation..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="require-mfa" className="rounded border-gray-300" />
                  <label htmlFor="require-mfa" className="text-sm text-gray-600">Require MFA setup on first login</label>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowInviteModal(false)}>Cancel</Button>
                <Button onClick={() => setShowInviteModal(false)}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
