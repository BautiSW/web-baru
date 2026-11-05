import { useEffect, useState } from 'react'
import { animate, useMotionValue } from 'motion/react'

/**
 * Capó del Volvo abriéndose: cuadros de un video, en una sola imagen (sprite sheet).
 * Al abrir avanza cuadro por cuadro; al cerrar vuelve para atrás.
 * Posición y tamaño en coordenadas de la escena (1677 x 938).
 */
const SHEET = {
  src: '/scene/capo-anim-v1.webp',
  frames: 29,
  cols: 7,
  cw: 918,
  ch: 676,
  x: 67.15,
  y: 70.51,
  w: 751.7,
  h: 554.27,
}

export function HoodAnimation({ open }: { open: boolean }) {
  const progress = useMotionValue(0)
  const [frame, setFrame] = useState(0)

  useEffect(() => progress.on('change', (v) => setFrame(Math.round(v * (SHEET.frames - 1)))), [progress])

  useEffect(() => {
    const controls = animate(progress, open ? 1 : 0, {
      duration: open ? 1.5 : 1.0,
      ease: open ? [0.45, 0, 0.25, 1] : [0.5, 0, 0.75, 0.4],
    })
    return () => controls.stop()
  }, [open, progress])

  const rows = Math.ceil(SHEET.frames / SHEET.cols)
  const col = frame % SHEET.cols
  const row = Math.floor(frame / SHEET.cols)

  return (
    <svg
      x={SHEET.x}
      y={SHEET.y}
      width={SHEET.w}
      height={SHEET.h}
      viewBox={`${col * SHEET.cw} ${row * SHEET.ch} ${SHEET.cw} ${SHEET.ch}`}
      preserveAspectRatio="none"
      overflow="hidden"
      pointerEvents="none"
      style={{ opacity: frame === 0 ? 0 : 1 }}
      aria-hidden="true"
    >
      <image href={SHEET.src} width={SHEET.cw * SHEET.cols} height={SHEET.ch * rows} />
    </svg>
  )
}
