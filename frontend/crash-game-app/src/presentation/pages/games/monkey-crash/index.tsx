import { useEffect, useRef, useState } from 'react'
import { repositories } from '#/data/repositories'
import { useRoundHistory } from '#/data/queries/games/use-round-history'
import { useRoundBets } from '#/data/queries/games/use-round-bets'
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

export function MonkeyCrashPage() {
  const multiplierRef = useRef<HTMLSpanElement | null>(null)
  const currentPointRef = useRef<number>(100)
  const lastMsgTimeRef = useRef<number>(Date.now())

  const [currentRound, setCurrentRound] = useState<IRound | null>(null)
  const [currentMultiplier, setCurrentMultiplier] = useState(1)
  const [latencyMs, setLatencyMs] = useState(0)
  const [history, setHistory] = useState<number[]>([])
  const historyInitializedRef = useRef(false)

  const { data: fetchedHistory } = useRoundHistory()
  const { data: roundBets = [] } = useRoundBets(currentRound?.id)

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
    setHistory(fetchedHistory.map((r) => r.breakPoint).reverse())
  }, [fetchedHistory])

  useEffect(() => {
    const { socket } = repositories.games

    socket.connect()

    socket.onSyncRound((data: IRound) => {
      const now = Date.now()
      setLatencyMs(now - lastMsgTimeRef.current)
      lastMsgTimeRef.current = now
      setCurrentRound(data)
      if (data.status === RoundStatus.PLAYING)
        updateMultiplier(data.currentPoint)
    })

    socket.onRoundUpdate((data: IRound) => {
      const now = Date.now()
      setLatencyMs(now - lastMsgTimeRef.current)
      lastMsgTimeRef.current = now
      setCurrentRound(data)

      if (data.status === RoundStatus.PLAYING) {
        updateMultiplier(data.currentPoint)
      }

      if (data.status === RoundStatus.ENDED) {
        setHistory((prev) => [...prev.slice(-49), data.currentPoint])
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
    <div className="p-6 flex flex-col gap-3 h-[calc(100dvh-4rem)] max-w-[90dvw] overflow-hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">Monkey Crash</h2>
      </div>

      <RoundHistory history={history} />

      <div className="flex gap-4 flex-1 min-h-0">
        <div className="h-full shrink-0 bg-background w-[30vh] rounded-lg border border-golden p-2">
          <BetHistory bets={roundBets} />
        </div>
        <div className="flex-1 flex flex-col gap-2 min-h-0">
          <div className="flex-1 min-h-0">
            <Graph
              multiplierRef={multiplierRef}
              currentPointRef={currentPointRef}
              roundId={currentRound?.number || 0}
              status={currentRound?.status}
              betting={currentRound?.status === RoundStatus.BETTING}
              playing={currentRound?.status === RoundStatus.PLAYING}
              crashed={currentRound?.status === RoundStatus.ENDED}
              rocketSrc="/monkey_at_rocket.png"
            />
          </div>
        </div>

        <div className="w-80 shrink-0">
          <Bet round={currentRound} currentMultiplier={currentMultiplier} />
        </div>
      </div>
    </div>
  )
}
