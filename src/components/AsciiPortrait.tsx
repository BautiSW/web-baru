import { useEffect, useRef } from 'react'

/**
 * Retrato en ASCII: la foto se arma con caracteres que se prenden y se apagan,
 * y cada tanto se disuelve en la foto real y vuelve. Con el mouse encima, se ve la foto
 * a través de una "lente" y los caracteres de alrededor se desordenan.
 */
const SRC = '/foto-contacto-v2.webp'
const RAMP = ' .:-=+*%#@'
const COLS = 64
const CREAM = [242, 237, 228]
const WARM = [226, 148, 92]

export function AsciiPortrait({ className = '' }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = wrap.current!
    const canvas = cv.current!
    const ctx = canvas.getContext('2d')!
    let alive = true
    let raf = 0
    let visible = true
    const img = new Image()
    img.src = SRC
    let W = 0
    let H = 0
    let rows = 0
    let cw = 0
    let ch = 0
    let dens = new Float32Array(0) // 0..1 cuánto "pesa" cada celda (oscuro = más)
    let lum = new Float32Array(0)
    let seed = new Float32Array(0)
    let flick = new Float32Array(0) // brillo actual de cada celda (titileo)
    let glyph = new Uint8Array(0)
    let atlas: HTMLCanvasElement | null = null
    const mouse = { x: -1e4, y: -1e4, in: false }
    const t0 = performance.now()
    let ready = false

    const build = () => {
      const r = el.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = Math.round(r.width * dpr)
      H = Math.round(r.height * dpr)
      canvas.width = W
      canvas.height = H
      if (!img.naturalWidth) return
      cw = W / COLS
      rows = Math.round(H / cw)
      ch = H / rows
      // Muestrear la foto en la grilla
      const s = document.createElement('canvas')
      s.width = COLS
      s.height = rows
      const sx = s.getContext('2d', { willReadFrequently: true })!
      sx.drawImage(img, 0, 0, COLS, rows)
      const px = sx.getImageData(0, 0, COLS, rows).data
      const n = COLS * rows
      dens = new Float32Array(n)
      lum = new Float32Array(n)
      seed = new Float32Array(n)
      flick = new Float32Array(n)
      glyph = new Uint8Array(n)
      for (let i = 0; i < n; i++) {
        const L = px[i * 4] / 255
        lum[i] = L
        // Fondo blanco = vacío; pelo y buzo = denso; cara = trazo fino
        let d = 1 - L
        d = d < 0.06 ? 0 : Math.min(1, Math.pow(d, 0.8) * 1.15)
        dens[i] = d
        seed[i] = Math.random()
        flick[i] = 1
        glyph[i] = Math.max(1, Math.min(RAMP.length - 1, Math.round(d * (RAMP.length - 1))))
      }
      // Atlas de caracteres (se dibujan una vez y después se copian: mucho más rápido)
      atlas = document.createElement('canvas')
      atlas.width = Math.ceil(cw * RAMP.length)
      atlas.height = Math.ceil(ch)
      const ax = atlas.getContext('2d')!
      ax.fillStyle = '#fff'
      ax.font = `600 ${Math.round(ch * 0.95)}px ui-monospace, "JetBrains Mono", Menlo, monospace`
      ax.textAlign = 'center'
      ax.textBaseline = 'middle'
      for (let g = 0; g < RAMP.length; g++) ax.fillText(RAMP[g], g * cw + cw / 2, ch / 2 + ch * 0.04)
      ready = true
    }

    // Tinte de los caracteres: el atlas es blanco; se pinta con "source-in" en un buffer
    let tinted: HTMLCanvasElement | null = null
    let tintedWarm: HTMLCanvasElement | null = null
    const tint = (rgb: number[]) => {
      const c = document.createElement('canvas')
      c.width = atlas!.width
      c.height = atlas!.height
      const x = c.getContext('2d')!
      x.drawImage(atlas!, 0, 0)
      x.globalCompositeOperation = 'source-in'
      x.fillStyle = `rgb(${rgb.join(',')})`
      x.fillRect(0, 0, c.width, c.height)
      return c
    }

    /** Mezcla foto/ASCII en el tiempo: ciclo de 9 s (ASCII 5,5 s → foto 2,5 s → vuelve). */
    const phase = (t: number) => {
      const T = 9
      const k = t % T
      if (k < 5.2) return 0
      if (k < 6.2) return (k - 5.2) / 1.0
      if (k < 8) return 1
      return 1 - (k - 8) / 1.0
    }

    const draw = (now: number) => {
      raf = 0
      if (!alive || !visible || !ready || !atlas) return
      if (!tinted) {
        tinted = tint(CREAM)
        tintedWarm = tint(WARM)
      }
      const t = (now - t0) / 1000
      ctx.clearRect(0, 0, W, H)
      const P = phase(t)
      const R = Math.min(W, H) * 0.24
      // Celdas
      for (let y = 0, i = 0; y < rows; y++) {
        for (let x = 0; x < COLS; x++, i++) {
          const d = dens[i]
          const cx = x * cw
          const cy = y * ch
          // Encendido inicial: de a poco, en orden aleatorio
          const on = Math.min(1, Math.max(0, (t - seed[i] * 1.4) / 0.25))
          // Mezcla hacia la foto: barrido diagonal con ruido, para que se "disuelva"
          const order = (x / COLS) * 0.35 + (y / rows) * 0.45 + seed[i] * 0.2
          let m = Math.min(1, Math.max(0, (P * 1.6 - order) / 0.6))
          // Lente del mouse: muestra la foto alrededor del cursor
          let scramble = 0
          if (mouse.in) {
            const dx = cx + cw / 2 - mouse.x
            const dy = cy + ch / 2 - mouse.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < R) m = Math.max(m, Math.min(1, ((R - dist) / R) * 2.2))
            else if (dist < R * 1.6) scramble = 1 - (dist - R) / (R * 0.6)
          }
          if (m > 0.001) {
            ctx.globalAlpha = m * on
            const sw = img.naturalWidth / COLS
            const sh = img.naturalHeight / rows
            ctx.drawImage(img, x * sw, y * sh, sw, sh, cx, cy, cw + 0.5, ch + 0.5)
          }
          if (d <= 0 || m >= 0.999) continue
          // Titileo: algunas celdas se apagan un instante y vuelven
          if (Math.random() < 0.004) flick[i] = 0.1
          flick[i] += (1 - flick[i]) * 0.08
          let gi = glyph[i]
          if (scramble > 0 && Math.random() < scramble * 0.5) gi = 1 + Math.floor(Math.random() * (RAMP.length - 1))
          else if (Math.random() < 0.0015) glyph[i] = Math.max(1, Math.min(RAMP.length - 1, gi + (Math.random() < 0.5 ? -1 : 1)))
          const a = (0.35 + 0.65 * d) * flick[i] * on * (1 - m)
          if (a < 0.02) continue
          ctx.globalAlpha = a
          const src = seed[i] > 0.985 ? tintedWarm! : tinted
          ctx.drawImage(src, gi * cw, 0, cw, ch, cx, cy, cw, ch)
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    const kick = () => {
      if (!raf && alive && visible && ready) raf = requestAnimationFrame(draw)
    }

    img.onload = () => {
      build()
      kick()
    }
    const ro = new ResizeObserver(() => {
      build()
      tinted = null
      kick()
    })
    ro.observe(el)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      kick()
    })
    io.observe(el)
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const s = W / r.width
      mouse.x = (e.clientX - r.left) * s
      mouse.y = (e.clientY - r.top) * s
      mouse.in = true
    }
    const leave = () => {
      mouse.in = false
    }
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerdown', move)
    canvas.addEventListener('pointerleave', leave)
    canvas.addEventListener('pointerup', (e) => e.pointerType !== 'mouse' && leave())
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return (
    <div ref={wrap} className={`relative aspect-[620/660] ${className}`}>
      <canvas ref={cv} className="absolute inset-0 h-full w-full touch-none" aria-label="Retrato de Bautista Suárez" role="img" />
    </div>
  )
}
