import { CircleUserRound } from 'lucide-react'

export function Header() {
  return (
    <header className="w-full h-16 bg-background text-white flex items-center justify-center">
      <button className="ml-auto mr-4 px-4 py-2 text-white rounded-xl cursor-pointer flex items-center gap-2">
        <CircleUserRound className="w-8 h-8 text-primary" />
      </button>
    </header>
  )
}
