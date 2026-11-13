import { useEffect, useRef } from 'react'
import { SCENE_H, SCENE_W } from '@/data/hotspots'

/**
 * La hoja de la carpeta (zona Contacto): se levanta con el aire, flamea y vuelve a caer en su lugar.
 * Es la misma hoja de la foto puesta en 3D (perspectiva calculada a partir de la escena),
 * así que termina exactamente donde empezó: no hay saltos ni hojas que se duplican.
 */
// Cámara estimada para la hoja (unidades de la escena; hoja de 297 x 210)
const CAM = {
  f: 5150,
  cx: 838.5,
  cy: 469,
  R: [
    [0.695005, 0.716825, 0.055947],
    [-0.274176, 0.192288, 0.94226],
    [0.664677, -0.670215, 0.330177],
  ],
  t: [385.1782, 536.0276, 9633.0729],
}
const PW = 297
const PH = 210
// Debajo de la hoja (la carpeta), sacado del video y emparejado de color
const PLATE = { src: '/scene/hoja-plate-v1.png', x: 1037.14, y: 702.14, w: 197.86, h: 83.57 }
const SHEET_SRC = '/scene/hoja-sheet-v2.webp'
const DURATION = 1.75

function project(u: number, v: number, z: number) {
  const { R, t, f, cx, cy } = CAM
  const X = R[0][0] * u + R[0][1] * v + R[0][2] * z + t[0]
  const Y = R[1][0] * u + R[1][1] * v + R[1][2] * z + t[1]
  const Z = R[2][0] * u + R[2][1] * v + R[2][2] * z + t[2]
  return [(f * X) / Z + cx, (f * Y) / Z + cy]
}

/** Homografía que lleva el rectángulo (0,0)-(w,h) a los 4 puntos dados → matrix3d de CSS. */
function rectToQuad(w: number, h: number, q: number[][]) {
  const src = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ]
  const A: number[][] = []
  const b: number[] = []
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i]
    const [X, Y] = q[i]
    A.push([x, y, 1, 0, 0, 0, -x * X, -y * X])
    b.push(X)
    A.push([0, 0, 0, x, y, 1, -x * Y, -y * Y])
    b.push(Y)
  }
  // Gauss
  for (let c = 0; c < 8; c++) {
    let p = c
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r
    ;[A[c], A[p]] = [A[p], A[c]]
    ;[b[c], b[p]] = [b[p], b[c]]
    for (let r = 0; r < 8; r++) {
      if (r === c) continue
      const k = A[r][c] / A[c][c]
      for (let j = c; j < 8; j++) A[r][j] -= k * A[c][j]
      b[r] -= k * b[c]
    }
  }
  const h8 = b.map((v, i) => v / A[i][i])
  const [a, bb, c, d, e, f, g, hh] = h8
  return `matrix3d(${a},${d},0,${g},${bb},${e},0,${hh},0,0,1,0,${c},${f},0,1)`
}

/** Ángulo del borde de adelante (grados): sube con el aire y flamea un par de veces hasta asentarse. */
function angle(t: number) {
  if (t <= 0) return 0
  const env = Math.exp(-2.4 * t) * Math.min(1, t / 0.12)
  return 36 * env * Math.abs(Math.sin((Math.PI * t) / 0.52))
}
function twistAt(t: number) {
  return 0.9 * Math.sin(t * 7.5) * Math.exp(-1.6 * t)
}

export function PaperSheet({ active }: { active: boolean }) {
  const wrap = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const sheet = useRef<HTMLImageElement>(null)
  const plate = useRef<HTMLImageElement>(null)
  const shadow = useRef<HTMLDivElement>(null)
  const running = useRef(false)

  // Ubicar el escenario igual que la escena (SVG "meet")
  useEffect(() => {
    const el = wrap.current!
    const place = () => {
      const W = el.clientWidth
      const H = el.clientHeight
      const s = Math.min(W / SCENE_W, H / SCENE_H)
      const ox = (W - SCENE_W * s) / 2
      const oy = (H - SCENE_H * s) / 2
      stage.current!.style.transform = `translate(${ox}px, ${oy}px) scale(${s})`
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(el)
    // Precargar y dejar la hoja en su lugar (invisible)
    render(0, 0)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function render(deg: number, vis: number, lift = 0, twist = 0) {
    const th = (deg * Math.PI) / 180
    // Bisagra en el borde de atrás (v = 0): el borde de adelante se levanta hacia arriba
    const q = [
      [0, 0],
      [PW, 0],
      [PW, PH],
      [0, PH],
    ].map(([u, v]) => {
      // Bisagra en el borde de atrás (v = 0): el borde de adelante se levanta con el aire.
      // Una esquina sube un poco más que la otra (twist), como una hoja de verdad.
      const k = 1 + twist * (u / PW - 0.5)
      return project(u, v * Math.cos(th * k), -v * Math.sin(th * k) - lift)
    })
    const ground = [
      [0, 0],
      [PW, 0],
      [PW, PH],
      [0, PH],
    ].map(([u, v]) => project(u, v, 0))
    const sh = sheet.current!
    sh.style.transform = rectToQuad(PW, PH, q)
    sh.style.opacity = String(vis)
    sh.style.filter = `brightness(${1 + 0.14 * Math.sin(th)})`
    const lifted = Math.min(1, deg / 6)
    plate.current!.style.opacity = String(lifted * vis)
    const sd = shadow.current!
    sd.style.transform = rectToQuad(PW, PH, ground)
    sd.style.opacity = String(0.5 * Math.sin(th) * vis)
  }

  useEffect(() => {
    if (!active || running.current) return
    running.current = true
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = (now - t0) / 1000
      const fadeIn = Math.min(1, t / 0.08)
      const fadeOut = t > DURATION ? Math.max(0, 1 - (t - DURATION) / 0.18) : 1
      const lead = Math.max(0, t - 0.06) // primero aparece la hoja quieta, después se levanta
      const deg = angle(lead)
      const lift = 3 * Math.exp(-2 * lead) * Math.sin(Math.min(1, lead / 0.6) * Math.PI)
      render(deg, fadeIn * fadeOut, lift, twistAt(lead))
      if (t < DURATION + 0.18) raf = requestAnimationFrame(tick)
      else {
        render(0, 0)
        running.current = false
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      // Si se desmonta a mitad, que no quede trabado
      cancelAnimationFrame(raf)
      running.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  return (
    <div ref={wrap} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div ref={stage} className="absolute left-0 top-0" style={{ width: SCENE_W, height: SCENE_H, transformOrigin: '0 0' }}>
        <img
          ref={plate}
          src={PLATE.src}
          alt=""
          className="absolute max-w-none"
          style={{ left: PLATE.x, top: PLATE.y, width: PLATE.w, height: PLATE.h, opacity: 0 }}
        />
        <div
          ref={shadow}
          className="absolute left-0 top-0"
          style={{ width: PW, height: PH, transformOrigin: '0 0', background: '#000', filter: 'blur(4px)', opacity: 0 }}
        />
        <img
          ref={sheet}
          src={SHEET_SRC}
          alt=""
          className="absolute left-0 top-0 max-w-none"
          style={{ width: PW, height: PH, transformOrigin: '0 0', opacity: 0, backfaceVisibility: 'hidden', willChange: 'transform' }}
        />
      </div>
    </div>
  )
}
