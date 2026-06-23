import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireHobbyist } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ListingActions } from '@/components/listings/ListingActions'
import { PlusCircle } from 'lucide-react'
import { PRICE_UNIT_LABELS, type Listing, type Category } from '@/lib/types'

export default async function DashboardPage() {
  const profile = await requireHobbyist()
  if (!profile) redirect('/login')

  const admin = createAdminClient()
  const { data: listings } = await admin
    .from('listings')
    .select('*, categories(name)')
    .eq('hobbyist_id', profile.id)
    .order('created_at', { ascending: false })

  type Row = Listing & { categories: Pick<Category, 'name'> | null }
  const rows = (listings as Row[]) ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">המודעות שלי</h1>
          <p className="text-muted-foreground">נהל/י את השירותים שאת/ה מציע/ה</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/listings/new">
            <PlusCircle className="h-4 w-4 ml-2" />
            מודעה חדשה
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>רשימת המודעות</CardTitle>
          <CardDescription>מודעות פעילות מוצגות ללקוחות בעמוד הראשי</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>כותרת</TableHead>
                <TableHead>קטגוריה</TableHead>
                <TableHead>מחיר</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead className="text-left">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell className="font-medium">{listing.title}</TableCell>
                    <TableCell>{listing.categories?.name ?? '—'}</TableCell>
                    <TableCell>
                      ₪ {listing.price.toLocaleString('he-IL')}
                      <span className="text-xs text-muted-foreground">
                        {' '}
                        {PRICE_UNIT_LABELS[listing.price_unit]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={listing.status === 'active' ? 'success' : 'secondary'}>
                        {listing.status === 'active' ? 'פעיל' : 'מושהה'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ListingActions id={listing.id} status={listing.status} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    עדיין אין מודעות — פרסמו את הראשונה!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
