import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getAdminContext } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/server'
import { updateIssueStatus } from '@/app/(admin)/actions'

const statusLabel: Record<string, string> = {
  open: 'פתוח',
  in_progress: 'בטיפול',
  resolved: 'טופל',
}

const statusVariant: Record<string, 'destructive' | 'default' | 'outline'> = {
  open: 'destructive',
  in_progress: 'default',
  resolved: 'outline',
}

const nextActionLabel: Record<string, string> = {
  open: 'התחל טיפול',
  in_progress: 'סמן כטופל',
  resolved: 'פתח מחדש',
}

export default async function IssuesPage() {
  const ctx = await getAdminContext()
  if (!ctx) redirect('/login')

  const admin = createAdminClient()
  const { data: issues } = await admin
    .from('issues')
    .select('id, description, status, created_at, users(name, apartment_number)')
    .eq('building_id', ctx.building_id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">קריאות שירות</h1>
        <p className="text-muted-foreground">תקלות שדיירים דיווחו עליהן</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>רשימת תקלות</CardTitle>
          <CardDescription>לחץ על הכפתור כדי לעדכן את הסטטוס</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>תיאור</TableHead>
                <TableHead>מדווח</TableHead>
                <TableHead>תאריך</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>פעולה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues && issues.length > 0 ? (
                issues.map((issue) => {
                  const reporter = Array.isArray(issue.users) ? issue.users[0] : issue.users
                  return (
                    <TableRow key={issue.id}>
                      <TableCell className="max-w-xs truncate">{issue.description}</TableCell>
                      <TableCell>
                        {reporter ? `${reporter.name} (${reporter.apartment_number})` : '—'}
                      </TableCell>
                      <TableCell>
                        {new Date(issue.created_at).toLocaleDateString('he-IL')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[issue.status]}>
                          {statusLabel[issue.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <form action={updateIssueStatus}>
                          <input type="hidden" name="issue_id" value={issue.id} />
                          <input type="hidden" name="current_status" value={issue.status} />
                          <Button type="submit" size="sm" variant="outline">
                            {nextActionLabel[issue.status]}
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    אין קריאות שירות פתוחות
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
