'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { mockCases, mockLeads, mockMonthlyMetrics, mockCasesByStatus } from '@/lib/mock-data';
import { caseStatusConfig, caseTypeLabels, formatCurrency, cn } from '@/lib/utils';
import {
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  DollarSign,
  Users,
  Briefcase,
  Target,
  Award,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('year');

  // Calculate metrics
  const totalCases = mockCases.length;
  const activeCases = mockCases.filter(c => !['closed', 'dismissed', 'settled'].includes(c.status)).length;
  const settledCases = mockCases.filter(c => c.status === 'settled').length;
  const totalRecovered = mockMonthlyMetrics.reduce((sum, m) => sum + m.revenue, 0);
  const avgCaseValue = settledCases > 0 ? totalRecovered / settledCases : 0;
  const totalLeads = mockLeads.length;
  const convertedLeads = mockLeads.filter(l => l.status === 'retained').length;
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

  // Case type distribution
  const casesByType = Object.entries(
    mockCases.reduce((acc, c) => {
      acc[c.caseType] = (acc[c.caseType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  // Lead source distribution
  const leadsBySource = Object.entries(
    mockLeads.reduce((acc, l) => {
      acc[l.source] = (acc[l.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  const maxMonthlyRevenue = Math.max(...mockMonthlyMetrics.map(m => m.revenue));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">
            Track firm performance and gain insights into your practice.
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            options={[
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' },
              { value: 'year', label: 'This Year' },
              { value: 'all', label: 'All Time' },
            ]}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-36"
          />
          <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover>
          <CardBody>
            <div className="flex items-start justify-between">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" />
                15%
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">{formatCurrency(totalRecovered)}</p>
            <p className="text-sm text-gray-500">Total Recovered</p>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody>
            <div className="flex items-start justify-between">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" />
                8%
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">{activeCases}</p>
            <p className="text-sm text-gray-500">Active Cases</p>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody>
            <div className="flex items-start justify-between">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" />
                5%
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">{conversionRate.toFixed(0)}%</p>
            <p className="text-sm text-gray-500">Lead Conversion</p>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody>
            <div className="flex items-start justify-between">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">{formatCurrency(avgCaseValue)}</p>
            <p className="text-sm text-gray-500">Avg. Settlement</p>
          </CardBody>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-400" />
              <h2 className="font-semibold text-gray-900">Revenue Trend</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex items-end gap-2 h-64">
              {mockMonthlyMetrics.map((month, index) => {
                const height = (month.revenue / maxMonthlyRevenue) * 100;
                const isCurrentMonth = index === mockMonthlyMetrics.length - 1;

                return (
                  <div key={month.month} className="flex-1 flex flex-col items-center">
                    <div
                      className={cn(
                        'w-full rounded-t-md transition-all duration-300 hover:opacity-80',
                        isCurrentMonth ? 'bg-primary-600' : 'bg-primary-200'
                      )}
                      style={{ height: `${height}%`, minHeight: '8px' }}
                    />
                    <span className={cn(
                      'text-xs mt-2',
                      isCurrentMonth ? 'font-semibold text-gray-900' : 'text-gray-400'
                    )}>
                      {month.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Case Pipeline */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-gray-400" />
              <h2 className="font-semibold text-gray-900">Case Pipeline</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {mockCasesByStatus.map((item) => {
                const config = caseStatusConfig[item.status];
                const maxCount = Math.max(...mockCasesByStatus.map(s => s.count));
                const percentage = (item.count / maxCount) * 100;

                return (
                  <div key={item.status} className="flex items-center gap-4">
                    <div className="w-28">
                      <Badge className={cn(config.bgColor, config.color)}>
                        {config.label}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all duration-500', config.bgColor)}
                          style={{ width: `${percentage}%`, opacity: 0.7 }}
                        />
                      </div>
                    </div>
                    <div className="w-20 text-right">
                      <span className="font-semibold text-gray-900">{item.count}</span>
                      <span className="text-gray-400 text-sm ml-1">cases</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case Types */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Cases by Type</h2>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-gray-100">
              {casesByType.slice(0, 6).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between px-6 py-3">
                  <span className="text-sm text-gray-600">
                    {caseTypeLabels[type as keyof typeof caseTypeLabels] || type}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                    <span className="text-xs text-gray-400">
                      ({((count / totalCases) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Lead Sources</h2>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-gray-100">
              {leadsBySource.map(([source, count]) => (
                <div key={source} className="flex items-center justify-between px-6 py-3">
                  <span className="text-sm text-gray-600 capitalize">
                    {source.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                    <span className="text-xs text-gray-400">
                      ({((count / totalLeads) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Monthly Summary */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Monthly Summary</h2>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-gray-100">
              {mockMonthlyMetrics.slice(-5).reverse().map((month) => (
                <div key={month.month} className="flex items-center justify-between px-6 py-3">
                  <span className="text-sm font-medium text-gray-900">{month.month}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">{month.newCases} new</span>
                    <span className="text-gray-500">{month.closedCases} closed</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(month.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Performance Metrics</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">145</p>
              <p className="text-sm text-gray-500">Avg. Days to Settlement</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">361</p>
              <p className="text-sm text-gray-500">5-Star Reviews</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">94%</p>
              <p className="text-sm text-gray-500">Win Rate</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">$100M+</p>
              <p className="text-sm text-gray-500">Total Recovered</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
