import { createClient, createAdminClient } from './supabase/server'
import type { Building, User } from './types'

export type AdminContext = User & { buildings: Building }

export async function getAdminContext(): Promise<AdminContext | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient()
  const { data } = await admin
    .from('users')
    .select('*, buildings(*)')
    .eq('auth_id', user.id)
    .eq('role', 'admin')
    .single()

  return (data as AdminContext | null)
}
