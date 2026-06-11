'use server'

import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'

export async function submitIssue(formData: FormData) {
  const token = formData.get('token') as string
  const description = formData.get('description') as string

  if (!description?.trim()) return

  const admin = createAdminClient()

  const { data: user, error } = await admin
    .from('users')
    .select('id, building_id')
    .eq('access_token', token)
    .single()

  if (error || !user) return

  await admin.from('issues').insert({
    building_id: user.building_id,
    reported_by_user_id: user.id,
    description: description.trim(),
    status: 'open',
  })

  redirect(`/portal/${token}?ticket=sent`)
}
