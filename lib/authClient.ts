"use server"

import { cookies } from 'next/headers'
import { API_BASE } from '@/lib/adminApi'

export async function setAdminSession(email: string, password: string): Promise<boolean> {
  // Attempt backend login compatible with workshop app: POST /auth/login returns { user, token }
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
    cache: 'no-store',
  })

  if (!res.ok) return false
  const data = await res.json().catch(() => null)
  const token: string | undefined = data?.token
  if (!token) return false

  // Store token in httpOnly cookie for middleware guard
  const cookieStore = await cookies()
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  })
  return true
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
}

export async function requestPasswordReset(email: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    credentials: 'include',
    cache: 'no-store',
  })
  return res.ok
}

export async function resetPassword(token: string, password: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
    credentials: 'include',
    cache: 'no-store',
  })
  return res.ok
}

export async function verifyOtp(code: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
    credentials: 'include',
    cache: 'no-store',
  })
  return res.ok
}
