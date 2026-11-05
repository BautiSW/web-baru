import { useEffect, useRef } from 'react'
import { animate, useMotionValue } from 'motion/react'
import { SCENE_H, SCENE_W } from '@/data/hotspots'

/**
 * Capó del Volvo abriéndose, dibujado en un <canvas> propio encima de la escena.
 * Va en una capa separada para que el navegador no tenga que redibujar todo el SVG
 * (con sus filtros) en cada cuadro: así la animación corre fluida.
 *
 * Los cuadros salen de un video, recortados a lo que se mueve y guardados en una
 * sola imagen (sprite sheet). Entre cuadro y cuadro se mezclan para que no salte.
 */
const SHEET = {
  src: '/scene/capo-anim-v2.webp',
  frames: 29,
  cols: 7,
  cw: 812,
  ch: 592,
  // posición en coordenadas de la escena (1677 x 938)
  x: 116.28,
  y: 90.19,
  w: 664.9,
  h: 485.4,
}

const OPEN = { duration: 1.1, ease: [0.3, 0, 0.2, 1] as const }
const CLOSE = { duration: 0.55, ease: [0.4, 0, 0.2, 1] as const }
/** Primer tramo de la apertura: el capó del video entra de a poco sobre el de la foto. */
const FADE_IN = 0.14

export function HoodAnimation({ open }: { open: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const sheet = useRef<HTMLImageElement | null>(null)
  const progress = useMotionValue(0)

  // Cargar la imagen una sola vez. decode() la prepara fuera del hilo principal,
  // así no traba la página; después cada cuadro se dibuja directo desde la hoja.
  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.decoding = 'async'
    img.src = SHEET.src
    img
      .decode()
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return
        sheet.current = img
        draw(progress.get())
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Ubicar el canvas igual que la escena (SVG con "meet": entra entera y centrada)
  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const place = () => {
      const W = wrap.clientWidth
      const H = wrap.clientHeight
      const s = Math.min(W / SCENE_W, H / SCENE_H)
      const ox = (W - SCENE_W * s) / 2
      const oy = (H - SCENE_H * s) / 2
      const cssW = SHEET.w * s
      const cssH = SHEET.h * s
      canvas.style.left = `${ox + SHEET.x * s}px`
      canvas.style.top = `${oy + SHEET.y * s}px`
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(Math.min(cssW * dpr, SHEET.cw))
      canvas.height = Math.round(Math.min(cssH * dpr, SHEET.ch))
      draw(progress.get())
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(wrap)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function draw(p: number) {
    const canvas = canvasRef.current
    const img = sheet.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (!img || p <= 0.001) return
    const f = p * (SHEET.frames - 1)
    const a = Math.floor(f)
    const b = Math.min(a + 1, SHEET.frames - 1)
    const t = f - a
    const fade = Math.min(1, p / FADE_IN)
    ctx.imageSmoothingQuality = 'high'
    const blit = (i: number) =>
      ctx.drawImage(
        img,
        (i % SHEET.cols) * SHEET.cw,
        Math.floor(i / SHEET.cols) * SHEET.ch,
        SHEET.cw,
        SHEET.ch,
        0,
        0,
        canvas.width,
        canvas.height,
      )
    ctx.globalAlpha = fade
    blit(a)
    if (t > 0.01 && b !== a) {
      ctx.globalAlpha = fade * t
      blit(b)
    }
    ctx.globalAlpha = 1
  }

  useEffect(() => progress.on('change', draw), [progress])

  useEffect(() => {
    const controls = animate(progress, open ? 1 : 0, open ? OPEN : CLOSE)
    return () => controls.stop()
  }, [open, progress])

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute" style={{ willChange: 'contents' }} />
    </div>
  )
}
