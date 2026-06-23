import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>הרשמה</CardTitle>
          <CardDescription>הצטרפו לקהילת בעלי התחביב והלקוחות</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </main>
  )
}
