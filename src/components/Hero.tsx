import { motion, useReducedMotion } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { AnimatedGradient } from '@/components/ui/animated-gradient'
import { ParallaxBackground } from '@/components/ui/parallax-background'
import { PulseDot } from '@/components/ui/pulse-dot'

// Alternativas a la frase principal, para probar más adelante:
// 1. "Pruebo cosas hasta que una funciona. Después pruebo otra."
// 2. "Curioso de nacimiento, builder por elección."
// 3. "Si parece una buena idea, ya la estoy armando."

const NAME = 'Bauti'
const TAGLINE = 'Curioso, creativo y con Claude abierto en otra pestaña.'

const letterContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
}
const letterItem = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}
const wordContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.55 } },
}
const wordItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

export function Hero() {
  const reduced = useReducedMotion()

  return (
    <section id="inicio" className="relative flex min-h-screen items-center overflow-hidden px-5 pt-24">
      <ParallaxBackground>
        <AnimatedGradient variant="a" />
      </ParallaxBackground>
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <p className="mb-4 font-mono text-sm font-medium uppercase tracking-[0.2em] text-cream/80">
            Hola, soy
          </p>

          {reduced ? (
            <h1 className="font-heading text-6xl font-extrabold leading-[0.95] text-cream sm:text-7xl md:text-8xl">
              {NAME}
              <PulseDot />
            </h1>
          ) : (
            <motion.h1
              initial="hidden"
              animate="show"
              variants={letterContainer}
              className="font-heading text-6xl font-extrabold leading-[0.95] text-cream sm:text-7xl md:text-8xl"
              aria-label={`${NAME}.`}
            >
              {NAME.split('').map((letter, i) => (
                <motion.span key={i} variants={letterItem} className="inline-block">
                  {letter}
                </motion.span>
              ))}
              <PulseDot />
            </motion.h1>
          )}

          {reduced ? (
            <p className="mx-auto mt-6 max-w-xl text-lg text-cream/90">{TAGLINE}</p>
          ) : (
            <motion.p
              initial="hidden"
              animate="show"
              variants={wordContainer}
              className="mx-auto mt-6 max-w-xl text-lg text-cream/90"
              aria-label={TAGLINE}
            >
              {TAGLINE.split(' ').map((word, i) => (
                <motion.span key={i} variants={wordItem} className="mr-[0.3em] inline-block">
                  {word}
                </motion.span>
              ))}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: reduced ? 0.2 : 1.1 }}
            className="mt-9 flex flex-wrap justify-center gap-4"
          >
            <a
              href="#proyectos"
              className="rounded-full bg-cream px-6 py-3 text-sm font-semibold text-black shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Ver proyectos
            </a>
            <a
              href="#contacto"
              className="rounded-full border border-cream/30 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-cream/10"
            >
              Contactame
            </a>
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#sobre-mi"
        aria-label="Bajar a Sobre mí"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/60"
        animate={reduced ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ArrowDown size={22} />
      </motion.a>
    </section>
  )
}
