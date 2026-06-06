import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'buy' | 'bearish'
}

export function Card({ children, className, variant = 'default' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm',
        variant === 'buy' && 'border-l-4 border-l-emerald-500/70 ring-1 ring-emerald-500/10',
        variant === 'bearish' && 'border-l-4 border-l-red-500/70',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={cn('p-4 border-b border-white/10', className)}>{children}</div>
}

export function CardBody({ children, className }: CardProps) {
  return <div className={cn('p-4', className)}>{children}</div>
}
