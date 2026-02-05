export type ReportTemplate = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  format: string[];
  lastGenerated: string;
  size: string;
  rows: number;
  category: 'attendance' | 'analytics' | 'financial';
};

export type CustomReport = {
  id: string;
  name: string;
  fields: string[];
  filters: {
    category: string;
    status: string;
    dateRange: string;
  };
  format: string;
  rows: number;
  size: string;
  createdAt: string;
};

export type ScheduledReport = {
  id: string;
  name: string;
  schedule: string;
  recipients: number;
  next: string;
  active: boolean;
};

export type ExportHistoryEntry = {
  id: string;
  name: string;
  format: string;
  size: string;
  rows: number;
  createdAt: string;
  generatedBy: string;
};

export type FieldOption = {
  label: string;
  get: (attendee: import('@/lib/adminApi').AttendeeRegistration) => string;
};

export type ReportFilters = {
  category: string;
  status: string;
  dateRange: string;
};
