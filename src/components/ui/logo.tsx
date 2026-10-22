import { useState } from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  /** Filename inside public/logos/, e.g. "saiba.png". */
  file: string
  alt: string
  /** Shown instead if the file isn't in public/logos/ yet. */
  initials: string
  size?: number
  /** "circle" (projects list) or "tile" (white rounded square, timeline). */
  variant?: 'circle' | 'tile'
  /** Inner padding for the tile variant — off for logos that already fill their square (e.g. ITBA). */
  padded?: boolean
  /** "contain" (default, white tile with padding) or "cover" (logo already fills a square — no padding, no white bg, crops to fill). */
  fit?: 'contain' | 'cover'
  className?: string
}

// Falls back to initials when the real logo file hasn't been dropped into
// public/logos/ yet — never breaks the layout.
export function Logo({
  file,
  alt,
  initials,
  size = 40,
  variant = 'circle',
  padded = true,
  fit = 'contain',
  className,
}: LogoProps) {
  const [errored, setErrored] = useState(false)

  if (variant === 'tile') {
    const isCover = fit === 'cover'
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center overflow-hidden rounded-xl',
          isCover ? 'bg-transparent' : 'bg-white',
          !isCover && padded && 'p-1.5',
          className,
        )}
        style={{ width: size, height: size }}
      >
        {errored ? (
          <span className="font-heading text-xs font-bold text-navy">{initials}</span>
        ) : (
          <img
            src={`/logos/${file}`}
            alt={alt}
            loading="lazy"
            onError={() => setErrored(true)}
            className={cn('h-full w-full', isCover ? 'object-cover' : 'object-contain')}
          />
        )}
      </div>
    )
  }

  if (errored) {
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full bg-blue/15 font-heading font-bold text-blue-light',
          className,
        )}
        style={{ width: size, height: size, fontSize: size * 0.34 }}
      >
        {initials}
      </div>
    )
  }

  return (
    <img
      src={`/logos/${file}`}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={cn('shrink-0 rounded-full bg-cream/5 object-contain', className)}
      style={{ width: size, height: size }}
    />
  )
}
