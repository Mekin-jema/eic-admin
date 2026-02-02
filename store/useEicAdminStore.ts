import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';
import { handleError } from './error-handler';
import {
  getAnalytics,
  getAttendees,
  getAttendanceSummary,
  type AnalyticsResponse,
  type AttendeeRegistration,
  type AttendanceSummaryResponse,
  // Communications
  getCommTemplates,
  getCommStats,
  getRecentMessages,
  sendCommunicationEmail,
  scheduleCommunicationEmail,
  type CommunicationTemplate,
  type CommunicationStats,
  type CommunicationLogItem,
  getEmailCampaigns,
  type EmailCampaignSummary,
  getSmsStats,
  type SmsStats,
  getRecentNotifications,
  type NotificationLogItem,
  getPlatformStats,
  type PlatformStats,
} from '@/lib/adminApi';

interface EicAdminState {
  // Common
  loading: boolean;
  error: string | null;

  // Dashboard/attendance
  analytics: AnalyticsResponse['data'] | null;
  attendees: AttendeeRegistration[];
  attendanceSummary: AttendanceSummaryResponse['summary'] | null;

  // Communications
  commTemplates: CommunicationTemplate[];
  commStats: CommunicationStats | null;
  commRecent: CommunicationLogItem[];
  emailCampaigns: EmailCampaignSummary[];
  smsStats: SmsStats | null;
  notifRecent: NotificationLogItem[];
  platformStats: PlatformStats | null;

  // Actions
  fetchAnalytics: () => Promise<void>;
  fetchAttendees: () => Promise<void>;
  fetchAttendanceSummary: () => Promise<void>;
  refreshDashboard: () => Promise<void>;

  fetchCommunications: () => Promise<void>;
  sendEmail: (payload: { templateKey?: string; audience: string; subject: string; body: string }) => Promise<void>;
  scheduleEmail: (payload: { templateKey?: string; audience: string; subject: string; body: string; scheduledFor: string }) => Promise<void>;
}

export const useEicAdminStore = create<EicAdminState>()(
  persist(
    (set, get) => ({
      loading: false,
      error: null,

      analytics: null,
      attendees: [],
      attendanceSummary: null,

      commTemplates: [],
      commStats: null,
      commRecent: [],
      emailCampaigns: [],
      smsStats: null,
      notifRecent: [],
      platformStats: null,

      // Dashboard
      fetchAnalytics: async () => {
        set({ loading: true, error: null });
        try {
          const res = await getAnalytics();
          set({ analytics: res.data });
        } catch (err) {
          const msg = handleError(err, 'Failed to fetch analytics');
          set({ error: msg });
        } finally {
          set({ loading: false });
        }
      },

      fetchAttendees: async () => {
        set({ loading: true, error: null });
        try {
          const res = await getAttendees();
          set({ attendees: res.data || [] });
        } catch (err) {
          const msg = handleError(err, 'Failed to fetch attendees');
          set({ error: msg });
        } finally {
          set({ loading: false });
        }
      },

      fetchAttendanceSummary: async () => {
        set({ loading: true, error: null });
        try {
          const res = await getAttendanceSummary();
          set({ attendanceSummary: res.summary });
        } catch (err) {
          const msg = handleError(err, 'Failed to fetch attendance summary');
          set({ error: msg });
        } finally {
          set({ loading: false });
        }
      },

      refreshDashboard: async () => {
        set({ loading: true, error: null });
        try {
          const [att, sum] = await Promise.all([getAttendees(), getAttendanceSummary()]);
          set({ attendees: att.data || [], attendanceSummary: sum.summary });
        } catch (err) {
          const msg = handleError(err, 'Failed to refresh dashboard');
          set({ error: msg });
        } finally {
          set({ loading: false });
        }
      },

      // Communications
      fetchCommunications: async () => {
        set({ loading: true, error: null });
        try {
          const [tpl, stats, recent, campaigns, sms, notif, platform] = await Promise.all([
            getCommTemplates(),
            getCommStats(),
            getRecentMessages(10),
            getEmailCampaigns(),
            getSmsStats(),
            getRecentNotifications(10),
            getPlatformStats(),
          ]);
          set({
            commTemplates: tpl.data,
            commStats: stats.data,
            commRecent: recent.data,
            emailCampaigns: campaigns.data,
            smsStats: sms.data,
            notifRecent: notif.data,
            platformStats: platform.data,
          });
        } catch (err) {
          const msg = handleError(err, 'Failed to fetch communications');
          set({ error: msg });
        } finally {
          set({ loading: false });
        }
      },

      sendEmail: async (payload) => {
        set({ loading: true, error: null });
        try {
          const res = await sendCommunicationEmail(payload);
          toast.success(`Sent ${res.data.sent}/${res.data.attempted} emails`);
          // Refresh communications data after sending
          await get().fetchCommunications();
        } catch (err) {
          const msg = handleError(err, 'Failed to send email');
          set({ error: msg });
        } finally {
          set({ loading: false });
        }
      },

      scheduleEmail: async (payload) => {
        set({ loading: true, error: null });
        try {
          const res = await scheduleCommunicationEmail(payload);
          toast.success(`Scheduled for ${new Date(res.data.scheduledFor).toLocaleString()}`);
          await get().fetchCommunications();
        } catch (err) {
          const msg = handleError(err, 'Failed to schedule email');
          set({ error: msg });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'eic-admin-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Persist useful caches
        attendees: state.attendees,
        attendanceSummary: state.attendanceSummary,
        commTemplates: state.commTemplates,
        emailCampaigns: state.emailCampaigns,
        smsStats: state.smsStats,
        platformStats: state.platformStats,
      }),
    }
  )
);
