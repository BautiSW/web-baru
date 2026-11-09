// Conversaciones de ejemplo para "Cómo uso la IA" — ilustran usos reales y
// cotidianos, no son capturas reales.

export interface ChatMessage {
  role: 'user' | 'ai'
  text: string
}

export interface ChatTab {
  key: string
  label: string
  assistant: string
  messages: ChatMessage[]
  /** true = tarjeta "Próximamente", sin conversación real. */
  locked?: boolean
  lockedMessage?: string
}

export const aiChatTabs: ChatTab[] = [
  {
    key: 'experimentar',
    label: 'Experimentar',
    assistant: 'Claude Code',
    messages: [
      { role: 'user', text: 'Quiero ver qué pasa si conecto un formulario directo a WhatsApp sin usar ninguna API paga. ¿Es una locura?' },
      { role: 'ai', text: 'No tanto: se puede armar con un webhook y un flujo en n8n. Empecemos por el disparador.' },
      { role: 'user', text: 'Dale, probemos aunque explote todo.' },
      { role: 'ai', text: 'Ese es el espíritu. Si explota, al menos sabemos dónde.' },
    ],
  },
  {
    key: 'crear-ideas',
    label: 'Crear ideas',
    assistant: 'ChatGPT',
    messages: [
      { role: 'user', text: 'Necesito ideas para el primer posteo de Retruco Agency. Todavía no tenemos clientes, así que nada de inventar casos.' },
      { role: 'ai', text: 'Mejor: contá un problema común en pymes y cómo se automatiza, en lenguaje simple, sin prometer resultados que no probaste.' },
      { role: 'user', text: 'Me gusta. Armemos ese ángulo.' },
      { role: 'ai', text: 'Dale, arranquemos por el problema, no por nosotros.' },
    ],
  },
  {
    key: 'resolver-problemas',
    label: 'Resolver problemas',
    assistant: 'Claude Code',
    messages: [
      { role: 'user', text: 'Mi web carga lentísimo en el celu y no entiendo por qué.' },
      { role: 'ai', text: 'Pasame el link. Lo primero que miro son las imágenes: casi siempre son el problema.' },
      { role: 'user', text: 'Sí, había fotos de 5 MB.' },
      { role: 'ai', text: 'Ahí está. Las paso a WebP y a tamaño de celular: debería cargar en un segundo.' },
    ],
  },
  {
    key: 'agendar',
    label: 'Agendar',
    assistant: 'Claude',
    messages: [
      { role: 'user', text: 'Esta semana tengo dos parciales, una entrega y una reunión con un cliente. ¿Cómo me organizo?' },
      { role: 'ai', text: 'Primero lo que tiene fecha fija: parciales y reunión. La entrega la partimos en tres bloques de dos horas.' },
      { role: 'user', text: '¿Y si se me complica algún día?' },
      { role: 'ai', text: 'Dejamos el viernes a la tarde libre de colchón. Siempre se complica algo.' },
    ],
  },
  {
    key: 'organizarme',
    label: 'Organizarme',
    assistant: 'Claude',
    messages: [
      { role: 'user', text: 'Tengo mil cosas en la cabeza: facu, laburo, mails, ideas sueltas. Ayudame a ordenarlas.' },
      { role: 'ai', text: 'Cuatro listas: hoy, esta semana, algún día y ruido. Lo que cae en ruido, se borra.' },
      { role: 'user', text: '¿Y las ideas sueltas?' },
      { role: 'ai', text: 'Van a "algún día". No se pierden, pero tampoco te sacan foco.' },
    ],
  },
  {
    key: 'aprender',
    label: 'Aprender',
    assistant: 'ChatGPT',
    messages: [
      { role: 'user', text: 'Quiero entender cómo armar un flujo simple en n8n. Nunca hice uno.' },
      { role: 'ai', text: 'Arranquemos de cero: un disparador, una acción, un solo paso. Nada de diez nodos el primer día.' },
      { role: 'user', text: 'Uf, me da impresión esto de los "agentes de IA".' },
      { role: 'ai', text: 'Es más Excel con esteroides que ciencia ficción. Vamos paso a paso.' },
    ],
  },
  {
    key: 'agentes',
    label: 'Agentes',
    assistant: '—',
    locked: true,
    lockedMessage: 'Un agente que contesta, agenda y hace el seguimiento solo. Está en el taller: cuando salga, lo vas a poder probar acá mismo.',
    messages: [],
  },
]
