'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarGroup } from '@/components/ui/Avatar';
import { Select } from '@/components/ui/Select';
import { mockCases, mockUsers } from '@/lib/mock-data';
import {
  caseStatusConfig,
  caseTypeLabels,
  priorityConfig,
  formatCurrency,
  formatDate,
  daysUntil,
  cn,
} from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  SlidersHorizontal,
  AlertCircle,
  Calendar,
  DollarSign,
  User,
  ArrowUpDown,
} from 'lucide-react';
import type { CaseStatus, CaseType, CasePriority } from '@/types';

type ViewMode = 'grid' | 'list' | 'kanban';

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Filter cases
  const filteredCases = mockCases
    .filter(caseItem => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        caseItem.caseNumber.toLowerCase().includes(searchLower) ||
        caseItem.title.toLowerCase().includes(searchLower) ||
        caseItem.client?.firstName.toLowerCase().includes(searchLower) ||
        caseItem.client?.lastName.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
      const matchesType = typeFilter === 'all' || caseItem.caseType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'value-high':
          return (b.medicalExpenses + b.lostWages + b.otherDamages) - (a.medicalExpenses + a.lostWages + a.otherDamages);
        case 'value-low':
          return (a.medicalExpenses + a.lostWages + a.otherDamages) - (b.medicalExpenses + b.lostWages + b.otherDamages);
        case 'sol':
          return new Date(a.statuteOfLimitations).getTime() - new Date(b.statuteOfLimitations).getTime();
        default:
          return 0;
      }
    });

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    ...Object.entries(caseStatusConfig).map(([value, config]) => ({
      value,
      label: config.label,
    })),
  ];

  const typeOptions = [
    { value: 'all', label: 'All Case Types' },
    ...Object.entries(caseTypeLabels).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'value-high', label: 'Highest Value' },
    { value: 'value-low', label: 'Lowest Value' },
    { value: 'sol', label: 'SOL Date' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cases</h1>
          <p className="text-gray-500 mt-1">
            Manage all your personal injury cases in one place.
          </p>
        </div>
        <Link href="/cases/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>New Case</Button>
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardBody className="py-4">
            <p className="text-sm text-gray-500">Total Cases</p>
            <p className="text-2xl font-bold text-gray-900">{mockCases.length}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4">
            <p className="text-sm text-gray-500">Active Cases</p>
            <p className="text-2xl font-bold text-blue-600">
              {mockCases.filter(c => !['closed', 'dismissed', 'settled'].includes(c.status)).length}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4">
            <p className="text-sm text-gray-500">Total Value</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(mockCases.reduce((sum, c) => sum + c.medicalExpenses + c.lostWages + c.otherDamages, 0))}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="py-4">
            <p className="text-sm text-gray-500">Urgent SOL</p>
            <p className="text-2xl font-bold text-orange-600">
              {mockCases.filter(c => daysUntil(c.statuteOfLimitations) <= 90 && daysUntil(c.statuteOfLimitations) > 0).length}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search cases by number, name, or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-40"
              />
              <Select
                options={typeOptions}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-44"
              />
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-36"
              />
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2.5 transition-colors',
                    viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-400 hover:text-gray-600'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2.5 transition-colors border-l border-gray-300',
                    viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-400 hover:text-gray-600'
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Cases List */}
      {viewMode === 'list' ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Case
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    SOL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCases.map((caseItem) => {
                  const statusConfig = caseStatusConfig[caseItem.status];
                  const priorityConf = priorityConfig[caseItem.priority];
                  const solDays = daysUntil(caseItem.statuteOfLimitations);
                  const totalDamages = caseItem.medicalExpenses + caseItem.lostWages + caseItem.otherDamages;

                  return (
                    <tr key={caseItem.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/cases/${caseItem.id}`} className="block">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 hover:text-primary-600">
                              {caseItem.caseNumber}
                            </p>
                            <Badge className={cn(priorityConf.bgColor, priorityConf.color)}>
                              {priorityConf.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5 max-w-xs truncate">
                            {caseItem.title}
                          </p>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {caseItem.client && (
                          <div className="flex items-center gap-2">
                            <Avatar
                              firstName={caseItem.client.firstName}
                              lastName={caseItem.client.lastName}
                              size="sm"
                            />
                            <span className="text-sm text-gray-900">
                              {caseItem.client.firstName} {caseItem.client.lastName}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {caseTypeLabels[caseItem.caseType]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn(statusConfig.bgColor, statusConfig.color)}>
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(totalDamages)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn(
                          'flex items-center gap-1.5 text-sm',
                          solDays <= 90 && 'text-orange-600 font-medium',
                          solDays <= 30 && 'text-red-600 font-medium'
                        )}>
                          {solDays <= 90 && <AlertCircle className="w-3.5 h-3.5" />}
                          <span>{formatDate(caseItem.statuteOfLimitations)}</span>
                          <span className="text-gray-400">({solDays}d)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <AvatarGroup max={3}>
                          {caseItem.leadAttorney && (
                            <Avatar
                              firstName={caseItem.leadAttorney.firstName}
                              lastName={caseItem.leadAttorney.lastName}
                              size="sm"
                            />
                          )}
                          {caseItem.assignedStaff.slice(0, 2).map((staffId) => {
                            const staff = mockUsers.find(u => u.id === staffId);
                            return staff ? (
                              <Avatar
                                key={staffId}
                                firstName={staff.firstName}
                                lastName={staff.lastName}
                                size="sm"
                              />
                            ) : null;
                          })}
                        </AvatarGroup>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCases.map((caseItem) => {
            const statusConfig = caseStatusConfig[caseItem.status];
            const priorityConf = priorityConfig[caseItem.priority];
            const solDays = daysUntil(caseItem.statuteOfLimitations);
            const totalDamages = caseItem.medicalExpenses + caseItem.lostWages + caseItem.otherDamages;

            return (
              <Link key={caseItem.id} href={`/cases/${caseItem.id}`}>
                <Card hover className="h-full">
                  <CardBody>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{caseItem.caseNumber}</p>
                          <Badge className={cn(priorityConf.bgColor, priorityConf.color)} >
                            {priorityConf.label}
                          </Badge>
                        </div>
                        <Badge className={cn(statusConfig.bgColor, statusConfig.color, 'mt-2')}>
                          {statusConfig.label}
                        </Badge>
                      </div>
                      {caseItem.leadAttorney && (
                        <Avatar
                          firstName={caseItem.leadAttorney.firstName}
                          lastName={caseItem.leadAttorney.lastName}
                          size="sm"
                        />
                      )}
                    </div>

                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {caseItem.title}
                    </h3>

                    <div className="space-y-2 text-sm">
                      {caseItem.client && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4 text-gray-400" />
                          {caseItem.client.firstName} {caseItem.client.lastName}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        {formatCurrency(totalDamages)} damages
                      </div>
                      <div className={cn(
                        'flex items-center gap-2',
                        solDays <= 90 ? 'text-orange-600' : 'text-gray-600'
                      )}>
                        <Calendar className="w-4 h-4" />
                        SOL: {formatDate(caseItem.statuteOfLimitations)} ({solDays}d)
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {caseTypeLabels[caseItem.caseType]}
                      </span>
                      <span className="text-xs text-gray-400">
                        Opened {formatDate(caseItem.createdAt)}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {filteredCases.length === 0 && (
        <Card>
          <CardBody className="py-12 text-center">
            <p className="text-gray-500">No cases found matching your criteria.</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
