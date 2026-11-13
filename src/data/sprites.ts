import type { Clip } from '@/components/VideoSprite'

/**
 * Animaciones de hover (videos con alfa apilado). Coordenadas en la escena (1677 x 938).
 * Generadas con scratchpad/tools/anim2.py: máscara por cuadro, así solo se ve lo que se mueve.
 */
export const capoClip: Clip = { src: '/scene/capo-v5', x: 140, y: 96.43, w: 595.71, h: 452.86, pw: 834, ph: 634, frames: 27, fps: 24 }
export const mateClip: Clip = { src: '/scene/mate-v3', x: 954.29, y: 93.57, w: 515.71, h: 595.71, pw: 722, ph: 834, frames: 96, fps: 28 }
