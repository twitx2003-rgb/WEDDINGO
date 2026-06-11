'use server'

import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export type AuthState = { error?: string } | null

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'נא למלא אימייל וסיסמה' }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: 'אימייל או סיסמה שגויים' }

  redirect('/admin')
}

export async function register(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const address = formData.get('address') as string
  const total_apartments = parseInt(formData.get('apartments') as string)
  const monthly_fee = parseFloat(formData.get('fee') as string)

  if (!name || !email || !password || !address || !total_apartments || !monthly_fee) {
    return { error: 'נא למלא את כל השדות' }
  }

  if (password.length < 6) return { error: 'הסיסמה חייבת להכיל לפחות 6 תווים' }

  const adminClient = createAdminClient()

  // Create auth user with email already confirmed (no verification email)
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

  // Sign in immediately after creation
  const supabase = await createClient()
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError) return { error: signInError.message }

  // Create building
  const { data: building, error: buildingError } = await adminClient
    .from('buildings')
    .insert({ address, total_apartments, monthly_fee })
    .select()
    .single()

  if (buildingError || !building) {
    return { error: buildingError?.message ?? 'שגיאה ביצירת בניין' }
  }

  // Create admin user record
  const { error: userError } = await adminClient.from('users').insert({
    building_id: building.id,
    auth_id: authData.user.id,
    name,
    apartment_number: 'ועד',
    phone: null,
    role: 'admin',
    access_token: crypto.randomUUID(),
  })

  if (userError) return { error: userError.message }

  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
