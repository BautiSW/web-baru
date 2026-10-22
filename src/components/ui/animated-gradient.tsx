// AnimatedGradient — canvas 2D "Ribbon Field" background, two variants (A/B)
// that intercalate through the page per PROMPT_WEB_BARU.md. Diagonal hard-edge
// color bands drawn as a linear gradient whose angle gently balances and whose
// stop positions bow with a slow sine wave, plus a tiled grain overlay and an
// optional vignette. Pauses off-screen (IntersectionObserver), respects
// prefers-reduced-motion, and caps devicePixelRatio at 2.

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ColorStop {
  color: string
  pos: number // 0-100
}

interface GradientSpec {
  stops: ColorStop[]
  angle: number
  backdrop: string
  grain: number // 0-100
  vignette: number // 0-100
  speed: number // 0-100+
  motionAmount: number // 0-100
  wave: number // 0-100
  clock0: number
}

const SPECS: Record<'a' | 'b', GradientSpec> = {
  a: {
    stops: [
      { color: '#1D62D7', pos: 0.91 },
      { color: '#1D62D7', pos: 42.59 },
      { color: '#C3CFEA', pos: 43.89 },
      { color: '#C3CFEA', pos: 48.11 },
      { color: '#3CC1F6', pos: 48.89 },
      { color: '#3CC1F6', pos: 56.11 },
      { color: '#1839A7', pos: 58.19 },
      { color: '#1839A7', pos: 79.81 },
      { color: '#1E788A', pos: 81.5 },
      { color: '#1E788A', pos: 100 },
    ],
    angle: 135,
    backdrop: '#3B82F6',
    grain: 100,
    vignette: 40,
    speed: 40,
    motionAmount: 50,
    wave: 12,
    clock0: 0,
  },
  b: {
    stops: [
      { color: '#FFFFFF', pos: 4.32 },
      { color: '#FFFFFF', pos: 33.18 },
      { color: '#78B8F9', pos: 37.86 },
      { color: '#78B8F9', pos: 58.14 },
      { color: '#5667FF', pos: 58.86 },
      { color: '#5667FF', pos: 79.64 },
      { color: '#4D2FF9', pos: 80 },
      { color: '#4D2FF9', pos: 100 },
    ],
    angle: 38,
    backdrop: '#0B1220',
    grain: 42,
    vignette: 0,
    speed: 100,
    motionAmount: 0,
    wave: 14,
    clock0: 20.75,
  },
}

export interface AnimatedGradientProps {
  variant: 'a' | 'b'
  className?: string
}

export function AnimatedGradient({ variant, className }: AnimatedGradientProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const rootRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const spec = SPECS[variant]
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let visible = true
    const start = performance.now()

    let grainTile: HTMLCanvasElement | null = null
    const buildGrain = () => {
      const tile = document.createElement('canvas')
      tile.width = 120
      tile.height = 120
      const g = tile.getContext('2d')
      if (g) {
        const id = g.createImageData(120, 120)
        for (let i = 0; i < id.data.length; i += 4) {
          const v = Math.random() * 255
          id.data[i] = id.data[i + 1] = id.data[i + 2] = v
          id.data[i + 3] = Math.random() < 0.5 ? 0 : 255
        }
        g.putImageData(id, 0, 0)
      }
      grainTile = tile
    }

    const resize = () => {
      const rect = root.getBoundingClientRect()
      w = Math.max(1, Math.round(rect.width))
      h = Math.max(1, Math.round(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
    }

    const draw = (now: number) => {
      const t = reduced ? 0 : (now - start) / 1000
      const ph = (t * spec.speed) / 100
      const amt = spec.motionAmount / 100
      // sin(x) - sin(0) = 0 at ph = 0, so the angle never jumps on mount.
      const angle = spec.angle + (Math.sin(ph * 0.6) - Math.sin(0)) * 28 * amt
      const clock = spec.clock0 + ph * 1.2

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const rad = (angle * Math.PI) / 180
      const cx = w * 0.5
      const cy = h * 0.5
      const len = Math.max(w, h) * 0.75
      const dx = Math.cos(rad) * len
      const dy = Math.sin(rad) * len

      const gradient = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy)
      for (const stop of spec.stops) {
        const cross = stop.pos / 100
        const offset = (spec.wave / 100) * 0.35 * Math.sin(cross * 2.4 * Math.PI * 2 + clock)
        const pos = Math.min(1, Math.max(0, stop.pos / 100 + offset))
        gradient.addColorStop(pos, stop.color)
      }

      ctx.fillStyle = spec.backdrop
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)

      if (spec.vignette > 0) {
        const vg = ctx.createRadialGradient(cx, cy, Math.min(w, h) * 0.1, cx, cy, Math.max(w, h) * 0.75)
        vg.addColorStop(0, 'rgba(0,0,0,0)')
        vg.addColorStop(1, `rgba(0,0,0,${spec.vignette / 100})`)
        ctx.fillStyle = vg
        ctx.fillRect(0, 0, w, h)
      }

      if (spec.grain > 0 && grainTile) {
        ctx.globalAlpha = (spec.grain / 100) * 0.5
        ctx.globalCompositeOperation = 'overlay'
        const pattern = ctx.createPattern(grainTile, 'repeat')
        if (pattern) {
          ctx.fillStyle = pattern
          ctx.fillRect(0, 0, w, h)
        }
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = 'source-over'
      }
    }

    const loop = (now: number) => {
      raf = 0
      if (!visible) return
      draw(now)
      if (!reduced) raf = requestAnimationFrame(loop)
    }

    buildGrain()
    resize()
    draw(performance.now())
    if (!reduced) raf = requestAnimationFrame(loop)

    const ro = new ResizeObserver(() => {
      resize()
      draw(performance.now())
    })
    ro.observe(root)

    const io = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true
      if (visible && !raf && !reduced) raf = requestAnimationFrame(loop)
    })
    io.observe(root)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [variant])

  const spec = SPECS[variant]

  return (
    <div
      ref={rootRef}
      className={cn('absolute inset-0 overflow-hidden', className)}
      style={{ backgroundColor: spec.backdrop }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
    </div>
  )
}
