import { CircleX, CircleCheck, Info } from 'lucide-react'

type ToastProps = {
  message: string
  type?: 'success' | 'error' | 'info'
}

const icons = {
  success: <CircleCheck className="text-primary w-24 h-24" />,
  error: <CircleX className="text-primary w-16 h-16" />,
  info: <Info className="text-primary w-24 h-24" />,
}

export function Toast({ message, type = 'info' }: ToastProps) {
  return (
    <div className="flex items-center border border-primary rounded-xl justify-center gap-4 p-6 bg-background">
      {icons[type]}
      <div className="text-secondary rounded shadow">{message}</div>
    </div>
  )
}
