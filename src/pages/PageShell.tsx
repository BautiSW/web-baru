import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { navigate } from '@/lib/router'

interface Props {
  eyebrow: string
  /** Zona de la escena del taller que se ve detrás del título (object-position). */
  sceneFocus?: string
  children: React.ReactNode
}

export function PageShell({ eyebrow, sceneFocus, children }: Props) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen bg-ink"
    >
      {sceneFocus && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[75vh] overflow-hidden">
          <motion.img
            src="/scene/taller-v5.webp"
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

      <div className="relative mx-auto max-w-6xl px-5 pb-40 pt-28 sm:px-8 sm:pt-32">
        <button
          onClick={() => navigate('home')}
          className="group mb-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/60 transition-colors hover:text-cream"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          Volver al taller
        </button>
        <p className="eyebrow mb-5">{eyebrow}</p>
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
