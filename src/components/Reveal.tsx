import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  /** Vertical travel distance in px — keep within 24–40. */
  distance?: number
  /** Animation duration in seconds — keep within 0.6–0.9. */
  duration?: number
  className?: string
}

export function Reveal({ children, delay = 0, distance = 32, duration = 0.7, className = '' }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
