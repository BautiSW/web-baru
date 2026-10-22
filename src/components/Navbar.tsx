import { useEffect, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Menu, X, Download } from 'lucide-react'
import { PulseDot } from '@/components/ui/pulse-dot'

const links = [
  { href: '#sobre-mi', label: 'Sobre mí' },
  { href: '#como-uso-ia', label: 'Cómo uso la IA' },
  { href: '#recorrido', label: 'Recorrido' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#herramientas', label: 'Herramientas' },
  { href: '#contacto', label: 'Contacto' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (current) => {
    if (open) return
    const previous = scrollY.getPrevious() ?? current
    const delta = current - previous
    if (current < 80) {
      setHidden(false)
    } else if (delta > 4) {
      setHidden(true)
    } else if (delta < -4) {
      setHidden(false)
    }
  })

  useEffect(() => {
    const sections = links.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <motion.header
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 z-50 w-full border-b border-cream/10 bg-black/80 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#inicio" className="font-heading text-lg font-bold text-cream">
          Bauti<PulseDot />
        </a>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors hover:text-blue-light ${
                active === l.href ? 'text-blue-light' : 'text-cream/70'
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/cv.pdf"
            download
            className="flex items-center gap-2 rounded-full bg-blue px-4 py-2 text-sm font-semibold text-cream shadow-sm shadow-blue/30 transition-transform hover:-translate-y-0.5 hover:bg-blue-light hover:text-black"
          >
            <Download size={16} />
            Descargar CV
          </a>
        </div>

        <button
          onClick={() => setOpen((o) => {
            if (!o) setHidden(false)
            return !o
          })}
          aria-label="Abrir menú"
          className="text-cream lg:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-cream/10 bg-black px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-cream/80"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/cv.pdf"
              download
              onClick={() => setOpen(false)}
              className="flex w-fit items-center gap-2 rounded-full bg-blue px-4 py-2 text-sm font-semibold text-cream"
            >
              <Download size={16} />
              Descargar CV
            </a>
          </div>
        </div>
      )}
    </motion.header>
  )
}
