import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { getAdminContext } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/server'
import { AddTenantForm } from '@/components/admin/AddTenantForm'
import { CopyLinkButton } from '@/components/admin/CopyLinkButton'

export default async function TenantsPage() {
  const ctx = await getAdminContext()
  if (!ctx) redirect('/login')

  const admin = createAdminClient()
  const { data: tenants } = await admin
    .from('users')
    .select('id, name, apartment_number, phone, access_token')
    .eq('building_id', ctx.building_id)
    .eq('role', 'tenant')
    .order('apartment_number')

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">ניהול דיירים</h1>
          <p className="text-muted-foreground">הוסף דיירים וצור קישורי גישה</p>
        </div>
      </div>

      <AddTenantForm />

      <Card>
        <CardHeader>
          <CardTitle>רשימת דיירים</CardTitle>
          <CardDescription>לחץ על סמל ההעתקה לשליחת קישור הגישה לדייר</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>שם</TableHead>
                <TableHead>דירה</TableHead>
                <TableHead>טלפון</TableHead>
                <TableHead>קישור גישה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants && tenants.length > 0 ? (
                tenants.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>{t.apartment_number}</TableCell>
                    <TableCell>{t.phone ?? '—'}</TableCell>
                    <TableCell>
                      <CopyLinkButton token={t.access_token} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    לא נמצאו דיירים — הוסף את הדייר הראשון
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
