// Tenant portal — personal payment status view
// Accessed via magic link: /portal/<access_token>
// TODO: look up user by access_token, fetch their payments
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function TenantPortalPage({ params }: Props) {
  const { token } = await params;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8" dir="rtl">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">שלום, דייר!</h1>
          <p className="text-muted-foreground text-sm">פורטל אישי — ועד-טק</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>מצב תשלומים</CardTitle>
            <CardDescription>סטטוס דמי ועד בית עדכני</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Placeholder — will be replaced with real data */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <span className="font-medium">סטטוס נוכחי</span>
              <Badge variant="outline">טוען...</Badge>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              חיבור למסד נתונים עדיין לא הוגדר.
            </p>
          </CardContent>
        </Card>

        <Button asChild variant="outline" className="w-full">
          <Link href={`/portal/${token}/ticket`}>
            דיווח על תקלה בבניין
          </Link>
        </Button>
      </div>
    </main>
  );
}
