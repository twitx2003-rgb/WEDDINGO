import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireHobbyist } from '@/lib/session'
import { logout } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'
import { LayoutList, UserCircle, LogOut, Store, Home } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'המודעות שלי', icon: LayoutList },
  { href: '/dashboard/profile', label: 'הפרופיל שלי', icon: UserCircle },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireHobbyist()
  if (!profile) redirect('/login')

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 flex-col border-l bg-card">
        <div className="border-b p-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <Store className="h-5 w-5 text-primary" />
            האזור שלי
          </Link>
          <p className="mt-1 truncate text-xs text-muted-foreground">{profile.name}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Home className="h-4 w-4" />
            לאתר הראשי
          </Link>
        </nav>
        <div className="border-t p-2">
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
