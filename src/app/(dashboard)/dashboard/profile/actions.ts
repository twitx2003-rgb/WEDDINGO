'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/server'
import { getCurrentProfile } from '@/lib/session'

export type ProfileState = { error?: string; success?: boolean } | null

export async function updateProfile(
  prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const profile = await getCurrentProfile()
  if (!profile) return { error: 'לא מורשה' }

  const name = ((formData.get('name') as string) || '').trim()
  const phone = ((formData.get('phone') as string) || '').trim() || null
  const bio = ((formData.get('bio') as string) || '').trim() || null
  const location = ((formData.get('location') as string) || '').trim() || null
  const avatar_url = ((formData.get('avatar_url') as string) || '').trim() || null

  if (!name) return { error: 'יש להזין שם' }

  const admin = createAdminClient()
  const { error } = await admin
    .from('profiles')
    .update({ name, phone, bio, location, avatar_url, updated_at: new Date().toISOString() })
    .eq('id', profile.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/profile')
  return { success: true }
}
