import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { AnimatedGradient } from '@/components/ui/animated-gradient'
import { ParallaxBackground } from '@/components/ui/parallax-background'
import { Logo } from '@/components/ui/logo'
import { timeline } from '@/data/timeline'

const TILE_SIZE = 56

interface TimelineItemProps {
  milestone: (typeof timeline)[number]
  index: number
  total: number
  progress: MotionValue<number>
}

function TimelineItem({ milestone, index, total, progress }: TimelineItemProps) {
  const threshold = total > 1 ? index / (total - 1) : 0
  const start = Math.max(0, threshold - 0.1)
  const dotScale = useTransform(progress, [start, threshold], [0.82, 1])
  const dotOpacity = useTransform(progress, [start, threshold], [0.4, 1])
  const ringShadow = useTransform(
    progress,
    [start, threshold],
    ['0 0 0 0 rgba(100,166,228,0)', '0 0 0 5px rgba(100,166,228,0.35)'],
  )

  return (
    <motion.li
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut', delay: (index % 4) * 0.1 }}
      className="relative mb-10 pl-20 last:mb-0"
    >
      <motion.div
        style={{ scale: dotScale, opacity: dotOpacity, boxShadow: ringShadow }}
        className="absolute left-0 top-0 rounded-xl"
      >
        <Logo
          file={milestone.logo}
          alt={milestone.title}
          initials={milestone.initials}
          size={TILE_SIZE}
          variant="tile"
          padded={milestone.padded ?? true}
        />
      </motion.div>

      <p className="font-mono text-xs font-medium uppercase tracking-wide text-blue">{milestone.period}</p>
      <h3 className="mt-1 font-heading text-lg font-bold text-black">{milestone.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-black/60">{milestone.description}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {milestone.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-black/5 px-2.5 py-0.5 text-[11px] font-medium text-black/55">
            {tag}
          </span>
        ))}
      </div>
    </motion.li>
  )
}

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="recorrido" className="bg-cream">
      <div className="relative flex h-64 flex-col items-center justify-center overflow-hidden px-5 text-center">
        <ParallaxBackground>
          <AnimatedGradient variant="b" />
        </ParallaxBackground>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative">
          <p className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-cream/80">Recorrido</p>
          <h2 className="font-heading text-4xl font-bold text-cream">El camino hasta acá</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-cream/80">
            Con un cambio de rumbo incluido — porque darse cuenta a tiempo también es una skill.
          </p>
        </div>
      </div>

      <div className="px-5 py-20">
        <div ref={containerRef} className="mx-auto max-w-2xl">
          <ol className="relative pl-[1px]">
            <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-black/10" />
            <motion.div
              style={{ scaleY: lineScale }}
              className="absolute left-[27px] top-0 h-full w-0.5 origin-top bg-blue"
            />
            {timeline.map((milestone, i) => (
              <TimelineItem
                key={milestone.title}
                milestone={milestone}
                index={i}
                total={timeline.length}
                progress={scrollYProgress}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
