import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8" dir="rtl">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>הרשמת ועד בית</CardTitle>
          <CardDescription>צור חשבון ורשום את הבניין שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </main>
  )
}
