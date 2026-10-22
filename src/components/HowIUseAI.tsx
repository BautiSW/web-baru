import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Lock } from 'lucide-react'
import { aiChatTabs, type ChatTab } from '@/data/ai-chats'
import { SectionHeading } from './SectionHeading'

const TYPE_MS = 22
const AFTER_MESSAGE_MS = 650
const BEFORE_NEXT_MESSAGE_MS = 450

const traits = ['Creo.', 'Experimento.', 'Aprendo rápido.', 'Ejecuto.']

function RotatingTraits() {
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setIndex((i) => (i + 1) % traits.length), 1800)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <div className="flex h-7 items-center font-mono text-sm text-blue-light">
      <AnimatePresence mode="wait">
        <motion.span
          key={traits[index]}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {traits[index]}
        </motion.span>
      </AnimatePresence>
      <span className="ml-0.5 animate-pulse">_</span>
    </div>
  )
}

function ChatWindow({ tab }: { tab: ChatTab }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [typingText, setTypingText] = useState('')
  const timers = useRef<number[]>([])
  const messages = tab.locked ? [{ role: 'ai' as const, text: tab.lockedMessage ?? '' }] : tab.messages

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const charMs = reduced ? 0 : TYPE_MS
    const pauseMessage = reduced ? 150 : AFTER_MESSAGE_MS
    const pauseNext = reduced ? 100 : BEFORE_NEXT_MESSAGE_MS

    let cancelled = false
    setVisibleCount(0)
    setTypingText('')

    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn()
      }, ms)
      timers.current.push(id)
    }

    const typeMessage = (msgIndex: number) => {
      if (msgIndex >= messages.length) return

      const text = messages[msgIndex].text
      let charIndex = 0

      const typeChar = () => {
        if (cancelled) return
        charIndex += 1
        setTypingText(text.slice(0, charIndex))
        if (charIndex < text.length) {
          schedule(typeChar, charMs)
        } else {
          schedule(() => {
            setVisibleCount(msgIndex + 1)
            setTypingText('')
            schedule(() => typeMessage(msgIndex + 1), pauseNext)
          }, pauseMessage)
        }
      }

      schedule(typeChar, charMs || 1)
    }

    typeMessage(0)

    return () => {
      cancelled = true
      timers.current.forEach((id) => clearTimeout(id))
      timers.current = []
    }
  }, [tab.key])

  const typingRole = messages[visibleCount]?.role

  return (
    <div className="w-full max-w-xl rounded-2xl border border-cream/10 bg-[#121214] shadow-2xl shadow-blue/10">
      <div className="flex items-center gap-2 border-b border-cream/10 px-5 py-3.5">
        {tab.locked ? (
          <>
            <Lock size={13} className="text-cream/40" />
            <span className="font-mono text-xs text-cream/50">Agentes · Próximamente</span>
          </>
        ) : (
          <>
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
            <span className="ml-3 font-mono text-xs text-cream/50">
              {tab.label} · con {tab.assistant}
            </span>
          </>
        )}
      </div>

      <div
        className={`flex min-h-[260px] flex-col gap-3 p-5 ${
          tab.locked ? 'items-center justify-center text-center' : 'justify-end'
        }`}
      >
        {tab.locked && (
          <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-cream/5 text-cream/40">
            <Lock size={20} />
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.slice(0, visibleCount).map((m, i) => (
            <motion.div
              key={`${tab.key}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={tab.locked ? '' : `flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <span
                className={
                  tab.locked
                    ? 'max-w-sm text-sm leading-relaxed text-cream/70'
                    : `max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.role === 'user' ? 'bg-blue text-cream' : 'bg-cream/10 text-cream/90'
                      }`
                }
              >
                {m.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {typingText && (
          <div className={tab.locked ? '' : `flex ${typingRole === 'user' ? 'justify-end' : 'justify-start'}`}>
            <span
              className={
                tab.locked
                  ? 'max-w-sm text-sm leading-relaxed text-cream/70'
                  : `max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      typingRole === 'user' ? 'bg-blue text-cream' : 'bg-cream/10 text-cream/90'
                    }`
              }
            >
              {typingText}
              <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-current align-middle">&nbsp;</span>
            </span>
          </div>
        )}

      </div>
    </div>
  )
}

export function HowIUseAI() {
  const [activeTab, setActiveTab] = useState(0)
  const tab = aiChatTabs[activeTab]

  return (
    <section id="como-uso-ia" className="bg-black px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Lo central" title="Cómo uso la IA" tone="onBlack" />

        <div className="mx-auto mb-10 max-w-2xl text-center">
          <RotatingTraits />
          <p className="mt-4 text-lg leading-relaxed text-cream/80">
            Uso la IA todos los días: para experimentar, crear ideas, resolver
            problemas del día a día, agendar cosas y organizarme.
          </p>
          <p className="mt-2 font-mono text-xs text-cream/40">
            Así le hablo a la IA en un día normal (conversaciones simuladas).
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          {aiChatTabs.map((t, i) => {
            if (t.locked) {
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(i)}
                  className={`group relative overflow-hidden rounded-full border border-dashed px-4 py-2 text-sm font-medium transition-colors animate-dash-pulse ${
                    activeTab === i ? 'border-blue-light text-cream' : 'border-cream/25 text-cream/50'
                  }`}
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cream/10 to-transparent animate-shimmer-sweep" />
                  <span className="relative flex items-center gap-1.5">
                    <Lock size={12} />
                    {t.label}
                    <span className="ml-1 rounded-full bg-cream/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cream/60">
                      Próximamente
                    </span>
                  </span>
                </button>
              )
            }

            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(i)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === i
                    ? 'border-blue bg-blue/20 text-cream'
                    : 'border-cream/15 text-cream/60 hover:border-cream/30 hover:text-cream'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <ChatWindow tab={tab} />
        </div>
      </div>
    </section>
  )
}
