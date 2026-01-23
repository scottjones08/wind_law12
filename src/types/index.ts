// Core Types for Wind Law Management System

export type CaseStatus =
  | 'intake'
  | 'investigation'
  | 'demand'
  | 'negotiation'
  | 'litigation'
  | 'trial'
  | 'settled'
  | 'closed'
  | 'dismissed';

export type CasePriority = 'low' | 'medium' | 'high' | 'urgent';

export type CaseType =
  | 'auto_accident'
  | 'truck_accident'
  | 'motorcycle_accident'
  | 'rideshare_accident'
  | 'premises_liability'
  | 'slip_and_fall'
  | 'workplace_injury'
  | 'construction_accident'
  | 'wrongful_death'
  | 'nursing_home'
  | 'dog_bite'
  | 'product_liability'
  | 'bicycle_accident'
  | 'pedestrian_accident'
  | 'boating_accident'
  | 'other';

export type LeadSource =
  | 'website'
  | 'referral'
  | 'google'
  | 'social_media'
  | 'tv_ad'
  | 'radio'
  | 'billboard'
  | 'direct_mail'
  | 'walk_in'
  | 'other';

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'consultation_scheduled'
  | 'retained'
  | 'not_qualified'
  | 'lost';

export type DocumentType =
  | 'medical_record'
  | 'police_report'
  | 'insurance_document'
  | 'correspondence'
  | 'photo_evidence'
  | 'video_evidence'
  | 'contract'
  | 'court_filing'
  | 'deposition'
  | 'expert_report'
  | 'bill'
  | 'settlement'
  | 'other';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type EventType =
  | 'consultation'
  | 'client_meeting'
  | 'court_date'
  | 'deposition'
  | 'mediation'
  | 'deadline'
  | 'follow_up'
  | 'internal_meeting'
  | 'other';

export type UserRole = 'admin' | 'attorney' | 'paralegal' | 'case_manager' | 'intake_specialist' | 'receptionist';

// Entity Interfaces
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: Address;
  dateOfBirth?: Date;
  ssn?: string; // Last 4 only for display
  emergencyContact?: EmergencyContact;
  preferredContactMethod: 'email' | 'phone' | 'text';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  caseType: CaseType;
  incidentDate?: Date;
  incidentDescription: string;
  estimatedValue?: number;
  assignedTo?: string;
  notes?: string;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  convertedToClientId?: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  clientId: string;
  client?: Client;
  caseType: CaseType;
  status: CaseStatus;
  priority: CasePriority;
  title: string;
  description: string;

  // Incident Details
  incidentDate: Date;
  incidentLocation?: string;
  incidentDescription: string;

  // Parties
  defendants: Party[];
  insuranceCompanies: InsuranceCompany[];

  // Financial
  medicalExpenses: number;
  lostWages: number;
  otherDamages: number;
  demandAmount?: number;
  settlementAmount?: number;

  // Assignment
  leadAttorneyId: string;
  leadAttorney?: User;
  assignedStaff: string[];

  // Dates
  statuteOfLimitations: Date;
  nextCourtDate?: Date;

  // Metadata
  source: LeadSource;
  referralSource?: string;
  notes?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Party {
  id: string;
  name: string;
  type: 'individual' | 'company';
  role: 'defendant' | 'witness' | 'expert';
  phone?: string;
  email?: string;
  address?: Address;
  attorney?: string;
  notes?: string;
}

export interface InsuranceCompany {
  id: string;
  name: string;
  claimNumber?: string;
  adjusterName?: string;
  adjusterPhone?: string;
  adjusterEmail?: string;
  policyLimit?: number;
  coverageType: string;
}

export interface Document {
  id: string;
  caseId: string;
  name: string;
  type: DocumentType;
  description?: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
  tags: string[];
}

export interface Task {
  id: string;
  caseId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  assignedTo: string;
  assignee?: User;
  createdBy: string;
  completedAt?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEvent {
  id: string;
  caseId?: string;
  clientId?: string;
  title: string;
  description?: string;
  type: EventType;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees: string[];
  reminderMinutes?: number;
  isAllDay: boolean;
  recurrence?: RecurrenceRule;
  createdBy: string;
  createdAt: Date;
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
  count?: number;
}

export interface Communication {
  id: string;
  caseId?: string;
  clientId: string;
  type: 'email' | 'phone' | 'text' | 'letter' | 'meeting';
  direction: 'inbound' | 'outbound';
  subject?: string;
  content: string;
  attachments?: string[];
  createdBy: string;
  createdAt: Date;
}

export interface Settlement {
  id: string;
  caseId: string;
  grossAmount: number;
  attorneyFees: number;
  caseExpenses: number;
  medicalLiens: number;
  otherDeductions: number;
  clientNetAmount: number;
  settlementDate: Date;
  disbursementDate?: Date;
  notes?: string;
}

export interface TimeEntry {
  id: string;
  caseId: string;
  userId: string;
  description: string;
  hours: number;
  rate: number;
  date: Date;
  billable: boolean;
  createdAt: Date;
}

export interface Expense {
  id: string;
  caseId: string;
  description: string;
  amount: number;
  category: string;
  vendor?: string;
  date: Date;
  receiptUrl?: string;
  reimbursable: boolean;
  createdBy: string;
  createdAt: Date;
}

// Dashboard & Analytics Types
export interface DashboardStats {
  activeCases: number;
  newLeadsThisMonth: number;
  pendingTasks: number;
  upcomingDeadlines: number;
  totalRecovered: number;
  avgCaseValue: number;
  conversionRate: number;
  casesWonThisYear: number;
}

export interface CasesByStatus {
  status: CaseStatus;
  count: number;
  totalValue: number;
}

export interface CasesByType {
  type: CaseType;
  count: number;
  avgValue: number;
}

export interface MonthlyMetrics {
  month: string;
  newCases: number;
  closedCases: number;
  revenue: number;
  leads: number;
}

// Activity feed
export interface Activity {
  id: string;
  type: 'case_created' | 'case_updated' | 'document_uploaded' | 'task_completed' | 'note_added' | 'settlement_received' | 'deadline_approaching';
  caseId?: string;
  clientId?: string;
  userId: string;
  user?: User;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// Form helpers
export interface SelectOption {
  value: string;
  label: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}
