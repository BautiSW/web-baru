import type { Route } from '@/lib/router'

/**
 * Zonas cliqueables de la escena del taller.
 * Coordenadas en el sistema de la imagen original (1677 x 938):
 * si se cambia la imagen, hay que reajustar estos polígonos.
 */
export const SCENE_W = 1677
export const SCENE_H = 938

export interface Hotspot {
  route: Exclude<Route, 'home'>
  label: string
  hint: string
  points: string
}

export const hotspots: Hotspot[] = [
  {
    route: 'garage',
    label: 'Under the hood',
    hint: 'Cómo trabajo y uso la IA',
    points: '0,300 118,302 185,352 262,416 450,410 565,416 640,436 690,470 722,525 722,640 665,700 625,800 360,805 0,893',
  },
  {
    route: 'work',
    label: 'Work',
    hint: 'Proyectos',
    // Ajustado a la compu, el mate y el termo (sin la pared de atrás)
    points: '858,396 1048,404 1052,512 1066,512 1110,470 1138,462 1152,400 1228,396 1230,628 1152,630 1138,594 1064,596 1042,574 818,567 856,500',
  },
  {
    route: 'about',
    label: 'Mi historia',
    hint: 'Quién soy',
    points: '1285,462 1395,468 1500,505 1628,505 1632,652 1600,702 1472,702 1380,612 1286,578',
  },
  {
    route: 'contact',
    label: 'Contacto',
    hint: 'Escribime',
    points: '1000,756 1088,688 1290,730 1312,840 1180,842 1095,812',
  },
]
