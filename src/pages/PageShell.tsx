import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { navigate } from '@/lib/router'

interface Props {
  eyebrow: string
  /** Zona de la escena del taller que se ve detrás del título (object-position). */
  sceneFocus?: string
  /** Imagen propia de fondo para el encabezado (en vez de la escena del taller). */
  hero?: React.ReactNode
  /** Retraso (s) para mostrar el botón de volver y el eyebrow, cuando la página tiene su propia intro. */
  chromeDelay?: number
  /** Página de una sola pantalla: en compu no se puede scrollear */
  fixed?: boolean
  children: React.ReactNode
}

export function PageShell({ eyebrow, sceneFocus, hero, chromeDelay = 0, fixed = false, children }: Props) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative min-h-screen bg-ink ${fixed ? 'lg:overflow-x-hidden' : ''}`}
    >
      {hero}
      {!hero && sceneFocus && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[75vh] overflow-hidden">
          <motion.img
            src="/scene/taller-v7.webp"
            alt=""
            initial={{ scale: 1.35, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.32 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="h-full w-full object-cover blur-[2px]"
            style={{ objectPosition: sceneFocus }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/70 to-ink" />
        </div>
      )}

      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-24 bg-gradient-to-b from-ink to-transparent" />

      <div className={`relative mx-auto max-w-6xl px-5 pt-28 sm:px-8 sm:pt-32 ${fixed ? 'pb-40 lg:pb-0' : 'pb-40'}`}>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: chromeDelay, duration: 0.6 }}
          onClick={() => navigate('home')}
          className="group mb-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/60 transition-colors hover:text-cream"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          Volver al taller
        </motion.button>
        {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
        {children}
      </div>
    </motion.main>
  )
}

export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="display mb-8 text-4xl sm:text-6xl">{children}</h2>
}
