// Payments management — mark tenants paid/unpaid per month
// TODO: fetch payments, implement togglePaymentStatus server action
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MONTHS = ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];

export default function PaymentsPage() {
  const currentMonth = new Date().getMonth(); // 0-indexed

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">ניהול תשלומים</h1>
          <p className="text-muted-foreground">סמן תשלומים לפי דייר וחודש</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">חודש נוכחי:</span>
          <Badge>{MONTHS[currentMonth]}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>טבלת תשלומים</CardTitle>
          <CardDescription>לחץ על "שולם" כדי לעדכן את סטטוס התשלום</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>דייר</TableHead>
                <TableHead>דירה</TableHead>
                <TableHead>סכום</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>פעולה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  אין דיירים רשומים עדיין
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
