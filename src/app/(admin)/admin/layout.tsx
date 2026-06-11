// Admin shell layout — shared navigation for all /admin/* routes
// TODO: add auth guard (redirect to /login if no session)
import Link from "next/link";
import { Building2, Users, CreditCard, Receipt, AlertCircle } from "lucide-react";

const navItems = [
  { href: "/admin", label: "דשבורד", icon: Building2 },
  { href: "/admin/tenants", label: "דיירים", icon: Users },
  { href: "/admin/payments", label: "תשלומים", icon: CreditCard },
  { href: "/admin/expenses", label: "הוצאות", icon: Receipt },
  { href: "/admin/issues", label: "תקלות", icon: AlertCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" dir="rtl">
      <aside className="w-56 border-l bg-card flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">ועד-טק</h2>
          <p className="text-xs text-muted-foreground">ממשק ניהול</p>
        </div>
        <nav className="flex flex-col gap-1 p-2 flex-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
