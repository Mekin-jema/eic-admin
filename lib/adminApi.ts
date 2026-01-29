// Simple API client for the EIC backend admin endpoints
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '') || 'https://eic-backend-9heh.onrender.com/api';

const COOKIE_NAME = 'admin_token'

const authHeader = (): Record<string, string> => {
  if (typeof document === 'undefined') return {}
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`))
    ?.split('=')[1]

  return token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {}
}

export interface TotalCounts {
  attendees: number;
  exhibitors: number;
  sponsors: number;
  contacts: number;
  total: number;
}

export interface RecentActivityItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface AnalyticsResponse {
  success: boolean;
  data: {
    totalCounts: TotalCounts;
    recentActivity: {
      attendees: RecentActivityItem[];
      exhibitors: RecentActivityItem[];
      sponsors: RecentActivityItem[];
    };
    dailyAnalytics: {
      attendees: Array<{ createdAt: string; _count: { id: number } }>;
      exhibitors: Array<{ createdAt: string; _count: { id: number } }>;
      sponsors: Array<{ createdAt: string; _count: { id: number } }>;
    };
  };
}

export interface AttendeeRegistration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  occupation: string;
  organization?: string | null;
  country: string;
  hearAboutUs: string;
  interests: string[];
  registrationType: string;
  groupSize?: number | null;
  specialNeeds?: string | null;
  needsVisa?: boolean | null;
  isCheckedIn: boolean;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  createdAt: string;
}

export interface ListResponse<T> { success: boolean; data: T[] }

export async function getAnalytics(): Promise<AnalyticsResponse> {
  const res = await fetch(`${API_BASE}/admin/analytics`, { credentials: 'include', headers: authHeader() });
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function getAttendees(): Promise<ListResponse<AttendeeRegistration>> {
  const res = await fetch(`${API_BASE}/admin/attendees`, { credentials: 'include', headers: authHeader() });
  if (!res.ok) throw new Error('Failed to fetch attendees');
  return res.json();
}

export interface AttendanceSummaryResponse {
  success: boolean;
  summary: {
    totalUsers: number;
    checkedInUsers: number;
    attendanceRate: number;
    recentCheckIns: number;
    breakdown: {
      attendees: { total: number; checkedIn: number };
      exhibitors: { total: number; checkedIn: number };
      sponsors: { total: number; checkedIn: number };
    };
  };
}

export async function getAttendanceSummary(): Promise<AttendanceSummaryResponse> {
  const res = await fetch(`${API_BASE}/attendance/summary`, { credentials: 'include', headers: authHeader() });
  if (!res.ok) throw new Error('Failed to fetch attendance summary');
  return res.json();
}

// Communications API
export interface CommunicationTemplate {
  id: string;
  key: string;
  name: string;
  subject: string;
  usedCount: number;
  lastUsedAt?: string | null;
}

export interface CommunicationStats {
  totalSent: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribes: number;
}

export interface CommunicationLogItem {
  id: string;
  templateKey?: string | null;
  channel: string;
  audience: string;
  subject: string;
  body: string;
  sentCount: number;
  openedCount?: number | null;
  clickedCount?: number | null;
  bouncedCount?: number | null;
  status: string;
  createdAt: string;
}

export async function getCommTemplates(): Promise<{ success: boolean; data: CommunicationTemplate[] }> {
  const res = await fetch(`${API_BASE}/admin/communications/templates`, { credentials: 'include', headers: authHeader() });
  if (!res.ok) throw new Error('Failed to fetch templates');
  return res.json();
}

export async function getCommStats(): Promise<{ success: boolean; data: CommunicationStats }> {
  const res = await fetch(`${API_BASE}/admin/communications/stats`, { credentials: 'include', headers: authHeader() });
  if (!res.ok) throw new Error('Failed to fetch communication stats');
  return res.json();
}

export async function getRecentMessages(limit = 10): Promise<{ success: boolean; data: CommunicationLogItem[] }> {
  const res = await fetch(`${API_BASE}/admin/communications/recent?limit=${limit}`, { credentials: 'include', headers: authHeader() });
  if (!res.ok) throw new Error('Failed to fetch recent messages');
  return res.json();
}

export async function sendCommunicationEmail(payload: { templateKey?: string; audience: string; subject: string; body: string }): Promise<{ success: boolean; data: { attempted: number; sent: number; errors: Array<{ email: string; error: string }> } }> {
  const res = await fetch(`${API_BASE}/admin/communications/email/send`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to send communication');
  return res.json();
}

// Extended communications endpoints
export interface EmailCampaignSummary { name: string; status: string; sent: number; openRate: number }
export async function getEmailCampaigns(): Promise<{ success: boolean; data: EmailCampaignSummary[] }> {
  const res = await fetch(`${API_BASE}/admin/communications/email/campaigns`, { credentials: 'include', headers: authHeader() });
  if (!res.ok) throw new Error('Failed to fetch email campaigns');
  return res.json();
}

export interface SmsStats { creditsRemaining: number; usedPercent: number; deliveryRate: number; delivered: number; failed: number }
export async function getSmsStats(): Promise<{ success: boolean; data: SmsStats }> {
  const res = await fetch(`${API_BASE}/admin/communications/sms/stats`, { credentials: 'include', headers: authHeader() });
  if (!res.ok) throw new Error('Failed to fetch SMS stats');
  return res.json();
}

export interface NotificationLogItem { id: string; title: string; message: string; audience: string; sentCount: number; createdAt: string }
export async function getRecentNotifications(limit = 10): Promise<{ success: boolean; data: NotificationLogItem[] }> {
  const res = await fetch(`${API_BASE}/admin/communications/notifications/recent?limit=${limit}`, { credentials: 'include', headers: authHeader() });
  if (!res.ok) throw new Error('Failed to fetch recent notifications');
  return res.json();
}

export interface PlatformStats { iosUsers: number; androidUsers: number; totalAppUsers: number }
export async function getPlatformStats(): Promise<{ success: boolean; data: PlatformStats }> {
  const res = await fetch(`${API_BASE}/admin/communications/notifications/platform`, { credentials: 'include', headers: authHeader() });
  if (!res.ok) throw new Error('Failed to fetch platform stats');
  return res.json();
}
