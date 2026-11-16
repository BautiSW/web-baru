import { useEffect, useRef } from 'react'

/**
 * "Code rain": la notebook del taller dibujada con 0 y 1 verdes que titilan,
 * con lluvia de código, scanlines, viñeta, brillo, grano y algún glitch.
 */
const SRC = '/work-laptop-v2.webp'
const CELL = 8 // px CSS por celda
const GREEN = [0, 255, 102]

export function CodeRain({ className = '' }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = wrap.current!
    const canvas = cv.current!
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    img.src = SRC
    let alive = true
    let visible = true
    let raf = 0
    let W = 0
    let H = 0
    let dpr = 1
    let cols = 0
    let rows = 0
    let lum = new Float32Array(0)
    let bit = new Uint8Array(0)
    let flick = new Float32Array(0)
    let heads = new Float32Array(0)
    let speeds = new Float32Array(0)
    let glyphs: HTMLCanvasElement | null = null
    let grain: HTMLCanvasElement | null = null
    let glow: HTMLCanvasElement | null = null
    let last = 0
    const t0 = performance.now()

    const build = () => {
      const r = el.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = Math.round(r.width * dpr)
      H = Math.round(r.height * dpr)
      canvas.width = W
      canvas.height = H
      if (!img.naturalWidth) return
      const cell = CELL * dpr
      cols = Math.floor(W / cell)
      rows = Math.floor(H / cell)
      // Muestreo de luminancia por celda + realce de bordes
      const s = document.createElement('canvas')
      s.width = cols
      s.height = rows
      const sx = s.getContext('2d', { willReadFrequently: true })!
      sx.drawImage(img, 0, 0, cols, rows)
      const px = sx.getImageData(0, 0, cols, rows).data
      const n = cols * rows
      const raw = new Float32Array(n)
      for (let i = 0; i < n; i++) raw[i] = px[i * 4] / 255
      lum = new Float32Array(n)
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x
          const gx = (raw[i + (x < cols - 1 ? 1 : 0)] - raw[i - (x > 0 ? 1 : 0)]) / 2
          const gy = (raw[i + (y < rows - 1 ? cols : 0)] - raw[i - (y > 0 ? cols : 0)]) / 2
          const edge = Math.min(1, Math.sqrt(gx * gx + gy * gy) * 2.5)
          let v = (raw[i] - 0.5) * 1.15 + 0.5 // contraste 115
          v = v + edge * 0.4 // realce de bordes 40
          lum[i] = Math.max(0, Math.min(1, v))
        }
      bit = new Uint8Array(n)
      flick = new Float32Array(n)
      for (let i = 0; i < n; i++) {
        bit[i] = Math.random() < 0.5 ? 0 : 1
        flick[i] = 1
      }
      heads = new Float32Array(cols)
      speeds = new Float32Array(cols)
      for (let x = 0; x < cols; x++) {
        heads[x] = Math.random() * rows * 2 - rows
        speeds[x] = 6 + Math.random() * 14 // celdas por segundo
      }
      // Glifos 0 y 1 en verde (una vez)
      glyphs = document.createElement('canvas')
      glyphs.width = Math.ceil(cell * 2)
      glyphs.height = Math.ceil(cell)
      const gctx = glyphs.getContext('2d')!
      gctx.fillStyle = `rgb(${GREEN.join(',')})`
      gctx.font = `700 ${Math.round(cell * 0.92)}px ui-monospace, Menlo, monospace`
      gctx.textAlign = 'center'
      gctx.textBaseline = 'middle'
      gctx.fillText('0', cell / 2, cell / 2 + cell * 0.05)
      gctx.fillText('1', cell * 1.5, cell / 2 + cell * 0.05)
      // Grano (textura de ruido que se desplaza)
      grain = document.createElement('canvas')
      grain.width = 256
      grain.height = 256
      const nctx = grain.getContext('2d')!
      const id = nctx.createImageData(256, 256)
      for (let i = 0; i < id.data.length; i += 4) {
        const g = Math.random() * 255
        id.data[i] = id.data[i + 1] = id.data[i + 2] = g
        id.data[i + 3] = 255
      }
      nctx.putImageData(id, 0, 0)
      glow = document.createElement('canvas')
      glow.width = Math.max(1, Math.round(W / 4))
      glow.height = Math.max(1, Math.round(H / 4))
    }

    const draw = (now: number) => {
      raf = 0
      if (!alive || !visible) return
      raf = requestAnimationFrame(draw)
      // ~30 cuadros por segundo alcanza para este look y cuida la batería
      if (now - last < 32) return
      const dt = Math.min(0.1, (now - (last || now)) / 1000)
      last = now
      if (!glyphs || !cols) return
      const t = (now - t0) / 1000
      const cell = CELL * dpr
      const intro = Math.min(1, t / 1.6)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.fillStyle = '#020403'
      ctx.fillRect(0, 0, W, H)

      for (let x = 0; x < cols; x++) {
        heads[x] += speeds[x] * dt
        if (heads[x] > rows + 12) {
          heads[x] = -Math.random() * rows
          speeds[x] = 6 + Math.random() * 14
        }
      }
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x
          // Titileo: cambian 0/1 y se apagan por instantes
          if (Math.random() < 0.035) bit[i] ^= 1
          if (Math.random() < 0.006) flick[i] = 0.15
          flick[i] += (1 - flick[i]) * 0.12
          const d = heads[x] - y
          const rain = d >= 0 && d < 10 ? (1 - d / 10) * (d < 1 ? 1 : 0.55) : 0
          const L = lum[i]
          let a = Math.min(1, Math.pow(L, 2.3) * 1.25) * flick[i] + rain * (0.18 + 0.5 * L)
          a *= intro > (x / cols) * 0.5 + (Math.sin(i) * 0.5 + 0.5) * 0.5 ? 1 : 0
          if (a < 0.04) continue
          ctx.globalAlpha = Math.min(1, a)
          ctx.drawImage(glyphs, bit[i] * cell, 0, cell, cell, x * cell, y * cell, cell, cell)
        }
      }
      ctx.globalAlpha = 1
      // Brillo (bloom): copia chica, borrosa, sumada
      if (glow) {
        const g = glow.getContext('2d')!
        g.clearRect(0, 0, glow.width, glow.height)
        g.filter = 'blur(3px)'
        g.drawImage(canvas, 0, 0, glow.width, glow.height)
        g.filter = 'none'
        ctx.globalCompositeOperation = 'lighter'
        ctx.globalAlpha = 0.35
        ctx.drawImage(glow, 0, 0, W, H)
      }
      // Tinte verde (overlay)
      ctx.globalCompositeOperation = 'overlay'
      ctx.globalAlpha = 0.45
      ctx.fillStyle = '#00ff66'
      ctx.fillRect(0, 0, W, H)
      // Scanlines
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 0.28
      ctx.fillStyle = '#000'
      for (let y = 0; y < H; y += 3 * dpr) ctx.fillRect(0, y, W, dpr)
      // Grano
      if (grain) {
        ctx.globalCompositeOperation = 'overlay'
        ctx.globalAlpha = 0.16
        const ox = Math.random() * 256
        const oy = Math.random() * 256
        for (let y = -oy; y < H; y += 256) for (let x = -ox; x < W; x += 256) ctx.drawImage(grain, x, y)
      }
      // Glitch: de vez en cuando, una franja se corre unos píxeles
      if (Math.random() < 0.06) {
        const gy = Math.random() * H
        const gh = (4 + Math.random() * 18) * dpr
        const off = (Math.random() - 0.5) * 24 * dpr
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 1
        ctx.drawImage(canvas, 0, gy, W, gh, off, gy, W, gh)
      }
      // Viñeta
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.72)
      vg.addColorStop(0, 'rgba(0,0,0,0)')
      vg.addColorStop(1, 'rgba(0,0,0,0.62)')
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, W, H)
    }
    const kick = () => {
      if (!raf && alive && visible) raf = requestAnimationFrame(draw)
    }
    img.onload = () => {
      build()
      kick()
    }
    const ro = new ResizeObserver(() => {
      build()
      kick()
    })
    ro.observe(el)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      kick()
    })
    io.observe(el)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return (
    <div ref={wrap} className={`relative aspect-[460/320] overflow-hidden rounded-2xl border border-white/10 ${className}`}>
      <canvas ref={cv} className="absolute inset-0 h-full w-full" aria-hidden="true" />
    </div>
  )
}
