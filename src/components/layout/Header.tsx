'use client';

import { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  UserPlus,
  Briefcase,
  Calendar as CalendarIcon,
  FileText,
  LogOut,
  User,
  Settings,
} from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { mockUsers } from '@/lib/mock-data';

const currentUser = mockUsers[0]; // Ryan Wind

const quickActions = [
  { name: 'New Case', href: '/cases/new', icon: Briefcase },
  { name: 'New Lead', href: '/leads/new', icon: UserPlus },
  { name: 'New Event', href: '/calendar/new', icon: CalendarIcon },
  { name: 'Upload Document', href: '/documents/upload', icon: FileText },
];

const notifications = [
  { id: 1, title: 'Deadline Approaching', message: 'Thompson case mediation in 2 days', time: '10 min ago', unread: true },
  { id: 2, title: 'New Lead', message: 'Patricia Martinez - Auto Accident', time: '1 hour ago', unread: true },
  { id: 3, title: 'Document Uploaded', message: 'Medical records added to Rodriguez case', time: '2 hours ago', unread: false },
  { id: 4, title: 'Task Completed', message: 'Sarah completed IME scheduling', time: '3 hours ago', unread: false },
];

export function Header() {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search cases, clients, documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs bg-gray-100 border border-gray-200 rounded text-gray-500">
              ESC
            </kbd>
          )}
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2">
        {/* Quick Add Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowQuickActions(!showQuickActions);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Add</span>
            <ChevronDown className={cn('w-4 h-4 transition-transform', showQuickActions && 'rotate-180')} />
          </button>

          {showQuickActions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowQuickActions(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
                {quickActions.map((action) => (
                  <a
                    key={action.name}
                    href={action.href}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <action.icon className="w-4 h-4 text-gray-400" />
                    {action.name}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowQuickActions(false);
              setShowUserMenu(false);
            }}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer',
                        notification.unread && 'bg-primary-50/50'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {notification.unread && (
                          <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                        )}
                        <div className={cn(!notification.unread && 'ml-5')}>
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-gray-100">
                  <a href="/notifications" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    View all notifications
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="relative ml-2">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowQuickActions(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {getInitials(currentUser.firstName, currentUser.lastName)}
              </span>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-gray-900">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{currentUser.role.replace('_', ' ')}</p>
            </div>
            <ChevronDown className={cn('w-4 h-4 text-gray-400 hidden lg:block transition-transform', showUserMenu && 'rotate-180')} />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{currentUser.firstName} {currentUser.lastName}</p>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                </div>
                <a
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  Your Profile
                </a>
                <a
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  Settings
                </a>
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 transition-colors w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
