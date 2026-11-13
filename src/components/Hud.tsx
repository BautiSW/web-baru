import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { site } from '@/data/site'
import { navigate, useRoute } from '@/lib/router'

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(t)
  }, [])
  return now
}

export function Hud() {
  const now = useClock()
  const route = useRoute()
  const away = route !== 'home'
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setRoleIndex((i) => (i + 1) % site.roles.length), 3200)
    return () => clearInterval(t)
  }, [])

  const tz = 'America/Argentina/Buenos_Aires'
  const date = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: tz })
    .format(now)
    .replace(/\./g, '')
  const time = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(now)

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between px-5 pt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream/75 sm:px-7">
      <button
        onClick={() => navigate('home')}
        className="group pointer-events-auto origin-top-left text-left transition-transform duration-300 ease-out hover:scale-[1.08] active:scale-[1.02]"
        aria-label={away ? 'Volver al taller' : site.name}
      >
        <span className="flex items-center gap-2 text-cream">
          {site.name}
          {away && (
            <span className="translate-x-[-4px] text-[9px] tracking-[0.18em] text-warm opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              ← Volver al taller
            </span>
          )}
        </span>
        <span className="relative mt-1 block h-4 overflow-hidden text-cream/50">
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              className="block"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {site.roles[roleIndex]}
            </motion.span>
          </AnimatePresence>
        </span>
      </button>
      <div className="hidden text-right sm:block">
        <span className="block">{date}</span>
        <span className="mt-1 block text-cream/50">{time} · Buenos Aires</span>
      </div>
    </header>
  )
}
