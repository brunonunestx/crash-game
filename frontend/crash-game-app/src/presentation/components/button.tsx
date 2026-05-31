import { cn } from '@crash-game/utils'

type ButtonProps = {
  label: string
  variant: 'primary' | 'secondary' | 'gradient'
  disabled?: boolean
  width?: string
  height?: string
  className?: string
  isLoading?: boolean
  onClick: () => void
}

const variants = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
  gradient: 'bg-gradient-to-r from-[#C9A13A] via-[#E5C76B] to-[#D8B24B]',
}

export function Button({
  label,
  variant,
  disabled,
  width,
  height,
  className,
  isLoading,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={cn(
        'button',
        variants[variant],
        'px-4 py-2 rounded-xl flex items-center justify-center',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      style={{ width, height }}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? 'Entrando...' : label}
    </button>
  )
}
