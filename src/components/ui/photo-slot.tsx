import { useState } from 'react'
import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PhotoSlotProps {
  /** Filename inside public/images/, e.g. "bauti.jpg". */
  file: string
  alt: string
  width?: number
  height?: number
  fit?: 'cover' | 'contain'
  className?: string
}

// Elegant placeholder (soft gradient + icon) until the real photo lands in
// public/images/ — never breaks the layout. width/height keep the box size
// stable whether the image loads or not, so nothing jumps.
export function PhotoSlot({ file, alt, width, height, fit = 'cover', className = '' }: PhotoSlotProps) {
  const [errored, setErrored] = useState(false)

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

  return (
    <img
      src={`/images/${file}`}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      onError={() => setErrored(true)}
      className={cn(fit === 'cover' ? 'object-cover' : 'object-contain', className)}
    />
  )
}
