import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useSpring } from 'motion/react'
import { hotspots, SCENE_H, SCENE_W, type Hotspot } from '@/data/hotspots'
import { SpriteAnimation } from './SpriteAnimation'
import { capoSheet, hojaSheet, mateSheet } from '@/data/sprites'
import type { Route } from '@/lib/router'

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
/** La misma escena con las luces cortadas (para la transición a cada sección). */
const OFF_SRC = window.matchMedia('(max-width: 900px)').matches ? '/scene/taller-off-v1-1280.webp' : '/scene/taller-off-v1.webp'
setTimeout(() => {
  const im = new Image()
  im.src = OFF_SRC
  // Precarga la escena ASCII de Under the hood cuando el home ya está tranquilo
  setTimeout(() => {
    const load = () => fetch('/hero-atlas.json').catch(() => undefined)
    if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 4000 })
    else load()
  }, 4000)
  im.decode().catch(() => undefined)
}, 3500)
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

function useViewport() {
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  useEffect(() => {
    const on = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return size
}

/** Punto donde va la etiqueta de cada objeto en el celular (arriba-centro de su zona). */
const ANCHORS = hotspots.map((h) => {
  const pts = h.points.split(' ').map((p) => p.split(',').map(Number))
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2
  const cy = Math.min(...ys) + (Math.max(...ys) - Math.min(...ys)) * 0.35
  return { x: cx, y: cy }
})
/** En el celular la cámara arranca centrada en el banco de trabajo. */
const MOBILE_START_X = 1040

export function Scene({ onEnter }: { onEnter: (route: Route) => void }) {
  const isTouch = useMedia('(hover: none)')
  const isPortrait = useMedia('(max-aspect-ratio: 11/10)')
  const reduceMotion = useMedia('(prefers-reduced-motion: reduce)')
  // Celular / pantalla vertical: la escena ocupa todo el alto y se recorre deslizando de costado
  const mobile = isPortrait
  const { w: vw, h: vh } = useViewport()
  const sceneScale = vh / SCENE_H
  const contentW = SCENE_W * sceneScale
  const minPan = Math.min(0, vw - contentW)
  const clampPan = (x: number) => Math.max(minPan, Math.min(0, x))
  const panX = useMotionValue(clampPan(vw / 2 - MOBILE_START_X * sceneScale))
  const dragged = useRef(false)
  useEffect(() => {
    if (mobile) panX.set(clampPan(vw / 2 - MOBILE_START_X * sceneScale))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobile, vw, vh])

  const [loaded, setLoaded] = useState(sceneReady)
  const [firstVisit] = useState(() => !seenOnce)
  const [hovered, setHovered] = useState<number | null>(null)
  const [spotIndex, setSpotIndex] = useState<number | null>(null)
  const [touched, setTouched] = useState(false)
  const [explored, setExplored] = useState(false)
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
  const labelRef = useRef<HTMLDivElement>(null)


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

  /** Corte de luz: parpadeo, se apaga todo de golpe y después funde a negro. */
  // Corte: titileo 0,6 s → queda a oscuras y se va apagando → negro total a los 3 s → página
  const CUT = { flicker: 0.6, total: 3 }
  const enter = (i: number) => {
    if (zoom) return
    const spot = hotspots[i]
    setHovered(i)
    if (reduceMotion) return go(spot.route)
    setZoom({ x: 0, y: 0, route: spot.route })
    // red de seguridad por si la animación no dispara el callback
    setTimeout(() => go(spot.route), CUT.total * 1000 + 300)
  }

  const select = (i: number | null) => {
    setHovered(i)
    if (i !== null) setSpotIndex(i)
    setExplored(true)
    // En el celular, la cámara se centra en el objeto elegido
    if (mobile && i !== null) {
      animate(panX, clampPan(vw / 2 - ANCHORS[i].x * sceneScale), { type: 'spring', stiffness: 120, damping: 22 })
    }
  }
  const tap = (i: number) => {
    if (dragged.current || zoom) return
    setTouched(true)
    if (hovered === i) enter(i)
    else select(i)
  }

  const onMove = (e: React.MouseEvent) => {
    if (isTouch || zoom || reduceMotion) return
    const nx = e.clientX / window.innerWidth - 0.5
    const ny = e.clientY / window.innerHeight - 0.5
    mx.set(nx * -40)
    my.set(ny * -24)
    tx.set(nx * 4)
    ty.set(ny * -3)
  }

  // La etiqueta sigue al objeto mientras se mueve la cámara, sin re-renderizar la escena:
  // un loop por cuadro que solo actualiza la posición del cartel.
  useEffect(() => {
    if (hovered === null || isTouch) return
    let raf = 0
    const tick = () => {
      const el = labelRef.current
      const r = polyRefs.current[hovered]?.getBoundingClientRect()
      if (el && r) {
        el.style.transform = `translate3d(${r.left + r.width / 2}px, ${Math.max(84, r.top - 10)}px, 0) translate(-50%, -100%)`
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [hovered, isTouch])

  const imgSrc = SCENE_SRC
  const garageIndex = hotspots.findIndex((h) => h.route === 'garage')
  const workIndex = hotspots.findIndex((h) => h.route === 'work')
  const contactIndex = hotspots.findIndex((h) => h.route === 'contact')
  const hoodOpen = hovered === garageIndex || zoom?.route === 'garage'

  return (
    <div className="fixed inset-0 overflow-hidden bg-black" onMouseMove={onMove}>
      <motion.div
        className="absolute inset-0"
        style={{ perspective: 1400 }}
      >
        <motion.div
          className="absolute left-0 top-0 h-full"
          style={{ width: mobile ? contentW : '100%', x: mobile ? panX : 0, touchAction: mobile ? 'pan-y' : 'auto' }}
          drag={mobile && !zoom ? 'x' : false}
          dragConstraints={{ left: minPan, right: 0 }}
          dragElastic={0.06}
          dragTransition={{ power: 0.25, timeConstant: 260 }}
          onDragStart={() => {
            dragged.current = true
            setExplored(true)
          }}
          onDragEnd={() => {
            setTimeout(() => (dragged.current = false), 60)
          }}
        >
        <motion.div
          className="absolute inset-0"
          style={{ x: sx, y: sy, rotateX: rotX, rotateY: rotY, scale: mobile ? 1 : 0.9, willChange: 'transform' }}
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

          {/* Corte de luz: la misma escena con todo apagado, que aparece con un parpadeo */}
          {zoom && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.15, 1, 0.45, 1] }}
              transition={{ duration: CUT.flicker, times: [0, 0.12, 0.24, 0.4, 0.55, 0.7], ease: 'linear' }}
            >
              <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} preserveAspectRatio="xMidYMid meet" className="h-full w-full">
                <g mask="url(#edgeX)">
                  <image href={OFF_SRC} width={SCENE_W} height={SCENE_H} preserveAspectRatio="xMidYMid slice" mask="url(#edgeY)" />
                </g>
                <rect width={SCENE_W} height={SCENE_H} fill="url(#vignette)" />
              </svg>
            </motion.div>
          )}

          {/* 2. Capó que se abre de verdad (cuadros de video), en su propia capa */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={zoom ? { filter: ['brightness(1)', 'brightness(0.3)', 'brightness(0.9)', 'brightness(0.3)', 'brightness(0.65)', 'brightness(0.3)'] } : { filter: 'brightness(1)' }}
            transition={zoom ? { duration: CUT.flicker, times: [0, 0.12, 0.24, 0.4, 0.55, 0.7], ease: 'linear' } : { duration: 0 }}
          >
          <SpriteAnimation sheet={capoSheet} active={hoodOpen} mode="reversible" duration={1.1} loadDelay={0} />
          {/* Mate: el termo ceba y sale vapor (zona Work) */}
          <SpriteAnimation sheet={mateSheet} active={hovered === workIndex} mode="oneshot" duration={3.6} loadDelay={300} />
          {/* Carpeta: se levanta y da vuelta la hoja (zona Contacto) */}
          <SpriteAnimation sheet={hojaSheet} active={hovered === contactIndex} mode="oneshot" duration={1.9} loadDelay={2700} />
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={zoom ? { opacity: [1, 0, 1, 0, 0.6, 0] } : { opacity: 1 }}
            transition={zoom ? { duration: CUT.flicker, times: [0, 0.12, 0.24, 0.4, 0.55, 0.7], ease: 'linear' } : { duration: 0 }}
          >

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

          </motion.div>

          {/* 4. Foco: oscurece todo menos el objeto (la opacidad la anima la GPU) */}
          <Layer style={{ opacity: hovered !== null && !zoom ? 0.66 : 0, transition: zoom ? 'opacity 80ms linear' : 'opacity 450ms ease' }}>
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
            onClick={() => isTouch && !dragged.current && !zoom && setHovered(null)}
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
                onMouseEnter={() => {
                  if (zoom || isTouch) return
                  select(i)
                }}
                onMouseLeave={() => !zoom && !isTouch && setHovered(null)}
                onFocus={() => {
                  setHovered(i)
                  setSpotIndex(i)
                }}
                onBlur={() => setHovered(null)}
                onClick={(e) => {
                  e.stopPropagation()
                  if (isTouch) return tap(i)
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

          {/* Etiquetas en el celular: se mueven con la escena; la del objeto elegido invita a entrar */}
          {isTouch && !zoom && (
            <div className="pointer-events-none absolute inset-0">
              {hotspots.map((h, i) => {
                const sel = hovered === i
                return (
                  <button
                    key={h.route}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (dragged.current) return
                      setTouched(true)
                      if (sel) enter(i)
                      else select(i)
                    }}
                    className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border font-mono uppercase tracking-[0.14em] transition-all duration-300 ${
                      sel
                        ? 'border-white/40 bg-cream px-3.5 py-1.5 text-[11px] text-ink'
                        : 'border-white/20 bg-black/70 px-3 py-1 text-[10px] text-cream'
                    }`}
                    style={{ left: `${(ANCHORS[i].x / SCENE_W) * 100}%`, top: `${(ANCHORS[i].y / SCENE_H) * 100}%` }}
                  >
                    {sel ? `${h.label} · Entrar →` : h.label}
                  </button>
                )
              })}
            </div>
          )}
        </motion.div>
        </motion.div>
      </motion.div>

      {/* Etiqueta del objeto (desktop) */}
      {!isTouch && hovered !== null && !zoom && (
        <div ref={labelRef} className="pointer-events-none fixed left-0 top-0 z-20" style={{ willChange: 'transform' }}>
          <motion.div
            key={hovered}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="whitespace-nowrap rounded-full border border-white/15 bg-black/80 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream"
          >
            {hotspots[hovered].label} <span className="text-cream/45">· {hotspots[hovered].hint}</span> →
          </motion.div>
        </div>
      )}

      {/* Pista inicial */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded && !explored && !touched && !zoom ? 0.7 : 0 }}
        transition={{ delay: loaded && !explored ? 1.2 : 0, duration: explored ? 0.3 : 0.8 }}
        className="pointer-events-none fixed inset-x-0 bottom-24 z-10 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-cream"
      >
        {isTouch ? 'Deslizá y tocá un objeto' : 'Pasá el mouse por los objetos del taller'}
      </motion.p>

      {/* Fundido: la lámpara se prende al entrar, todo se apaga al salir */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 bg-black"
        initial={{ opacity: firstVisit ? 1 : 0.6 }}
        animate={{ opacity: zoom ? [0, 0, 0.3, 1] : loaded ? 0 : 1 }}
        transition={zoom ? { duration: CUT.total, times: [0, 0.2, 0.6, 1], ease: ['linear', 'easeIn', [0.4, 0, 0.6, 1]] } : { duration: firstVisit ? 0.8 : 0.35, ease: 'easeOut' }}
        onAnimationComplete={() => zoom && go(zoom.route)}
      />
    </div>
  )
}
