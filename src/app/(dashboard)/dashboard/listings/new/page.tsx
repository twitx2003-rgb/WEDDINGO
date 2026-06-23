import { redirect } from 'next/navigation'
import { requireHobbyist } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ListingForm } from '@/components/listings/ListingForm'
import type { Category } from '@/lib/types'

export default async function NewListingPage() {
  const profile = await requireHobbyist()
  if (!profile) redirect('/login')

  const admin = createAdminClient()
  const { data: categories } = await admin.from('categories').select('*').order('name')

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">מודעה חדשה</h1>
        <p className="text-muted-foreground">פרסמו שירות חדש ללקוחות</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>פרטי המודעה</CardTitle>
        </CardHeader>
        <CardContent>
          <ListingForm categories={(categories as Category[]) ?? []} />
        </CardContent>
      </Card>
    </div>
  )
}
