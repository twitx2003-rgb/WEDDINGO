import { redirect, notFound } from 'next/navigation'
import { requireHobbyist } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ListingForm } from '@/components/listings/ListingForm'
import type { Category, Listing } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditListingPage({ params }: Props) {
  const { id } = await params
  const profile = await requireHobbyist()
  if (!profile) redirect('/login')

  const admin = createAdminClient()
  const [{ data: listing }, { data: categories }] = await Promise.all([
    admin.from('listings').select('*').eq('id', id).single(),
    admin.from('categories').select('*').order('name'),
  ])

  if (!listing) notFound()
  // Ownership guard — don't let a hobbyist edit someone else's listing.
  if ((listing as Listing).hobbyist_id !== profile.id) redirect('/dashboard')

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">עריכת מודעה</h1>
        <p className="text-muted-foreground">עדכנו את פרטי השירות</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>פרטי המודעה</CardTitle>
        </CardHeader>
        <CardContent>
          <ListingForm
            categories={(categories as Category[]) ?? []}
            listing={listing as Listing}
          />
        </CardContent>
      </Card>
    </div>
  )
}
