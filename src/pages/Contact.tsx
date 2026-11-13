import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Check, FileDown, Send } from 'lucide-react'
import { PageShell } from './PageShell'
import { AtlasHero } from '@/components/AtlasHero'
import { site } from '@/data/site'
import { AsciiPortrait } from '@/components/AsciiPortrait'

/** Título que aparece letra por letra en la oscuridad (igual que en Under the hood). */
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

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
})

type Status = 'idle' | 'sending' | 'sent' | 'error'

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  textarea = false,
  delay,
}: {
  label: string
  name: string
  type?: string
  placeholder: string
  textarea?: boolean
  delay: number
}) {
  const cls =
    'w-full resize-none border-b border-white/15 bg-transparent pb-3 pt-2 text-[17px] text-cream placeholder:text-cream/25 outline-none transition-colors focus:border-cream/70'
  return (
    <motion.label className="block" {...fadeUp(delay)}>
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/45">{label}</span>
      {textarea ? (
        <textarea name={name} required rows={4} placeholder={placeholder} className={cls} />
      ) : (
        <input name={name} type={type} required placeholder={placeholder} className={cls} autoComplete={name === 'email' ? 'email' : 'name'} />
      )}
    </motion.label>
  )
}

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setStatus('sending')
    try {
      // Netlify Forms: el formulario "contacto" está declarado también en index.html
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <PageShell eyebrow="" hero={<AtlasHero figure={false} />} chromeDelay={1.4}>
      <section className="grid min-h-[calc(100svh-15rem)] items-center gap-14 pb-10 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        {/* Izquierda: foto, título y contacto directo */}
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}>
            <AsciiPortrait className="w-56 sm:w-64 lg:w-[250px]" />
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/35">
              <span className="hidden sm:inline">Pasá el mouse</span>
              <span className="sm:hidden">Tocá la foto</span>
            </p>
          </motion.div>

          <motion.p
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.24em] text-cream/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Contacto
          </motion.p>
          <h1 className="display mt-2 text-6xl sm:text-7xl xl:text-8xl">
            <TypedTitle text="Hablemos." delay={0.8} />
          </h1>
          <motion.p className="mt-6 max-w-md text-lg text-cream/70" {...fadeUp(1.5)}>
            ¿Una idea, un proyecto o una propuesta? Escribime y lo charlamos.
          </motion.p>

          <motion.div className="mt-8" {...fadeUp(1.75)}>
            <p className="text-sm text-cream/45">O directo a</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex items-center gap-1.5 font-semibold text-cream transition-colors hover:text-warm"
              >
                {site.email}
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <span className="hidden h-4 w-px bg-white/15 sm:block" />
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 font-semibold text-cream transition-colors hover:text-warm"
              >
                LinkedIn
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href={site.cv}
                download="CV-Bautista-Suarez.pdf"
                className="inline-flex items-center gap-1.5 font-semibold text-cream transition-colors hover:text-warm"
              >
                CV <FileDown className="size-4" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Derecha: formulario */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[380px] flex-col justify-center"
              >
                <span className="grid size-12 place-items-center rounded-full bg-cream text-ink">
                  <Check className="size-5" />
                </span>
                <h2 className="display mt-6 text-4xl sm:text-5xl">¡Llegó!</h2>
                <p className="mt-3 max-w-sm text-cream/65">Gracias por escribir. Te respondo lo antes posible.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-8 w-fit font-mono text-[11px] uppercase tracking-[0.18em] text-cream/50 transition-colors hover:text-cream"
                >
                  Mandar otro mensaje
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                name="contacto"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                onSubmit={submit}
                className="space-y-9"
                exit={{ opacity: 0 }}
              >
                <input type="hidden" name="form-name" value="contacto" />
                <p className="hidden">
                  <label>
                    No completar: <input name="bot-field" />
                  </label>
                </p>
                <Field label="Nombre" name="nombre" placeholder="Tu nombre" delay={1.2} />
                <Field label="Email" name="email" type="email" placeholder="tu@email.com" delay={1.35} />
                <Field label="Mensaje" name="mensaje" placeholder="Contame en qué estás pensando…" textarea delay={1.5} />
                <motion.div className="flex flex-wrap items-center gap-5" {...fadeUp(1.65)}>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="group inline-flex items-center gap-2.5 rounded-full bg-cream px-7 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-ink transition-[transform,opacity] duration-200 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60"
                  >
                    <Send className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
                  </button>
                  {status === 'error' && (
                    <p className="text-sm text-warm">
                      No se pudo enviar. Escribime a <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>.
                    </p>
                  )}
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageShell>
  )
}
