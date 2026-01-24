import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";
import { handleError } from "./error-handler";

// 🌍 API Base URL
const API_BASE_URL = 
"https://api-dev.coolify.powerethio.com/api/survey";
// "https://api.coolify.powerethio.com/api/survey"


const API_BASE = "https://api-dev.coolify.powerethio.com/api";



//  "https://api.coolify.powerethio.com/api"
// 🧾 Analytics Data Interface
export interface DashboardAnalytics {
  summary: {
    totalRegistrations: number;
    recentRegistrations: number;
    documentUploads: number;
    pendingDocuments: number;
    completeDocuments: number;
    inCompleteDocuments: number;
    totalBanks: number;
  };
  centerDistribution: { _id: string; count: number }[];
  shiftDistribution: { _id: string; count: number }[];
  trainingTimeDistribution: { _id: string; count: number }[];
  dailyRegistrations: { _id: string; count: number }[];
  locationDistribution: { _id: string; count: number }[];
  documentStatus: { _id: string; count: number }[];
  bankDistribution: { _id: string; count: number }[];
}

// 🖼️ User Image Type
export interface UserImage {
  public_id: string;
  secure_url: string;
}

// 👤 Registration Type
interface RegistrationResponse {
  users: User[];
  resPerPage: number;
  filteredUserCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  trainingAddress: string;
  bank: string;
  shift: "shift1" | "shift2";
  trainingTime: "morning" | "afternoon";
  idImage?: {
    public_id: string;
    secure_url: string;
  };
  receiptImage?: {
    public_id: string;
    secure_url: string;
  };
  createdAt: string;
  updatedAt: string;
}
// 📦 Backend Response for Registrations
interface RegistrationResponse {
  users: User[];
  resPerPage: number;
  filteredUserCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  totalCount: number;
}

// 🔔 Notification Type (frontend shape)
interface NotificationType {
  _id: string;
  title?: string;
  message?: string;
  type?: string;
  createdAt?: string;
  seen?: boolean;
  notTypeId?: string;
}

// � Order type (minimal shape used in admin)
interface OrderType {
  _id: string;
  registration?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    trainingAddress?: string;
    shift?: string;
    trainingTime?: string;
    paymentStatus?: string;
    learnerIdSent?: boolean;
    learnerCredentialsSent?: boolean;
    learnerId?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  total?: number;
  status?: 'Pending' | 'Approved' | 'Cancelled' | string;
  paymentStatus?: 'Pending' | 'Completed' | 'Failed' | 'Cancelled' | string;
  paymentIntentUniqueId?: string;
  fenanPayCheckoutUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// �🧠 Zustand State Interface
interface AdminDashboardState {
  registrations: RegistrationResponse | null;
  analytics: DashboardAnalytics | null;
  loading: boolean;
  error: string | null;
  notifications?: NotificationType[];

  // orders
  orders?: OrderType[];
  ordersLoading?: boolean;
  actionLoadingOrderId?: string | null;

  fetchOrders?: () => Promise<void>;
  approveOrder?: (orderId: string) => Promise<void>;
  cancelOrder?: (orderId: string) => Promise<void>;

  // notification helpers
  fetchAdminNotifications?: (adminUserId?: string) => Promise<void>;
  markNotificationAsSeen?: (notificationId: string, adminUserId?: string) => Promise<void>;
  markAllNotificationsAsSeen?: (adminUserId?: string) => Promise<void>;

  fetchRegistrations: (limit?: number, page?: number, search?: string) => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User | null>;
  downloadAllUsers: () => Promise<void>;
}

// ⚡ Zustand Store
export const useAdminDashboardStore = create<AdminDashboardState>()(
  persist(
    (set) => ({
      registrations: null,
      analytics: null,
  notifications: [],
        orders: [],
        ordersLoading: false,
        actionLoadingOrderId: null,
      loading: false,
      error: null,

      // 📦 Fetch All Registrations (supports optional search)
      // In your store (useAdminDashboardStore)
      fetchRegistrations: async (page?: number, pageSize?: number, search?: string) => {
        set({ loading: true, error: null });
        try {
          const params: Record<string, string | number | boolean> = {};
          if (page) params.page = page;
          if (pageSize) params.limit = pageSize;
          if (search && String(search).trim().length > 0) {
            // backend apiFilter expects `keyword` for search
            params.keyword = String(search).trim();
          }

          const res = await axios.get<RegistrationResponse>(
            `${API_BASE_URL}/get-all-registered-user`,
            { params }
          );

          console.log("Fetched Registrations:", res.data);
          set({ registrations: res.data });
        } catch (err) {
          const msg = handleError(err, "Failed to fetch registrations");
          set({ error: msg });
          toast.error(msg);
        } finally {
          set({ loading: false });
        }
      },

      // 🔔 Fetch Admin Notifications
      fetchAdminNotifications: async (adminUserId = 'admin') => {
        set({ loading: true, error: null });
        try {
          // NOTE: notifications endpoint lives on the main API root (not under /survey)
          const res = await axios.get(`${API_BASE}/notifications/get-admin-notification/${adminUserId}`);
          // backend returns { notifications: [...] }
          set({ notifications: res.data.notifications || [] });
        } catch (err) {
          const msg = handleError(err, 'Failed to fetch notifications');
          set({ error: msg });
          // swallow – notifications shouldn't break the whole page
        } finally {
          set({ loading: false });
        }
      },

      // 🧾 Fetch Orders
      fetchOrders: async () => {
        set({ ordersLoading: true, error: null });
        try {
          const res = await axios.get(`${API_BASE}/registration-order/get-orders`);
          const ordersData = res.data || [];
          set({ orders: ordersData });
          // toast.success('Orders loaded');
        } catch (err) {
          const msg = handleError(err, 'Failed to fetch orders');
          set({ error: msg });
          toast.error(msg);
        } finally {
          set({ ordersLoading: false });
        }
      },

      // ✅ Approve order
      approveOrder: async (orderId: string) => {
        set({ actionLoadingOrderId: orderId });
        try {
          await axios.put(`${API_BASE}/registration-order/approve-order/${orderId}`);
          toast.success('Order approved');
          // refresh orders
          const res = await axios.get(`${API_BASE}/registration-order/get-orders`);
          set({ orders: res.data || [] });
        } catch (err) {
          const msg = handleError(err, 'Failed to approve order');
          set({ error: msg });
          toast.error(msg);
        } finally {
          set({ actionLoadingOrderId: null });
        }
      },

      // ❌ Cancel order
      cancelOrder: async (orderId: string) => {
        set({ actionLoadingOrderId: orderId });
        try {
          await axios.put(`${API_BASE}/registration-order/cancel-order/${orderId}`);
          toast.success('Order cancelled');
          const res = await axios.get(`${API_BASE}/registration-order/get-orders`);
          set({ orders: res.data || [] });
        } catch (err) {
          const msg = handleError(err, 'Failed to cancel order');
          set({ error: msg });
          toast.error(msg);
        } finally {
          set({ actionLoadingOrderId: null });
        }
      },

      // 🔁 Mark notification as seen for admin
      markNotificationAsSeen: async (notificationId: string, adminUserId = 'admin') => {
        try {
          await axios.post(`${API_BASE}/notifications/mark-seen-notification`, {
            notificationId,
            userId: adminUserId,
          });
          // refresh notifications
          const res = await axios.get(`${API_BASE}/notifications/get-admin-notification/${adminUserId}`);
          set({ notifications: res.data.notifications || [] });
        } catch (err) {
          const msg = handleError(err, 'Failed to mark notification as seen');
          set({ error: msg });
        }
      },

      // 🔁🔁 Mark all unread notifications as seen
      markAllNotificationsAsSeen: async (adminUserId = 'admin') => {
        try {
          const current: NotificationType[] = (await axios.get(`${API_BASE}/notifications/get-admin-notification/${adminUserId}`)).data.notifications || [];
          const unread = current.filter((n: NotificationType) => !(n.seen || false));
          if (unread.length === 0) return;

          // mark all in parallel
          await Promise.all(unread.map((n: NotificationType) => axios.post(`${API_BASE}/notifications/mark-seen-notification`, { notificationId: n._id, userId: adminUserId })));

          // refresh once
          const res = await axios.get(`${API_BASE}/notifications/get-admin-notification/${adminUserId}`);
          set({ notifications: res.data.notifications || [] });
        } catch (err) {
          const msg = handleError(err, 'Failed to mark all notifications as seen');
          set({ error: msg });
          toast.error(msg);
        }
      },

      // 📊 Fetch Dashboard Analytics
      fetchAnalytics: async () => {
        set({ loading: true, error: null });
        try {
          const res = await axios.get(`${API_BASE_URL}/dashboard/stats`);
          set({ analytics: res.data.data });
        } catch (err) {
          const msg = handleError(err, "Failed to fetch analytics");
          set({ error: msg });
          toast.error(msg);
        } finally {
          set({ loading: false });
        }
      },

      // 👤 Fetch Single User by ID
      fetchUserById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.get(`${API_BASE_URL}/get-registered-user-by-id/${id}`);
          return res.data.data as User;
        } catch (err) {
          const msg = handleError(err, "Failed to fetch user");
          set({ error: msg });
          toast.error(msg);
          return null;
        } finally {
          set({ loading: false });
        }
      },

      // 📥 Download All Users (for admin export)
      downloadAllUsers: async () => {
        set({ loading: true, error: null });
        try {
          const res = await axios.get(`${API_BASE_URL}/get-all-users-for-dowl`, {
            responseType: "blob",
          });
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "registrations.csv");
          document.body.appendChild(link);
          link.click();
          link.remove();
          toast.success("User data downloaded successfully");
        } catch (err) {
          const msg = handleError(err, "Failed to download user data");
          set({ error: msg });
          toast.error(msg);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "admin-dashboard-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        registrations: state.registrations,
        analytics: state.analytics,
      }),
    }
  )
);
