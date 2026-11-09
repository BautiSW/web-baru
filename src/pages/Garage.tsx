import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { ArrowUp, RotateCcw } from 'lucide-react'
import { PageShell, Reveal } from './PageShell'
import { aiChatTabs, type ChatTab } from '@/data/ai-chats'
import { toolGroups } from '@/data/tools'

// La escena ASCII (y su SDK) va en un chunk aparte: no pesa en el home
const AsciiHero = lazy(() => import('@/components/AsciiHero').then((m) => ({ default: m.AsciiHero })))

const process = [
  { n: '01', title: 'Detectar', text: 'Todo arranca con algo que me molesta o que veo que se puede hacer mejor.' },
  { n: '02', title: 'Prototipar', text: 'Armo una primera versión rápido, con IA, para ver si la idea se sostiene.' },
  { n: '03', title: 'Romper', text: 'La pruebo con gente real y ajusto lo que no anda. Las veces que haga falta.' },
  { n: '04', title: 'Lanzar', text: 'Cuando funciona, sale. Y después se sigue mejorando.' },
]

const credentials = [
  { title: 'AI Fluency: Framework & Foundations', org: 'Anthropic', date: 'Ago. 2026', text: 'Uso eficaz, ético y seguro de la IA.' },
  { title: 'Desarrollo Web', org: 'Coderhouse', date: '2023', text: 'HTML, CSS, JavaScript, UX y marketing digital.' },
]

/* ───────────── Chat en vivo ───────────── */

type Phase = 'typing' | 'thinking' | 'streaming' | 'done'
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Reproduce una conversación: escribo en la barra, mando, la IA "piensa" y contesta palabra por palabra. */
function useConversation(tab: ChatTab, run: boolean, runId: number) {
  const [shown, setShown] = useState(0) // mensajes ya enviados por completo
  const [phase, setPhase] = useState<Phase>('done')
  const [draft, setDraft] = useState('') // lo que se está tipeando en la barra
  const [partial, setPartial] = useState(0) // palabras visibles de la respuesta en curso

  useEffect(() => {
    setShown(0)
    setDraft('')
    setPartial(0)
    setPhase('done')
    if (!run || tab.locked) return
    let alive = true
    ;(async () => {
      await sleep(500)
      for (let i = 0; i < tab.messages.length && alive; i++) {
        const m = tab.messages[i]
        if (m.role === 'user') {
          setPhase('typing')
          const step = Math.min(32, 1500 / m.text.length)
          for (let c = 1; c <= m.text.length && alive; c++) {
            setDraft(m.text.slice(0, c))
            await sleep(step * (m.text[c - 1] === ' ' ? 1.6 : 1))
          }
          await sleep(320)
          if (!alive) return
          setDraft('')
          setShown(i + 1)
          await sleep(350)
        } else {
          setPhase('thinking')
          await sleep(900)
          setPhase('streaming')
          const words = m.text.split(' ').length
          for (let w = 1; w <= words && alive; w++) {
            setPartial(w)
            await sleep(55)
          }
          if (!alive) return
          setShown(i + 1)
          setPartial(0)
          await sleep(600)
        }
      }
      if (alive) setPhase('done')
    })()
    return () => {
      alive = false
    }
  }, [tab, run, runId])

  return { shown, phase, draft, partial }
}

function Dots() {
  return (
    <span className="inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-cream/60"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </span>
  )
}

function LiveChat() {
  const box = useRef<HTMLDivElement>(null)
  const inView = useInView(box, { once: true, margin: '-25% 0px' })
  const [active, setActive] = useState(aiChatTabs[0].key)
  const [runId, setRunId] = useState(0)
  const tab = aiChatTabs.find((t) => t.key === active)!
  const { shown, phase, draft, partial } = useConversation(tab, inView, runId)
  const pick = (k: string) => {
    setActive(k)
    setRunId((n) => n + 1)
  }

  return (
    <div ref={box} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.015]">
      <div className="flex gap-1 overflow-x-auto border-b border-white/10 p-2">
        {aiChatTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => pick(t.key)}
            className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm transition-colors ${
              t.key === active ? 'bg-white/12 text-cream' : 'text-cream/55 hover:text-cream'
            }`}
          >
            {t.label}
            {t.locked && <span className="ml-2 font-mono text-[9px] uppercase tracking-wider text-warm">En el taller</span>}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7">
        <p className="eyebrow">con {tab.assistant}</p>
        {phase === 'done' && shown > 0 && (
          <button
            onClick={() => setRunId((n) => n + 1)}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/45 transition-colors hover:text-cream"
          >
            <RotateCcw className="size-3" /> Repetir
          </button>
        )}
      </div>

      <div className="space-y-3 px-5 py-6 sm:px-8">
        {tab.locked ? (
          <motion.div
            key={tab.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[200px] flex-col justify-center"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-warm">● Próximamente</p>
            <p className="mt-3 max-w-lg text-lg leading-relaxed text-cream/75">{tab.lockedMessage}</p>
          </motion.div>
        ) : (
          tab.messages.map((m, i) => {
            const user = m.role === 'user'
            const sent = i < shown
            const current = i === shown
            const thinking = current && !user && phase === 'thinking'
            const streaming = current && !user && phase === 'streaming'
            const words = m.text.split(' ')
            return (
              <div key={`${tab.key}-${runId}-${i}`} className={`relative flex ${user ? 'justify-end' : 'justify-start'}`}>
                {/* Burbuja final (reserva el espacio aunque no se vea, así no salta el layout) */}
                <motion.p
                  initial={false}
                  animate={{ opacity: sent || streaming ? 1 : 0, y: sent || streaming ? 0 : 8 }}
                  transition={{ duration: 0.25 }}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                    user ? 'bg-cream text-ink' : 'border border-white/10 bg-white/5 text-cream/85'
                  }`}
                >
                  {streaming
                    ? words.map((w, k) => (
                        <span key={k} className={k < partial ? '' : 'opacity-0'}>
                          {w}{' '}
                        </span>
                      ))
                    : m.text}
                </motion.p>
                {thinking && (
                  <div className="absolute left-0 top-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <Dots />
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {!tab.locked && (
        <div className="border-t border-white/10 p-3 sm:p-4">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
            <p className="min-h-[1.5em] flex-1 truncate text-[15px]">
              {draft ? (
                <span className="text-cream">{draft}</span>
              ) : (
                <span className="text-cream/30">Escribile a {tab.assistant}…</span>
              )}
              {phase === 'typing' && (
                <motion.span
                  className="ml-0.5 inline-block h-[1.1em] w-px translate-y-[0.2em] bg-cream"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                />
              )}
            </p>
            <span
              className={`grid size-8 place-items-center rounded-full transition-colors ${
                draft ? 'bg-cream text-ink' : 'bg-white/10 text-cream/40'
              }`}
            >
              <ArrowUp className="size-4" />
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ───────────── Página ───────────── */

/** Título que aparece letra por letra en la oscuridad. */
function TypedTitle({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span aria-label={text}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + i * 0.045, duration: 0.05 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

function SectionHead({ n, title, text }: { n: string; title: string; text?: string }) {
  return (
    <Reveal className="mb-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-warm">{n}</p>
      <h2 className="display mt-3 text-4xl sm:text-6xl">{title}</h2>
      {text && <p className="mt-4 max-w-xl text-cream/60">{text}</p>}
    </Reveal>
  )
}

export function Garage() {
  return (
    <PageShell eyebrow="" hero={<Suspense fallback={<div className="absolute inset-x-0 top-0 h-screen bg-black" />}><AsciiHero delay={0.3} /></Suspense>} chromeDelay={1.6}>
      {/* Intro: arranca en negro y aparece la escena ASCII de fondo */}
      <section className="flex min-h-[calc(100svh-14rem)] flex-col justify-end pb-10 sm:justify-center sm:pb-0 lg:items-end">
        <div className="lg:w-auto">
          <motion.div
            className="mb-5 flex items-center gap-2 opacity-60"
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 0.6, scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{ originX: 0 }}
          >
            <div className="h-px w-8 bg-cream" />
            <span className="font-mono text-[10px] tracking-wider">∞</span>
            <div className="h-px flex-1 bg-cream" />
          </motion.div>
          <h1 className="display whitespace-nowrap text-6xl sm:text-8xl lg:text-[7.5rem] xl:text-[8.5rem]">
            <TypedTitle text="Under" delay={0.7} />
            <br />
            <TypedTitle text="the hood." delay={0.95} />
          </h1>
          <motion.p
            className="mt-7 max-w-md text-lg text-cream/75 sm:text-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            Lo que no se ve cuando algo funciona.
          </motion.p>
          <motion.div
            className="mt-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-cream/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.4, 1] }}
            transition={{ delay: 2.3, duration: 2, repeat: Infinity, repeatType: 'mirror' }}
          >
            Scroll ↓
          </motion.div>
        </div>
      </section>

      <section className="mt-40">
        <SectionHead n="01 · Cómo trabajo" title="Del problema al producto." />
        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08} className="bg-ink p-6">
              <p className="font-mono text-sm text-warm">{s.n}</p>
              <h3 className="mt-4 font-display text-2xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/60">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-32">
        <SectionHead
          n="02 · Cómo uso la IA"
          title="Mi copiloto de todos los días."
          text="Para experimentar, crear ideas, resolver problemas, agendar, organizarme y aprender. Tocá una y mirá."
        />
        <Reveal>
          <LiveChat />
        </Reveal>
      </section>

      <section className="mt-32">
        <SectionHead n="03 · Herramientas" title="Caja de herramientas." />
        <div className="grid gap-10 lg:grid-cols-3">
          {toolGroups.map((g, gi) => (
            <div key={g.title}>
              <Reveal delay={gi * 0.08}>
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/45">{g.title}</p>
              </Reveal>
              <div className="flex flex-wrap gap-2.5">
                {g.items.map((t, i) => (
                  <motion.span
                    key={t.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: gi * 0.08 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-cream/90 transition-colors hover:border-white/25 hover:bg-white/[0.06]"
                  >
                    <img src={`/logos/${t.logo}.png`} alt="" className="size-[18px] object-contain" loading="lazy" />
                    {t.name}
                  </motion.span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-32">
        <SectionHead n="04 · Formación" title="Certificaciones." />
        <div className="grid gap-4 sm:grid-cols-2">
          {credentials.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-white/10 p-6 transition-colors hover:border-warm/40">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/45">
                  {c.org} · {c.date}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold">{c.title}</h3>
                <p className="mt-2 text-sm text-cream/60">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
