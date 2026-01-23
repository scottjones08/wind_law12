'use client';

import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { mockTasks } from '@/lib/mock-data';
import { priorityConfig, formatSmartDate, cn, daysUntil } from '@/lib/utils';
import { ArrowRight, CheckCircle2, Circle, Clock } from 'lucide-react';

export function TaskList() {
  const pendingTasks = mockTasks
    .filter(task => task.status !== 'completed' && task.status !== 'cancelled')
    .sort((a, b) => {
      // Sort by priority first, then due date
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  return (
    <Card>
      <CardHeader
        action={
          <Link href="/tasks">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All
            </Button>
          </Link>
        }
      >
        <h2 className="text-lg font-semibold text-gray-900">Pending Tasks</h2>
      </CardHeader>
      <CardBody className="p-0">
        <div className="divide-y divide-gray-100">
          {pendingTasks.map((task) => {
            const priority = priorityConfig[task.priority];
            const isOverdue = task.dueDate && daysUntil(task.dueDate) < 0;
            const isDueSoon = task.dueDate && daysUntil(task.dueDate) <= 2 && daysUntil(task.dueDate) >= 0;

            return (
              <div
                key={task.id}
                className="flex items-start gap-3 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <button className="mt-0.5 flex-shrink-0 hover:scale-110 transition-transform">
                  {getStatusIcon(task.status)}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <Badge className={cn(priority.bgColor, priority.color)}>
                      {priority.label}
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{task.description}</p>
                  )}
                  {task.dueDate && (
                    <p
                      className={cn(
                        'text-xs mt-1.5',
                        isOverdue && 'text-red-600 font-medium',
                        isDueSoon && !isOverdue && 'text-orange-600',
                        !isOverdue && !isDueSoon && 'text-gray-400'
                      )}
                    >
                      {isOverdue ? 'Overdue: ' : 'Due: '}
                      {formatSmartDate(task.dueDate)}
                    </p>
                  )}
                </div>
                {task.assignee && (
                  <Avatar
                    firstName={task.assignee.firstName}
                    lastName={task.assignee.lastName}
                    size="sm"
                  />
                )}
              </div>
            );
          })}
          {pendingTasks.length === 0 && (
            <div className="px-6 py-8 text-center">
              <CheckCircle2 className="w-10 h-10 text-green-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">All caught up!</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
