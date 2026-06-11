import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Building2, Users, CreditCard, Receipt, AlertCircle, LogOut } from 'lucide-react'
import { getAdminContext } from '@/lib/session'
import { logout } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/admin', label: 'דשבורד', icon: Building2 },
  { href: '/admin/tenants', label: 'דיירים', icon: Users },
  { href: '/admin/payments', label: 'תשלומים', icon: CreditCard },
  { href: '/admin/expenses', label: 'הוצאות', icon: Receipt },
  { href: '/admin/issues', label: 'תקלות', icon: AlertCircle },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getAdminContext()
  if (!ctx) redirect('/login')

  return (
    <div className="flex min-h-screen" dir="rtl">
      <aside className="w-56 border-l bg-card flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">ועד-טק</h2>
          <p className="text-xs text-muted-foreground truncate">{ctx.buildings.address}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{ctx.name}</p>
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
        <div className="p-2 border-t">
          <form action={logout}>
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start gap-3">
              <LogOut className="h-4 w-4" />
              יציאה
            </Button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
