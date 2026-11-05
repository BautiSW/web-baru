import { useEffect, useRef } from 'react'
import { animate, useMotionValue } from 'motion/react'
import { SCENE_H, SCENE_W } from '@/data/hotspots'

/**
 * Animación hecha con cuadros de un video, dibujada en un <canvas> propio encima de la escena.
 * Va en una capa separada para que el navegador no redibuje todo el SVG en cada cuadro.
 * Los cuadros están recortados a lo que se mueve y guardados en una sola imagen (sprite sheet);
 * entre cuadro y cuadro se mezclan para que el movimiento sea continuo.
 */
export interface Sheet {
  src: string
  frames: number
  cols: number
  cw: number
  ch: number
  /** posición y tamaño en coordenadas de la escena (1677 x 938) */
  x: number
  y: number
  w: number
  h: number
}

type Ease = readonly [number, number, number, number]

interface Props {
  sheet: Sheet
  active: boolean
  /**
   * reversible: avanza al activarse y vuelve para atrás al soltar (capó).
   * oneshot: se reproduce una vez desde el principio y, al soltar, se desvanece (mate).
   */
  mode: 'reversible' | 'oneshot'
  duration: number
  backDuration?: number
  ease?: Ease
}

/** Tramo inicial en el que el cuadro del video entra de a poco sobre la foto. */
const FADE_IN = 0.08

export function SpriteAnimation({ sheet, active, mode, duration, backDuration = 0.55, ease = [0.3, 0, 0.2, 1] }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement | null>(null)
  const progress = useMotionValue(0)
  const alpha = useMotionValue(0)

  // Cargar la imagen una sola vez; decode() la prepara sin trabar la página
  useEffect(() => {
    let cancelled = false
    const im = new Image()
    im.decoding = 'async'
    im.src = sheet.src
    im.decode()
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return
        img.current = im
        draw()
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet.src])

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
      const cssW = sheet.w * s
      const cssH = sheet.h * s
      canvas.style.left = `${ox + sheet.x * s}px`
      canvas.style.top = `${oy + sheet.y * s}px`
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(Math.min(cssW * dpr, sheet.cw))
      canvas.height = Math.round(Math.min(cssH * dpr, sheet.ch))
      draw()
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(wrap)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet])

  function draw() {
    const canvas = canvasRef.current
    const im = img.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const p = progress.get()
    const vis = alpha.get() * Math.min(1, p / FADE_IN)
    if (!im || vis <= 0.001) return
    const f = p * (sheet.frames - 1)
    const a = Math.floor(f)
    const b = Math.min(a + 1, sheet.frames - 1)
    const t = f - a
    const blit = (i: number) =>
      ctx.drawImage(
        im,
        (i % sheet.cols) * sheet.cw,
        Math.floor(i / sheet.cols) * sheet.ch,
        sheet.cw,
        sheet.ch,
        0,
        0,
        canvas.width,
        canvas.height,
      )
    ctx.imageSmoothingQuality = 'high'
    ctx.globalAlpha = vis
    blit(a)
    if (t > 0.01 && b !== a) {
      ctx.globalAlpha = vis * t
      blit(b)
    }
    ctx.globalAlpha = 1
  }

  useEffect(() => {
    const u1 = progress.on('change', draw)
    const u2 = alpha.on('change', draw)
    return () => {
      u1()
      u2()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, alpha])

  useEffect(() => {
    if (mode === 'reversible') {
      alpha.set(1)
      const c = animate(progress, active ? 1 : 0, active ? { duration, ease } : { duration: backDuration, ease: [0.4, 0, 0.2, 1] })
      return () => c.stop()
    }
    // oneshot
    if (active) {
      progress.jump(0)
      alpha.jump(1)
      const c = animate(progress, 1, { duration, ease: 'linear' })
      return () => c.stop()
    }
    const c = animate(alpha, 0, { duration: 0.45, ease: 'easeOut' })
    return () => c.stop()
  }, [active, mode, duration, backDuration, ease, progress, alpha])

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute" style={{ willChange: 'contents' }} />
    </div>
  )
}
