import { useState } from 'react'
import { motion } from 'motion/react'
import { tools, languages } from '@/data/tools'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'

function Marquee({ items, direction, started }: { items: string[]; direction: 'left' | 'right'; started: boolean }) {
  const doubled = [...items, ...items]
  const animClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'

  return (
    <div className="overflow-hidden">
      <div className={`flex w-max gap-3 ${animClass}`}>
        {doubled.map((item, i) => {
          const isOriginal = i < items.length
          return (
            <span
              key={`${item}-${i}`}
              style={isOriginal && started ? { animationDelay: `${i * 60}ms` } : undefined}
              className={`shrink-0 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-black shadow-sm ${
                isOriginal ? (started ? 'animate-chip-in' : 'opacity-0') : ''
              }`}
            >
              {item}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export function Tools() {
  const [started, setStarted] = useState(false)
  const ia = tools.filter((t) => t.category === 'ia').map((t) => t.name)
  const software = tools.filter((t) => t.category === 'software').map((t) => t.name)

  return (
    <section id="herramientas" className="bg-cream px-5 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="Con qué trabajo" title="Herramientas" tone="onCream" />

        <motion.div
          className="flex flex-col gap-4"
          viewport={{ once: true, amount: 0.3 }}
          onViewportEnter={() => setStarted(true)}
        >
          <Marquee items={ia} direction="left" started={started} />
          <Marquee items={software} direction="right" started={started} />
        </motion.div>

        <Reveal className="mt-14">
          <p className="text-center font-mono text-xs font-medium uppercase tracking-[0.2em] text-blue">
            Idiomas
          </p>

          <div className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-center sm:gap-10">
            {languages.map((lang, i) => (
              <Reveal key={lang.name} delay={i * 0.1} className="text-center">
                <p className="font-heading text-sm font-bold text-black">{lang.name}</p>
                <p className="text-xs text-black/50">{lang.level}</p>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
