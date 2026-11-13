import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { PageShell, Reveal } from './PageShell'
import { projects } from '@/data/projects'

export function Work() {
  return (
    <PageShell eyebrow="Work · Lo que construí" sceneFocus="55% 50%">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="display text-6xl sm:text-8xl lg:text-[9rem]"
      >
        Lo que
        <br />
        construí.
      </motion.h1>
      <p className="mt-8 max-w-xl text-lg text-cream/65">
        Proyectos propios, de la idea al prototipo funcionando. Algunos en etapa temprana: lo digo como es.
      </p>

      <div className="mt-20 border-t border-white/10">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.05}>
            <article className="group grid gap-6 border-b border-white/10 py-10 md:grid-cols-[80px_1fr_auto] md:items-start">
              <p className="font-mono text-sm text-cream/40">0{i + 1}</p>
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                    <img
                      src={`/logos/${p.logo}`}
                      alt={`Logo de ${p.title}`}
                      className={p.logoFit === 'cover' ? 'h-full w-full object-cover' : 'h-full w-full object-contain p-1.5'}
                    />
                  </div>
                  <div>
                    <h2 className="display text-4xl sm:text-6xl">{p.title}</h2>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-cream/50">
                      {p.role}
                      {p.period && ` · ${p.period}`} · {p.status}
                    </p>
                  </div>
                </div>
                <p className="mt-6 max-w-2xl leading-relaxed text-cream/70">{p.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border border-white/12 px-3 py-1 text-xs text-cream/65">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 px-5 py-2.5 text-sm transition-colors hover:border-warm hover:text-warm"
                >
                  Ver proyecto <ArrowUpRight className="size-4" />
                </a>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </PageShell>
  )
}
