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
    // Incluye el espacio donde sube el capó abierto, para que no se cierre al mover el mouse
    points: '0,295 120,300 180,350 465,100 592,128 612,246 600,420 715,470 722,640 665,700 625,800 360,805 0,895',
  },
  {
    route: 'work',
    label: 'Work',
    hint: 'Proyectos',
    points: '815,395 1050,395 1150,398 1226,396 1230,632 1150,632 1062,598 1035,582 818,578',
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
    // Incluye el aire sobre la carpeta, por donde vuela la hoja al pasar el mouse
    points: '985,752 1090,650 1250,645 1312,730 1312,842 1198,848 1088,804',
  },
]
