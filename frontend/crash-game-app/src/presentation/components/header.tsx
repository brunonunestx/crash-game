import { Menu } from 'lucide-react'

type HeaderProps = {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="w-full h-14 bg-background text-white flex items-center px-4 shrink-0">
      <button
        onClick={onMenuClick}
        className="text-primary p-1"
        aria-label="Abrir menu"
      >
        <Menu size={24} />
      </button>
    </header>
  )
}
