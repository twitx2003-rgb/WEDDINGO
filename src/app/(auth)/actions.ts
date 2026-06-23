'use server'

import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import type { UserRole } from '@/lib/types'

export type AuthState = { error?: string } | null

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'נא למלא אימייל וסיסמה' }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) return { error: 'אימייל או סיסמה שגויים' }

  // Route by role: hobbyists go to their dashboard, customers to browse.
  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  redirect(profile?.role === 'hobbyist' ? '/dashboard' : '/')
}

export async function register(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const role = formData.get('role') as UserRole
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const phone = ((formData.get('phone') as string) || '').trim() || null

  if (!role || !name || !email || !password) return { error: 'נא למלא את כל השדות' }
  if (role !== 'customer' && role !== 'hobbyist') return { error: 'יש לבחור סוג משתמש' }
  if (password.length < 6) return { error: 'הסיסמה חייבת להכיל לפחות 6 תווים' }

  const adminClient = createAdminClient()

  // Create the auth user with email already confirmed (no verification email).
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    if (authError?.message?.includes('already registered')) {
      return { error: 'אימייל זה כבר רשום במערכת' }
    }
    return { error: authError?.message ?? 'שגיאה ביצירת חשבון' }
  }

  // Sign in immediately after creation.
  const supabase = await createClient()
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError) return { error: signInError.message }

  // Create the profile row (id == auth user id).
  const { error: profileError } = await adminClient.from('profiles').insert({
    id: authData.user.id,
    role,
    name,
    phone,
  })

  if (profileError) return { error: profileError.message }

  redirect(role === 'hobbyist' ? '/dashboard' : '/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
