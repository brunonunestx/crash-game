import { cn } from '@crash-game/utils'

type InputProps = {
  value: string | number
  placeholder?: string
  className?: string
  type?: string
  regex?: RegExp
  disabled?: boolean
  onChange: (value: string | number) => void
}

export function Input({
  value,
  type,
  placeholder,
  className,
  regex,
  disabled,
  onChange,
}: InputProps) {
  return (
    <input
      className={cn(
        'bg-background text-foreground border border-golden rounded-xl p-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => {
        const val = e.target.value
        if (regex && !regex.test(val)) return
        onChange(val)
      }}
    />
  )
}
