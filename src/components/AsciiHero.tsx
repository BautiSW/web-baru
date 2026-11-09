import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import UnicornScene from 'unicornstudio-react'

/**
 * Fondo animado en ASCII (Unicorn Studio) para el encabezado de Under the hood.
 * La escena se recorta abajo (donde va la marca de agua) y se pausa cuando sale de pantalla.
 */
const PROJECT_ID = 'OMzqyUv6M3kSnv0JeAtC'

export function AsciiHero({ delay = 0.4 }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const small = typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="pointer-events-none absolute inset-x-0 top-0 h-screen overflow-hidden bg-black">
      <motion.div
        className="absolute inset-x-0 top-0 h-[112%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ delay, duration: 1.6, ease: 'easeOut' }}
      >
        <UnicornScene
          projectId={PROJECT_ID}
          width="100%"
          height="100%"
          scale={small ? 0.6 : 1}
          dpi={small ? 1 : 1.5}
          fps={small ? 30 : 60}
          lazyLoad={false}
          paused={!visible}
          onLoad={() => setLoaded(true)}
          altText=""
          ariaLabel="Animación de fondo"
        />
      </motion.div>
      {/* Fundido hacia el resto de la página */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-ink" />
      {/* Esquinas tipo visor */}
      <div className="absolute left-4 top-20 size-8 border-l border-t border-white/25 sm:left-6 sm:size-12" />
      <div className="absolute right-4 top-20 size-8 border-r border-t border-white/25 sm:right-6 sm:size-12" />
      <div className="absolute bottom-[12vh] left-4 size-8 border-b border-l border-white/25 sm:left-6 sm:size-12" />
      <div className="absolute bottom-[12vh] right-4 size-8 border-b border-r border-white/25 sm:right-6 sm:size-12" />
    </div>
  )
}
