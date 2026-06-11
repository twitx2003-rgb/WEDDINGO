// Expenses log — add building expenses (electricity, cleaning, etc.)
// TODO: fetch expenses list, implement addExpense server action
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";

export default function ExpensesPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">ניהול הוצאות</h1>
        <p className="text-muted-foreground">רשום הוצאות שוטפות של הבניין</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>הוסף הוצאה חדשה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="desc">תיאור</Label>
              <Input id="desc" placeholder="חשבון חשמל, מנקה..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">סכום (₪)</Label>
              <Input id="amount" type="number" placeholder="500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">תאריך</Label>
              <Input id="date" type="date" />
            </div>
          </div>
          <Button className="mt-4">
            <PlusCircle className="h-4 w-4 ml-2" />
            הוסף הוצאה
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>היסטוריית הוצאות</CardTitle>
          <CardDescription>כל ההוצאות שנרשמו</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>תיאור</TableHead>
                <TableHead>סכום</TableHead>
                <TableHead>תאריך</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  לא נרשמו הוצאות עדיין
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
