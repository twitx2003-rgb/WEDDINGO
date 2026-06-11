import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { submitIssue } from '@/app/(tenant)/actions'
import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ token: string }>
}

export default async function SubmitTicketPage({ params }: Props) {
  const { token } = await params

  const admin = createAdminClient()
  const { data: user } = await admin
    .from('users')
    .select('id, name')
    .eq('access_token', token)
    .eq('role', 'tenant')
    .single()

  if (!user) redirect('/')

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>דיווח על תקלה</CardTitle>
          <CardDescription>תאר את הבעיה בקצרה ולחץ שלח</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={submitIssue} className="space-y-4">
            <input type="hidden" name="token" value={token} />
            <div className="space-y-2">
              <Label htmlFor="description">תיאור התקלה</Label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="לדוגמה: הנורה בכניסה שרופה, מעלית תקועה..."
                required
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Button type="submit" className="w-full">שלח דיווח</Button>
          </form>
          <Button asChild variant="ghost" className="w-full">
            <Link href={`/portal/${token}`}>חזרה לפורטל</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
