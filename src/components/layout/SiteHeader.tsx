import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getCurrentProfile } from '@/lib/session'
import { logout } from '@/app/(auth)/actions'
import { LayoutDashboard, LogOut, Sparkles } from 'lucide-react'

export async function SiteHeader() {
  const profile = await getCurrentProfile()

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          תחביב־כסף
        </Link>

        <nav className="flex items-center gap-2">
          {profile ? (
            <>
              {profile.role === 'hobbyist' && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4 ml-2" />
                    האזור שלי
                  </Link>
                </Button>
              )}
              <span className="hidden text-sm text-muted-foreground sm:inline">
                שלום, {profile.name}
              </span>
              <form action={logout}>
                <Button type="submit" variant="outline" size="sm">
                  <LogOut className="h-4 w-4 ml-2" />
                  יציאה
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">כניסה</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">הרשמה</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
