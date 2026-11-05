import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { hotspots, SCENE_H, SCENE_W, type Hotspot } from '@/data/hotspots'
import { SpriteAnimation } from './SpriteAnimation'
import { capoSheet, mateSheet } from '@/data/sprites'
import type { Route } from '@/lib/router'

interface Rect {
  left: number
  top: number
  width: number
  height: number
}

function useMedia(query: string) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const m = window.matchMedia(query)
    const on = () => setMatch(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return match
}

/** Imagen de la escena según la pantalla (se decide una sola vez). */
function pickSceneSrc() {
  const small = window.matchMedia('(max-width: 900px)').matches
  const big = window.innerWidth * (window.devicePixelRatio || 1) > 2600
  return small ? '/scene/taller-v7-1280.webp' : big ? '/scene/taller-v7-4k.webp' : '/scene/taller-v7.webp'
}
const SCENE_SRC = pickSceneSrc()
/** Precarga y decodifica la imagen apenas carga la web; queda lista para volver al taller al instante. */
let sceneReady = false
const sceneLoading: Promise<void> = (() => {
  const img = new Image()
  img.src = SCENE_SRC
  return img
    .decode()
    .catch(() => undefined)
    .then(() => {
      sceneReady = true
    })
})()
/** Si ya se vio el taller en esta visita, al volver no se repite el fundido largo. */
let seenOnce = false

function Layer({ className = '', style, children }: { className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} style={{ willChange: 'opacity', ...style }} aria-hidden="true">
      <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} preserveAspectRatio="xMidYMid meet" className="h-full w-full">
        {children}
      </svg>
    </div>
  )
}

export function Scene({ onEnter }: { onEnter: (route: Route) => void }) {
  const isTouch = useMedia('(hover: none)')
  const isPortrait = useMedia('(max-aspect-ratio: 11/10)')
  const reduceMotion = useMedia('(prefers-reduced-motion: reduce)')

  const [loaded, setLoaded] = useState(sceneReady)
  const [firstVisit] = useState(() => !seenOnce)
  const [hovered, setHovered] = useState<number | null>(null)
  const [spotIndex, setSpotIndex] = useState<number | null>(null)
  const [touched, setTouched] = useState(false)
  const [explored, setExplored] = useState(false)
  const [rects, setRects] = useState<Rect[]>([])
  const [zoom, setZoom] = useState<{ x: number; y: number; route: Route } | null>(null)
  const polyRefs = useRef<(SVGPolygonElement | null)[]>([])
  const navigated = useRef(false)

  // Parallax suave siguiendo el mouse
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 50, damping: 18, mass: 0.7 })
  const sy = useSpring(my, { stiffness: 50, damping: 18, mass: 0.7 })
  // Leve giro de "cámara" hacia donde apunta el mouse
  const tx = useMotionValue(0)
  const ty = useMotionValue(0)
  const rotY = useSpring(tx, { stiffness: 50, damping: 18, mass: 0.7 })
  const rotX = useSpring(ty, { stiffness: 50, damping: 18, mass: 0.7 })
  const [liveRect, setLiveRect] = useState<Rect | null>(null)

  const measure = useCallback(() => {
    setRects(
      polyRefs.current.map((p) => {
        if (!p) return { left: 0, top: 0, width: 0, height: 0 }
        const r = p.getBoundingClientRect()
        return { left: r.left, top: r.top, width: r.width, height: r.height }
      }),
    )
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure, loaded, isPortrait])

  // Mostrar la escena apenas la imagen esté decodificada (con red de seguridad)
  useEffect(() => {
    let alive = true
    sceneLoading.then(() => alive && setLoaded(true))
    const t = setTimeout(() => alive && setLoaded(true), 1500)
    seenOnce = true
    return () => {
      alive = false
      clearTimeout(t)
    }
  }, [])

  const go = (route: Route) => {
    if (navigated.current) return
    navigated.current = true
    onEnter(route)
  }

  const enter = (i: number) => {
    if (zoom) return
    const p = polyRefs.current[i]
    const spot = hotspots[i]
    if (!p) return go(spot.route)
    const r = p.getBoundingClientRect()
    setHovered(i)
    if (reduceMotion) return go(spot.route)
    let x = r.left + r.width / 2
    let y = r.top + r.height / 2
    if (spot.route === 'garage') {
      // La cámara se mete en el motor (punto del vano del motor en la escena)
      const svg = p.ownerSVGElement
      const ctm = svg?.getScreenCTM()
      if (svg && ctm) {
        const pt = new DOMPoint(462, 455).matrixTransform(ctm)
        x = pt.x
        y = pt.y
      }
    }
    setZoom({ x, y, route: spot.route })
    // red de seguridad por si la animación no dispara el callback
    setTimeout(() => go(spot.route), 1400)
  }

  const onMove = (e: React.MouseEvent) => {
    if (isTouch || zoom || reduceMotion) return
    const nx = e.clientX / window.innerWidth - 0.5
    const ny = e.clientY / window.innerHeight - 0.5
    mx.set(nx * -40)
    my.set(ny * -24)
    tx.set(nx * 4)
    ty.set(ny * -3)
    if (hovered !== null) {
      const r = polyRefs.current[hovered]?.getBoundingClientRect()
      if (r) setLiveRect({ left: r.left, top: r.top, width: r.width, height: r.height })
    }
  }

  const hoveredRect = hovered !== null ? (liveRect ?? rects[hovered]) : null
  const imgSrc = SCENE_SRC
  const garageIndex = hotspots.findIndex((h) => h.route === 'garage')
  const workIndex = hotspots.findIndex((h) => h.route === 'work')
  const hoodOpen = hovered === garageIndex || zoom?.route === 'garage'

  return (
    <div className="fixed inset-0 overflow-hidden bg-black" onMouseMove={onMove}>
      <motion.div
        className="absolute inset-0"
        style={{ transformOrigin: zoom ? `${zoom.x}px ${zoom.y}px` : '50% 50%', perspective: 1400 }}
        animate={zoom ? { scale: zoom.route === 'garage' ? 6 : 2.8 } : { scale: 1 }}
        transition={zoom?.route === 'garage' ? { duration: 1.25, ease: [0.6, 0, 0.9, 0.3] } : { duration: 1.1, ease: [0.7, 0, 0.84, 0] }}
        onAnimationComplete={() => zoom && go(zoom.route)}
      >
        <motion.div
          className="absolute inset-0"
          style={{ x: sx, y: sy, rotateX: rotX, rotateY: rotY, scale: isPortrait ? 1 : 0.9, willChange: 'transform' }}
        >
          {/* 1. Escena base (estática: se dibuja una vez) */}
          <svg
            viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="Taller de Bauti: un Volvo 122S blanco, un banco de trabajo con una notebook, un mate, pelotas de fútbol y rugby y una carpeta con llaves."
          >
            <defs>
              <radialGradient id="vignette" cx="0.55" cy="0.5" r="0.75">
                <stop offset="55%" stopColor="#000" stopOpacity="0" />
                <stop offset="100%" stopColor="#000" stopOpacity="0.7" />
              </radialGradient>
              {/* Bordes que se funden a negro: la escena se ve entera, sin recortes */}
              <linearGradient id="fadeX" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.035" stopColor="#fff" stopOpacity="1" />
                <stop offset="0.965" stopColor="#fff" stopOpacity="1" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="fadeY" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.04" stopColor="#fff" stopOpacity="1" />
                <stop offset="0.96" stopColor="#fff" stopOpacity="1" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <mask id="edgeX" maskContentUnits="userSpaceOnUse">
                <rect width={SCENE_W} height={SCENE_H} fill="url(#fadeX)" />
              </mask>
              <mask id="edgeY" maskContentUnits="userSpaceOnUse">
                <rect width={SCENE_W} height={SCENE_H} fill="url(#fadeY)" />
              </mask>
            </defs>
            <g mask="url(#edgeX)">
              <image
                href={imgSrc}
                width={SCENE_W}
                height={SCENE_H}
                preserveAspectRatio="xMidYMid slice"
                mask="url(#edgeY)"
              />
            </g>
            <rect width={SCENE_W} height={SCENE_H} fill="url(#vignette)" />
          </svg>

          {/* 2. Capó que se abre de verdad (cuadros de video), en su propia capa */}
          <SpriteAnimation sheet={capoSheet} active={hoodOpen} mode="reversible" duration={1.1} />
          {/* Mate: el termo ceba y sale vapor (zona Work) */}
          <SpriteAnimation sheet={mateSheet} active={hovered === workIndex} mode="oneshot" duration={3.6} />

          {/* 3. Efectos de luz: cada uno en su capa, así sus animaciones no redibujan la escena */}
          <Layer className="lamp-glow">
            <defs>
              <radialGradient id="lampGrad" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#ffc98a" stopOpacity="0.55" />
                <stop offset="45%" stopColor="#ffb066" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx={950} cy={180} r={330} fill="url(#lampGrad)" />
          </Layer>
          {/* Neón: una capa oscura que lo "apaga" en parpadeos (cartel + reflejo en el capó) */}
          <Layer className="neon-off">
            <defs>
              <filter id="neonSoft" x="-20%" y="-30%" width="140%" height="160%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
              <filter id="neonSoftLg" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="22" />
              </filter>
            </defs>
            <polygon points="484,158 784,132 792,324 488,304" fill="#000" filter="url(#neonSoft)" />
            <polygon points="430,412 660,418 668,498 436,486" fill="#000" filter="url(#neonSoftLg)" opacity={0.65} />
          </Layer>
          {/* La lámpara apenas falla junto con el neón */}
          <Layer className="lamp-off">
            <defs>
              <filter id="lampSoft" x="-20%" y="-30%" width="140%" height="160%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
              <filter id="lampSoftLg" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="22" />
              </filter>
            </defs>
            <g opacity={0.28}>
              <ellipse cx={952} cy={170} rx={78} ry={30} fill="#000" filter="url(#lampSoft)" />
              <ellipse cx={1000} cy={360} rx={300} ry={190} fill="#000" filter="url(#lampSoftLg)" opacity={0.5} />
            </g>
          </Layer>

          {/* 4. Foco: oscurece todo menos el objeto (la opacidad la anima la GPU) */}
          <Layer style={{ opacity: hovered !== null ? 0.66 : 0, transition: 'opacity 450ms ease' }}>
            <defs>
              <filter id="spotSoft" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="22" />
              </filter>
              <mask id="spot">
                <rect width={SCENE_W} height={SCENE_H} fill="white" />
                {spotIndex !== null && (
                  <polygon points={hotspots[spotIndex].points} fill="black" filter="url(#spotSoft)" />
                )}
              </mask>
            </defs>
            <rect width={SCENE_W} height={SCENE_H} fill="#000" mask="url(#spot)" />
          </Layer>

          {/* 5. Zonas cliqueables (invisibles), arriba de todo */}
          <svg
            viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
          >
            {hotspots.map((h: Hotspot, i) => (
              <polygon
                key={h.route}
                ref={(el) => {
                  polyRefs.current[i] = el
                }}
                points={h.points}
                fill="transparent"
                pointerEvents="all"
                tabIndex={0}
                role="link"
                aria-label={`${h.label}: ${h.hint}`}
                className="cursor-pointer outline-none"
                onMouseEnter={(e) => {
                  if (zoom) return
                  const r = e.currentTarget.getBoundingClientRect()
                  setLiveRect({ left: r.left, top: r.top, width: r.width, height: r.height })
                  setHovered(i)
                  setSpotIndex(i)
                  setExplored(true)
                }}
                onMouseLeave={() => !zoom && setHovered(null)}
                onFocus={() => {
                  setHovered(i)
                  setSpotIndex(i)
                }}
                onBlur={() => setHovered(null)}
                onClick={() => {
                  setTouched(true)
                  enter(i)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    enter(i)
                  }
                }}
              />
            ))}
          </svg>
        </motion.div>
      </motion.div>

      {/* Etiqueta del objeto (desktop) */}
      {!isTouch && hoveredRect && !zoom && (
        <motion.div
          key={hovered}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none fixed z-20 -translate-x-1/2 -translate-y-full"
          style={{
            left: hoveredRect.left + hoveredRect.width / 2,
            top: Math.max(84, hoveredRect.top - 10),
          }}
        >
          <div className="whitespace-nowrap rounded-full border border-white/15 bg-black/70 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream backdrop-blur-md">
            {hotspots[hovered!].label} <span className="text-cream/45">· {hotspots[hovered!].hint}</span> →
          </div>
        </motion.div>
      )}

      {/* Etiquetas fijas (celular) */}
      {isTouch &&
        !zoom &&
        rects.map((r, i) =>
          r.width ? (
            <button
              key={hotspots[i].route}
              onClick={() => enter(i)}
              className="fixed z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cream backdrop-blur-md"
              style={{ left: r.left + r.width / 2, top: r.top + r.height / 2 }}
            >
              {hotspots[i].label}
            </button>
          ) : null,
        )}

      {/* Pista inicial */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded && !explored && !touched && !zoom ? 0.7 : 0 }}
        transition={{ delay: loaded && !explored ? 1.2 : 0, duration: explored ? 0.3 : 0.8 }}
        className="pointer-events-none fixed inset-x-0 bottom-24 z-10 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-cream"
      >
        {isTouch ? 'Tocá un objeto del taller' : 'Pasá el mouse por los objetos del taller'}
      </motion.p>

      {/* Al meterse en el motor: un resplandor cálido antes del corte a la sección */}
      {zoom?.route === 'garage' && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-30"
          style={{
            background: `radial-gradient(circle at ${zoom.x}px ${zoom.y}px, rgba(255,190,120,0.55), rgba(120,60,20,0.35) 35%, rgba(0,0,0,0) 70%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6, ease: 'easeIn' }}
        />
      )}
      {/* Fundido: la lámpara se prende al entrar, todo se apaga al salir */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 bg-black"
        initial={{ opacity: firstVisit ? 1 : 0.6 }}
        animate={{ opacity: zoom ? 1 : loaded ? 0 : 1 }}
        transition={zoom ? (zoom.route === 'garage' ? { delay: 0.8, duration: 0.45 } : { delay: 0.55, duration: 0.55 }) : { duration: firstVisit ? 0.8 : 0.35, ease: 'easeOut' }}
      />
    </div>
  )
}
