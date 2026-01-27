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
      if (res.status >= 200 && res.status < 300) {
        set({ isAuthenticated: true })
        return true
      }
      set({ error: 'Invalid credentials' })
      return false
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
