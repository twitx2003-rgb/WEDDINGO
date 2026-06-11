import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-md space-y-6 text-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">ועד-טק</h1>
          <p className="mt-2 text-muted-foreground">Vaad-Tech — Building Management System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ברוכים הבאים</CardTitle>
            <CardDescription>מערכת ניהול ועד בית פשוטה ויעילה</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/login">כניסת מנהל (ועד בית)</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              דייר? לחץ על הקישור האישי שקיבלת מוועד הבית.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
