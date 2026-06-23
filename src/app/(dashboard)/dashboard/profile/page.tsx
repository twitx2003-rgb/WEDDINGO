import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/session'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileForm } from '@/components/profile/ProfileForm'

export default async function ProfilePage() {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">הפרופיל שלי</h1>
        <p className="text-muted-foreground">פרטים אלו מוצגים ללקוחות במודעות שלך</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>פרטים אישיים</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  )
}
