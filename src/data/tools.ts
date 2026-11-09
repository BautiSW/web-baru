export interface ToolItem {
  name: string
  /** Archivo en /public/logos */
  logo: string
}

export interface ToolGroup {
  title: string
  items: ToolItem[]
}

const t = (name: string, logo: string): ToolItem => ({ name, logo })

export const toolGroups: ToolGroup[] = [
  {
    title: 'IA',
    items: [
      t('Claude', 'claude'),
      t('Claude Code', 'claude'),
      t('ChatGPT', 'chatgpt'),
      t('Gemini', 'gemini'),
      t('Midjourney', 'midjourney'),
      t('Higgsfield', 'higgsfield'),
      t('Base44', 'base44'),
    ],
  },
  {
    title: 'Diseño y video',
    items: [t('After Effects', 'aftereffects'), t('Premiere Pro', 'premiere'), t('CapCut', 'capcut'), t('Blender', 'blender')],
  },
  {
    title: 'Desarrollo y productividad',
    items: [
      t('VS Code', 'vscode'),
      t('GitHub', 'github'),
      t('Vercel', 'vercel'),
      t('Supabase', 'supabase'),
      t('n8n', 'n8n'),
      t('Excel', 'excel'),
      t('Gmail', 'gmail'),
      t('Google Calendar', 'gcalendar'),
      t('Google Drive', 'gdrive'),
      t('Google Meet', 'gmeet'),
      t('Obsidian', 'obsidian'),
    ],
  },
]

export interface Language {
  name: string
  level: string
}

export const languages: Language[] = [
  { name: 'Español', level: 'Nativo' },
  { name: 'Inglés', level: 'Profesional · Certificación Cambridge' },
  { name: 'Portugués', level: 'Intermedio' },
]
