import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { PageShell, Reveal } from './PageShell'
import { AtlasHero } from '@/components/AtlasHero'
import { languages } from '@/data/tools'
import { navigate } from '@/lib/router'

/* ───────────── Contenido ───────────── */

interface Chapter {
  year: string
  kicker: string
  title: string
  text: string
  photos: string[]
  logo?: string
}

const chapters: Chapter[] = [
  {
    year: '2006',
    kicker: 'El arranque',
    title: 'Buenos Aires',
    text: 'Nací en Buenos Aires. De chico, siempre afuera: el río, la pelota y los autos clásicos de mi viejo.',
    photos: ['chico-rio'],
  },
  {
    year: '2011',
    kicker: 'El colegio',
    title: "St. Luke's College",
    text: 'Bachiller en Ciencias Exactas. Rugby, competencias entre casas y un grupo de amigos que sigue. En 2023, el IGCSE de inglés de Cambridge.',
    photos: ['stlukes-puerta', 'stlukes-egreso', 'stlukes-gorros'],
    logo: 'stlukes.png',
  },
  {
    year: '2023',
    kicker: 'El primer código',
    title: 'Coderhouse',
    text: 'Mi primer curso de desarrollo web: HTML, CSS, JavaScript y UX. Las bases que hoy uso para dirigir a la IA cuando construyo.',
    photos: [],
    logo: 'coderhouse.png',
  },
  {
    year: '2025',
    kicker: 'Un desvío',
    title: 'ITBA',
    text: 'Un semestre de Ingeniería Industrial que sirvió para confirmar hacia dónde quería ir: los negocios y crear productos.',
    photos: ['itba'],
    logo: 'itba.png',
  },
  {
    year: '2025',
    kicker: 'El rumbo',
    title: 'Di Tella',
    text: 'Administración de Empresas en la Universidad Torcuato Di Tella, con la idea de especializarme en Marketing.',
    photos: ['ditella-auto'],
    logo: 'ditella.png',
  },
  {
    year: 'Hoy',
    kicker: 'Construyendo',
    title: 'Ideas que andan',
    text: 'GoStudy, wAise y ahora Retruco Agency con mi socio. Noches de código con la IA de copiloto. En 2026, la certificación AI Fluency de Anthropic.',
    photos: ['programando'],
    logo: 'anthropic.png',
  },
]

const offScreen = [
  { title: 'Fútbol', text: 'Juego desde que me acuerdo. Hincha de Racing.', photo: 'futbol-chico', span: 'md:col-span-2' },
  { title: 'Rugby', text: "Lo jugué en St. Luke's: ahí aprendí a jugar para el equipo.", photo: 'rugby', span: '' },
  { title: 'Piano', text: 'Clases y un piano de estudio en casa.', photo: 'piano', span: 'md:row-span-2' },
  { title: 'Golf', text: 'Lo arranqué este año.', photo: 'golf', span: '' },
  { title: 'Autos clásicos', text: 'El Volvo del taller es real: un proyecto con mi viejo.', photo: 'auto-23', span: 'md:col-span-2' },
  { title: 'Viajes', text: 'De la nieve al Vaticano.', photo: 'nieve', span: 'md:col-span-2' },
  { title: '', text: '', photo: 'vaticano', span: 'md:col-span-2' },
]

const img = (name: string) => `/historia/${name}.webp`

/* ───────────── Piezas ───────────── */

function TypedTitle({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span aria-label={text}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + i * 0.05, duration: 0.05 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

/** Fotos del capítulo: una grande y las demás encima, como fotos sueltas sobre la mesa. */
function Photos({ ch, drift }: { ch: Chapter; drift?: MotionValue<number> }) {
  if (!ch.photos.length) {
    return (
      <div className="grid aspect-[4/3] w-full place-items-center rounded-2xl border border-white/10 bg-white/[0.03]">
        {ch.logo && <img src={`/logos/${ch.logo}`} alt="" className="w-1/3 rounded-xl bg-white p-4" />}
      </div>
    )
  }
  const [main, ...rest] = ch.photos
  return (
    <div className="relative w-full">
      <img
        src={img(main)}
        alt=""
        loading="lazy"
        className="aspect-[4/3] w-full rounded-2xl border border-white/10 object-cover shadow-2xl"
      />
      {rest.map((p, i) => (
        <motion.img
          key={p}
          src={img(p)}
          alt=""
          loading="lazy"
          style={drift ? { y: drift } : undefined}
          className={`absolute w-[42%] rounded-xl border-4 border-[#111] object-cover shadow-2xl ${
            i === 0 ? '-bottom-10 -right-8 aspect-[4/3] rotate-[4deg]' : '-left-8 -top-10 aspect-[3/4] w-[30%] -rotate-[5deg]'
          }`}
        />
      ))}
    </div>
  )
}

function ChapterText({ ch, n }: { ch: Chapter; n: number }) {
  return (
    <div>
      <p
        className="font-display text-7xl font-black leading-none sm:text-8xl lg:text-[8.5rem]"
        style={{ WebkitTextStroke: '1.5px rgba(242,237,228,0.55)', color: 'rgba(242,237,228,0.04)' }}
      >
        {ch.year}
      </p>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-warm">
        {String(n + 1).padStart(2, '0')} · {ch.kicker}
      </p>
      <h2 className="display mt-3 text-4xl sm:text-6xl">{ch.title}</h2>
      <p className="mt-5 max-w-md text-lg leading-relaxed text-cream/70">{ch.text}</p>
    </div>
  )
}

/** Línea de tiempo horizontal: al scrollear para abajo, los capítulos pasan de derecha a izquierda. */
function HorizontalTimeline() {
  const section = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [dist, setDist] = useState(0)

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })
  const x = useTransform(smooth, (v) => -v * dist)
  const bar = useTransform(smooth, [0, 1], [0, 1])
  const drift = useTransform(smooth, [0, 1], [30, -30])

  return (
    <div ref={section} className="relative left-1/2 hidden w-screen -translate-x-1/2 md:block" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max items-center gap-[8vw] pl-[10vw] pr-[12vw] will-change-transform">
          {chapters.map((ch, i) => (
            <article key={ch.title} className="grid w-[min(84vw,1080px)] grid-cols-[1.1fr_1fr] items-center gap-16">
              <Photos ch={ch} drift={drift} />
              <ChapterText ch={ch} n={i} />
            </article>
          ))}
          <article className="flex w-[min(60vw,640px)] flex-col justify-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-warm">Lo que sigue</p>
            <h2 className="display mt-3 text-5xl sm:text-7xl">Seguir construyendo.</h2>
            <button
              onClick={() => navigate('work')}
              className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              Ver lo que construí
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
          </article>
        </motion.div>

        {/* Eje: años y avance */}
        <div className="absolute inset-x-[10vw] bottom-28">
          <div className="relative h-px bg-white/15">
            <motion.div className="absolute inset-y-0 left-0 w-full origin-left bg-cream/70" style={{ scaleX: bar }} />
          </div>
          <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-cream/40">
            {chapters.map((c) => (
              <span key={c.title}>{c.year}</span>
            ))}
            <span>→</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/** En celular: la misma historia, vertical, con una línea al costado. */
function VerticalTimeline() {
  return (
    <div className="relative mt-6 space-y-20 border-l border-white/15 pl-6 md:hidden">
      {chapters.map((ch, i) => (
        <Reveal key={ch.title}>
          <span className="absolute -left-[5px] mt-3 size-2.5 rounded-full bg-cream" />
          <div className="space-y-8">
            <ChapterText ch={ch} n={i} />
            <div className="pr-6">
              <Photos ch={ch} />
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

/* ───────────── Página ───────────── */

export function About() {
  return (
    <PageShell eyebrow="" hero={<AtlasHero figure={false} full />} chromeDelay={1.4}>
      <section className="flex min-h-[calc(100svh-16rem)] flex-col items-center justify-center text-center">
        <motion.p
          className="font-mono text-[11px] uppercase tracking-[0.24em] text-cream/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Mi historia
        </motion.p>
        <h1 className="display mt-3 text-6xl sm:text-8xl lg:text-[8.5rem]">
          <TypedTitle text="De dónde vengo." delay={0.7} />
        </h1>
        <motion.p
          className="mx-auto mt-6 max-w-xl text-lg text-cream/65"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.8 }}
        >
          Tengo 20 años, vivo en Buenos Aires y estudio Administración de Empresas en Di Tella. Emprendo desde chico.
        </motion.p>
      </section>

      <HorizontalTimeline />
      <VerticalTimeline />

      <section className="mt-32 md:mt-24">
        <Reveal className="mb-10 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-cream/50">Fuera de la pantalla</p>
          <h2 className="display mt-3 text-5xl sm:text-7xl">Lo que me mueve.</h2>
        </Reveal>
        <div className="grid grid-flow-row-dense auto-rows-[220px] grid-cols-1 gap-3 sm:grid-cols-2 md:auto-rows-[240px] md:grid-cols-4">
          {offScreen.map((o, i) => (
            <Reveal key={o.photo} delay={(i % 4) * 0.06} className={`group relative overflow-hidden rounded-2xl border border-white/10 ${o.span}`}>
              <img
                src={img(o.photo)}
                alt={o.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              {o.title && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-2xl font-bold">{o.title}</h3>
                    <p className="mt-1 text-sm text-cream/70">{o.text}</p>
                  </div>
                </>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-24 pb-10 text-center">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-cream/50">Idiomas</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {languages.map((l) => (
              <div key={l.name} className="rounded-full border border-white/15 px-5 py-2.5">
                <span className="font-semibold">{l.name}</span>
                <span className="ml-2 text-sm text-cream/55">{l.level}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </PageShell>
  )
}
