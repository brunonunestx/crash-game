import React, { useEffect, useRef } from 'react'

type Particle = {
  angle: number
  speed: number
  size: number
  color: string
}

type Explosion = {
  startTime: number
  particles: Particle[]
}

type GraphProps = {
  multiplierRef: React.RefObject<HTMLSpanElement | null>
  roundId: number
  betting: boolean
  playing: boolean
  crashed: boolean
  rocketSrc?: string
}

const EXPLOSION_COLORS = ['#FF4444', '#FF8C00', '#FFD700', '#FF6B35', '#FFF']
const EXPLOSION_DURATION = 1200
const CURVE_EXPONENT = 0.22
const CURVE_X_STEP = 3

function generateParticles(): Particle[] {
  return Array.from({ length: 28 }, () => ({
    angle: Math.random() * Math.PI * 2,
    speed: 0.3 + Math.random() * 0.7,
    size: 3 + Math.random() * 6,
    color:
      EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)],
  }))
}

export function Graph({
  multiplierRef,
  roundId,
  betting,
  playing,
  crashed,
  rocketSrc,
}: GraphProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const rocketImageRef = useRef<HTMLImageElement | null>(null)
  const explosionRef = useRef<Explosion | null>(null)
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
      explosionRef.current = null
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
    if (crashed) {
      explosionRef.current = {
        startTime: performance.now(),
        particles: generateParticles(),
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

      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      const elapsed =
        startTimeRef.current !== null ? (now - startTimeRef.current) / 1000 : 0

      const tipX = Math.floor(elapsed * 60)
      const tipWorldX = tipX * CURVE_X_STEP
      const tipWorldY = H - Math.exp((tipX / 60) * CURVE_EXPONENT) * 20

      const leftMargin = 60
      const camTargetX = Math.min(tipWorldX + leftMargin, W * 0.65)
      const camTargetY = H * 0.65
      const camOffsetX = camTargetX - tipWorldX
      const camOffsetY = camTargetY - tipWorldY

      ctx.save()
      ctx.translate(camOffsetX, camOffsetY)
      ctx.beginPath()
      for (let x = 0; x <= elapsed * 60; x++) {
        const t = x / 60
        const px = x * CURVE_X_STEP
        const py = H - Math.exp(t * CURVE_EXPONENT) * 20
        if (x === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.strokeStyle = crashedRef.current ? '#FF4444' : '#FFD700'
      ctx.lineWidth = 4
      ctx.stroke()
      ctx.restore()

      const showMonkey = !crashedRef.current && rocketImageRef.current &&
        (bettingRef.current || tipX > 0)

      if (showMonkey && rocketImageRef.current) {
        const size = 240
        crashedTipRef.current = { x: camTargetX, y: camTargetY }
        ctx.drawImage(rocketImageRef.current, camTargetX - size / 2, camTargetY - size / 2, size, size)
      }

      const explosion = explosionRef.current
      if (crashedRef.current && explosion) {
        const progress = Math.min(
          (now - explosion.startTime) / EXPLOSION_DURATION,
          1,
        )
        const eased = 1 - Math.pow(1 - progress, 2) // ease-out
        const origin = crashedTipRef.current ?? { x: camTargetX, y: camTargetY }

        const ringRadius = eased * 80
        const ringAlpha = 1 - progress
        ctx.beginPath()
        ctx.arc(origin.x, origin.y, ringRadius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255, 100, 50, ${ringAlpha})`
        ctx.lineWidth = 3
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(origin.x, origin.y, ringRadius * 0.6, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255, 200, 50, ${ringAlpha * 0.6})`
        ctx.lineWidth = 2
        ctx.stroke()

        for (const p of explosion.particles) {
          const dist = eased * p.speed * 120
          const px = origin.x + Math.cos(p.angle) * dist
          const py = origin.y + Math.sin(p.angle) * dist
          const alpha = 1 - progress

          ctx.beginPath()
          ctx.arc(px, py, p.size * (1 - progress * 0.5), 0, Math.PI * 2)
          ctx.fillStyle = p.color
            .replace(')', `, ${alpha})`)
            .replace('rgb', 'rgba')
            .replace('#', 'rgba(')
            .replace('rgba(FF', 'rgba(255,')

          const hex = p.color.replace('#', '')
          const r = parseInt(hex.substring(0, 2), 16)
          const g = parseInt(hex.substring(2, 4), 16)
          const b = parseInt(hex.substring(4, 6), 16)
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
          ctx.fill()
        }
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
    <div className="ml-auto mr-auto relative w-[50%] h-64 bg-background-variant rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <span
        ref={multiplierRef}
        className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-golden"
      >
        1.00x
      </span>
    </div>
  )
}
