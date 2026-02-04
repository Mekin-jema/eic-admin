// Simple API client for the EIC backend admin endpoints
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '') ||
  'https://eic-main-backend-2.onrender.com/api';

// Cookie name for admin auth token
const COOKIE_NAME = 'admin_token';

// Build authorization header from cookie (client-only)
const authHeader = (): Record<string, string> => {
  if (typeof document === 'undefined') return {};
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`))
    ?.split('=')[1];

  return token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {};
};

// Generic API list response wrapper
export interface ListResponse<T> {
  success: boolean;
  data: T[];
}

// Analytics total counters
export interface TotalCounts {
  attendees: number;
  contacts: number;
  total: number;
}

// Recent activity attendee item
export interface RecentActivityItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

// Analytics response payload
export interface AnalyticsResponse {
  success: boolean;
  data: {
    totalCounts: TotalCounts;
    recentActivity: {
      attendees: RecentActivityItem[];
    };
    dailyAnalytics: {
      attendees: Array<{ date: string; count: number }>;
    };
  };
}

// Attendee registration record
export interface AttendeeRegistration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  organization: string;
  jobTitle: string;
  country: string;
  category?: string | null;
  otherCategory?: string | null;
  sectorInterest?: string | null;
  hasExistingCompany?: boolean | null;
  companyName?: string | null;
  companySector?: string | null;
  businessLicenseUrl?: string | null;
  attendance?: string | null;
  day1Attendance?: string | null;
  day1Sessions?: string[] | null;
  day2Attendance?: string | null;
  day2Sessions?: string[] | null;
  needsVisa?: boolean | null;
  siteVisit?: boolean | null;
  passportCopyUrl?: string | null;
  specialRequirements?: string | null;
  communicationPreference: string;
  isCheckedIn: boolean;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  lastScannedAt?: string | null;
  scanCount?: number | null;
  createdAt: string;
}

// Attendance summary response payload
export interface AttendanceSummaryResponse {
  success: boolean;
  summary: {
    totalUsers: number;
    checkedInUsers: number;
    attendanceRate: number;
    recentCheckIns: number;
    breakdown: {
      attendees: { total: number; checkedIn: number };
    };
  };
}

// Communications template record
export interface CommunicationTemplate {
  id: string;
  key: string;
  name: string;
  subject: string;
  body?: string | null;
  usedCount: number;
  lastUsedAt?: string | null;
}

// Communications statistics
export interface CommunicationStats {
  totalSent: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribes: number;
}

// Communications log item
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

// Email campaign summary
export interface EmailCampaignSummary {
  name: string;
  status: string;
  sent: number;
  openRate: number;
}

// SMS statistics
export interface SmsStats {
  creditsRemaining: number;
  usedPercent: number;
  deliveryRate: number;
  delivered: number;
  failed: number;
}

// Notification log item
export interface NotificationLogItem {
  id: string;
  title: string;
  message: string;
  audience: string;
  sentCount: number;
  createdAt: string;
}

// Mobile platform stats
export interface PlatformStats {
  iosUsers: number;
  androidUsers: number;
  totalAppUsers: number;
}

// Fetch analytics dashboard data
export async function getAnalytics(): Promise<AnalyticsResponse> {
  const res = await fetch(`${API_BASE}/admin/analytics`, {
    credentials: 'include',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

// Fetch attendee list
export async function getAttendees(): Promise<ListResponse<AttendeeRegistration>> {
  const res = await fetch(`${API_BASE}/admin/attendees`, {
    credentials: 'include',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Failed to fetch attendees');
  return res.json();
}

// Fetch attendance summary metrics
export async function getAttendanceSummary(): Promise<AttendanceSummaryResponse> {
  const res = await fetch(`${API_BASE}/attendance/summary`, {
    credentials: 'include',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Failed to fetch attendance summary');
  return res.json();
}

// Fetch attendee by ID
export async function getAttendeeById(id: string, token?: string) {
  const headers = token ? { Authorization: `Bearer ${token}` } : authHeader();
  const res = await fetch(`${API_BASE}/attendee/attendee-registration/${id}`, {
    credentials: 'include',
    headers,
  });
  if (!res.ok) throw new Error('Attendee not found');
  const data = await res.json();
  return data.attendee;
}

// Update attendee by ID
export async function updateAttendeeById(
  id: string,
  data: Partial<AttendeeRegistration>
): Promise<{ success: boolean; attendee: AttendeeRegistration }> {
  const res = await fetch(`${API_BASE}/attendee/attendee-registration/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update attendee');
  return res.json();
}

// Delete attendee by ID
export async function deleteAttendeeById(
  id: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/attendee/attendee-registration/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Failed to delete attendee');
  return res.json();
}

// Build badge download URL for attendee
export function getAttendeeBadgeUrl(id: string): string {
  return `${API_BASE}/attendee/attendee-registration/${id}/badge`;
}

// Build export data URL for attendee
export function getAttendeeExportUrl(id: string): string {
  return `${API_BASE}/attendee/attendee-registration/${id}/export`;
}

// Send a direct email to a specific attendee
export async function sendAttendeeEmail(
  id: string,
  data: { subject: string; body: string; includeBadge?: boolean }
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/attendee/attendee-registration/${id}/send-email`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to send email');
  return res.json();
}

// Fetch communications templates
export async function getCommTemplates(): Promise<{
  success: boolean;
  data: CommunicationTemplate[];
}> {
  const res = await fetch(`${API_BASE}/admin/communications/templates`, {
    credentials: 'include',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Failed to fetch templates');
  return res.json();
}

// Create a communications template
export async function createCommTemplate(payload: {
  key: string;
  name: string;
  subject: string;
  body?: string;
}): Promise<{ success: boolean; data: CommunicationTemplate }> {
  const res = await fetch(`${API_BASE}/admin/communications/templates`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create template');
  return res.json();
}

// Update a communications template
export async function updateCommTemplate(
  id: string,
  payload: { name?: string; subject?: string; body?: string }
): Promise<{ success: boolean; data: CommunicationTemplate }> {
  const res = await fetch(`${API_BASE}/admin/communications/templates/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update template');
  return res.json();
}

// Delete a communications template
export async function deleteCommTemplate(
  id: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/admin/communications/templates/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Failed to delete template');
  return res.json();
}

// Fetch communications statistics
export async function getCommStats(): Promise<{ success: boolean; data: CommunicationStats }> {
  const res = await fetch(`${API_BASE}/admin/communications/stats`, {
    credentials: 'include',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Failed to fetch communication stats');
  return res.json();
}

// Fetch recent communications messages
export async function getRecentMessages(
  limit = 10
): Promise<{ success: boolean; data: CommunicationLogItem[] }> {
  const res = await fetch(`${API_BASE}/admin/communications/recent?limit=${limit}`, {
    credentials: 'include',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Failed to fetch recent messages');
  return res.json();
}

// Send a communications email
export async function sendCommunicationEmail(payload: {
  templateKey?: string;
  audience: string;
  subject: string;
  body: string;
}): Promise<{
  success: boolean;
  data: { attempted: number; sent: number; errors: Array<{ email: string; error: string }> };
}> {
  const res = await fetch(`${API_BASE}/admin/communications/email/send`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to send communication');
  return res.json();
}

// Send a test communications email
export async function sendTestCommunicationEmail(payload: {
  email: string;
  subject: string;
  body: string;
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/admin/communications/email/test`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to send test email');
  return res.json();
}

// Send communications email to selected recipients
export async function sendSelectedRecipientEmails(payload: {
  templateKey?: string;
  recipientIds: string[];
  subject: string;
  body: string;
}): Promise<{
  success: boolean;
  data: { attempted: number; sent: number; errors: Array<{ email: string; error: string }> };
}> {
  const res = await fetch(`${API_BASE}/admin/communications/email/recipients`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to send recipient emails');
  return res.json();
}

// Schedule a communications email
export async function scheduleCommunicationEmail(payload: {
  templateKey?: string;
  audience: string;
  subject: string;
  body: string;
  scheduledFor: string;
}): Promise<{ success: boolean; data: { id: string; scheduledFor: string } }> {
  const res = await fetch(`${API_BASE}/admin/communications/email/schedule`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to schedule communication');
  return res.json();
}

// Fetch email campaigns summary
export async function getEmailCampaigns(): Promise<{
  success: boolean;
  data: EmailCampaignSummary[];
}> {
  const res = await fetch(`${API_BASE}/admin/communications/email/campaigns`, {
    credentials: 'include',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Failed to fetch email campaigns');
  return res.json();
}

// Fetch SMS stats
export async function getSmsStats(): Promise<{ success: boolean; data: SmsStats }> {
  const res = await fetch(`${API_BASE}/admin/communications/sms/stats`, {
    credentials: 'include',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Failed to fetch SMS stats');
  return res.json();
}

// Fetch recent notifications
export async function getRecentNotifications(
  limit = 10
): Promise<{ success: boolean; data: NotificationLogItem[] }> {
  const res = await fetch(`${API_BASE}/admin/communications/notifications/recent?limit=${limit}`, {
    credentials: 'include',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Failed to fetch recent notifications');
  return res.json();
}

// Fetch platform stats for push notifications
export async function getPlatformStats(): Promise<{ success: boolean; data: PlatformStats }> {
  const res = await fetch(`${API_BASE}/admin/communications/notifications/platform`, {
    credentials: 'include',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error('Failed to fetch platform stats');
  return res.json();
}
