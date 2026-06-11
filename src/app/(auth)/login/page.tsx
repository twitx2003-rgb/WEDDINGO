import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8" dir="rtl">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>כניסת מנהל</CardTitle>
          <CardDescription>הכנס את פרטיך כדי להיכנס לממשק הניהול</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  )
}
