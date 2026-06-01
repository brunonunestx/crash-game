import { centsToDouble } from '@crash-game/utils'
import { useState } from 'react'
import type { RoundHistoryItem } from '#/data/repositories/games/round/repository'
import { RoundVerifyModal } from './round-verify-modal'

type RoundHistoryProps = {
  history: RoundHistoryItem[]
}

function chipStyle(multiplier: number): string {
  if (multiplier > 10)
    return 'text-purple-400 border-purple-400/30 bg-purple-400/10'
  if (multiplier > 5)
    return 'text-green-400 border-green-400/30 bg-green-400/10'
  if (multiplier > 2)
    return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
  return 'text-red-400 border-red-400/30 bg-red-400/10'
}

export function RoundHistory({ history }: RoundHistoryProps) {
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null)

  if (history.length === 0) return null

  return (
    <>
      <div className="w-full min-w-0 overflow-x-auto styled-scrollbar p-2">
        <div className="flex items-center gap-2">
          {[...history].reverse().map((item) => {
            const multiplier = centsToDouble(item.breakPoint)
            return (
              <span
                key={item.id}
                onClick={() => setSelectedRoundId(item.id)}
                className={`shrink-0 text-xs font-bold px-2 py-1 cursor-pointer rounded-lg border ${chipStyle(multiplier)}`}
              >
                {multiplier.toFixed(2)}x
              </span>
            )
          })}
        </div>
      </div>

      {selectedRoundId && (
        <RoundVerifyModal
          roundId={selectedRoundId}
          onClose={() => setSelectedRoundId(null)}
        />
      )}
    </>
  )
}
