'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { mockCasesByStatus } from '@/lib/mock-data';
import { caseStatusConfig, formatCurrency, cn } from '@/lib/utils';
import type { CaseStatus } from '@/types';

export function CasePipeline() {
  const pipelineStatuses: CaseStatus[] = ['intake', 'investigation', 'demand', 'negotiation', 'litigation', 'settled'];
  const totalCases = mockCasesByStatus.reduce((sum, item) => sum + item.count, 0);
  const totalValue = mockCasesByStatus.reduce((sum, item) => sum + item.totalValue, 0);

  return (
    <Card>
      <CardHeader>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Case Pipeline</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalCases} active cases · {formatCurrency(totalValue)} total value
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex gap-3">
          {pipelineStatuses.map((status) => {
            const statusData = mockCasesByStatus.find(s => s.status === status);
            const config = caseStatusConfig[status];
            const percentage = statusData ? (statusData.count / totalCases) * 100 : 0;

            return (
              <div key={status} className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', config.bgColor, config.color)}>
                    {config.label}
                  </span>
                  <span className="text-lg font-bold text-gray-900">{statusData?.count || 0}</span>
                </div>
                <div className="h-24 bg-gray-50 rounded-lg p-3 relative overflow-hidden">
                  <div
                    className={cn('absolute bottom-0 left-0 right-0 transition-all duration-500', config.bgColor)}
                    style={{ height: `${percentage * 2}%`, opacity: 0.5 }}
                  />
                  <div className="relative">
                    <p className="text-xs text-gray-500">{formatCurrency(statusData?.totalValue || 0)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
