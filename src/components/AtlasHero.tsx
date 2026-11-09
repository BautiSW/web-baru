import { useEffect, useRef } from 'react'

/**
 * Fondo de Under the hood: Atlas sosteniendo la esfera, dibujado con puntos en un canvas.
 * Los puntos aparecen de a poco, titilan, la esfera "gira" con una banda de luz y
 * se apartan del mouse. Se pausa fuera de pantalla.
 */
interface Atlas {
  w: number
  h: number
  p: number[] // x, y, brillo (0-99), esEsfera
}

let atlasData: Promise<Atlas> | null = null
export const loadAtlas = () => (atlasData ??= fetch('/hero-atlas.json').then((r) => r.json()))

const CREAM = '242,237,228'

export function AtlasHero() {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = wrap.current!
    const cv = canvas.current!
    const ctx = cv.getContext('2d')!
    let raf = 0
    let alive = true
    let visible = true
    let data: Atlas | null = null
    let W = 0
    let H = 0
    let dpr = 1
    let k = 1
    let ox = 0
    let oy = 0
    let figAlpha = 1
    const mouse = { x: -9999, y: -9999 }
    let seeds: Float32Array = new Float32Array(0)
    let stars: Float32Array = new Float32Array(0)
    const t0 = performance.now()

    const layout = () => {
      const r = el.getBoundingClientRect()
      W = r.width
      H = r.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      cv.width = Math.round(W * dpr)
      cv.height = Math.round(H * dpr)
      cv.style.width = `${W}px`
      cv.style.height = `${H}px`
      if (data) {
        const small = W < 1024
        const figH = H * (small ? 0.72 : 0.84)
        k = figH / data.h
        const figW = data.w * k
        ox = small ? (W - figW) / 2 : Math.max(24, W * 0.27 - figW / 2)
        oy = small ? H * 0.08 : (H - figH) / 2 + H * 0.045
        figAlpha = small ? 0.42 : 1
      }
      const n = Math.round((W * H) / 9000)
      stars = new Float32Array(n * 4)
      for (let i = 0; i < n; i++) {
        stars[i * 4] = Math.random() * W
        stars[i * 4 + 1] = Math.random() * H
        stars[i * 4 + 2] = 0.6 + Math.random() * 1.1
        stars[i * 4 + 3] = Math.random() * Math.PI * 2
      }
    }

    const draw = (now: number) => {
      raf = 0
      if (!alive || !visible) return
      const t = (now - t0) / 1000
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = `rgb(${CREAM})`

      // Estrellas
      const starIn = Math.min(1, t / 1.5)
      for (let i = 0; i < stars.length; i += 4) {
        const a = (0.2 + 0.45 * (0.5 + 0.5 * Math.sin(t * 0.9 + stars[i + 3]))) * starIn
        ctx.globalAlpha = a
        const s = stars[i + 2]
        ctx.fillRect(stars[i], stars[i + 1], s, s)
      }

      if (data) {
        const p = data.p
        const size = Math.max(1.2, k * 0.72)
        const R = 120
        for (let i = 0, j = 0; i < p.length; i += 4, j++) {
          const delay = seeds[j * 2]
          const intro = Math.min(1, Math.max(0, (t - 0.3 - delay) / 0.5))
          if (intro <= 0) continue
          let x = ox + p[i] * k
          let y = oy + p[i + 1] * k
          let a = Math.min(1, (p[i + 2] / 99) * 1.25) * (0.82 + 0.18 * Math.sin(t * 1.6 + seeds[j * 2 + 1]))
          if (p[i + 3]) {
            // Banda de luz que recorre la esfera, como si girara
            a *= 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(p[i] * 0.075 - t * 1.1))
          }
          const dx = x - mouse.x
          const dy = y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1
            const f = (1 - d / R) ** 2
            x += (dx / d) * f * 14
            y += (dy / d) * f * 14
            a = Math.min(1, a + f * 0.6)
          }
          ctx.globalAlpha = a * intro * figAlpha
          ctx.fillRect(x, y, size, size)
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    const kick = () => {
      if (!raf && alive && visible) raf = requestAnimationFrame(draw)
    }

    loadAtlas().then((d) => {
      if (!alive) return
      data = d
      const n = d.p.length / 4
      seeds = new Float32Array(n * 2)
      for (let j = 0; j < n; j++) {
        // Aparecen de abajo hacia arriba, con algo de azar
        seeds[j * 2] = (1 - d.p[j * 4 + 1] / d.h) * 1.1 + Math.random() * 0.6
        seeds[j * 2 + 1] = Math.random() * Math.PI * 2
      }
      layout()
    })

    layout()
    kick()
    const ro = new ResizeObserver(layout)
    ro.observe(el)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      kick()
    })
    io.observe(el)
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const onLeave = () => {
      mouse.x = mouse.y = -9999
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={wrap} className="pointer-events-none absolute inset-x-0 top-0 h-screen overflow-hidden bg-black">
      <canvas ref={canvas} className="absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-ink" />
      <div className="absolute left-4 top-20 size-8 border-l border-t border-white/25 sm:left-6 sm:size-12" />
      <div className="absolute right-4 top-20 size-8 border-r border-t border-white/25 sm:right-6 sm:size-12" />
      <div className="absolute bottom-[12vh] left-4 size-8 border-b border-l border-white/25 sm:left-6 sm:size-12" />
      <div className="absolute bottom-[12vh] right-4 size-8 border-b border-r border-white/25 sm:right-6 sm:size-12" />
    </div>
  )
}
