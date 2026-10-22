export interface Milestone {
  period: string
  title: string
  description: string
  tags: string[]
  logo: string
  initials: string
  /** Set false only for logos that already fill their square (ITBA). */
  padded?: boolean
}

// Orden exacto pedido por Bauti (no es estrictamente cronológico).
export const timeline: Milestone[] = [
  {
    period: '2011 – 2024',
    title: "St. Luke's College",
    description:
      'Bachiller con especialización en Ciencias Exactas. En el colegio jugué rugby, participé de competencias por equipos entre casas (por colores) y de otras actividades grupales. Entre todo eso, terminé de aprender a trabajar en equipo.',
    tags: ['Trabajo en equipo', 'Ciencias Exactas', 'Rugby 🏉'],
    logo: 'stlukes.png',
    initials: 'SL',
  },
  {
    period: '2023',
    title: 'University of Cambridge — IGCSE',
    description: 'Certificación internacional de inglés (English as a Second Language), nivel profesional acreditado.',
    tags: ['English as a Second Language', 'Certificación internacional'],
    logo: 'cambridge.png',
    initials: 'CB',
  },
  {
    period: 'Feb. 2023 – abr. 2023',
    title: 'Coderhouse — Desarrollo Web',
    description:
      'HTML, CSS, JavaScript, diseño UX y marketing digital. Nota final: 7,8. Las bases de cómo se construye una web. Hoy me sirven para dirigir mejor a la IA cuando creo.',
    tags: ['HTML/CSS', 'JavaScript', 'UX'],
    logo: 'coderhouse.png',
    initials: 'CH',
  },
  {
    period: 'Mar. 2025 – ago. 2025',
    title: 'ITBA — Ingeniería Industrial',
    description:
      'Un semestre que sirvió para confirmar hacia dónde quería ir: los negocios y la creación de productos.',
    tags: ['Ingeniería Industrial', 'Un semestre'],
    logo: 'itba.png',
    initials: 'ITBA',
    padded: false,
  },
  {
    period: 'Ago. 2025 – presente',
    title: 'Universidad Torcuato Di Tella',
    description: 'Licenciatura en Administración de Empresas, con una futura especialización en Marketing.',
    tags: ['Administración de Empresas', 'Marketing'],
    logo: 'ditella.png',
    initials: 'UTDT',
  },
  {
    period: 'Ago. 2026',
    title: 'Certificación de Anthropic — AI Fluency: Framework & Foundations',
    description: 'Uso eficaz, ético y seguro de la IA.',
    tags: ['Anthropic', 'AI Fluency'],
    logo: 'anthropic.png',
    initials: 'AN',
  },
]
