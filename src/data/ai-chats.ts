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
      { role: 'user', text: 'Necesito ideas para el primer posteo de SAIBA Studios. Todavía no tenemos clientes, así que nada de inventar casos.' },
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
      { role: 'user', text: 'wAise me tira un error raro al guardar un proceso y no entiendo por qué.' },
      { role: 'ai', text: 'Pasame el stack trace y el fragmento donde se guarda. Puede ser un campo que llega vacío.' },
      { role: 'user', text: 'Ahí va. Y sí, encontré el campo.' },
      { role: 'ai', text: 'Era eso: el id llegaba undefined antes de que cargara el formulario. Validalo antes del submit y listo.' },
    ],
  },
  {
    key: 'agendar',
    label: 'Agendar',
    assistant: 'Claude',
    messages: [
      { role: 'user', text: 'Tengo entrega de la facu, un llamado con mi socio de SAIBA y quiero avanzar con GoStudy. Decime cómo ordeno el día.' },
      { role: 'ai', text: 'La facu primero, tiene fecha fija. El llamado a la tarde. GoStudy si te queda pila a la noche.' },
      { role: 'user', text: '¿Y si no me queda pila?' },
      { role: 'ai', text: 'Entonces se corre a mañana. No se te va a caer el mundo encima.' },
    ],
  },
  {
    key: 'organizarme',
    label: 'Organizarme',
    assistant: 'Claude',
    messages: [
      { role: 'user', text: 'Se me mezclan las tareas de SAIBA, la facu y GoStudy en la cabeza. Ayudame a separarlas.' },
      { role: 'ai', text: 'Armemos tres columnas: Facu, SAIBA, GoStudy. Todo lo demás es ruido por ahora.' },
      { role: 'user', text: '¿Y los mails sueltos que no sé dónde van?' },
      { role: 'ai', text: 'Van en una cuarta columna: "Después". Ahí pueden descansar en paz.' },
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
    lockedMessage: 'Estoy aprendiendo a armar agentes. Volvé en unos meses y te muestro uno funcionando.',
    messages: [],
  },
]
