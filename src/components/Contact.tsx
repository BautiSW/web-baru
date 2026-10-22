import { Reveal } from './Reveal'
import { AnimatedGradient } from '@/components/ui/animated-gradient'
import { ParallaxBackground } from '@/components/ui/parallax-background'
import { SocialIcons } from '@/components/ui/social-icons'

export function Contact() {
  return (
    <section id="contacto" className="relative overflow-hidden px-5 py-28">
      <ParallaxBackground>
        <AnimatedGradient variant="a" />
      </ParallaxBackground>
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative mx-auto max-w-2xl text-center">
        <p className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-cream/80">
          Llegaste hasta acá, así que ya me conocés un poco. Si querés conocerme más, escribime.
        </p>
        <h2 className="font-heading text-3xl font-bold text-cream sm:text-4xl">Contacto</h2>
        <p className="mx-auto mt-4 max-w-md text-cream/80">
          Busco una pasantía donde aprender, aportar y seguir construyendo con
          IA. Si te interesa charlar, escribime.
        </p>

        <Reveal className="mt-10 flex justify-center">
          <SocialIcons />
        </Reveal>
      </div>
    </section>
  )
}
