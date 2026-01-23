'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Target,
  DollarSign,
  Clock,
  Users,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Eye,
  RefreshCw,
  Sparkles,
  MessageSquare,
  Scale,
  Shield,
  Star,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Send
} from 'lucide-react';

interface CaseInsight {
  id: string;
  caseNumber: string;
  clientName: string;
  type: 'opportunity' | 'risk' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  timestamp: string;
  actionable: boolean;
  suggestedAction?: string;
}

interface SettlementPrediction {
  caseId: string;
  caseNumber: string;
  clientName: string;
  predictedRange: { min: number; max: number };
  confidence: number;
  factors: { name: string; impact: 'positive' | 'negative' | 'neutral'; weight: number }[];
  similarCases: number;
  averageSettlement: number;
}

interface TrendData {
  metric: string;
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  insight: string;
}

const mockInsights: CaseInsight[] = [
  {
    id: '1',
    caseNumber: 'CASE-2024-001',
    clientName: 'Sarah Johnson',
    type: 'opportunity',
    title: 'Treatment Gap Detected - Recommend Follow-up',
    description: 'Client has a 23-day gap in medical treatment. Resuming treatment could strengthen the case by demonstrating ongoing injury.',
    confidence: 92,
    impact: 'high',
    category: 'Medical',
    timestamp: '2024-01-15T10:30:00',
    actionable: true,
    suggestedAction: 'Contact client to schedule follow-up appointment with treating physician'
  },
  {
    id: '2',
    caseNumber: 'CASE-2024-002',
    clientName: 'Michael Chen',
    type: 'prediction',
    title: 'High Settlement Probability',
    description: 'Based on similar cases and current evidence, this case has an 87% likelihood of settling above $150,000.',
    confidence: 87,
    impact: 'high',
    category: 'Settlement',
    timestamp: '2024-01-15T09:15:00',
    actionable: false
  },
  {
    id: '3',
    caseNumber: 'CASE-2024-003',
    clientName: 'Emily Rodriguez',
    type: 'risk',
    title: 'Liability Concerns - Comparative Negligence',
    description: 'Police report indicates potential comparative negligence. Consider obtaining witness statements to counter.',
    confidence: 78,
    impact: 'high',
    category: 'Liability',
    timestamp: '2024-01-15T08:45:00',
    actionable: true,
    suggestedAction: 'Interview witnesses from police report before depositions'
  },
  {
    id: '4',
    caseNumber: 'CASE-2024-004',
    clientName: 'David Thompson',
    type: 'recommendation',
    title: 'Demand Letter Timing Optimal',
    description: 'All medical treatment appears complete. Analysis suggests this is the optimal time to send a demand letter.',
    confidence: 85,
    impact: 'medium',
    category: 'Strategy',
    timestamp: '2024-01-14T16:30:00',
    actionable: true,
    suggestedAction: 'Prepare and send demand letter within next 7 days'
  },
  {
    id: '5',
    caseNumber: 'CASE-2024-005',
    clientName: 'Jennifer Williams',
    type: 'opportunity',
    title: 'Underinsured Motorist Coverage Available',
    description: 'Client\'s policy includes $100k UIM coverage. Defendant\'s policy limits may be insufficient for damages.',
    confidence: 95,
    impact: 'high',
    category: 'Insurance',
    timestamp: '2024-01-14T14:00:00',
    actionable: true,
    suggestedAction: 'File UIM claim to maximize recovery'
  },
  {
    id: '6',
    caseNumber: 'CASE-2024-001',
    clientName: 'Sarah Johnson',
    type: 'risk',
    title: 'Pre-existing Condition Documentation Needed',
    description: 'Medical records show prior back treatment. Recommend obtaining complete history to establish baseline.',
    confidence: 88,
    impact: 'medium',
    category: 'Medical',
    timestamp: '2024-01-14T11:30:00',
    actionable: true,
    suggestedAction: 'Request complete medical history for past 5 years'
  }
];

const mockPrediction: SettlementPrediction = {
  caseId: '1',
  caseNumber: 'CASE-2024-001',
  clientName: 'Sarah Johnson',
  predictedRange: { min: 85000, max: 145000 },
  confidence: 82,
  factors: [
    { name: 'Clear liability', impact: 'positive', weight: 25 },
    { name: 'Documented injuries', impact: 'positive', weight: 20 },
    { name: 'Strong medical evidence', impact: 'positive', weight: 18 },
    { name: 'Treatment gap', impact: 'negative', weight: -8 },
    { name: 'Policy limits ($250k)', impact: 'positive', weight: 15 },
    { name: 'Defendant has assets', impact: 'positive', weight: 10 },
    { name: 'Pre-existing condition', impact: 'negative', weight: -5 }
  ],
  similarCases: 47,
  averageSettlement: 112500
};

const mockTrends: TrendData[] = [
  { metric: 'Average Case Value', current: 125000, previous: 118000, change: 5.9, trend: 'up', insight: 'Case values are trending upward due to increased medical costs' },
  { metric: 'Time to Settlement', current: 245, previous: 268, change: -8.6, trend: 'down', insight: 'Faster settlements due to improved demand letter quality' },
  { metric: 'Win Rate', current: 94, previous: 91, change: 3.3, trend: 'up', insight: 'Better case screening is improving success rates' },
  { metric: 'Client Satisfaction', current: 4.8, previous: 4.6, change: 4.3, trend: 'up', insight: 'Portal communication features driving higher satisfaction' }
];

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState('insights');
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; message: string }[]>([
    { role: 'ai', message: 'Hello! I\'m your AI case assistant. Ask me about case strategy, settlement predictions, or any insights about your cases.' }
  ]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <Lightbulb className="h-5 w-5 text-green-500" />;
      case 'risk':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'recommendation':
        return <Target className="h-5 w-5 text-blue-500" />;
      case 'prediction':
        return <Brain className="h-5 w-5 text-purple-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-gray-500" />;
    }
  };

  const getInsightBadge = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <Badge variant="success">Opportunity</Badge>;
      case 'risk':
        return <Badge variant="danger">Risk</Badge>;
      case 'recommendation':
        return <Badge variant="primary">Recommendation</Badge>;
      case 'prediction':
        return <Badge className="bg-purple-100 text-purple-700">Prediction</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Badge variant="danger" className="text-xs">High Impact</Badge>;
      case 'medium':
        return <Badge variant="warning" className="text-xs">Medium Impact</Badge>;
      case 'low':
        return <Badge variant="default" className="text-xs">Low Impact</Badge>;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatHistory([...chatHistory, { role: 'user', message: chatMessage }]);
    // Simulate AI response
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        role: 'ai',
        message: 'Based on my analysis of similar cases, I recommend focusing on documenting the ongoing medical treatment and gathering additional witness statements. The comparable cases in our database show a 23% higher settlement when these elements are well-documented.'
      }]);
    }, 1000);
    setChatMessage('');
  };

  const highPriorityInsights = mockInsights.filter(i => i.impact === 'high').length;
  const actionableInsights = mockInsights.filter(i => i.actionable).length;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Case Insights</h1>
              <p className="text-gray-600">Intelligent analysis and predictions for your cases</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Analysis
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Active Insights</p>
                  <p className="text-3xl font-bold text-purple-700">{mockInsights.length}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-purple-600 mt-2">{highPriorityInsights} high priority</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Actionable Items</p>
                  <p className="text-3xl font-bold text-green-700">{actionableInsights}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">Ready for action</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Prediction Accuracy</p>
                  <p className="text-3xl font-bold text-blue-700">89%</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">Last 12 months</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600 font-medium">Cases Analyzed</p>
                  <p className="text-3xl font-bold text-amber-700">156</p>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <p className="text-xs text-amber-600 mt-2">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="insights">Case Insights</TabsTrigger>
            <TabsTrigger value="predictions">Settlement Predictions</TabsTrigger>
            <TabsTrigger value="trends">Practice Trends</TabsTrigger>
            <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Insights List */}
              <div className="lg:col-span-2 space-y-4">
                {mockInsights.map((insight) => (
                  <Card key={insight.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                          insight.type === 'opportunity' ? 'bg-green-100' :
                          insight.type === 'risk' ? 'bg-red-100' :
                          insight.type === 'recommendation' ? 'bg-blue-100' :
                          'bg-purple-100'
                        }`}>
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {getInsightBadge(insight.type)}
                                {getImpactBadge(insight.impact)}
                                <span className="text-xs text-gray-400">{insight.category}</span>
                              </div>
                              <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-sm">
                                <span className="text-gray-500">Confidence:</span>
                                <span className="font-semibold text-gray-900">{insight.confidence}%</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{insight.description}</p>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <div className="text-sm text-gray-500">
                              {insight.caseNumber} • {insight.clientName}
                            </div>
                            {insight.actionable && (
                              <Button size="sm" className="flex items-center gap-1">
                                <Zap className="h-4 w-4" />
                                Take Action
                              </Button>
                            )}
                          </div>
                          {insight.suggestedAction && (
                            <div className="mt-3 p-3 bg-primary-50 rounded-lg">
                              <p className="text-sm text-primary-700">
                                <strong>Suggested:</strong> {insight.suggestedAction}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Insights by Type</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">Opportunities</span>
                      </div>
                      <span className="font-semibold">{mockInsights.filter(i => i.type === 'opportunity').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-gray-600">Risks</span>
                      </div>
                      <span className="font-semibold">{mockInsights.filter(i => i.type === 'risk').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-600">Recommendations</span>
                      </div>
                      <span className="font-semibold">{mockInsights.filter(i => i.type === 'recommendation').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-gray-600">Predictions</span>
                      </div>
                      <span className="font-semibold">{mockInsights.filter(i => i.type === 'prediction').length}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Insight Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">
                      Help improve our AI by rating insight quality
                    </p>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" /> Helpful
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <ThumbsDown className="h-4 w-4" /> Not Useful
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Settlement Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-500">{mockPrediction.caseNumber} • {mockPrediction.clientName}</p>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Predicted Settlement Range</p>
                      <p className="text-4xl font-bold text-gray-900 mt-1">
                        {formatCurrency(mockPrediction.predictedRange.min)} - {formatCurrency(mockPrediction.predictedRange.max)}
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${mockPrediction.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{mockPrediction.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Based on {mockPrediction.similarCases} similar cases</p>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Average Settlement</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(mockPrediction.averageSettlement)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contributing Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockPrediction.factors.map((factor, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {factor.impact === 'positive' ? (
                            <ArrowUp className="h-4 w-4 text-green-500" />
                          ) : factor.impact === 'negative' ? (
                            <ArrowDown className="h-4 w-4 text-red-500" />
                          ) : (
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-700">{factor.name}</span>
                        </div>
                        <span className={`text-sm font-medium ${
                          factor.weight > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {factor.weight > 0 ? '+' : ''}{factor.weight}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockTrends.map((trend, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-medium text-gray-900">{trend.metric}</h3>
                      <div className={`flex items-center gap-1 ${
                        trend.trend === 'up' ? 'text-green-600' :
                        trend.trend === 'down' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {trend.trend === 'up' ? <TrendingUp className="h-4 w-4" /> :
                         trend.trend === 'down' ? <TrendingDown className="h-4 w-4" /> :
                         <ArrowRight className="h-4 w-4" />}
                        <span className="text-sm font-medium">{Math.abs(trend.change)}%</span>
                      </div>
                    </div>
                    <div className="flex items-end gap-4 mb-4">
                      <div>
                        <p className="text-3xl font-bold text-gray-900">
                          {trend.metric.includes('Value') ? formatCurrency(trend.current) :
                           trend.metric.includes('Time') ? `${trend.current} days` :
                           trend.metric.includes('Rate') ? `${trend.current}%` :
                           trend.current}
                        </p>
                        <p className="text-sm text-gray-500">
                          Previous: {trend.metric.includes('Value') ? formatCurrency(trend.previous) :
                           trend.metric.includes('Time') ? `${trend.previous} days` :
                           trend.metric.includes('Rate') ? `${trend.previous}%` :
                           trend.previous}
                        </p>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <Lightbulb className="h-4 w-4 inline mr-1" />
                        {trend.insight}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assistant" className="mt-6">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary-600" />
                  AI Case Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {msg.role === 'ai' && (
                          <div className="flex items-center gap-2 mb-1">
                            <Brain className="h-4 w-4 text-purple-500" />
                            <span className="text-xs font-medium text-purple-600">AI Assistant</span>
                          </div>
                        )}
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="border-t border-gray-100 p-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask about case strategy, settlement predictions, or insights..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => setChatMessage('What\'s the best strategy for the Johnson case?')}
                      className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
                    >
                      Case strategy
                    </button>
                    <button
                      onClick={() => setChatMessage('Show me cases similar to CASE-2024-001')}
                      className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
                    >
                      Similar cases
                    </button>
                    <button
                      onClick={() => setChatMessage('What are the risks in my current cases?')}
                      className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
                    >
                      Risk analysis
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
