'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/server'
import { requireHobbyist } from '@/lib/session'
import type { PriceUnit } from '@/lib/types'

export type ListingState = { error?: string } | null

const PRICE_UNITS: PriceUnit[] = ['fixed', 'hour', 'session', 'item']

function parseListingForm(formData: FormData):
  | { error: string }
  | {
      data: {
        category_id: string
        title: string
        description: string
        price: number
        price_unit: PriceUnit
        location: string | null
        image_url: string | null
        status: 'active' | 'paused'
      }
    } {
  const category_id = formData.get('category_id') as string
  const title = ((formData.get('title') as string) || '').trim()
  const description = ((formData.get('description') as string) || '').trim()
  const price = parseFloat(formData.get('price') as string)
  const price_unit = formData.get('price_unit') as PriceUnit
  const location = ((formData.get('location') as string) || '').trim() || null
  const image_url = ((formData.get('image_url') as string) || '').trim() || null
  const status = (formData.get('status') as string) === 'paused' ? 'paused' : 'active'

  if (!category_id) return { error: 'יש לבחור קטגוריה' }
  if (!title) return { error: 'יש להזין כותרת' }
  if (!description) return { error: 'יש להזין תיאור' }
  if (isNaN(price) || price < 0) return { error: 'יש להזין מחיר תקין' }
  if (!PRICE_UNITS.includes(price_unit)) return { error: 'יש לבחור יחידת מחיר' }

  return {
    data: { category_id, title, description, price, price_unit, location, image_url, status },
  }
}

export async function createListing(
  prevState: ListingState,
  formData: FormData
): Promise<ListingState> {
  const profile = await requireHobbyist()
  if (!profile) return { error: 'לא מורשה' }

  const parsed = parseListingForm(formData)
  if ('error' in parsed) return { error: parsed.error }

  const admin = createAdminClient()
  const { error } = await admin
    .from('listings')
    .insert({ ...parsed.data, hobbyist_id: profile.id })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/')
  redirect('/dashboard')
}

export async function updateListing(
  prevState: ListingState,
  formData: FormData
): Promise<ListingState> {
  const profile = await requireHobbyist()
  if (!profile) return { error: 'לא מורשה' }

  const id = formData.get('id') as string
  if (!id) return { error: 'מודעה לא נמצאה' }

  const parsed = parseListingForm(formData)
  if ('error' in parsed) return { error: parsed.error }

  const admin = createAdminClient()
  // Ownership check — service-role bypasses RLS, so verify explicitly.
  const { data: existing } = await admin
    .from('listings')
    .select('hobbyist_id')
    .eq('id', id)
    .single()
  if (!existing || existing.hobbyist_id !== profile.id) return { error: 'לא מורשה' }

  const { error } = await admin
    .from('listings')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/')
  redirect('/dashboard')
}

export async function deleteListing(formData: FormData) {
  const profile = await requireHobbyist()
  if (!profile) return

  const id = formData.get('id') as string
  if (!id) return

  const admin = createAdminClient()
  const { data: existing } = await admin
    .from('listings')
    .select('hobbyist_id')
    .eq('id', id)
    .single()
  if (!existing || existing.hobbyist_id !== profile.id) return

  await admin.from('listings').delete().eq('id', id)

  revalidatePath('/dashboard')
  revalidatePath('/')
}

export async function toggleListingStatus(formData: FormData) {
  const profile = await requireHobbyist()
  if (!profile) return

  const id = formData.get('id') as string
  const current = formData.get('current_status') as string
  if (!id) return

  const admin = createAdminClient()
  const { data: existing } = await admin
    .from('listings')
    .select('hobbyist_id')
    .eq('id', id)
    .single()
  if (!existing || existing.hobbyist_id !== profile.id) return

  const next = current === 'active' ? 'paused' : 'active'
  await admin
    .from('listings')
    .update({ status: next, updated_at: new Date().toISOString() })
    .eq('id', id)

  revalidatePath('/dashboard')
  revalidatePath('/')
}
