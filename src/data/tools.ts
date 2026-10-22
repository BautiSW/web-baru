export interface ToolItem {
  name: string
  category: 'ia' | 'software'
}

export const tools: ToolItem[] = [
  { name: 'Claude', category: 'ia' },
  { name: 'Claude Code', category: 'ia' },
  { name: 'ChatGPT', category: 'ia' },
  { name: 'Gemini', category: 'ia' },
  { name: 'Midjourney', category: 'ia' },
  { name: 'GitHub Copilot', category: 'ia' },
  { name: 'Base44', category: 'ia' },
  { name: 'n8n', category: 'ia' },
  { name: 'Excel', category: 'software' },
  { name: 'Google Suite', category: 'software' },
  { name: 'Microsoft Office', category: 'software' },
  { name: 'Visual Studio', category: 'software' },
  { name: 'After Effects', category: 'software' },
  { name: 'Premiere Pro', category: 'software' },
  { name: 'Blender 3D', category: 'software' },
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
