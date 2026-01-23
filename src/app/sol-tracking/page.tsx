'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  AlertTriangle,
  Clock,
  Calendar,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Filter,
  Download,
  Settings,
  Eye,
  FileText,
  User,
  MapPin,
  Scale,
  Shield,
  Timer,
  TrendingUp,
  Zap,
  ChevronRight,
  ExternalLink,
  Search
} from 'lucide-react';

interface SOLCase {
  id: string;
  caseNumber: string;
  clientName: string;
  caseType: string;
  incidentDate: string;
  solDate: string;
  daysRemaining: number;
  jurisdiction: string;
  status: 'critical' | 'warning' | 'caution' | 'safe';
  assignedAttorney: string;
  lastReviewed: string;
  filingStatus: 'not_filed' | 'filed' | 'pending';
  notes?: string;
}

interface SOLAlert {
  id: string;
  caseNumber: string;
  clientName: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  acknowledged: boolean;
}

const mockSOLCases: SOLCase[] = [
  {
    id: '1',
    caseNumber: 'CASE-2022-089',
    clientName: 'Maria Rodriguez',
    caseType: 'Auto Accident',
    incidentDate: '2022-02-15',
    solDate: '2024-02-15',
    daysRemaining: 31,
    jurisdiction: 'Virginia',
    status: 'critical',
    assignedAttorney: 'Ryan Wind',
    lastReviewed: '2024-01-14',
    filingStatus: 'not_filed',
    notes: 'Need to file complaint ASAP. All discovery completed.'
  },
  {
    id: '2',
    caseNumber: 'CASE-2022-156',
    clientName: 'James Thompson',
    caseType: 'Medical Malpractice',
    incidentDate: '2022-04-20',
    solDate: '2024-04-20',
    daysRemaining: 96,
    jurisdiction: 'Virginia',
    status: 'warning',
    assignedAttorney: 'Sarah Chen',
    lastReviewed: '2024-01-10',
    filingStatus: 'pending',
    notes: 'Expert review in progress. Complaint draft ready.'
  },
  {
    id: '3',
    caseNumber: 'CASE-2023-012',
    clientName: 'David Williams',
    caseType: 'Premises Liability',
    incidentDate: '2023-01-10',
    solDate: '2025-01-10',
    daysRemaining: 361,
    jurisdiction: 'Virginia',
    status: 'safe',
    assignedAttorney: 'Michael Park',
    lastReviewed: '2024-01-05',
    filingStatus: 'not_filed'
  },
  {
    id: '4',
    caseNumber: 'CASE-2022-201',
    clientName: 'Patricia Johnson',
    caseType: 'Wrongful Death',
    incidentDate: '2022-07-08',
    solDate: '2024-07-08',
    daysRemaining: 175,
    jurisdiction: 'Virginia',
    status: 'caution',
    assignedAttorney: 'Ryan Wind',
    lastReviewed: '2024-01-12',
    filingStatus: 'not_filed',
    notes: 'Estate paperwork pending. Need to expedite.'
  },
  {
    id: '5',
    caseNumber: 'CASE-2023-045',
    clientName: 'Robert Chen',
    caseType: 'Auto Accident',
    incidentDate: '2023-03-15',
    solDate: '2025-03-15',
    daysRemaining: 425,
    jurisdiction: 'North Carolina',
    status: 'safe',
    assignedAttorney: 'Sarah Chen',
    lastReviewed: '2024-01-08',
    filingStatus: 'not_filed'
  },
  {
    id: '6',
    caseNumber: 'CASE-2022-178',
    clientName: 'Emily Watson',
    caseType: 'Dog Bite',
    incidentDate: '2022-05-22',
    solDate: '2024-05-22',
    daysRemaining: 128,
    jurisdiction: 'Virginia',
    status: 'caution',
    assignedAttorney: 'Michael Park',
    lastReviewed: '2024-01-13',
    filingStatus: 'not_filed'
  },
  {
    id: '7',
    caseNumber: 'CASE-2022-095',
    clientName: 'Steven Garcia',
    caseType: 'Truck Accident',
    incidentDate: '2022-03-01',
    solDate: '2024-03-01',
    daysRemaining: 46,
    jurisdiction: 'Virginia',
    status: 'warning',
    assignedAttorney: 'Ryan Wind',
    lastReviewed: '2024-01-15',
    filingStatus: 'filed'
  }
];

const mockAlerts: SOLAlert[] = [
  {
    id: '1',
    caseNumber: 'CASE-2022-089',
    clientName: 'Maria Rodriguez',
    message: 'SOL expires in 31 days - URGENT: File complaint immediately',
    severity: 'critical',
    timestamp: '2024-01-15T08:00:00',
    acknowledged: false
  },
  {
    id: '2',
    caseNumber: 'CASE-2022-095',
    clientName: 'Steven Garcia',
    message: 'SOL expires in 46 days - Complaint filed, verify service',
    severity: 'warning',
    timestamp: '2024-01-15T08:00:00',
    acknowledged: true
  },
  {
    id: '3',
    caseNumber: 'CASE-2022-156',
    clientName: 'James Thompson',
    message: 'SOL expires in 96 days - Review expert report and finalize complaint',
    severity: 'warning',
    timestamp: '2024-01-15T08:00:00',
    acknowledged: false
  },
  {
    id: '4',
    caseNumber: 'CASE-2022-178',
    clientName: 'Emily Watson',
    message: 'SOL expires in 128 days - Schedule review meeting',
    severity: 'info',
    timestamp: '2024-01-14T08:00:00',
    acknowledged: true
  }
];

const jurisdictionRules = [
  { state: 'Virginia', personalInjury: '2 years', medicalMalpractice: '2 years', wrongfulDeath: '2 years', productLiability: '2 years' },
  { state: 'North Carolina', personalInjury: '3 years', medicalMalpractice: '3 years', wrongfulDeath: '2 years', productLiability: '6 years' },
  { state: 'Maryland', personalInjury: '3 years', medicalMalpractice: '5 years', wrongfulDeath: '3 years', productLiability: '3 years' },
  { state: 'Washington DC', personalInjury: '3 years', medicalMalpractice: '3 years', wrongfulDeath: '2 years', productLiability: '3 years' }
];

export default function SOLTrackingPage() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return <Badge variant="danger" className="animate-pulse">Critical</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      case 'caution':
        return <Badge className="bg-amber-100 text-amber-700">Caution</Badge>;
      case 'safe':
        return <Badge variant="success">Safe</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getFilingBadge = (status: string) => {
    switch (status) {
      case 'filed':
        return <Badge variant="success" className="text-xs">Filed</Badge>;
      case 'pending':
        return <Badge variant="warning" className="text-xs">Pending</Badge>;
      case 'not_filed':
        return <Badge variant="default" className="text-xs">Not Filed</Badge>;
      default:
        return null;
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredCases = mockSOLCases.filter(c => {
    const matchesStatus = !statusFilter || c.status === statusFilter;
    const matchesSearch = !searchQuery ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const criticalCount = mockSOLCases.filter(c => c.status === 'critical').length;
  const warningCount = mockSOLCases.filter(c => c.status === 'warning').length;
  const cautionCount = mockSOLCases.filter(c => c.status === 'caution').length;
  const unacknowledgedAlerts = mockAlerts.filter(a => !a.acknowledged).length;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Statute of Limitations Tracking</h1>
            <p className="text-gray-600">Monitor and manage SOL deadlines across all cases</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setShowSettingsModal(true)} className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Alert Settings
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Critical Alert Banner */}
        {criticalCount > 0 && (
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Critical SOL Warning</h3>
                <p className="text-red-100">{criticalCount} case(s) require immediate attention - SOL expires within 60 days</p>
              </div>
            </div>
            <Button className="bg-white text-red-600 hover:bg-red-50">
              View Critical Cases
            </Button>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card
            className={`cursor-pointer transition-all ${statusFilter === 'critical' ? 'ring-2 ring-red-500' : ''}`}
            onClick={() => setStatusFilter(statusFilter === 'critical' ? null : 'critical')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Critical (≤60 days)</p>
                  <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${statusFilter === 'warning' ? 'ring-2 ring-amber-500' : ''}`}
            onClick={() => setStatusFilter(statusFilter === 'warning' ? null : 'warning')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Warning (61-120 days)</p>
                  <p className="text-3xl font-bold text-amber-600">{warningCount}</p>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${statusFilter === 'caution' ? 'ring-2 ring-yellow-500' : ''}`}
            onClick={() => setStatusFilter(statusFilter === 'caution' ? null : 'caution')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Caution (121-180 days)</p>
                  <p className="text-3xl font-bold text-yellow-600">{cautionCount}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${statusFilter === 'safe' ? 'ring-2 ring-green-500' : ''}`}
            onClick={() => setStatusFilter(statusFilter === 'safe' ? null : 'safe')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Safe ({'>'}180 days)</p>
                  <p className="text-3xl font-bold text-green-600">{mockSOLCases.filter(c => c.status === 'safe').length}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cases List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>SOL Deadlines</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search cases..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64"
                      />
                    </div>
                    {statusFilter && (
                      <Button variant="ghost" size="sm" onClick={() => setStatusFilter(null)}>
                        Clear Filter
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {filteredCases.sort((a, b) => a.daysRemaining - b.daysRemaining).map((solCase) => (
                    <div
                      key={solCase.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        solCase.status === 'critical' ? 'bg-red-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                            solCase.status === 'critical' ? 'bg-red-100' :
                            solCase.status === 'warning' ? 'bg-amber-100' :
                            solCase.status === 'caution' ? 'bg-yellow-100' :
                            'bg-green-100'
                          }`}>
                            <Timer className={`h-6 w-6 ${
                              solCase.status === 'critical' ? 'text-red-600' :
                              solCase.status === 'warning' ? 'text-amber-600' :
                              solCase.status === 'caution' ? 'text-yellow-600' :
                              'text-green-600'
                            }`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">{solCase.clientName}</h4>
                              {getStatusBadge(solCase.status)}
                              {getFilingBadge(solCase.filingStatus)}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {solCase.caseNumber} • {solCase.caseType}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                Incident: {formatDate(solCase.incidentDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {solCase.jurisdiction}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                {solCase.assignedAttorney}
                              </span>
                            </div>
                            {solCase.notes && (
                              <p className="text-sm text-gray-500 mt-2 bg-gray-100 p-2 rounded">
                                {solCase.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            solCase.status === 'critical' ? 'text-red-600' :
                            solCase.status === 'warning' ? 'text-amber-600' :
                            solCase.status === 'caution' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {solCase.daysRemaining}
                          </div>
                          <p className="text-sm text-gray-500">days remaining</p>
                          <p className="text-xs text-gray-400 mt-1">
                            SOL: {formatDate(solCase.solDate)}
                          </p>
                          <Button variant="ghost" size="sm" className="mt-2">
                            <Eye className="h-4 w-4 mr-1" /> View Case
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary-600" />
                    Recent Alerts
                  </CardTitle>
                  {unacknowledgedAlerts > 0 && (
                    <Badge variant="danger">{unacknowledgedAlerts} new</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.acknowledged
                        ? 'bg-gray-50 border-gray-200'
                        : alert.severity === 'critical'
                          ? 'bg-red-50 border-red-200'
                          : alert.severity === 'warning'
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.severity)}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{alert.clientName}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{alert.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {new Date(alert.timestamp).toLocaleDateString()}
                          </span>
                          {!alert.acknowledged && (
                            <Button variant="ghost" size="sm" className="text-xs h-6">
                              Acknowledge
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Jurisdiction Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary-600" />
                  SOL Quick Reference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jurisdictionRules.map((rule) => (
                    <div key={rule.state} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {rule.state}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Personal Injury:</span>
                          <span className="font-medium">{rule.personalInjury}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Med Mal:</span>
                          <span className="font-medium">{rule.medicalMalpractice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Wrongful Death:</span>
                          <span className="font-medium">{rule.wrongfulDeath}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Product Liability:</span>
                          <span className="font-medium">{rule.productLiability}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Full Reference Guide
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">SOL Alert Settings</h3>
                <p className="text-sm text-gray-500">Configure when and how you receive SOL deadline alerts</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Alert Thresholds</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="text-gray-700">Critical Alert</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue="60" className="w-16 border rounded px-2 py-1 text-center" />
                        <span className="text-gray-500">days</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <span className="text-gray-700">Warning Alert</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue="120" className="w-16 border rounded px-2 py-1 text-center" />
                        <span className="text-gray-500">days</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <span className="text-gray-700">Caution Alert</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue="180" className="w-16 border rounded px-2 py-1 text-center" />
                        <span className="text-gray-500">days</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notification Channels</h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">In-App Notifications</span>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">Email Digest (Daily)</span>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">Instant Email (Critical only)</span>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Additional Recipients</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      placeholder="Add email address"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <Button variant="outline">Add</Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge className="flex items-center gap-1">
                      ryan@windlaw.com
                      <button className="ml-1 hover:text-red-500">&times;</button>
                    </Badge>
                    <Badge className="flex items-center gap-1">
                      paralegal@windlaw.com
                      <button className="ml-1 hover:text-red-500">&times;</button>
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowSettingsModal(false)}>Cancel</Button>
                <Button onClick={() => setShowSettingsModal(false)}>Save Settings</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
