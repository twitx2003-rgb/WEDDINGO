// Admin registration + building creation
// TODO: wire up createClient() + signUp(), then insert into buildings + users tables
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>הרשמת ועד בית</CardTitle>
          <CardDescription>צור חשבון ורשום את הבניין שלך</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">שם מלא</Label>
            <Input id="name" placeholder="ישראל ישראלי" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">אימייל</Label>
            <Input id="email" type="email" placeholder="vaad@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">סיסמה</Label>
            <Input id="password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">כתובת הבניין</Label>
            <Input id="address" placeholder="רחוב הרצל 12, תל אביב" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="apartments">מספר דירות</Label>
              <Input id="apartments" type="number" placeholder="20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fee">דמי ועד (₪/חודש)</Label>
              <Input id="fee" type="number" placeholder="200" />
            </div>
          </div>
          <Button className="w-full">הרשמה</Button>
          <p className="text-center text-sm text-muted-foreground">
            יש לך חשבון?{" "}
            <Link href="/login" className="underline">
              כניסה
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
