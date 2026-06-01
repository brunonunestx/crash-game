import { useEffect, useRef, useState } from 'react'
import { repositories } from '#/data/repositories'
import { useRoundHistory } from '#/data/queries/games/use-round-history'
import { useRoundBets } from '#/data/queries/games/use-round-bets'
import type { RoundHistoryItem } from '#/data/repositories/games/round/repository'
import type { IRound } from '@crash-game/types'
import { RoundStatus } from '@crash-game/types'
import { centsToDouble } from '@crash-game/utils'
import { Graph } from './_components/graph'
import { Bet } from './_components/bet'
import { RoundHistory } from './_components/round-history'
import { BetHistory } from './_components/bet-history'

function getMultiplierColor(multiplier: number): string {
  if (multiplier >= 10) return '#a855f7'
  if (multiplier >= 5) return '#3b82f6'
  if (multiplier >= 2) return '#22c55e'
  return '#D4AF37'
}

type MobileTab = 'bet' | 'players'

export function MonkeyCrashPage() {
  const multiplierRef = useRef<HTMLSpanElement | null>(null)
  const currentPointRef = useRef<number>(100)
  const lastMsgTimeRef = useRef<number>(Date.now())

  const [currentRound, setCurrentRound] = useState<IRound | null>(null)
  const [currentMultiplier, setCurrentMultiplier] = useState(1)
  const [history, setHistory] = useState<RoundHistoryItem[]>([])
  const [mobileTab, setMobileTab] = useState<MobileTab>('bet')
  const historyInitializedRef = useRef(false)

  const { data: fetchedHistory } = useRoundHistory()
  const { data: roundBets = [] } = useRoundBets(currentRound?.id)

  console.log('Current Round:', fetchedHistory)

  function updateMultiplier(currentPoint: number) {
    currentPointRef.current = currentPoint
    const multiplier = centsToDouble(currentPoint)
    setCurrentMultiplier(multiplier)
    if (multiplierRef.current) {
      multiplierRef.current.textContent = `${multiplier.toFixed(2)}x`
      multiplierRef.current.style.color = getMultiplierColor(multiplier)
    }
  }

  useEffect(() => {
    if (!fetchedHistory || historyInitializedRef.current) return
    historyInitializedRef.current = true
    setHistory([...fetchedHistory].reverse())
  }, [fetchedHistory])

  useEffect(() => {
    const { socket } = repositories.games

    socket.connect()

    socket.onSyncRound((data: IRound) => {
      const now = Date.now()
      lastMsgTimeRef.current = now
      setCurrentRound(data)
      if (data.status === RoundStatus.PLAYING)
        updateMultiplier(data.currentPoint)
    })

    socket.onRoundUpdate((data: IRound) => {
      const now = Date.now()
      lastMsgTimeRef.current = now
      setCurrentRound(data)

      if (data.status === RoundStatus.PLAYING) {
        updateMultiplier(data.currentPoint)
      }

      if (data.status === RoundStatus.ENDED) {
        setHistory((prev) => [
          ...prev.slice(-49),
          { id: data.id, breakPoint: data.currentPoint },
        ])
        currentPointRef.current = 100
        setCurrentMultiplier(1)
        if (multiplierRef.current) {
          multiplierRef.current.style.color = '#ef4444'
        }
      }

      if (data.status === RoundStatus.BETTING) {
        setCurrentMultiplier(1)
        if (multiplierRef.current) {
          multiplierRef.current.style.color = '#D4AF37'
        }
      }
    })

    return () => socket.disconnect()
  }, [])

  return (
    <div className="flex flex-col gap-2 md:gap-3 p-2 md:p-6 h-[calc(100dvh-3.5rem)] md:h-[100dvh] overflow-hidden">
      <RoundHistory history={history} />

      <div className="flex gap-4 flex-1 min-h-0">
        {/* BetHistory: coluna lateral — visível apenas desktop */}
        <div className="hidden md:block h-full shrink-0 bg-background w-[30vh] rounded-lg border border-golden p-2">
          <BetHistory bets={roundBets} roundId={currentRound?.id} />
        </div>

        <div className="flex flex-col flex-1 gap-2 min-h-0">
          {/* Graph */}
          <div className="h-[38dvh] md:h-auto md:flex-1 min-h-0">
            <Graph
              multiplierRef={multiplierRef}
              currentPointRef={currentPointRef}
              roundId={currentRound?.number || 0}
              status={currentRound?.status}
              betting={currentRound?.status === RoundStatus.BETTING}
              playing={currentRound?.status === RoundStatus.PLAYING}
              crashed={currentRound?.status === RoundStatus.ENDED}
              rocketSrc="/monkey_at_rocket.png"
              hashedSeed={currentRound?.hashedSeed}
            />
          </div>

          {/* Tabs mobile */}
          <div className="flex md:hidden border-b border-golden shrink-0">
            {(['bet', 'players'] as MobileTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setMobileTab(t)}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                  mobileTab === t
                    ? 'text-primary border-b-2 border-primary -mb-px'
                    : 'text-foreground-variant'
                }`}
              >
                {t === 'bet' ? 'Apostar' : 'Jogadores'}
              </button>
            ))}
          </div>

          {/* Conteúdo das tabs (mobile) — sempre montado para preservar estado */}
          <div className="flex md:hidden flex-1 min-h-0 overflow-hidden">
            <div className={mobileTab === 'bet' ? 'flex flex-1 min-h-0' : 'hidden'}>
              <Bet round={currentRound} currentMultiplier={currentMultiplier} />
            </div>
            <div className={mobileTab === 'players' ? 'w-full h-full bg-background rounded-lg border border-golden p-2' : 'hidden'}>
              <BetHistory bets={roundBets} roundId={currentRound?.id} />
            </div>
          </div>
        </div>

        {/* Bet: coluna lateral — visível apenas desktop */}
        <div className="hidden md:block w-80 shrink-0">
          <Bet round={currentRound} currentMultiplier={currentMultiplier} />
        </div>
      </div>
    </div>
  )
}
