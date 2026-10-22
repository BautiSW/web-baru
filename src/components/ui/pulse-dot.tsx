import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

// The blue dot after "Bauti" — kept as its own element so it can pulse
// independently of the surrounding heading/logo type size.
export function PulseDot({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion()

  return (
    <motion.span
      className={cn('inline-block text-blue-light', className)}
      animate={reduced ? undefined : { opacity: [1, 0.45, 1], scale: [1, 1.3, 1] }}
      transition={reduced ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      .
    </motion.span>
  )
}
