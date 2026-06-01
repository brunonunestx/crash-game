import { useBet } from '#/data/queries/games/use-bet'
import { Box } from '#/presentation/components/box'
import { Toast } from '#/presentation/components/toast'
import { RoundStatus, type IRound } from '@crash-game/types'
import { gameTimings } from '@crash-game/constants'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

type BetProps = {
  round: IRound | null
  currentMultiplier: number
}

type Tab = 'manual' | 'auto'

const CHIP_AMOUNTS = [1, 2, 5, 10, 50, 100]

export const Bet = ({ round, currentMultiplier }: BetProps) => {
  const [tab, setTab] = useState<Tab>('manual')
  const [betAmount, setBetAmount] = useState(0)
  const [targetMultiplier, setTargetMultiplier] = useState(2.0)
  const [userAlreadyBet, setUserAlreadyBet] = useState(false)
  const [userAlreadyCashOut, setUserAlreadyCashOut] = useState(false)
  const [timeLeft, setTimeLeft] = useState(gameTimings.bettingDurationMs)

  const userAlreadyBetRef = useRef(false)
  const userAlreadyCashOutRef = useRef(false)
  const betAmountSnapshotRef = useRef(0)

  const { useCreateBet, useCashOut, useCancelBet } = useBet()

  useEffect(() => {
    if (round?.status === RoundStatus.ENDED) {
      if (userAlreadyBetRef.current && !userAlreadyCashOutRef.current) {
        toast.custom(() => (
          <Toast
            message={`Você perdeu R$ ${betAmountSnapshotRef.current.toFixed(2)}`}
            type="error"
          />
        ))
      }
      resetRound()
    }
    if (round?.status === RoundStatus.STARTING) resetRound()
  }, [round?.status])

  useEffect(() => {
    if (round?.status !== RoundStatus.BETTING) {
      setTimeLeft(gameTimings.bettingDurationMs)
      return
    }
    const startedAt = Date.now()
    const interval = setInterval(() => {
      setTimeLeft(
        Math.max(0, gameTimings.bettingDurationMs - (Date.now() - startedAt)),
      )
    }, 100)
    return () => clearInterval(interval)
  }, [round?.status])

  function resetRound() {
    userAlreadyBetRef.current = false
    userAlreadyCashOutRef.current = false
    betAmountSnapshotRef.current = 0
    setUserAlreadyBet(false)
    setUserAlreadyCashOut(false)
    setBetAmount(0)
  }

  function placeBet() {
    userAlreadyBetRef.current = true
    betAmountSnapshotRef.current = betAmount
    setUserAlreadyBet(true)
    useCreateBet.mutate({ amount: betAmount })
  }

  function doCashOut() {
    userAlreadyCashOutRef.current = true
    setUserAlreadyCashOut(true)
    useCashOut.mutate()
  }

  const status = round?.status
  const isBetting = status === RoundStatus.BETTING
  const isPlaying = status === RoundStatus.PLAYING
  const isCashOutMode = isPlaying && userAlreadyBet && !userAlreadyCashOut

  const timerPercent = (timeLeft / gameTimings.bettingDurationMs) * 100
  const timerColor =
    timeLeft > 5000
      ? 'bg-green-500'
      : timeLeft > 2000
        ? 'bg-yellow-400'
        : 'bg-red-500'

  const potentialGain = (betAmount * targetMultiplier).toFixed(2)
  const currentGain = (
    betAmountSnapshotRef.current * currentMultiplier
  ).toFixed(2)

  return (
    <Box className="w-full h-full items-start justify-start gap-0 p-0 overflow-hidden">
      <div className="flex w-full border-b border-golden">
        {(['manual'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
              tab === t
                ? 'text-primary border-b-2 border-primary -mb-px'
                : 'text-foreground-variant hover:text-foreground'
            }`}
          >
            {t === 'manual' ? 'Manual' : 'Automático'}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 p-5 w-full flex-1">
        {tab === 'auto' ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-foreground-variant text-sm">Em breve</p>
          </div>
        ) : (
          <>
            {isBetting && (
              <div className="flex flex-col gap-1">
                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-100 ${timerColor}`}
                    style={{ width: `${timerPercent}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <span className="text-foreground-variant text-xs font-semibold uppercase tracking-wide">
                Valor da aposta
              </span>
              <div className="flex items-center gap-2 bg-background rounded-xl border border-golden px-3 py-2">
                <span className="text-foreground-variant text-sm">R$</span>
                <input
                  type="number"
                  value={betAmount || ''}
                  placeholder="0,00"
                  disabled={userAlreadyBet}
                  onChange={(e) =>
                    setBetAmount(Math.max(0, Number(e.target.value)))
                  }
                  className="flex-1 bg-transparent text-foreground text-sm outline-none disabled:opacity-50"
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => setBetAmount((p) => Math.max(0, p / 2))}
                    disabled={userAlreadyBet || betAmount <= 0}
                    className="text-xs px-1.5 py-0.5 rounded bg-background-variant text-foreground-variant hover:text-primary disabled:opacity-40"
                  >
                    /2
                  </button>
                  <button
                    onClick={() => setBetAmount((p) => p * 2)}
                    disabled={userAlreadyBet || betAmount <= 0}
                    className="text-xs px-1.5 py-0.5 rounded bg-background-variant text-foreground-variant hover:text-primary disabled:opacity-40"
                  >
                    x2
                  </button>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {CHIP_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    onClick={() => setBetAmount((p) => p + val)}
                    disabled={userAlreadyBet}
                    className="text-xs px-2 py-1 rounded-lg bg-background-variant text-foreground-variant hover:text-primary hover:border-primary border border-golden/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    +{val}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              {isCashOutMode ? (
                <ActionButton
                  label="CASH OUT"
                  sub={`GANHO ATUAL: R$ ${currentGain}`}
                  onClick={doCashOut}
                  loading={useCashOut.isPending}
                  color="from-green-700 via-green-500 to-green-700"
                />
              ) : isPlaying && !userAlreadyBet ? (
                <ActionButton
                  label="AGUARDAR"
                  sub="Próxima rodada"
                  onClick={() => {}}
                  disabled
                  color="from-gray-700 via-gray-600 to-gray-700"
                />
              ) : isBetting && userAlreadyBet ? (
                <ActionButton
                  label="CANCELAR APOSTA"
                  sub={`Aposta: R$ ${betAmountSnapshotRef.current.toFixed(2)}`}
                  onClick={() => useCancelBet.mutate()}
                  loading={useCancelBet.isPending}
                  color="from-red-800 via-red-600 to-red-800"
                />
              ) : isBetting ? (
                <ActionButton
                  label="APOSTAR"
                  sub={
                    betAmount > 0
                      ? `POSSÍVEIS GANHOS: R$ ${potentialGain}`
                      : 'Insira um valor'
                  }
                  onClick={placeBet}
                  disabled={betAmount <= 0}
                  color="from-yellow-600 via-yellow-400 to-yellow-600"
                />
              ) : (
                <ActionButton
                  label="AGUARDAR"
                  sub="Apostas fechadas"
                  onClick={() => {}}
                  disabled
                  color="from-gray-700 via-gray-600 to-gray-700"
                />
              )}
            </div>
          </>
        )}
      </div>
    </Box>
  )
}

type ActionButtonProps = {
  label: string
  sub: string
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  color: string
}

function ActionButton({
  label,
  sub,
  onClick,
  loading,
  disabled,
  color,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full rounded-xl bg-gradient-to-r ${color} flex flex-col items-center justify-center py-3 gap-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity`}
    >
      <span className="text-white font-bold text-base tracking-wide">
        {loading ? '...' : label}
      </span>
      <span className="text-white/70 text-xs">{sub}</span>
    </button>
  )
}
