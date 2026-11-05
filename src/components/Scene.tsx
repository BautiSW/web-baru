import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { hotspots, SCENE_H, SCENE_W, type Hotspot } from '@/data/hotspots'
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

export function Scene({ onEnter }: { onEnter: (route: Route) => void }) {
  const isTouch = useMedia('(hover: none)')
  const isPortrait = useMedia('(max-aspect-ratio: 11/10)')
  const reduceMotion = useMedia('(prefers-reduced-motion: reduce)')
  const isSmall = useMedia('(max-width: 900px)')

  const [loaded, setLoaded] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
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

  // Si la imagen tarda, igual mostramos la escena
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2500)
    return () => clearTimeout(t)
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
    setZoom({ x: r.left + r.width / 2, y: r.top + r.height / 2, route: spot.route })
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
  const bigScreen = window.innerWidth * (window.devicePixelRatio || 1) > 2600
  const imgSrc = isSmall
    ? '/scene/taller-v7-1280.webp'
    : bigScreen
      ? '/scene/taller-v7-4k.webp'
      : '/scene/taller-v7.webp'
  const capoSrc = isSmall ? '/scene/capo-v7-1280.webp' : bigScreen ? '/scene/capo-v7-4k.webp' : '/scene/capo-v7.webp'
  const garageIndex = hotspots.findIndex((h) => h.route === 'garage')
  const hoodOpen = hovered === garageIndex || zoom?.route === 'garage'

  return (
    <div className="fixed inset-0 overflow-hidden bg-black" onMouseMove={onMove}>
      <motion.div
        className="absolute inset-0"
        style={{ transformOrigin: zoom ? `${zoom.x}px ${zoom.y}px` : '50% 50%', perspective: 1400 }}
        animate={zoom ? { scale: 2.8 } : { scale: 1 }}
        transition={{ duration: 1.1, ease: [0.7, 0, 0.84, 0] }}
        onAnimationComplete={() => zoom && go(zoom.route)}
      >
        <motion.div className="absolute inset-0" style={{ x: sx, y: sy, rotateX: rotX, rotateY: rotY, scale: isPortrait ? 1 : 0.9 }}>
          <svg
            viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="h-full w-full"
            role="img"
            aria-label="Taller de Bauti: un Volvo 122S blanco, un banco de trabajo con una notebook, un mate, pelotas de fútbol y rugby y una carpeta con llaves."
          >
            <defs>
              <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="22" />
              </filter>
              <radialGradient id="lamp" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#ffc98a" stopOpacity="0.55" />
                <stop offset="45%" stopColor="#ffb066" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
              </radialGradient>
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
              <filter id="softSm" x="-20%" y="-30%" width="140%" height="160%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
              <mask id="spot">
                <rect width={SCENE_W} height={SCENE_H} fill="white" />
                {hovered !== null && (
                  <polygon points={hotspots[hovered].points} fill="black" filter="url(#soft)" />
                )}
              </mask>
            </defs>

            <g mask="url(#edgeX)">
              <image
                href={imgSrc}
                width={SCENE_W}
                height={SCENE_H}
                preserveAspectRatio="xMidYMid slice"
                mask="url(#edgeY)"
                onLoad={() => setLoaded(true)}
              />
              {/* Capó abierto: capa recortada a la zona del auto que aparece con un fundido */}
              <motion.image
                href={capoSrc}
                x={134.3}
                y={67.7}
                width={643.6}
                height={502.8}
                preserveAspectRatio="none"
                initial={false}
                animate={{ opacity: hoodOpen ? 1 : 0 }}
                transition={{ duration: hoodOpen ? 0.55 : 0.4, ease: 'easeInOut' }}
                pointerEvents="none"
              />
            </g>

            {/* Neón: una capa oscura que se apaga y prende sobre el cartel y su reflejo en el capó */}
            <g pointerEvents="none" aria-hidden="true">
              <polygon points="484,158 784,132 792,324 488,304" fill="#000" filter="url(#softSm)" className="neon-off" />
              <g opacity={0.65}>
                <polygon points="430,412 660,418 668,498 436,486" fill="#000" filter="url(#soft)" className="neon-off" />
              </g>
            </g>

            <g className="lamp-glow-wrap">
              <circle cx={950} cy={180} r={330} fill="url(#lamp)" className="lamp-glow" pointerEvents="none" />
            </g>
            {/* La lámpara titila junto con el neón */}
            <g pointerEvents="none" aria-hidden="true" opacity={0.28}>
              <ellipse cx={952} cy={170} rx={78} ry={30} fill="#000" filter="url(#softSm)" className="lamp-off" />
              <ellipse cx={1000} cy={360} rx={300} ry={190} fill="#000" filter="url(#soft)" className="lamp-off" opacity={0.5} />
            </g>
            <rect width={SCENE_W} height={SCENE_H} fill="url(#vignette)" pointerEvents="none" />

            {/* Foco: oscurece todo menos el objeto */}
            <rect
              width={SCENE_W}
              height={SCENE_H}
              fill="#000"
              mask="url(#spot)"
              pointerEvents="none"
              style={{ opacity: hovered !== null ? 0.66 : 0, transition: 'opacity 450ms ease' }}
            />

            {hotspots.map((h: Hotspot, i) => (
              <polygon
                key={h.route}
                ref={(el) => {
                  polyRefs.current[i] = el
                }}
                points={h.points}
                fill={hovered === i ? 'rgba(255,190,120,0.06)' : 'transparent'}
                filter={hovered === i ? 'url(#soft)' : undefined}
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
                  setExplored(true)
                }}
                onMouseLeave={() => !zoom && setHovered(null)}
                onFocus={() => setHovered(i)}
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
        transition={{ delay: loaded && !explored ? 1.6 : 0, duration: explored ? 0.3 : 0.8 }}
        className="pointer-events-none fixed inset-x-0 bottom-24 z-10 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-cream"
      >
        {isTouch ? 'Tocá un objeto del taller' : 'Pasá el mouse por los objetos del taller'}
      </motion.p>

      {/* Fundido: la lámpara se prende al entrar, todo se apaga al salir */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 bg-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: zoom ? 1 : loaded ? 0 : 1 }}
        transition={zoom ? { delay: 0.55, duration: 0.55 } : { duration: 1.4, ease: 'easeOut' }}
      />
    </div>
  )
}
