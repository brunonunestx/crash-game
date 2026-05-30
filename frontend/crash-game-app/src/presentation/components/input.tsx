import { cn } from '@crash-game/utils'

type InputProps = {
  value: string
  placeholder?: string
  className?: string
  type?: string
  onChange: (value: string) => void
}

export function Input({
  value,
  type,
  placeholder,
  className,
  onChange,
}: InputProps) {
  return (
    <input
      className={cn(
        'bg-background text-foreground border border-golden rounded-xl p-2',
        className,
      )}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
