'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { mockEvents, mockCases, mockUsers } from '@/lib/mock-data';
import { formatDate, formatSmartDate, cn } from '@/lib/utils';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Video,
  Gavel,
  AlertCircle,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';

const eventTypeConfig: Record<string, { icon: typeof CalendarIcon; color: string; bg: string; label: string }> = {
  consultation: { icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Consultation' },
  client_meeting: { icon: Users, color: 'text-green-600', bg: 'bg-green-100', label: 'Client Meeting' },
  court_date: { icon: Gavel, color: 'text-red-600', bg: 'bg-red-100', label: 'Court Date' },
  deposition: { icon: Video, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Deposition' },
  mediation: { icon: Users, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Mediation' },
  deadline: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Deadline' },
  follow_up: { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Follow Up' },
  internal_meeting: { icon: Users, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Internal Meeting' },
  other: { icon: CalendarIcon, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Other' },
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [view, setView] = useState<'month' | 'week' | 'agenda'>('month');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the first day of the week (Sunday = 0)
  const startDay = monthStart.getDay();
  const prevMonthDays = Array(startDay).fill(null);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getEventsForDay = (day: Date) => {
    return mockEvents.filter(event => isSameDay(new Date(event.startTime), day));
  };

  const upcomingEvents = mockEvents
    .filter(event => new Date(event.startTime) >= new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-500 mt-1">
            Schedule and manage appointments, court dates, and deadlines.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowNewEventModal(true)}>
          New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {format(currentDate, 'MMMM yyyy')}
                  </h2>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={prevMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    {['month', 'week', 'agenda'].map((v) => (
                      <button
                        key={v}
                        onClick={() => setView(v as typeof view)}
                        className={cn(
                          'px-3 py-1.5 text-sm capitalize transition-colors',
                          view === v ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="p-3 text-center text-sm font-semibold text-gray-500 border-b border-gray-200"
                  >
                    {day}
                  </div>
                ))}

                {/* Empty cells for days before month start */}
                {prevMonthDays.map((_, index) => (
                  <div key={`empty-${index}`} className="min-h-[120px] p-2 bg-gray-50 border-b border-r border-gray-100" />
                ))}

                {/* Days of the month */}
                {daysInMonth.map((day) => {
                  const events = getEventsForDay(day);
                  const isCurrentDay = isToday(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);

                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        'min-h-[120px] p-2 border-b border-r border-gray-100 cursor-pointer transition-colors',
                        isSelected && 'bg-primary-50',
                        !isSelected && 'hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-center justify-center mb-1">
                        <span
                          className={cn(
                            'w-7 h-7 flex items-center justify-center text-sm rounded-full',
                            isCurrentDay && 'bg-primary-600 text-white font-semibold',
                            !isCurrentDay && 'text-gray-700'
                          )}
                        >
                          {format(day, 'd')}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {events.slice(0, 3).map((event) => {
                          const config = eventTypeConfig[event.type] || eventTypeConfig.other;
                          return (
                            <div
                              key={event.id}
                              className={cn(
                                'px-2 py-1 rounded text-xs truncate',
                                config.bg,
                                config.color
                              )}
                            >
                              {event.title}
                            </div>
                          );
                        })}
                        {events.length > 3 && (
                          <p className="text-xs text-gray-400 pl-2">+{events.length - 3} more</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar - Upcoming Events */}
        <div className="space-y-6">
          {selectedDate && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </h3>
              </CardHeader>
              <CardBody className="p-0">
                <div className="divide-y divide-gray-100">
                  {getEventsForDay(selectedDate).length > 0 ? (
                    getEventsForDay(selectedDate).map((event) => {
                      const config = eventTypeConfig[event.type] || eventTypeConfig.other;
                      const IconComponent = config.icon;
                      return (
                        <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className={cn('p-2 rounded-lg', config.bg)}>
                              <IconComponent className={cn('w-4 h-4', config.color)} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
                              </p>
                              {event.location && (
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center">
                      <CalendarIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No events scheduled</p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {upcomingEvents.map((event) => {
                  const config = eventTypeConfig[event.type] || eventTypeConfig.other;
                  const IconComponent = config.icon;
                  return (
                    <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className={cn('p-2 rounded-lg flex-shrink-0', config.bg)}>
                          <IconComponent className={cn('w-4 h-4', config.color)} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{event.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatSmartDate(event.startTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* Event Type Legend */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Event Types</h3>
            </CardHeader>
            <CardBody className="space-y-2">
              {Object.entries(eventTypeConfig).slice(0, 6).map(([key, config]) => {
                const IconComponent = config.icon;
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div className={cn('p-1.5 rounded', config.bg)}>
                      <IconComponent className={cn('w-3 h-3', config.color)} />
                    </div>
                    <span className="text-sm text-gray-600">{config.label}</span>
                  </div>
                );
              })}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* New Event Modal */}
      <Modal
        isOpen={showNewEventModal}
        onClose={() => setShowNewEventModal(false)}
        title="Create New Event"
        size="lg"
      >
        <div className="space-y-4">
          <Input label="Event Title" placeholder="Enter event title" />
          <Select
            label="Event Type"
            options={Object.entries(eventTypeConfig).map(([value, config]) => ({
              value,
              label: config.label,
            }))}
            placeholder="Select event type"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" />
            <Input label="Start Time" type="time" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="End Date" type="date" />
            <Input label="End Time" type="time" />
          </div>
          <Input label="Location" placeholder="Enter location" />
          <Select
            label="Related Case"
            options={[
              { value: '', label: 'No case' },
              ...mockCases.map(c => ({ value: c.id, label: c.caseNumber + ' - ' + c.title })),
            ]}
            placeholder="Select case (optional)"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Event details..."
            />
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowNewEventModal(false)}>Cancel</Button>
          <Button>Create Event</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
