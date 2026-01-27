import { create } from 'zustand'
import axios from 'axios'
import { API_BASE } from '@/lib/adminApi'

interface AuthState {
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  requestReset: (email: string) => Promise<boolean>
  resetPassword: (token: string, password: string) => Promise<boolean>
}

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

const COOKIE_NAME = 'admin_token'
const SESSION_SECONDS = 60 * 60 * 8

const getCookieToken = (): string | null => {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`))
  return match ? decodeURIComponent(match.split('=')[1]) : null
}

const writeSessionCookie = (token: string) => {
  if (typeof document === 'undefined') return
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:'
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${SESSION_SECONDS}; samesite=Lax${secure ? '; secure' : ''}`
}

const clearSessionCookie = () => {
  if (typeof document === 'undefined') return
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:'
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; samesite=Lax${secure ? '; secure' : ''}`
}

api.interceptors.request.use((config) => {
  const token = getCookieToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const extractError = (err: any) => {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    'Request failed'
  ) as string
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  loading: false,
  error: null,

  async login(email, password) {
    set({ loading: true, error: null })
    try {
      const res = await api.post('/auth/login', { email, password })
      const token = res?.data?.token as string | undefined
      if (!token) {
        set({ error: 'Invalid credentials' })
        return false
      }

      writeSessionCookie(token)
      set({ isAuthenticated: true })
      return true
    } catch (err) {
      const message = extractError(err)
      set({ error: message })
      return false
    } finally {
      set({ loading: false })
    }
  },

  async logout() {
    set({ loading: true, error: null })
    try {
      await api.post('/auth/logout')
    } catch (err) {
      const message = extractError(err)
      set({ error: message })
    } finally {
      clearSessionCookie()
      set({ isAuthenticated: false, loading: false })
    }
  },

  async requestReset(email) {
    set({ loading: true, error: null })
    try {
      await api.post('/auth/forgot-password', { email })
      return true
    } catch (err) {
      const message = extractError(err)
      set({ error: message })
      return false
    } finally {
      set({ loading: false })
    }
  },

  async resetPassword(token, password) {
    set({ loading: true, error: null })
    try {
      await api.post('/auth/reset-password', { token, password })
      return true
    } catch (err) {
      const message = extractError(err)
      set({ error: message })
      return false
    } finally {
      set({ loading: false })
    }
  },
}))
