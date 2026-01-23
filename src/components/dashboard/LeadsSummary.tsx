'use client';

import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockLeads } from '@/lib/mock-data';
import { leadStatusConfig, caseTypeLabels, formatRelativeTime, cn } from '@/lib/utils';
import { ArrowRight, Phone, Mail, Calendar } from 'lucide-react';

export function LeadsSummary() {
  const activeLeads = mockLeads
    .filter(lead => lead.status !== 'not_qualified' && lead.status !== 'lost' && lead.status !== 'retained')
    .slice(0, 4);

  const leadCounts = {
    new: mockLeads.filter(l => l.status === 'new').length,
    qualified: mockLeads.filter(l => l.status === 'qualified').length,
    consultation: mockLeads.filter(l => l.status === 'consultation_scheduled').length,
  };

  return (
    <Card>
      <CardHeader
        action={
          <Link href="/leads">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All
            </Button>
          </Link>
        }
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Leads</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-500">
              <span className="font-medium text-blue-600">{leadCounts.new}</span> new
            </span>
            <span className="text-xs text-gray-500">
              <span className="font-medium text-green-600">{leadCounts.qualified}</span> qualified
            </span>
            <span className="text-xs text-gray-500">
              <span className="font-medium text-orange-600">{leadCounts.consultation}</span> scheduled
            </span>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <div className="divide-y divide-gray-100">
          {activeLeads.map((lead) => {
            const statusConfig = leadStatusConfig[lead.status];

            return (
              <Link
                key={lead.id}
                href={`/leads/${lead.id}`}
                className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {lead.firstName} {lead.lastName}
                    </p>
                    <Badge className={cn(statusConfig.bgColor, statusConfig.color)}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{caseTypeLabels[lead.caseType]}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Phone className="w-3 h-3" />
                      {lead.phone}
                    </span>
                    {lead.email && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {formatRelativeTime(lead.createdAt)}
                  </p>
                  {lead.followUpDate && (
                    <p className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                      <Calendar className="w-3 h-3" />
                      Follow up
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
