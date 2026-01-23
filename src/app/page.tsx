'use client';

import {
  StatCard,
  RecentCases,
  UpcomingEvents,
  TaskList,
  ActivityFeed,
  CasePipeline,
  RevenueChart,
  LeadsSummary,
} from '@/components/dashboard';
import { mockDashboardStats } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import {
  Briefcase,
  UserPlus,
  CheckSquare,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Award,
  Target,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Ryan. Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Cases"
          value={mockDashboardStats.activeCases}
          change={12}
          changeLabel="vs last month"
          icon={<Briefcase className="w-5 h-5" />}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="New Leads"
          value={mockDashboardStats.newLeadsThisMonth}
          change={8}
          changeLabel="vs last month"
          icon={<UserPlus className="w-5 h-5" />}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <StatCard
          title="Pending Tasks"
          value={mockDashboardStats.pendingTasks}
          change={-5}
          changeLabel="vs last week"
          icon={<CheckSquare className="w-5 h-5" />}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
        <StatCard
          title="Urgent Deadlines"
          value={mockDashboardStats.upcomingDeadlines}
          icon={<AlertTriangle className="w-5 h-5" />}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
        />
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Recovered"
          value={formatCurrency(mockDashboardStats.totalRecovered)}
          change={15}
          changeLabel="YTD growth"
          icon={<DollarSign className="w-5 h-5" />}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <StatCard
          title="Avg Case Value"
          value={formatCurrency(mockDashboardStats.avgCaseValue)}
          change={7}
          changeLabel="vs last year"
          icon={<TrendingUp className="w-5 h-5" />}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Cases Won"
          value={mockDashboardStats.casesWonThisYear}
          changeLabel="this year"
          icon={<Award className="w-5 h-5" />}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-50"
        />
        <StatCard
          title="Conversion Rate"
          value={`${mockDashboardStats.conversionRate}%`}
          change={3}
          changeLabel="vs last quarter"
          icon={<Target className="w-5 h-5" />}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
      </div>

      {/* Case Pipeline */}
      <CasePipeline />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Cases and Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <RecentCases />
          <RevenueChart />
        </div>

        {/* Right Column - Events and Activity */}
        <div className="space-y-6">
          <UpcomingEvents />
          <TaskList />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadsSummary />
        <ActivityFeed />
      </div>
    </div>
  );
}
