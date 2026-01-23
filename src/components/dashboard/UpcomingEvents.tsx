'use client';

import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockEvents } from '@/lib/mock-data';
import { formatSmartDate, cn } from '@/lib/utils';
import { ArrowRight, Calendar, Clock, MapPin, Video, Users } from 'lucide-react';

const eventTypeIcons: Record<string, { icon: typeof Calendar; color: string; bg: string }> = {
  consultation: { icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  client_meeting: { icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
  court_date: { icon: Calendar, color: 'text-red-600', bg: 'bg-red-50' },
  deposition: { icon: Video, color: 'text-purple-600', bg: 'bg-purple-50' },
  mediation: { icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
  deadline: { icon: Clock, color: 'text-red-600', bg: 'bg-red-50' },
  follow_up: { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50' },
  internal_meeting: { icon: Users, color: 'text-gray-600', bg: 'bg-gray-50' },
  other: { icon: Calendar, color: 'text-gray-600', bg: 'bg-gray-50' },
};

export function UpcomingEvents() {
  const now = new Date();
  const upcomingEvents = mockEvents
    .filter(event => new Date(event.startTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader
        action={
          <Link href="/calendar">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View Calendar
            </Button>
          </Link>
        }
      >
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
      </CardHeader>
      <CardBody className="p-0">
        <div className="divide-y divide-gray-100">
          {upcomingEvents.map((event) => {
            const typeConfig = eventTypeIcons[event.type] || eventTypeIcons.other;
            const IconComponent = typeConfig.icon;

            return (
              <div
                key={event.id}
                className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className={cn('p-2 rounded-lg flex-shrink-0', typeConfig.bg)}>
                  <IconComponent className={cn('w-5 h-5', typeConfig.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatSmartDate(event.startTime)}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {upcomingEvents.length === 0 && (
            <div className="px-6 py-8 text-center">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No upcoming events</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
