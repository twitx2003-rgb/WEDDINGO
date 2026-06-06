import Link from 'next/link'
import { TrendingUp, Newspaper, Settings, Activity } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { TickerStrip } from './TickerStrip'

export function Navbar() {
  return (
    <div className="sticky top-0 z-50">
      <nav className="border-b border-white/[0.06] bg-[#0a0a0f]/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2.5 group">
                <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-[0_0_18px_-2px_rgba(37,99,235,0.7)] transition-transform group-hover:scale-105">
                  <Activity className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
                </span>
                <span className="font-semibold text-[15px] tracking-tight text-white" dir="ltr">
                  Micah<span className="text-blue-400">Tracker</span>
                </span>
              </Link>
              <div className="flex items-center gap-1">
                <NavLink href="/news" icon={Newspaper}>חדשות</NavLink>
                <NavLink href="/stocks" icon={TrendingUp}>מניות</NavLink>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge />
              <Link
                href="/settings"
                className="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                title="הגדרות"
              >
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <TickerStrip />
    </div>
  )
}

function NavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-colors"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  )
}
