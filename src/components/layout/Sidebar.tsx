'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserPlus,
  Calendar,
  FileText,
  DollarSign,
  MessageSquare,
  BarChart3,
  Settings,
  Scale,
  ChevronLeft,
  ChevronRight,
  Phone,
  Building2,
  ClipboardCheck,
  Stethoscope,
  Calculator,
  Mail,
  Shield,
  Workflow,
  AlertTriangle,
  Brain,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface NavSection {
  title?: string;
  items: { name: string; href: string; icon: React.ElementType; badge?: string }[];
}

const navigationSections: NavSection[] = [
  {
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Case Management',
    items: [
      { name: 'Cases', href: '/cases', icon: Briefcase },
      { name: 'Clients', href: '/clients', icon: Users },
      { name: 'Leads', href: '/leads', icon: UserPlus },
      { name: 'Intake', href: '/intake', icon: ClipboardCheck, badge: 'New' },
    ]
  },
  {
    title: 'Medical & Treatment',
    items: [
      { name: 'Medical Records', href: '/medical-records', icon: Stethoscope },
      { name: 'SOL Tracking', href: '/sol-tracking', icon: AlertTriangle },
    ]
  },
  {
    title: 'Financials',
    items: [
      { name: 'Settlements', href: '/settlements', icon: Calculator },
      { name: 'Billing', href: '/billing', icon: DollarSign },
      { name: 'Demands', href: '/demands', icon: Mail },
    ]
  },
  {
    title: 'Operations',
    items: [
      { name: 'Calendar', href: '/calendar', icon: Calendar },
      { name: 'Documents', href: '/documents', icon: FileText },
      { name: 'Communications', href: '/communications', icon: MessageSquare },
    ]
  },
  {
    title: 'Advanced Tools',
    items: [
      { name: 'Client Portal', href: '/portal', icon: Shield },
      { name: 'Workflows', href: '/workflows', icon: Workflow },
      { name: 'AI Insights', href: '/insights', icon: Brain, badge: 'AI' },
      { name: 'Reports', href: '/reports', icon: BarChart3 },
    ]
  },
];

const secondaryNav = [
  { name: 'Team', href: '/team', icon: Building2 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isSectionExpanded = (title: string | undefined) => {
    if (!title) return true;
    return expandedSections[title] !== false; // Default to expanded
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-md">
            <Scale className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-lg leading-tight">Wind Law</span>
              <span className="text-xs text-gray-500">Case Management</span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navigationSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-4">
            {/* Section Title */}
            {section.title && !collapsed && (
              <button
                onClick={() => toggleSection(section.title!)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600"
              >
                <span>{section.title}</span>
                {isSectionExpanded(section.title) ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}

            {/* Section Items */}
            {isSectionExpanded(section.title) && (
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                          isActive
                            ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                          collapsed && 'justify-center px-2'
                        )}
                        title={collapsed ? item.name : undefined}
                      >
                        <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary-600')} />
                        {!collapsed && (
                          <div className="flex items-center justify-between flex-1">
                            <span>{item.name}</span>
                            {item.badge && (
                              <span className={cn(
                                'px-1.5 py-0.5 text-[10px] font-semibold rounded',
                                item.badge === 'AI'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-accent-100 text-accent-700'
                              )}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}

        {/* Divider */}
        <div className="my-4 border-t border-gray-100" />

        {/* Secondary Navigation */}
        <ul className="space-y-1">
          {secondaryNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    collapsed && 'justify-center px-2'
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary-600')} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Contact Info / Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-3 border border-primary-100">
            <div className="flex items-center gap-2 text-sm text-primary-700 font-medium mb-1">
              <Phone className="w-4 h-4" />
              <span>(804) 773-3815</span>
            </div>
            <p className="text-xs text-primary-600">Richmond, VA</p>
          </div>
        </div>
      )}
    </aside>
  );
}
