import React, { useEffect, useRef } from 'react'

import { RoundStatus } from '@crash-game/types'

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

// Log scale: 1x at 88% down, 32x at 8% down
const CHART_BOTTOM_PCT = 0.88
const CHART_TOP_PCT = 0.08
const LOG_REF = Math.log(32)

function curveScreenY(t: number, H: number): number {
  const M = Math.exp(t * CURVE_EXPONENT)
  const logM = Math.log(Math.max(M, 1))
  return H * CHART_BOTTOM_PCT - (logM / LOG_REF) * H * (CHART_BOTTOM_PCT - CHART_TOP_PCT)
}

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

    // pct values derived from log scale: pct = BOTTOM - (log(M)/log(32)) * (BOTTOM - TOP)
    const Y_LABELS = [
      { label: '32x', pct: 0.08 },
      { label: '16x', pct: 0.24 },
      { label: '8x', pct: 0.40 },
      { label: '4x', pct: 0.56 },
      { label: '2x', pct: 0.72 },
      { label: '1x', pct: 0.88 },
    ]

    const X_LABELS = ['10s', '20s', '30s', '40s']

    function draw(now: number) {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1
      const W = canvas.width / dpr
      const H = canvas.height / dpr

      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      const AXIS_LEFT = 36
      const AXIS_BOTTOM = 24

      ctx.font = '11px monospace'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      for (const { label, pct } of Y_LABELS) {
        const y = pct * H
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(AXIS_LEFT, y)
        ctx.lineTo(W, y)
        ctx.stroke()
        ctx.fillStyle = 'rgba(255,255,255,0.35)'
        ctx.fillText(label, AXIS_LEFT - 4, y)
      }

      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      const xSlots = X_LABELS.length + 1
      for (let i = 0; i < X_LABELS.length; i++) {
        const x = AXIS_LEFT + ((i + 1) / xSlots) * (W - AXIS_LEFT)
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, H - AXIS_BOTTOM)
        ctx.stroke()
        ctx.fillStyle = 'rgba(255,255,255,0.35)'
        ctx.fillText(X_LABELS[i], x, H - 4)
      }

      const elapsed =
        startTimeRef.current !== null
          ? (now - startTimeRef.current) / 1000
          : lastElapsedRef.current

      if (startTimeRef.current !== null) {
        lastElapsedRef.current = elapsed
      }

      const tipX = Math.floor(elapsed * 60)
      const tipWorldX = tipX * CURVE_X_STEP
      // Y is computed in screen space via log scale — no Y camera offset needed
      const tipScreenY = curveScreenY(tipX / 60, H)

      const leftMargin = 60
      const camTargetX = Math.min(tipWorldX + leftMargin, W * 0.65)
      const camOffsetX = camTargetX - tipWorldX

      ctx.save()
      ctx.translate(camOffsetX, 0)
      ctx.beginPath()
      for (let x = 0; x <= elapsed * 60; x++) {
        const px = x * CURVE_X_STEP
        const py = curveScreenY(x / 60, H)
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
          crashedTipRef.current = { x: camTargetX, y: tipScreenY }
          drawX = camTargetX
          drawY = tipScreenY
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
    <div className="relative w-full h-full bg-background rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {status === RoundStatus.BETTING && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-primary animate-pulse">
            Apostas abertas
          </span>
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
