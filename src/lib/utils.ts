import { clsx, type ClassValue } from 'clsx';
import { format, formatDistanceToNow, isToday, isTomorrow, isThisWeek, parseISO } from 'date-fns';
import type { CaseStatus, CaseType, LeadStatus, TaskPriority, CasePriority } from '@/types';

// Class name utility
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format phone number
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

// Format date
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
}

// Format date with time
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
}

// Format relative time
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

// Format smart date (Today, Tomorrow, This Week, or full date)
export function formatSmartDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) {
    return `Today at ${format(d, 'h:mm a')}`;
  }
  if (isTomorrow(d)) {
    return `Tomorrow at ${format(d, 'h:mm a')}`;
  }
  if (isThisWeek(d)) {
    return format(d, "EEEE 'at' h:mm a");
  }
  return format(d, 'MMM d, yyyy');
}

// Get initials from name
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

// Get full name
export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

// Case status display info
export const caseStatusConfig: Record<CaseStatus, { label: string; color: string; bgColor: string }> = {
  intake: { label: 'Intake', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  investigation: { label: 'Investigation', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  demand: { label: 'Demand', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  negotiation: { label: 'Negotiation', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  litigation: { label: 'Litigation', color: 'text-red-700', bgColor: 'bg-red-100' },
  trial: { label: 'Trial', color: 'text-red-800', bgColor: 'bg-red-200' },
  settled: { label: 'Settled', color: 'text-green-700', bgColor: 'bg-green-100' },
  closed: { label: 'Closed', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  dismissed: { label: 'Dismissed', color: 'text-gray-500', bgColor: 'bg-gray-50' },
};

// Case type display labels
export const caseTypeLabels: Record<CaseType, string> = {
  auto_accident: 'Auto Accident',
  truck_accident: 'Truck Accident',
  motorcycle_accident: 'Motorcycle Accident',
  rideshare_accident: 'Rideshare Accident',
  premises_liability: 'Premises Liability',
  slip_and_fall: 'Slip & Fall',
  workplace_injury: 'Workplace Injury',
  construction_accident: 'Construction Accident',
  wrongful_death: 'Wrongful Death',
  nursing_home: 'Nursing Home Abuse',
  dog_bite: 'Dog Bite',
  product_liability: 'Product Liability',
  bicycle_accident: 'Bicycle Accident',
  pedestrian_accident: 'Pedestrian Accident',
  boating_accident: 'Boating Accident',
  other: 'Other',
};

// Lead status config
export const leadStatusConfig: Record<LeadStatus, { label: string; color: string; bgColor: string }> = {
  new: { label: 'New', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  contacted: { label: 'Contacted', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  qualified: { label: 'Qualified', color: 'text-green-700', bgColor: 'bg-green-100' },
  consultation_scheduled: { label: 'Consultation Scheduled', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  retained: { label: 'Retained', color: 'text-green-800', bgColor: 'bg-green-200' },
  not_qualified: { label: 'Not Qualified', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  lost: { label: 'Lost', color: 'text-red-700', bgColor: 'bg-red-100' },
};

// Priority config
export const priorityConfig: Record<TaskPriority | CasePriority, { label: string; color: string; bgColor: string }> = {
  low: { label: 'Low', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  medium: { label: 'Medium', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  high: { label: 'High', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  urgent: { label: 'Urgent', color: 'text-red-600', bgColor: 'bg-red-100' },
};

// Generate case number
export function generateCaseNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `WL-${year}-${random}`;
}

// Calculate days until deadline
export function daysUntil(date: Date | string): number {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffTime = d.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// Calculate settlement distribution
export function calculateSettlement(grossAmount: number, attorneyFeePercent: number = 33.33) {
  const attorneyFees = grossAmount * (attorneyFeePercent / 100);
  return {
    grossAmount,
    attorneyFees,
    attorneyFeePercent,
  };
}

// Validate email
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate phone
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10;
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Group array by key
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {} as Record<string, T[]>);
}
