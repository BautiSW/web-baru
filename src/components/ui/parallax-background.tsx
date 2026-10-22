import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

// Wraps an AnimatedGradient so it drifts slower than the page scroll. The
// child is overscanned (inset -10%) so the shift never reveals an edge.
export function ParallaxBackground({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div className="absolute inset-[-10%]" style={reduced ? undefined : { y }}>
        {children}
      </motion.div>
    </div>
  )
}
