import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, AlertCircle, TrendingDown } from 'lucide-react'
import { getAdminContext } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboardPage() {
  const ctx = await getAdminContext()
  if (!ctx) redirect('/login')

  const admin = createAdminClient()
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  const building_id = ctx.building_id

  const [
    { data: paidPayments },
    { data: allExpenses },
    { data: openIssues },
    { data: tenants },
    { data: paidThisMonth },
  ] = await Promise.all([
    admin.from('payments').select('amount').eq('status', 'paid').in(
      'user_id',
      (await admin.from('users').select('id').eq('building_id', building_id).eq('role', 'tenant')).data?.map((u) => u.id) ?? []
    ),
    admin.from('expenses').select('amount').eq('building_id', building_id),
    admin.from('issues').select('id', { count: 'exact' }).eq('building_id', building_id).eq('status', 'open'),
    admin.from('users').select('id').eq('building_id', building_id).eq('role', 'tenant'),
    admin
      .from('payments')
      .select('user_id')
      .eq('month', month)
      .eq('year', year)
      .eq('status', 'paid'),
  ])

  const totalIncome = (paidPayments ?? []).reduce((s, p) => s + p.amount, 0)
  const totalExpenses = (allExpenses ?? []).reduce((s, e) => s + e.amount, 0)
  const balance = totalIncome - totalExpenses

  const tenantCount = tenants?.length ?? 0
  const paidTenantIds = new Set((paidThisMonth ?? []).map((p) => p.user_id))
  const unpaidCount = tenantCount - paidTenantIds.size
  const unpaidAmount = unpaidCount * ctx.buildings.monthly_fee

  const openCount = openIssues?.length ?? 0

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">דשבורד</h1>
        <p className="text-muted-foreground">סקירה כללית של מצב הבניין</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">יתרה בקופה</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₪ {balance.toLocaleString('he-IL')}
            </div>
            <p className="text-xs text-muted-foreground">תשלומים פחות הוצאות</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">חובות פתוחים החודש</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ₪ {unpaidAmount.toLocaleString('he-IL')}
            </div>
            <p className="text-xs text-muted-foreground">{unpaidCount} דיירים לא שילמו</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">קריאות שירות פתוחות</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openCount}</div>
            <p className="text-xs text-muted-foreground">ממתינות לטיפול</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
