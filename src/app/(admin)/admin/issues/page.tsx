// Service tickets / issues — view and update status
// TODO: fetch issues list, implement updateIssueStatus server action
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statusLabel: Record<string, string> = {
  open: "פתוח",
  in_progress: "בטיפול",
  resolved: "טופל",
};

const statusVariant: Record<string, "destructive" | "default" | "success"> = {
  open: "destructive",
  in_progress: "default",
  resolved: "success",
};

export default function IssuesPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">קריאות שירות</h1>
        <p className="text-muted-foreground">תקלות שדיירים דיווחו עליהן</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>רשימת תקלות</CardTitle>
          <CardDescription>לחץ על סטטוס כדי לעדכן</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>תיאור</TableHead>
                <TableHead>מדווח על ידי</TableHead>
                <TableHead>תאריך</TableHead>
                <TableHead>סטטוס</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  אין קריאות שירות פתוחות
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
