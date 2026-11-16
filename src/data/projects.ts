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
  /** Carpeta en Work: tarjeta con el logo y colores de la obra del fondo */
  card: string
  palette: string[]
  style: 'marble' | 'streak'
}

export const projects: Project[] = [
  {
    title: 'Retruco Agency',
    role: 'Cofundador',
    period: '2026 – presente',
    logo: 'retruco.png',
    initials: 'RA',
    description:
      'Agencia de desarrollo web e integración de IA para pymes, junto a mi socio: sitios a medida, diseño UI/UX y automatización con chatbots y respuestas automáticas. La idea es simple: impulsar a los negocios a usar la inteligencia artificial en su día a día.',
    tags: ['Desarrollo web', 'UI/UX', 'Automatización con IA'],
    status: 'Etapa temprana',
    link: 'https://retrucoweb.vercel.app/',
    card: '/projects/retruco-card.webp',
    palette: ['#f7f5e8', '#e6dcc4', '#b8976a', '#3b2d22', '#8f4b2e', '#d98a5a', '#f4e8cf'],
    style: 'marble',
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
    card: '/projects/waise-card.webp',
    palette: ['#040507', '#0a1626', '#123d73', '#1d74d6', '#5aa9ff', '#0b1220', '#bfe0ff'],
    style: 'streak',
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
    card: '/projects/gostudy-card.webp',
    palette: ['#04150e', '#0c4a31', '#1db87c', '#7de3b6', '#0a2b1e', '#d9fff0'],
    style: 'marble',
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
    card: '/projects/behind-the-door-card.webp',
    palette: ['#050505', '#2a2a2a', '#f4f4f4', '#101010', '#8d8d8d', '#ffffff'],
    style: 'marble',
  },
]
