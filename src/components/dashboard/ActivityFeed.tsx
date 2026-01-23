'use client';

import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { mockActivities } from '@/lib/mock-data';
import { formatRelativeTime, cn } from '@/lib/utils';
import {
  ArrowRight,
  FileText,
  Briefcase,
  CheckCircle2,
  MessageSquare,
  DollarSign,
  AlertCircle,
  Plus,
} from 'lucide-react';

const activityIcons: Record<string, { icon: typeof FileText; color: string; bg: string }> = {
  case_created: { icon: Plus, color: 'text-green-600', bg: 'bg-green-50' },
  case_updated: { icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
  document_uploaded: { icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
  task_completed: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  note_added: { icon: MessageSquare, color: 'text-gray-600', bg: 'bg-gray-100' },
  settlement_received: { icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
  deadline_approaching: { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
};

export function ActivityFeed() {
  const recentActivities = mockActivities.slice(0, 8);

  return (
    <Card>
      <CardHeader
        action={
          <Link href="/activity">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All
            </Button>
          </Link>
        }
      >
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </CardHeader>
      <CardBody className="p-0">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-10 top-0 bottom-0 w-px bg-gray-100" />

          <div className="divide-y divide-gray-50">
            {recentActivities.map((activity) => {
              const config = activityIcons[activity.type] || activityIcons.note_added;
              const IconComponent = config.icon;

              return (
                <div
                  key={activity.id}
                  className="relative flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className={cn('p-2 rounded-full z-10', config.bg)}>
                    <IconComponent className={cn('w-4 h-4', config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {activity.user && (
                        <span className="text-sm font-medium text-gray-900">
                          {activity.user.firstName} {activity.user.lastName}
                        </span>
                      )}
                      <span className="text-sm text-gray-600">{activity.description}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatRelativeTime(activity.createdAt)}
                    </p>
                  </div>
                  {activity.user && (
                    <Avatar
                      firstName={activity.user.firstName}
                      lastName={activity.user.lastName}
                      size="xs"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
