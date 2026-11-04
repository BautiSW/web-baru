import { useState } from 'react'
import { Briefcase, FileDown, House, Mail, User, Wrench } from 'lucide-react'
import { site } from '@/data/site'
import { navigate, type Route } from '@/lib/router'

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[17px]" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-[17px]" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
)

type Item =
  | { kind: 'route'; route: Route; label: string; icon: React.ReactNode }
  | { kind: 'link'; href: string; label: string; icon: React.ReactNode; download?: boolean }

const nav: Item[] = [
  { kind: 'route', route: 'home', label: 'Taller', icon: <House className="size-[17px]" strokeWidth={1.7} /> },
  { kind: 'route', route: 'about', label: 'Mi historia', icon: <User className="size-[17px]" strokeWidth={1.7} /> },
  { kind: 'route', route: 'work', label: 'Work', icon: <Briefcase className="size-[17px]" strokeWidth={1.7} /> },
  { kind: 'route', route: 'garage', label: 'Under the hood', icon: <Wrench className="size-[17px]" strokeWidth={1.7} /> },
  { kind: 'route', route: 'contact', label: 'Contacto', icon: <Mail className="size-[17px]" strokeWidth={1.7} /> },
]

const links: Item[] = [
  { kind: 'link', href: site.linkedin, label: 'LinkedIn', icon: <LinkedInIcon /> },
  { kind: 'link', href: site.instagram, label: 'Instagram', icon: <InstagramIcon /> },
  { kind: 'link', href: site.cv, label: 'Descargar CV', icon: <FileDown className="size-[17px]" strokeWidth={1.7} />, download: true },
]

export function Dock({ route }: { route: Route }) {
  const [tip, setTip] = useState<string | null>(null)

  const renderItem = (item: Item) => {
    const active = item.kind === 'route' && item.route === route
    const cls = `relative flex size-10 items-center justify-center rounded-xl transition-colors duration-200 sm:size-11 ${
      active ? 'bg-white/14 text-cream' : 'text-cream/60 hover:bg-white/8 hover:text-cream'
    }`
    const events = {
      onMouseEnter: () => setTip(item.label),
      onMouseLeave: () => setTip(null),
      'aria-label': item.label,
    }
    const tooltip = tip === item.label && (
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/85 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cream">
        {item.label}
      </span>
    )
    if (item.kind === 'route') {
      return (
        <button key={item.label} className={cls} onClick={() => navigate(item.route)} {...events}>
          {item.icon}
          {tooltip}
        </button>
      )
    }
    return (
      <a
        key={item.label}
        className={cls}
        href={item.href}
        {...(item.download ? { download: 'CV-Bautista-Suarez.pdf' } : { target: '_blank', rel: 'noopener noreferrer' })}
        {...events}
      >
        {item.icon}
        {tooltip}
      </a>
    )
  }

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-3 sm:bottom-6">
      <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-black/55 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl">
        {nav.map(renderItem)}
        <span className="mx-1 h-6 w-px bg-white/12" />
        {links.map(renderItem)}
      </div>
    </nav>
  )
}
