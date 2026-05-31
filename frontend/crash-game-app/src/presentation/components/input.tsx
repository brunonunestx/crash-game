import { cn } from '@crash-game/utils'

type InputProps = {
  value: string | number
  placeholder?: string
  className?: string
  type?: string
  regex?: RegExp
  onChange: (value: string | number) => void
}

export function Input({
  value,
  type,
  placeholder,
  className,
  regex,
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
      onChange={(e) => {
        const val = e.target.value
        if (regex && !regex.test(val)) return
        onChange(val)
      }}
    />
  )
}
