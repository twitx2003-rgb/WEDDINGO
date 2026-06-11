// Admin login — Supabase email + password
// TODO: wire up createClient() + signInWithPassword()
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>כניסת מנהל</CardTitle>
          <CardDescription>הכנס את פרטיך כדי להיכנס לממשק הניהול</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">אימייל</Label>
            <Input id="email" type="email" placeholder="vaad@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">סיסמה</Label>
            <Input id="password" type="password" />
          </div>
          <Button className="w-full">כניסה</Button>
          <p className="text-center text-sm text-muted-foreground">
            אין לך חשבון?{" "}
            <Link href="/register" className="underline">
              הרשמה
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
