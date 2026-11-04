import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PageShell, Reveal, SectionTitle } from './PageShell'
import { aiChatTabs } from '@/data/ai-chats'
import { tools } from '@/data/tools'

const process = [
  { n: '01', title: 'Idea', text: 'Arranco por un problema real, no por la tecnología.' },
  { n: '02', title: 'Prototipo', text: 'Lo construyo con IA, de la idea al primer prototipo funcionando.' },
  { n: '03', title: 'Iterar', text: 'Pruebo, rompo y ajusto. Si explota, al menos sé dónde.' },
  { n: '04', title: 'Lanzar', text: 'Lo pongo en manos de gente real y aprendo de lo que pasa.' },
]

function ChatViewer() {
  const tabs = aiChatTabs
  const [active, setActive] = useState(tabs[0].key)
  const tab = tabs.find((t) => t.key === active)!

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <div className="flex gap-1 overflow-x-auto border-b border-white/10 p-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm transition-colors ${
              t.key === active ? 'bg-white/12 text-cream' : 'text-cream/55 hover:text-cream'
            }`}
          >
            {t.label}
            {t.locked && <span className="ml-2 font-mono text-[9px] uppercase tracking-wider text-warm">Pronto</span>}
          </button>
        ))}
      </div>
      <div className="min-h-[320px] p-5 sm:p-8">
        <p className="eyebrow mb-6">con {tab.assistant} · conversación de ejemplo</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {tab.locked ? (
              <p className="text-cream/65">{tab.lockedMessage}</p>
            ) : (
              tab.messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <p
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                      m.role === 'user' ? 'bg-cream text-ink' : 'border border-white/10 bg-white/5 text-cream/85'
                    }`}
                  >
                    {m.text}
                  </p>
                </div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export function Garage() {
  const ia = tools.filter((t) => t.category === 'ia')
  const software = tools.filter((t) => t.category === 'software')

  return (
    <PageShell eyebrow="Under the hood · Cómo funciona por dentro" sceneFocus="12% 55%">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="display text-6xl sm:text-8xl lg:text-[9rem]"
      >
        Under
        <br />
        the hood.
      </motion.h1>
      <p className="mt-8 max-w-xl text-lg text-cream/65">
        Abrí el capó: así trabajo, estas son mis herramientas y así uso la IA en un día normal.
      </p>

      <section className="mt-24">
        <SectionTitle>El proceso</SectionTitle>
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

      <section className="mt-28">
        <SectionTitle>Cómo uso la IA</SectionTitle>
        <p className="mb-8 max-w-xl text-cream/60">
          Para experimentar, crear ideas, resolver problemas, agendar, organizarme y aprender. Así le hablo en un día
          normal.
        </p>
        <Reveal>
          <ChatViewer />
        </Reveal>
      </section>

      <section className="mt-28">
        <SectionTitle>Herramientas</SectionTitle>
        <p className="eyebrow mb-4">IA</p>
        <div className="mb-10 flex flex-wrap gap-2.5">
          {ia.map((t) => (
            <span key={t.name} className="rounded-full border border-warm/40 px-4 py-2 text-sm text-cream">
              {t.name}
            </span>
          ))}
        </div>
        <p className="eyebrow mb-4">Software</p>
        <div className="flex flex-wrap gap-2.5">
          {software.map((t) => (
            <span key={t.name} className="rounded-full border border-white/15 px-4 py-2 text-sm text-cream/75">
              {t.name}
            </span>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
