import { createClient, createAdminClient } from './supabase/server'
import type { Profile } from './types'

// The signed-in user's profile (or null). Used by guards & server actions.
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient()
  const { data } = await admin.from('profiles').select('*').eq('id', user.id).single()

  return (data as Profile | null)
}

// Convenience guard for hobbyist-only surfaces.
export async function requireHobbyist(): Promise<Profile | null> {
  const profile = await getCurrentProfile()
  if (!profile || profile.role !== 'hobbyist') return null
  return profile
}
