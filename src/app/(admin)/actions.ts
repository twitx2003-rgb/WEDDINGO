'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/server'
import { getAdminContext } from '@/lib/session'

export type AddTenantState = {
  error?: string
  newToken?: string
  newName?: string
} | null

export async function addTenant(
  prevState: AddTenantState,
  formData: FormData
): Promise<AddTenantState> {
  const ctx = await getAdminContext()
  if (!ctx) return { error: 'לא מורשה' }

  const name = formData.get('name') as string
  const apartment_number = formData.get('apartment_number') as string
  const phone = (formData.get('phone') as string) || null

  if (!name || !apartment_number) return { error: 'שם ומספר דירה הם שדות חובה' }

  const access_token = crypto.randomUUID()
  const admin = createAdminClient()

  const { error } = await admin.from('users').insert({
    building_id: ctx.building_id,
    auth_id: null,
    name,
    apartment_number,
    phone,
    role: 'tenant',
    access_token,
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/tenants')
  return { newToken: access_token, newName: name }
}

export async function togglePaymentStatus(formData: FormData) {
  const ctx = await getAdminContext()
  if (!ctx) return

  const user_id = formData.get('user_id') as string
  const payment_id = formData.get('payment_id') as string | null
  const current_status = formData.get('current_status') as string
  const month = parseInt(formData.get('month') as string)
  const year = parseInt(formData.get('year') as string)
  const amount = parseFloat(formData.get('amount') as string)

  const admin = createAdminClient()
  const new_status = current_status === 'paid' ? 'unpaid' : 'paid'

  if (payment_id) {
    await admin.from('payments').update({ status: new_status }).eq('id', payment_id)
  } else {
    await admin
      .from('payments')
      .insert({ user_id, month, year, amount, status: 'paid' })
  }

  revalidatePath('/admin/payments')
  revalidatePath('/admin')
}

export async function addExpense(formData: FormData) {
  const ctx = await getAdminContext()
  if (!ctx) return

  const description = formData.get('description') as string
  const amount = parseFloat(formData.get('amount') as string)
  const date = formData.get('date') as string

  if (!description || !amount || !date) return

  const admin = createAdminClient()
  await admin.from('expenses').insert({
    building_id: ctx.building_id,
    description,
    amount,
    date,
  })

  revalidatePath('/admin/expenses')
  revalidatePath('/admin')
}

const STATUS_CYCLE: Record<string, string> = {
  open: 'in_progress',
  in_progress: 'resolved',
  resolved: 'open',
}

export async function updateIssueStatus(formData: FormData) {
  const ctx = await getAdminContext()
  if (!ctx) return

  const issue_id = formData.get('issue_id') as string
  const current_status = formData.get('current_status') as string
  const next_status = STATUS_CYCLE[current_status] ?? 'open'

  const admin = createAdminClient()
  await admin.from('issues').update({ status: next_status }).eq('id', issue_id)

  revalidatePath('/admin/issues')
  revalidatePath('/admin')
}
