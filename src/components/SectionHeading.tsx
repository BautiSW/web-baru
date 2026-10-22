import { motion } from 'motion/react'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  tone?: 'onBlack' | 'onCream'
  align?: 'center' | 'left'
}

const headingVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}
const eyebrowVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}
const titleVariants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}
const barVariants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export function SectionHeading({ eyebrow, title, tone = 'onBlack', align = 'center' }: SectionHeadingProps) {
  const titleColor = tone === 'onBlack' ? 'text-cream' : 'text-black'
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={headingVariants}
      className={`mb-12 flex flex-col ${alignment}`}
    >
      <motion.p
        variants={eyebrowVariants}
        className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-blue-light"
      >
        {eyebrow}
      </motion.p>

      <span className="overflow-hidden py-1 leading-none">
        <motion.h2
          variants={titleVariants}
          className={`font-heading text-3xl font-bold ${titleColor} sm:text-4xl`}
        >
          {title}
        </motion.h2>
      </span>

      <motion.div variants={barVariants} className="mt-4 h-1 w-14 origin-left rounded-full bg-blue" />
    </motion.div>
  )
}
