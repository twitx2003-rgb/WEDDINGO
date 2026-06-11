// Tenant management — add tenants and copy their magic portal link
// TODO: fetch tenants list, implement add/edit form, copy access_token link
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";

export default function TenantsPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">ניהול דיירים</h1>
          <p className="text-muted-foreground">הוסף דיירים וצור קישורי גישה</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 ml-2" />
          הוסף דייר
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>רשימת דיירים</CardTitle>
          <CardDescription>לחץ על הסמל להעתקת קישור הגישה לוואטסאפ</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>שם</TableHead>
                <TableHead>דירה</TableHead>
                <TableHead>טלפון</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>קישור גישה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  לא נמצאו דיירים — הוסף את הדייר הראשון
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
