import { centsToDouble } from '@crash-game/utils'

type RoundHistoryProps = {
  history: number[]
}

function chipStyle(multiplier: number): string {
  if (multiplier > 10) return 'text-purple-400 border-purple-400/30 bg-purple-400/10'
  if (multiplier > 5)  return 'text-green-400 border-green-400/30 bg-green-400/10'
  if (multiplier > 2)  return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
  return 'text-red-400 border-red-400/30 bg-red-400/10'
}

export function RoundHistory({ history }: RoundHistoryProps) {
  if (history.length === 0) return null

  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto styled-scrollbar pb-1">
      {[...history].reverse().map((crashPoint, i) => {
        const multiplier = centsToDouble(crashPoint)
        return (
          <span
            key={i}
            className={`shrink-0 text-xs font-bold px-2 py-1 rounded-lg border ${chipStyle(multiplier)}`}
          >
            {multiplier.toFixed(2)}x
          </span>
        )
      })}
    </div>
  )
}
