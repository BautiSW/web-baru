import { motion } from 'motion/react'
import { PageShell, Reveal, SectionTitle } from './PageShell'
import { timeline } from '@/data/timeline'
import { languages } from '@/data/tools'

const traits = [
  { title: 'Curioso', text: 'Me gusta entender cómo funcionan las cosas y probar ideas nuevas antes de que estén "terminadas".' },
  { title: 'Builder con IA', text: 'Uso inteligencia artificial todos los días para pensar, organizarme y construir.' },
  { title: 'Compañero de equipo', text: 'Sumo mejor en equipo: escucho, aporto y me involucro en todo el proceso, no solo en mi parte.' },
  { title: 'Me gusta organizar', text: 'Administrar, liderar y poner orden en el caos es algo que disfruto, no un trámite.' },
]

const offScreen = [
  { title: 'Fútbol', text: 'Juego y soy hincha de Racing Club.' },
  { title: 'Rugby', text: "Lo jugué en St. Luke's. Ahí aprendí a trabajar en equipo." },
  { title: 'Golf', text: 'Lo arranqué este año.' },
  { title: 'Piano', text: 'Clases y un piano de estudio en casa.' },
  { title: 'Autos clásicos', text: 'El Volvo 122S de la escena es real: un proyecto con mi viejo.' },
  { title: 'Mate', text: 'Siempre al lado de la compu.' },
]

export function About() {
  return (
    <PageShell eyebrow="Mi historia" sceneFocus="88% 62%">
      <section className="flex flex-col items-center gap-6 py-6 md:flex-row md:justify-center md:gap-8">
        <motion.h1
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="display text-[clamp(3rem,5.6vw,6.5rem)]"
        >
          Business
        </motion.h1>
        <motion.img
          src="/images/bauti-bn.webp"
          alt="Bautista Suárez"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-40 rounded-2xl object-cover sm:w-48 lg:w-52"
          style={{ aspectRatio: '3 / 4' }}
        />
        <motion.h1
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="display text-[clamp(3rem,5.6vw,6.5rem)]"
        >
          Builder
        </motion.h1>
      </section>

      <Reveal className="mx-auto mt-16 max-w-3xl space-y-5 text-lg leading-relaxed text-cream/80 sm:text-xl">
        <p>
          Tengo 20 años, vivo en Buenos Aires y estudio Administración de Empresas en la Universidad Torcuato Di
          Tella. Emprendo desde muy chico. Hoy estoy construyendo proyectos propios usando IA como herramienta
          central de trabajo, desde la idea hasta el primer prototipo funcionando.
        </p>
        <p>
          Me gusta crear, organizar equipos y resolver problemas reales. Busco una pasantía donde pueda aprender del
          mundo profesional, aportar desde el día uno y seguir creciendo junto a gente de la que aprender.
        </p>
      </Reveal>

      <section className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {traits.map((t, i) => (
          <Reveal key={t.title} delay={i * 0.08} className="bg-ink p-6">
            <p className="eyebrow mb-3">0{i + 1}</p>
            <h3 className="font-display text-xl font-bold">{t.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream/60">{t.text}</p>
          </Reveal>
        ))}
      </section>

      <section className="mt-28">
        <SectionTitle>El camino hasta acá</SectionTitle>
        <p className="mb-10 max-w-xl text-cream/60">
          Con un cambio de rumbo incluido, porque darse cuenta a tiempo también es una skill.
        </p>
        <div className="border-t border-white/10">
          {timeline.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.05}>
              <div className="grid gap-4 border-b border-white/10 py-7 md:grid-cols-[180px_56px_1fr]">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-cream/50">{m.period}</p>
                <div className="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-white">
                  <img
                    src={`/logos/${m.logo}`}
                    alt=""
                    className={m.padded === false ? 'h-full w-full object-cover' : 'h-full w-full object-contain p-1.5'}
                  />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold">{m.title}</h3>
                  <p className="mt-2 max-w-2xl text-cream/65">{m.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-28">
        <SectionTitle>Fuera de la pantalla</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offScreen.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-white/10 p-6 transition-colors hover:border-warm/40">
                <h3 className="font-display text-xl font-bold">{o.title}</h3>
                <p className="mt-2 text-sm text-cream/60">{o.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-28">
        <SectionTitle>Idiomas</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {languages.map((l) => (
            <div key={l.name} className="rounded-full border border-white/15 px-5 py-2.5">
              <span className="font-semibold">{l.name}</span>
              <span className="ml-2 text-sm text-cream/55">{l.level}</span>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
