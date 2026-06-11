import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { PlusCircle } from 'lucide-react'
import { getAdminContext } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/server'
import { addExpense } from '@/app/(admin)/actions'

export default async function ExpensesPage() {
  const ctx = await getAdminContext()
  if (!ctx) redirect('/login')

  const admin = createAdminClient()
  const { data: expenses } = await admin
    .from('expenses')
    .select('id, description, amount, date')
    .eq('building_id', ctx.building_id)
    .order('date', { ascending: false })

  const total = (expenses ?? []).reduce((s, e) => s + e.amount, 0)

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">ניהול הוצאות</h1>
        <p className="text-muted-foreground">רשום הוצאות שוטפות של הבניין</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>הוסף הוצאה חדשה</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addExpense} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="description">תיאור</Label>
              <Input id="description" name="description" placeholder="חשבון חשמל, מנקה..." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">סכום (₪)</Label>
              <Input id="amount" name="amount" type="number" min="1" step="0.01" placeholder="500" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">תאריך</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div className="sm:col-span-3">
              <Button type="submit">
                <PlusCircle className="h-4 w-4 ml-2" />
                הוסף הוצאה
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>היסטוריית הוצאות</CardTitle>
            {expenses && expenses.length > 0 && (
              <span className="text-sm font-medium">
                סה&quot;כ: ₪ {total.toLocaleString('he-IL')}
              </span>
            )}
          </div>
          <CardDescription>כל ההוצאות שנרשמו</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>תיאור</TableHead>
                <TableHead>סכום</TableHead>
                <TableHead>תאריך</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses && expenses.length > 0 ? (
                expenses.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.description}</TableCell>
                    <TableCell>₪ {e.amount.toLocaleString('he-IL')}</TableCell>
                    <TableCell>{new Date(e.date).toLocaleDateString('he-IL')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    לא נרשמו הוצאות עדיין
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
