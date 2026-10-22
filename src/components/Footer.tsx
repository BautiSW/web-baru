import HalftoneWordmarkFooter from '@/components/ui/halftone-wordmark-footer'

export function Footer() {
  return (
    <HalftoneWordmarkFooter
      wordmark="bautista"
      label="Bautista Suárez"
      meta="©2026 · Buenos Aires"
      height="420px"
      fontFamily='"Inter Tight", "Poppins", sans-serif'
      palette={{ background: '#0A0A0B', ink: '#F4EFE6', warm: '#64A6E4' }}
      columns={[
        {
          title: 'Navegar',
          links: [
            { label: 'Inicio', href: '#inicio' },
            { label: 'Sobre mí', href: '#sobre-mi' },
            { label: 'Recorrido', href: '#recorrido' },
            { label: 'Proyectos', href: '#proyectos' },
          ],
        },
        {
          title: 'Contacto',
          links: [
            { label: 'bautisuarez@gmail.com', href: 'mailto:bautisuarez@gmail.com' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bautista-suarez' },
          ],
        },
      ]}
    />
  )
}
