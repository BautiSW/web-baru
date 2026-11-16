import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, X } from 'lucide-react'
import { PageShell } from './PageShell'
import { AtlasHero } from '@/components/AtlasHero'
import GlassFolder, { type FolderFile } from '@/components/ui/glass-folder-cards'
import { projects, type Project } from '@/data/projects'

/** Título que aparece letra por letra en la oscuridad (igual que en las otras secciones). */
function TypedTitle({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span aria-label={text}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + i * 0.05, duration: 0.05 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

const host = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

/** Lo que hay adentro de cada carpeta: la web, la ficha y el logo (adelante). */
function filesOf(p: Project): FolderFile[] {
  const files: FolderFile[] = []
  if (p.link) files.push({ name: 'Visitar la web', meta: host(p.link), art: { style: p.style, colors: p.palette, gloss: 0.4 }, href: p.link })
  files.push({ name: 'Ficha del proyecto', meta: 'Leer' })
  files.push({ name: p.title, meta: p.period || p.status, image: p.card })
  return files
}

function useFolderWidth() {
  const get = () => (typeof window === 'undefined' ? 340 : window.innerWidth < 420 ? Math.min(320, window.innerWidth - 48) : 340)
  const [w, setW] = useState(get)
  useEffect(() => {
    const on = () => setW(get())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return w
}

function ProjectSheet({ p, onClose }: { p: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.article
        className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#0d0d0f]/95 p-7 shadow-2xl sm:p-9"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-5 top-5 grid size-9 place-items-center rounded-full text-cream/50 transition-colors hover:bg-white/10 hover:text-cream"
        >
          <X className="size-4" />
        </button>
        <div className="flex items-center gap-4">
          <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-white">
            <img src={`/logos/${p.logo}`} alt="" className={p.logoFit === 'cover' ? 'h-full w-full object-cover' : 'h-full w-full object-contain'} />
          </div>
          <div>
            <h2 className="display text-3xl sm:text-4xl">{p.title}</h2>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-cream/50">
              {p.role}
              {p.period && ` · ${p.period}`}
            </p>
          </div>
        </div>
        <p className="mt-6 leading-relaxed text-cream/75">{p.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span key={t} className="rounded-full border border-white/12 px-3 py-1 text-xs text-cream/65">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-warm">● {p.status}</p>
          {p.link && (
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              Visitar
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
      </motion.article>
    </motion.div>
  )
}

export function Work() {
  const width = useFolderWidth()
  const [sheet, setSheet] = useState<Project | null>(null)

  return (
    <PageShell eyebrow="" hero={<AtlasHero figure={false} />} chromeDelay={1.4}>
      <section className="text-center">
        <motion.p
          className="font-mono text-[11px] uppercase tracking-[0.24em] text-cream/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Work
        </motion.p>
        <h1 className="display mt-3 text-6xl sm:text-8xl">
          <TypedTitle text="Lo que construí." delay={0.7} />
        </h1>
        <motion.p
          className="mx-auto mt-6 max-w-lg text-lg text-cream/70"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          Cuatro proyectos, cuatro carpetas. Abrí una y mirá qué hay adentro.
        </motion.p>
        <motion.p
          className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/35"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <span className="hidden sm:inline">Pasá el mouse · Tocá para abrir</span>
          <span className="sm:hidden">Tocá una carpeta para abrirla</span>
        </motion.p>
      </section>

      <section className="mx-auto mt-16 grid max-w-[820px] grid-cols-1 justify-items-center gap-x-14 gap-y-16 md:grid-cols-2">
        {projects.map((p, i) => (
          <GlassFolder
            key={p.title}
            label={p.title}
            meta={[p.role, p.period].filter(Boolean).join(' · ')}
            tone="dark"
            art={{ style: p.style, colors: p.palette, scale: 0.7, warp: p.style === 'streak' ? 1.5 : 3.2, gloss: 0.5, veins: 0.4 }}
            seed={i * 7 + 3}
            files={filesOf(p)}
            action="none"
            width={width}
            appearDelay={i * 140}
            onFileSelect={(file) => {
              if (file.name === 'Ficha del proyecto' || file.name === p.title) setSheet(p)
            }}
          />
        ))}
      </section>

      <AnimatePresence>{sheet && <ProjectSheet key={sheet.title} p={sheet} onClose={() => setSheet(null)} />}</AnimatePresence>
    </PageShell>
  )
}
