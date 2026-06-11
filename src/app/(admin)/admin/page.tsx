// Admin Dashboard — shows balance, total debt, and open issues
// TODO: fetch real data from Supabase via createAdminClient()
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, AlertCircle, TrendingDown } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">דשבורד</h1>
        <p className="text-muted-foreground">סקירה כללית של מצב הבניין</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">יתרה בקופה</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₪ —</div>
            <p className="text-xs text-muted-foreground">תשלומים פחות הוצאות</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">חובות פתוחים</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₪ —</div>
            <p className="text-xs text-muted-foreground">סכום לא שולם החודש</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">קריאות שירות פתוחות</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">ממתינות לטיפול</p>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground">
        נתונים יוצגו לאחר חיבור ל-Supabase.
      </p>
    </div>
  );
}
