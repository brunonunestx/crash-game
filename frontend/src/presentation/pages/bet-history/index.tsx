import { useMyBets } from '#/data/queries/games/use-my-bets'
import { Box } from '#/presentation/components/box'
import { ChevronLeft, ChevronRight, ScrollText } from 'lucide-react'
import { useState } from 'react'
import type { MyBetItem } from '#/data/repositories/games/bet/repository'

const LIMIT = 20

const STATUS_CONFIG: Record<
  MyBetItem['status'],
  { label: string; className: string }
> = {
  CASHED_OUT: { label: 'Cash Out', className: 'text-green-400 bg-green-400/10 border-green-400/20' },
  LOST:       { label: 'Perdeu',   className: 'text-red-400 bg-red-400/10 border-red-400/20' },
  CANCELED:   { label: 'Cancelado', className: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20' },
  ACTIVE:     { label: 'Ativa',    className: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
}

export function BetHistoryPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useMyBets(page, LIMIT)

  return (
    <div className="p-4 md:p-8 flex flex-col gap-6">
      <h2 className="text-xl md:text-2xl font-bold text-primary">
        Histórico de Apostas
      </h2>

      <Box className="w-full items-start gap-0 p-0 overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr] text-xs text-foreground-variant px-5 py-3 border-b border-white/5 w-full gap-4">
          <span className="w-16">Rodada</span>
          <span>Status</span>
          <span className="text-right">Aposta</span>
          <span className="text-right">Multiplicador</span>
          <span className="text-right">Data</span>
        </div>

        {isLoading ? (
          <div className="py-12 w-full flex items-center justify-center">
            <p className="text-foreground-variant text-sm animate-pulse">
              Carregando...
            </p>
          </div>
        ) : data?.bets.length === 0 ? (
          <div className="py-12 w-full flex flex-col items-center justify-center gap-3">
            <ScrollText className="text-foreground-variant w-10 h-10 opacity-40" />
            <p className="text-foreground-variant text-sm">
              Nenhuma aposta encontrada
            </p>
          </div>
        ) : (
          data?.bets.map((bet) => <BetRow key={bet.id} bet={bet} />)
        )}
      </Box>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-foreground-variant">
          <span>
            Página {data.currentPage} de {data.totalPages} —{' '}
            {data.totalItems} apostas
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 rounded hover:text-primary disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
              className="p-1 rounded hover:text-primary disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function BetRow({ bet }: { bet: MyBetItem }) {
  const config = STATUS_CONFIG[bet.status]
  const multiplier =
    bet.cashoutAt !== null ? bet.cashoutAt.toFixed(2) + 'x' : '—'

  return (
    <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr] text-sm px-5 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors w-full gap-4 items-center">
      <span className="text-foreground-variant text-xs w-16">
        #{bet.roundNumber}
      </span>
      <span
        className={`inline-flex items-center self-start w-fit px-2 py-0.5 rounded-full border text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
      <span className="text-right text-foreground tabular-nums">
        R$ {bet.amount.toFixed(2)}
      </span>
      <span
        className={`text-right tabular-nums font-medium ${
          bet.status === 'CASHED_OUT' ? 'text-green-400' : 'text-foreground-variant'
        }`}
      >
        {multiplier}
      </span>
      <span className="text-right text-foreground-variant text-xs">
        {new Date(bet.createdAt).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    </div>
  )
}
