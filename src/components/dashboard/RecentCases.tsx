'use client';

import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { mockCases } from '@/lib/mock-data';
import { caseStatusConfig, caseTypeLabels, formatCurrency, formatDate } from '@/lib/utils';
import { ArrowRight, AlertCircle } from 'lucide-react';

export function RecentCases() {
  const recentCases = mockCases
    .filter(c => c.status !== 'closed' && c.status !== 'dismissed')
    .slice(0, 5);

  return (
    <Card>
      <CardHeader
        action={
          <Link href="/cases">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All
            </Button>
          </Link>
        }
      >
        <h2 className="text-lg font-semibold text-gray-900">Active Cases</h2>
      </CardHeader>
      <CardBody className="p-0">
        <div className="divide-y divide-gray-100">
          {recentCases.map((caseItem) => {
            const statusConfig = caseStatusConfig[caseItem.status];
            const daysToSOL = Math.ceil(
              (new Date(caseItem.statuteOfLimitations).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            const isUrgentSOL = daysToSOL <= 90;

            return (
              <Link
                key={caseItem.id}
                href={`/cases/${caseItem.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {caseItem.caseNumber}
                    </p>
                    <Badge
                      className={`${statusConfig.bgColor} ${statusConfig.color}`}
                    >
                      {statusConfig.label}
                    </Badge>
                    {isUrgentSOL && (
                      <span className="flex items-center gap-1 text-xs text-orange-600">
                        <AlertCircle className="w-3 h-3" />
                        SOL: {daysToSOL}d
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5 truncate">{caseItem.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>{caseTypeLabels[caseItem.caseType]}</span>
                    <span>Incident: {formatDate(caseItem.incidentDate)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(caseItem.medicalExpenses + caseItem.lostWages + caseItem.otherDamages)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Total Damages</p>
                </div>
                {caseItem.leadAttorney && (
                  <Avatar
                    firstName={caseItem.leadAttorney.firstName}
                    lastName={caseItem.leadAttorney.lastName}
                    size="sm"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
