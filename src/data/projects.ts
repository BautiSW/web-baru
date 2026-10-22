export interface Project {
  title: string
  role: string
  period: string
  logo: string
  initials: string
  description: string
  tags: string[]
  status: string
  link: string | null
  /** "cover" for logos that already fill a square (no padding/white bg). Defaults to "contain". */
  logoFit?: 'contain' | 'cover'
}

export const projects: Project[] = [
  {
    title: 'SAIBA Studios',
    role: 'Cofundador',
    period: '2026 – presente',
    logo: 'saiba.png',
    initials: 'SS',
    description:
      'Agencia de desarrollo web e integración de IA para pymes, junto a mi socio: sitios a medida, diseño UI/UX y automatización con chatbots y respuestas automáticas. La idea es simple: impulsar a los negocios a usar la inteligencia artificial en su día a día.',
    tags: ['Desarrollo web', 'UI/UX', 'Automatización con IA'],
    status: 'Etapa temprana',
    link: 'https://saiba-studios.vercel.app/',
  },
  {
    title: 'wAise',
    role: 'Creador',
    period: '2025',
    logo: 'waise.png',
    initials: 'wA',
    logoFit: 'cover',
    description:
      'Plataforma de RRHH con IA — "The Intelligent HR Companion" — para selección, onboarding, desempeño y cultura organizacional, con análisis y coaching asistidos por IA. Desarrollada y presentada en el HR Challenge de Base44.',
    tags: ['RRHH', 'IA', 'Base44'],
    status: 'Presentado en HR Challenge',
    link: 'https://waise.base44.app/',
  },
  {
    title: 'GoStudy!',
    role: 'Creador',
    period: '2025',
    logo: 'gostudy.png',
    initials: 'GS',
    logoFit: 'cover',
    description:
      'App para optimizar el estudio: gestión de materias, sesiones de estudio, recordatorios y logros, con un sistema de puntos que gamifica el aprendizaje con objetivos diarios y recompensas.',
    tags: ['Educación', 'Gamificación', 'Producto'],
    status: 'En desarrollo',
    link: 'https://gostudy.base44.app/',
  },
  {
    title: 'Behind the Door',
    role: 'Creador',
    period: '',
    logo: 'behind-the-door.png',
    initials: 'BD',
    description:
      'Mi colección de NFTs — BTD Club. Subíamos las piezas a OpenSea, armando una galería de arte digital en clave Web3.',
    tags: ['NFT', 'OpenSea', 'Web3'],
    status: 'Proyecto personal',
    link: 'https://btd.base44.app/',
  },
]
