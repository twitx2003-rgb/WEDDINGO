// Tenant submit-issue form
// TODO: wire up submitIssue server action → insert into issues table
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function SubmitTicketPage({ params }: Props) {
  const { token } = await params;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>דיווח על תקלה</CardTitle>
          <CardDescription>תאר את הבעיה בקצרה ולחץ שלח</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">תיאור התקלה</Label>
            <textarea
              id="description"
              rows={4}
              placeholder="לדוגמה: הנורה בכניסה שרופה, מעלית תקועה..."
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Button className="w-full">שלח דיווח</Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href={`/portal/${token}`}>חזרה לפורטל</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
