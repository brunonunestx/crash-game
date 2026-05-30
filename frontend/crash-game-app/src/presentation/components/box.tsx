import { cn } from '@crash-game/utils'

type BoxProps = {
  className?: string
  children: React.ReactNode
}

export function Box({ children, className }: BoxProps) {
  return (
    <div
      className={cn(
        `bg-background border border-golden shadow rounded-xl p-4 flex flex-col items-center justify-between`,
        className,
      )}
    >
      {children}
    </div>
  )
}
