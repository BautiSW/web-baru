import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FolderOpen, FileText, ExternalLink } from 'lucide-react'
import { projects } from '@/data/projects'
import { Logo } from '@/components/ui/logo'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'

export function Projects() {
  const [selected, setSelected] = useState(0)
  const project = projects[selected]

  return (
    <section id="proyectos" className="bg-black px-5 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="Lo que construí" title="Proyectos" tone="onBlack" />

        <Reveal className="overflow-hidden rounded-2xl border border-cream/10 bg-[#111113] shadow-2xl">
          <div className="flex items-center gap-2 border-b border-cream/10 bg-[#0d0d0f] px-4 py-2.5 font-mono text-xs text-cream/50">
            <FolderOpen size={14} />
            ~/proyectos
          </div>

          <div className="grid sm:grid-cols-[220px_1fr]">
            <div className="border-b border-cream/10 sm:border-b-0 sm:border-r">
              {projects.map((p, i) => (
                <motion.button
                  key={p.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  onClick={() => setSelected(i)}
                  className={`flex w-full items-center gap-2.5 border-b border-cream/5 px-4 py-3 text-left text-sm transition-colors last:border-b-0 ${
                    selected === i ? 'bg-blue/15 text-cream' : 'text-cream/60 hover:bg-cream/5'
                  }`}
                >
                  <Logo file={p.logo} alt={p.title} initials={p.initials} size={40} variant="tile" fit={p.logoFit} />
                  <span className="truncate font-mono">{p.title.toLowerCase().replace(/\s+/g, '-')}</span>
                </motion.button>
              ))}
            </div>

            <div className="relative min-h-[340px] p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Logo
                        file={project.logo}
                        alt={project.title}
                        initials={project.initials}
                        size={72}
                        variant="tile"
                        fit={project.logoFit}
                      />
                      <div>
                        <h3 className="font-heading text-xl font-bold text-cream">{project.title}</h3>
                        <p className="text-xs font-medium text-blue-light">
                          {project.role}
                          {project.period && ` · ${project.period}`}
                        </p>
                      </div>
                    </div>

                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex shrink-0 items-center gap-1.5 rounded-full border border-blue-light/30 px-3.5 py-2 text-xs font-semibold text-blue-light transition-colors hover:bg-blue-light/10"
                      >
                        Visitar sitio <ExternalLink size={13} />
                      </a>
                    ) : (
                      <button
                        disabled
                        title="Sitio no disponible todavía"
                        className="flex shrink-0 cursor-not-allowed items-center gap-1.5 rounded-full border border-cream/10 px-3.5 py-2 text-xs font-semibold text-cream/30"
                      >
                        Visitar sitio <ExternalLink size={13} />
                      </button>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-cream/70">{project.description}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-cream/5 px-3 py-1 text-xs font-medium text-cream/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-start gap-2 rounded-xl border border-cream/10 bg-cream/[0.03] px-4 py-3 text-xs text-cream/50">
                    <FileText size={14} className="mt-0.5 shrink-0" />
                    <span>{project.status}. Proyecto propio en etapa temprana — todavía no facturó.</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
