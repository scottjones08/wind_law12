'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { mockMonthlyMetrics } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

export function RevenueChart() {
  const maxRevenue = Math.max(...mockMonthlyMetrics.map(m => m.revenue));
  const totalRevenue = mockMonthlyMetrics.reduce((sum, m) => sum + m.revenue, 0);

  return (
    <Card>
      <CardHeader>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {formatCurrency(totalRevenue)} total recovered this year
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex items-end gap-2 h-48">
          {mockMonthlyMetrics.map((month, index) => {
            const height = (month.revenue / maxRevenue) * 100;
            const isCurrentMonth = index === mockMonthlyMetrics.length - 1;

            return (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1">
                    {formatCurrency(month.revenue).replace('$', '')}
                  </span>
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 hover:opacity-80 ${
                      isCurrentMonth ? 'bg-primary-600' : 'bg-primary-200'
                    }`}
                    style={{ height: `${height}%`, minHeight: '8px' }}
                  />
                </div>
                <span className={`text-xs mt-2 ${isCurrentMonth ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
                  {month.month}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary-200" />
            <span className="text-xs text-gray-500">Previous Months</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary-600" />
            <span className="text-xs text-gray-500">Current Month</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
