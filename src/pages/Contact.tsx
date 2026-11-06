import { motion } from 'motion/react'
import { ArrowUpRight, FileDown } from 'lucide-react'
import { PageShell } from './PageShell'
import { site } from '@/data/site'

export function Contact() {
  return (
    <PageShell eyebrow="Contacto" sceneFocus="68% 85%">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="display text-7xl sm:text-9xl lg:text-[11rem]"
      >
        Hablemos.
      </motion.h1>
      <p className="mt-8 max-w-xl text-lg text-cream/70">
        Busco una pasantía donde aprender, aportar y seguir construyendo con IA. Si te interesa charlar, escribime.
      </p>

      <motion.a
        href={`mailto:${site.email}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="group mt-14 inline-flex items-center gap-3 border-b border-white/20 pb-2 font-display text-2xl font-bold transition-colors hover:border-warm hover:text-warm sm:text-5xl"
      >
        {site.email}
        <ArrowUpRight className="size-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:size-9" />
      </motion.a>

      <div className="mt-14 flex flex-wrap gap-3">
        <a
          href={site.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm transition-colors hover:border-warm hover:text-warm"
        >
          LinkedIn <ArrowUpRight className="size-4" />
        </a>
        <a
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm transition-colors hover:border-warm hover:text-warm"
        >
          Instagram <ArrowUpRight className="size-4" />
        </a>
        <a
          href={site.cv}
          download="CV-Bautista-Suarez.pdf"
          className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-85"
        >
          Descargar CV <FileDown className="size-4" />
        </a>
      </div>

      <p className="mt-20 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/40">
        Buenos Aires, Argentina
      </p>
    </PageShell>
  )
}
