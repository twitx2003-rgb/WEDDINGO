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
        'card-lift rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm',
        variant === 'buy' && 'border-l-[3px] border-l-emerald-500/80 ring-1 ring-emerald-500/10',
        variant === 'bearish' && 'border-l-[3px] border-l-red-500/80',
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
