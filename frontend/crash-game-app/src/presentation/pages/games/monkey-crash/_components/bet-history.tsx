import { centsToDouble } from '@crash-game/utils'
import type { RoundBetItem } from '#/data/repositories/games/bet/repository'

type BetHistoryProps = {
  bets: RoundBetItem[]
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  const masked = local.slice(0, 3).padEnd(local.length, '*')
  return `${masked}@${domain}`
}

function statusLabel(status: RoundBetItem['status'], cashoutAt: number | null) {
  if (status === 'CASHED_OUT' && cashoutAt !== null) {
    return (
      <span className="text-green-400 font-bold">
        {centsToDouble(cashoutAt).toFixed(2)}x
      </span>
    )
  }
  if (status === 'LOST') {
    return <span className="text-red-400">Crash</span>
  }
  if (status === 'CANCELED') {
    return <span className="text-zinc-500">Cancelado</span>
  }
  return <span className="text-yellow-400 animate-pulse">Voando...</span>
}

export function BetHistory({ bets }: BetHistoryProps) {
  if (bets.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
        Nenhuma aposta nesta rodada
      </div>
    )
  }

  const sorted = [...bets].sort((a, b) => {
    const order = { CASHED_OUT: 0, ACTIVE: 1, LOST: 2, CANCELED: 3 }
    return order[a.status] - order[b.status]
  })

  return (
    <div className="flex flex-col gap-1 overflow-y-auto h-full styled-scrollbar pr-1 ">
      <div className="grid grid-cols-3 text-xs text-zinc-500 px-2 pb-1 border-b border-white/5">
        <span>Jogador</span>
        <span className="text-right">Aposta</span>
        <span className="text-right">Saída</span>
      </div>
      {sorted.map((bet) => (
        <div
          key={bet.id}
          className="grid grid-cols-3 text-xs px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors"
        >
          <span className="text-zinc-300 truncate">
            {maskEmail(bet.userEmail)}
          </span>
          <span className="text-right text-zinc-300">
            R$ {centsToDouble(bet.amount).toFixed(2)}
          </span>
          <span className="text-right">
            {statusLabel(bet.status, bet.cashoutAt)}
          </span>
        </div>
      ))}
    </div>
  )
}
