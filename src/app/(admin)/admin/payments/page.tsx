import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getAdminContext } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/server'
import { togglePaymentStatus } from '@/app/(admin)/actions'

const MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']

export default async function PaymentsPage() {
  const ctx = await getAdminContext()
  if (!ctx) redirect('/login')

  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  const building_id = ctx.building_id

  const admin = createAdminClient()
  const { data: tenants } = await admin
    .from('users')
    .select('id, name, apartment_number')
    .eq('building_id', building_id)
    .eq('role', 'tenant')
    .order('apartment_number')

  const { data: payments } = await admin
    .from('payments')
    .select('id, user_id, status')
    .eq('month', month)
    .eq('year', year)

  const paymentMap = new Map(payments?.map((p) => [p.user_id, p]) ?? [])
  const monthlyFee = ctx.buildings.monthly_fee

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">ניהול תשלומים</h1>
          <p className="text-muted-foreground">סמן תשלומים לפי דייר וחודש</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">חודש נוכחי:</span>
          <Badge>{MONTHS[month - 1]} {year}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>טבלת תשלומים</CardTitle>
          <CardDescription>לחץ על הכפתור כדי לעדכן את סטטוס התשלום</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>דייר</TableHead>
                <TableHead>דירה</TableHead>
                <TableHead>סכום</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>פעולה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants && tenants.length > 0 ? (
                tenants.map((t) => {
                  const payment = paymentMap.get(t.id)
                  const status = payment?.status ?? 'unpaid'
                  return (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell>{t.apartment_number}</TableCell>
                      <TableCell>₪ {monthlyFee.toLocaleString('he-IL')}</TableCell>
                      <TableCell>
                        <Badge variant={status === 'paid' ? 'default' : 'destructive'}>
                          {status === 'paid' ? 'שולם' : 'לא שולם'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <form action={togglePaymentStatus}>
                          <input type="hidden" name="user_id" value={t.id} />
                          <input type="hidden" name="payment_id" value={payment?.id ?? ''} />
                          <input type="hidden" name="current_status" value={status} />
                          <input type="hidden" name="month" value={month} />
                          <input type="hidden" name="year" value={year} />
                          <input type="hidden" name="amount" value={monthlyFee} />
                          <Button type="submit" size="sm" variant={status === 'paid' ? 'outline' : 'default'}>
                            {status === 'paid' ? 'בטל תשלום' : 'סמן שולם'}
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    אין דיירים רשומים עדיין — הוסף דיירים בלשונית "דיירים"
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
