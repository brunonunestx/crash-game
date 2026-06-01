import React, { useEffect, useRef, useState } from 'react'

import { RoundStatus } from '@crash-game/types'
import { gameTimings } from '@crash-game/constants'
import { Clock } from 'lucide-react'

type FlyAway = {
  startTime: number
  x: number
  y: number
}

type GraphProps = {
  multiplierRef: React.RefObject<HTMLSpanElement | null>
  currentPointRef: React.RefObject<number>
  roundId: number
  status: RoundStatus | undefined
  betting: boolean
  playing: boolean
  crashed: boolean
  rocketSrc?: string
}

const FLY_DURATION = 1400
const CURVE_EXPONENT = 0.22
const CURVE_X_STEP = 3

const LOG_SCALE_FACTOR = 0.22

const buildLabels = () => {
  const labels = []
  let m = 1
  while (m <= 1000) {
    labels.push({ label: `${m}x`, M: m })
    m *= 2
  }
  return labels
}
const ALL_Y_LABELS = buildLabels().map((m) => ({
  label: `${m.label}`,
  M: m.M,
}))

export function Graph({
  multiplierRef,
  currentPointRef,
  roundId,
  status,
  betting,
  playing,
  crashed,
  rocketSrc,
}: GraphProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const lastElapsedRef = useRef(0)
  const rocketImageRef = useRef<HTMLImageElement | null>(null)
  const flyAwayRef = useRef<FlyAway | null>(null)
  const crashedTipRef = useRef<{ x: number; y: number } | null>(null)
  const crashedRef = useRef(false)
  const bettingRef = useRef(false)

  const [timeLeft, setTimeLeft] = useState(gameTimings.bettingDurationMs)

  useEffect(() => {
    if (status !== RoundStatus.BETTING) {
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
  }, [status])

  useEffect(() => {
    if (!rocketSrc) return
    const img = new Image()
    img.src = rocketSrc
    img.onload = () => {
      rocketImageRef.current = img
    }
  }, [rocketSrc])

  useEffect(() => {
    if (playing) {
      startTimeRef.current = performance.now()
      lastElapsedRef.current = 0
      flyAwayRef.current = null
      crashedTipRef.current = null
    } else {
      startTimeRef.current = null
    }
  }, [playing, roundId])

  useEffect(() => {
    bettingRef.current = betting
  }, [betting])

  useEffect(() => {
    crashedRef.current = crashed
    if (crashed && crashedTipRef.current) {
      flyAwayRef.current = {
        startTime: performance.now(),
        x: crashedTipRef.current.x,
        y: crashedTipRef.current.y,
      }
    }
  }, [crashed])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }

    resize()
    window.addEventListener('resize', resize)

    let rafId: number

    function draw(now: number) {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1
      const W = canvas.width / dpr
      const H = canvas.height / dpr

      // Pixels per log unit — scales with canvas height
      const LOG_SCALE = H * LOG_SCALE_FACTOR

      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      const AXIS_LEFT = 0
      const AXIS_BOTTOM = 0

      const elapsed =
        startTimeRef.current !== null
          ? (now - startTimeRef.current) / 1000
          : lastElapsedRef.current

      if (startTimeRef.current !== null) {
        lastElapsedRef.current = elapsed
      }

      const tipX = Math.floor(elapsed * 60)

      const tipWorldX = tipX * CURVE_X_STEP
      const currentM = Math.exp((tipX / 60) * CURVE_EXPONENT)
      const tipWorldY = -Math.log(currentM) * LOG_SCALE

      const monkeyScreenX = Math.min(tipWorldX + 60, W * 0.4)
      const monkeyScreenY = H * 0.5
      const camOffsetX = monkeyScreenX - tipWorldX
      const camOffsetY = monkeyScreenY - tipWorldY

      const GRID_SIZE = 28
      ctx.strokeStyle = 'rgba(255,255,255,0.035)'
      ctx.lineWidth = 0.5
      for (let gy = 0; gy < H - AXIS_BOTTOM; gy += GRID_SIZE) {
        ctx.beginPath()
        ctx.moveTo(AXIS_LEFT, gy)
        ctx.lineTo(W, gy)
        ctx.stroke()
      }
      for (let gx = AXIS_LEFT; gx < W; gx += GRID_SIZE) {
        ctx.beginPath()
        ctx.moveTo(gx, 0)
        ctx.lineTo(gx, H - AXIS_BOTTOM)
        ctx.stroke()
      }

      for (const { M } of ALL_Y_LABELS) {
        const screenY = monkeyScreenY + Math.log(currentM / M) * LOG_SCALE
        if (screenY < 0 || screenY > H - AXIS_BOTTOM) continue

        ctx.strokeStyle = 'rgba(255,255,255,0.06)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(AXIS_LEFT, screenY)
        ctx.lineTo(W, screenY)
        ctx.stroke()
      }

      const X_INTERVAL_FRAMES = 1 * 60
      const xIntervalWorld = X_INTERVAL_FRAMES * CURVE_X_STEP
      const visibleWorldLeft = AXIS_LEFT - camOffsetX
      const visibleWorldRight = W - camOffsetX
      const firstIdx = Math.ceil(visibleWorldLeft / xIntervalWorld)
      const lastIdx = Math.floor(visibleWorldRight / xIntervalWorld)
      for (let i = firstIdx; i <= lastIdx; i++) {
        if (i <= 0) continue
        const screenX = i * xIntervalWorld + camOffsetX
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(screenX, 0)
        ctx.lineTo(screenX, H - AXIS_BOTTOM)
        ctx.stroke()
      }

      ctx.save()
      ctx.translate(camOffsetX, camOffsetY)
      ctx.beginPath()
      for (let x = 0; x <= elapsed * 60; x++) {
        const px = x * CURVE_X_STEP
        const py = -Math.log(Math.exp((x / 60) * CURVE_EXPONENT)) * LOG_SCALE
        if (x === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      const curveColor = crashedRef.current ? '#FF4444' : '#FFD700'
      ctx.shadowBlur = 14
      ctx.shadowColor = curveColor
      ctx.strokeStyle = curveColor
      ctx.lineWidth = 4
      ctx.stroke()
      ctx.shadowBlur = 0
      ctx.restore()

      const flyAway = flyAwayRef.current
      const flyElapsed = flyAway ? now - flyAway.startTime : 0
      const flyDone = flyElapsed > FLY_DURATION
      const isFlying = flyAway !== null && !flyDone

      const showMonkey =
        rocketImageRef.current !== null &&
        (isFlying || (!crashedRef.current && (bettingRef.current || tipX > 0)))

      if (showMonkey && rocketImageRef.current) {
        const multiplier = (currentPointRef.current ?? 100) / 100
        const size = Math.min(240 + (multiplier - 1) * 15, 420)

        let drawX: number
        let drawY: number
        let rotation = 0

        if (!crashedRef.current || !flyAway) {
          const bob = Math.sin(now * 0.007) * 7
          const wobble = Math.sin(now * 0.013) * 0.04
          crashedTipRef.current = { x: monkeyScreenX, y: monkeyScreenY + bob }
          drawX = monkeyScreenX
          drawY = monkeyScreenY + bob
          rotation = wobble
        } else {
          const t = Math.min(flyElapsed / FLY_DURATION, 1)
          const eased = t * t
          const flyDist = eased * 700
          const flyAngle = -Math.PI / 3
          drawX = flyAway.x + Math.cos(flyAngle) * flyDist
          drawY = flyAway.y + Math.sin(flyAngle) * flyDist
          rotation = t * Math.PI * 6
        }

        ctx.save()
        ctx.translate(drawX, drawY)
        ctx.rotate(rotation)
        ctx.drawImage(rocketImageRef.current, -size / 2, -size / 2, size, size)
        ctx.restore()
      }

      ctx.restore()
      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="relative w-full h-full bg-background border border-golden rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {status === RoundStatus.BETTING && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-primary">
            <Clock size={36} strokeWidth={2} />
            <span className="text-5xl font-bold font-black-ops-one-regular">
              {Math.ceil(timeLeft / 1000)}s
            </span>
          </div>
        </div>
      )}

      {status === RoundStatus.ENDED && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span
            ref={multiplierRef}
            className="text-5xl font-bold text-red-400"
          />
          <span className="text-xl font-bold text-red-400">CRASH!</span>
        </div>
      )}

      {(status === RoundStatus.PLAYING ||
        status === RoundStatus.STARTING ||
        !status) && (
        <span
          ref={multiplierRef}
          className="absolute inset-0 flex items-center justify-center text-4xl font-bold font-black-ops-one-regular text-primary"
        >
          1.00x
        </span>
      )}
    </div>
  )
}
