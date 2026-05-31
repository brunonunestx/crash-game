import { useEffect, useRef } from 'react'
import { repositories } from '#/data/repositories'
import type { IRound } from '@crash-game/types'
import { RoundStatus } from '@crash-game/types'
import { centsToDouble } from '@crash-game/utils'
import { Graph } from './_components/graph'
import { useState } from 'react'
import { Bet } from './_components/bet'

export function MonkeyCrashPage() {
  const multiplierRef = useRef<HTMLSpanElement | null>(null)
  const [currentRound, setCurrentRound] = useState<IRound | null>(null)

  useEffect(() => {
    const { socket } = repositories.games

    socket.connect()
    socket.onSyncRound((data: IRound) => {
      setCurrentRound(data)
      if (multiplierRef.current) {
        const multiplier = centsToDouble(data.currentPoint).toFixed(2)
        multiplierRef.current.textContent = `${multiplier}x`
      }
    })

    socket.onRoundUpdate((data: IRound) => {
      setCurrentRound(data)
      if (multiplierRef.current) {
        const multiplier = centsToDouble(data.currentPoint).toFixed(2)
        multiplierRef.current.textContent = `${multiplier}x`
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-primary mb-4">Monkey Crash</h2>
      <div className="w-full h-full bg-background rounded-lg p-4">
        <p className="text-primary">Status: {currentRound?.status}</p>
        <Graph
          multiplierRef={multiplierRef}
          roundId={currentRound?.number || 0}
          betting={currentRound?.status === RoundStatus.BETTING}
          playing={currentRound?.status === RoundStatus.PLAYING}
          crashed={currentRound?.status === RoundStatus.ENDED}
          rocketSrc="/monkey_at_rocket.png"
        />
        <Bet round={currentRound} />
      </div>
    </div>
  )
}
