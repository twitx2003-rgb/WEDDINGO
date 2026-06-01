import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'bullish' | 'bearish' | 'neutral' | 'buy' | 'watch' | 'sell' | 'avoid' | 'running' | 'success' | 'error'
  className?: string
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-gray-700 text-gray-200',
  bullish: 'bg-green-900/60 text-green-300 border border-green-700/50',
  bearish: 'bg-red-900/60 text-red-300 border border-red-700/50',
  neutral: 'bg-gray-700 text-gray-300',
  buy: 'bg-green-500/20 text-green-300 border border-green-500/40',
  watch: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40',
  sell: 'bg-red-500/20 text-red-300 border border-red-500/40',
  avoid: 'bg-orange-500/20 text-orange-300 border border-orange-500/40',
  running: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
  success: 'bg-green-500/20 text-green-300',
  error: 'bg-red-500/20 text-red-300',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
