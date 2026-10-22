import { Lightbulb, Users, Sparkles, Crown } from 'lucide-react'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { PhotoSlot } from '@/components/ui/photo-slot'

const traits = [
  {
    icon: Lightbulb,
    title: 'Curioso',
    text: 'Me gusta entender cómo funcionan las cosas y probar ideas nuevas antes de que estén "terminadas".',
  },
  {
    icon: Sparkles,
    title: 'Builder con IA',
    text: 'Uso inteligencia artificial todos los días para pensar, organizarme y construir.',
  },
  {
    icon: Users,
    title: 'Compañero de equipo',
    text: 'Sumo mejor en equipo: escucho, aporto y me involucro en todo el proceso, no solo en mi parte.',
  },
  {
    icon: Crown,
    title: 'Me gusta organizar',
    text: 'Administrar, liderar y poner orden en el caos es algo que disfruto, no un trámite.',
  },
]

export function About() {
  return (
    <section id="sobre-mi" className="bg-[#F6F0E6] px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal className="mx-auto w-fit justify-self-center md:mx-0 md:justify-self-start">
            <PhotoSlot
              file="bauti-estudio.webp"
              alt="Bautista Suárez, foto de estudio"
              fit="contain"
              width={520}
              height={760}
              className="h-auto w-[70vw] max-w-sm object-contain sm:w-[65vw] md:h-[75vh] md:max-h-[720px] md:w-auto md:max-w-full"
            />
          </Reveal>

          <Reveal delay={0.2}>
            <SectionHeading eyebrow="Quién soy" title="Sobre mí" tone="onCream" align="left" />

            <p className="text-lg leading-relaxed text-black/80">
              Tengo 19 años, vivo en Buenos Aires y estudio Administración de
              Empresas en la Universidad Torcuato Di Tella. Emprendo desde muy
              chico: Hoy estoy construyendo proyectos propios usando IA como
              herramienta central de trabajo, desde la idea hasta el primer
              prototipo funcionando.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-black/80">
              Me gusta crear, organizar equipos y resolver problemas reales.
              Busco una pasantía donde pueda aprender del mundo profesional,
              aportar desde el día uno y seguir creciendo junto a gente de la
              que aprender.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {traits.map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} delay={0.3 + i * 0.1}>
                  <div className="h-full rounded-2xl border border-black/10 bg-black/[0.02] p-5 transition-colors hover:border-blue/40">
                    <Icon className="mb-3 text-blue" size={22} />
                    <h3 className="font-heading text-sm font-semibold text-black">{title}</h3>
                    <p className="mt-1 text-sm text-black/60">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
