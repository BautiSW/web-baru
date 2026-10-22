import { useState } from 'react'
import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PhotoSource {
  /** Filename inside public/images/. */
  file: string
  /** Media query that picks this file over the base one. */
  media: string
  width: number
  height: number
}

interface PhotoSlotProps {
  /** Filename inside public/images/, e.g. "bauti.jpg". */
  file: string
  alt: string
  width?: number
  height?: number
  fit?: 'cover' | 'contain'
  className?: string
  /** Art-directed alternatives, rendered as <picture> sources (only one file downloads). */
  sources?: PhotoSource[]
  /** Extra <img> classes that only apply while `sources` are in play. */
  sourcesClassName?: string
}

// Elegant placeholder (soft gradient + icon) until the real photo lands in
// public/images/ — never breaks the layout. width/height keep the box size
// stable whether the image loads or not, so nothing jumps.
export function PhotoSlot({
  file,
  alt,
  width,
  height,
  fit = 'cover',
  className = '',
  sources,
  sourcesClassName = '',
}: PhotoSlotProps) {
  const [errored, setErrored] = useState(false)
  // If an art-directed source fails, drop the sources and retry with the base file.
  const [sourcesFailed, setSourcesFailed] = useState(false)
  const withSources = !!sources?.length && !sourcesFailed

  if (errored) {
    return (
      <div
        className={cn(
          'flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-navy to-blue/40 text-cream/30',
          className,
        )}
      >
        <ImageIcon size={32} strokeWidth={1.5} />
      </div>
    )
  }

  const img = (
    <img
      src={`/images/${file}`}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      onError={(e) => {
        const failedBase = (e.currentTarget.currentSrc || e.currentTarget.src).endsWith(`/images/${file}`)
        if (withSources && !failedBase) setSourcesFailed(true)
        else setErrored(true)
      }}
      className={cn(fit === 'cover' ? 'object-cover' : 'object-contain', className, withSources && sourcesClassName)}
    />
  )

  if (!withSources) return img

  return (
    <picture>
      {sources!.map((s) => (
        <source key={s.file} srcSet={`/images/${s.file}`} media={s.media} width={s.width} height={s.height} />
      ))}
      {img}
    </picture>
  )
}
