import Link from 'next/link'
import { TrendingUp, Newspaper, Settings, BarChart2 } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { TickerStrip } from './TickerStrip'

export function Navbar() {
  return (
    <div className="sticky top-0 z-50">
      <nav className="border-b border-white/10 bg-gray-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <BarChart2 className="h-6 w-6 text-blue-400" />
                <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Micah Tracker
                </span>
              </Link>
              <div className="flex items-center gap-1">
                <NavLink href="/news" icon={Newspaper}>News</NavLink>
                <NavLink href="/stocks" icon={TrendingUp}>Stocks</NavLink>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge />
              <Link
                href="/settings"
                className="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Settings"
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
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  )
}
