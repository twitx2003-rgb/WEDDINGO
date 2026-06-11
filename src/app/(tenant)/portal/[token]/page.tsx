import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'

const MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']

interface Props {
  params: Promise<{ token: string }>
  searchParams: Promise<{ ticket?: string }>
}

export default async function TenantPortalPage({ params, searchParams }: Props) {
  const { token } = await params
  const { ticket } = await searchParams

  const admin = createAdminClient()

  const { data: user } = await admin
    .from('users')
    .select('id, name, apartment_number, building_id, buildings(address, monthly_fee)')
    .eq('access_token', token)
    .eq('role', 'tenant')
    .single()

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-8" dir="rtl">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-destructive">קישור לא תקין</h1>
          <p className="text-muted-foreground">הקישור שבו השתמשת אינו תקין או פג תוקף.</p>
        </div>
      </main>
    )
  }

  const building = Array.isArray(user.buildings) ? user.buildings[0] : user.buildings

  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const { data: payments } = await admin
    .from('payments')
    .select('id, month, year, amount, status')
    .eq('user_id', user.id)
    .order('year', { ascending: false })
    .order('month', { ascending: false })
    .limit(12)

  const currentPayment = payments?.find((p) => p.month === month && p.year === year)
  const isPaidThisMonth = currentPayment?.status === 'paid'

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8" dir="rtl">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">שלום, {user.name}!</h1>
          <p className="text-muted-foreground text-sm">
            דירה {user.apartment_number} — {building?.address}
          </p>
        </div>

        {ticket === 'sent' && (
          <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 text-center">
            ✅ הדיווח נשלח בהצלחה! הוועד יטפל בהקדם.
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>סטטוס תשלום חודשי</CardTitle>
            <CardDescription>{MONTHS[month - 1]} {year}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">דמי ועד בית</p>
                <p className="text-sm text-muted-foreground">
                  ₪ {(building?.monthly_fee ?? 0).toLocaleString('he-IL')} לחודש
                </p>
              </div>
              <Badge variant={isPaidThisMonth ? 'default' : 'destructive'}>
                {isPaidThisMonth ? 'שולם' : 'לא שולם'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {payments && payments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">היסטוריית תשלומים</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span>{MONTHS[p.month - 1]} {p.year}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">₪ {p.amount.toLocaleString('he-IL')}</span>
                    <Badge variant={p.status === 'paid' ? 'outline' : 'destructive'} className="text-xs">
                      {p.status === 'paid' ? 'שולם' : 'לא שולם'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Button asChild variant="outline" className="w-full">
          <Link href={`/portal/${token}/ticket`}>דיווח על תקלה בבניין</Link>
        </Button>
      </div>
    </main>
  )
}
