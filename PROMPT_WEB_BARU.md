# PROMPT: Portfolio web de Bautista Suárez (Baru)

> Claude Code: leé este archivo COMPLETO antes de hacer nada. Hablame en castellano rioplatense, tono relajado y directo. Este archivo reemplaza cualquier instrucción técnica anterior que te haya dado (en particular: usamos **TypeScript**, no JavaScript puro).

---

## 1. Quién soy y para qué es la web

Soy Bautista Suárez (Baru), 19 años, vivo en Buenos Aires. Estudio Administración de Empresas en la Universidad Torcuato Di Tella (primer año). Soy emprendedor en etapa temprana.

**Objetivo de la web:** que una empresa o un reclutador la vea, se ría, entienda rápido quién soy y quiera contratarme (busco una pasantía / primer trabajo en una empresa que me meta en el mundo profesional).

**Qué tiene que transmitir (en este orden de importancia):**
1. Que uso la IA todos los días para pensar, organizarme y construir (esto es lo central).
2. Que soy carismático, con humor, buena persona y compañero: trabajo bien en equipo y me gusta organizar, administrar y liderar.
3. Que soy curioso, creativo y me gusta hacer cosas.
4. Que la web da ganas de seguir scrolleando. Tiene que ser estética y llamar la atención, sin volverse un circo.

**Reglas de honestidad (importantes):**
- No inventes logros, clientes, números ni experiencia. Si falta un dato, dejá `[COMPLETAR]` bien visible.
- Mis proyectos son de etapa temprana y **ninguno facturó ni tiene clientes todavía**. La web puede decirlo con humor, pero nunca insinuar lo contrario.
- Los textos con humor que escribas marcalos con `[REVISAR]` para que yo los apruebe o cambie.

## 2. Stack

- **React + Vite + TypeScript + Tailwind CSS**, con estructura tipo shadcn (alias `@/` apuntando a `src/`, componentes en `src/components/ui`).
- Animaciones: `motion` (framer-motion) y, si hace falta, GSAP. Íconos: `lucide-react`.
- Fuentes por Google Fonts o `@fontsource`: Poppins (títulos), Inter / Inter Tight (texto), JetBrains Mono (detalles chicos).
- Antes de instalar cualquier librería que no esté en esta lista, avisame.
- Rendimiento: tiene que andar fluida en un celular normal. Pausá los canvas cuando no se ven (IntersectionObserver), limitá el devicePixelRatio a 2, y respetá `prefers-reduced-motion`.
- Responsive de verdad: pensá primero en celular.
- No te ocupes ahora de cómo se publica. Eso lo vemos al final. Solo dejá un `public/cv.pdf` de placeholder para el botón "Descargar CV".

## 3. Dirección visual

**Paleta general:** negro y blanco crema como base, con detalles en azul marino oscuro y las gamas de azul de los degradés.

```css
:root {
  --black: #0A0A0B;        /* fondo oscuro principal */
  --cream: #F4EFE6;        /* blanco crema (fondo claro y texto sobre oscuro) */
  --navy: #0B2545;         /* azul marino: detalles, líneas, botones */
  --blue: #1F5FA8;         /* acento */
  --blue-light: #64A6E4;   /* acento claro */
}
```

- Alternar secciones **negras** y **crema**, con **bandas de degradé** animado entre ellas o como fondo de secciones clave.
- Tipografía grande y con carácter en los títulos (Poppins 700/800), mucho aire, detalles chicos en mono.
- Que se sienta como una web de estudio de diseño, pero con mi humor encima.

### 3.1 Los dos degradés animados (se intercalan)

Son dos degradés de 21st.dev, estilo "Ribbon Field" (bandas diagonales difuminadas con una onda y grano). Quiero que **los dos se muevan** y que se **intercalen a lo largo de la página**: el Degradé A en el hero y en la sección de contacto previa al footer, el Degradé B en las bandas/transiciones del medio (por ejemplo, en el encabezado de Proyectos y de Recorrido). Si queda bien, que hagan un crossfade suave con el scroll.

Armá un componente `AnimatedGradient` reutilizable (canvas 2D, loop con `requestAnimationFrame`, con props para elegir A o B, y usable como fondo `absolute inset-0`). Como fallback antes de que cargue el canvas, usá el CSS de cada uno.

**Reglas de movimiento (de la especificación original):**
- Reloj `t` en segundos transcurridos. `ph = t * speed/100`, `spin = ph * dir`.
- Toda modulación tiene que valer exactamente 0 cuando `ph = 0` (usá `cos(x) - 1` o `sin(x + p) - sin(p)`), si no el degradé pega un salto al arrancar.
- Para bandas duras: `angle + sin(spin * 0.6) * 28 * amt` (las bandas se balancean, no giran).
- Para el campo de bandas curvo, avanzá el reloj de la onda desde su valor inicial: `clock = clock0 + ph * 1.2`.
- No redondees los valores animados (nada de `Math.round` en ángulo, centro o posiciones de paradas), porque eso hace que se vea a saltitos.
- La onda doblando las bandas: offset del eje transversal `= (wave / 100) * 0.35 * sin(cross * 2.4 * 2π + clock)`.
- El Degradé B viene con `motionAmount: 0`, o sea que solo se movería la onda. Si no se nota el movimiento, subí un poco el balanceo (`amt` alrededor de 0.4–0.6) y decime qué valores dejaste.
- Quiero movimiento lento y elegante, no mareante.

#### Degradé A — "my gradient"

- Estilo: Ribbon Field. Paleta (color @ posición): `#3CC1F6` @ 50%, `#C3CFEA` @ 47%, `#1D62D7` @ 40%, `#1839A7` @ 63%, `#1E788A` @ 100%.
- Parámetros: `angle 135, centerX 50, centerY 50, scale 68, softness 26, wave 12, distortion 28, grain 100, vignette 40, count 6, fade 40, envelope "ramp", spread -20, seed 1, backdrop #3B82F6`. Para este usá `speed 40, motionAmount 50` (en el original no estaba animado, ahora sí).
- CSS de referencia (aproximación; el grano y la onda reales requieren canvas):

```css
.gradient-a {
  background-color: #1D62D7;
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.500'/></svg>"), radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 52%, rgba(0, 0, 0, 0.32) 100%), linear-gradient(135deg, #1D62D7 0.91%, #1D62D7 42.59%, #C3CFEA 43.89%, #C3CFEA 48.11%, #3CC1F6 48.89%, #3CC1F6 56.11%, #1839A7 58.19%, #1839A7 79.81%, #1E788A 81.5%, #1E788A 100%);
  background-size: 120px 120px, auto, auto;
  background-blend-mode: overlay, normal, normal;
}
```

#### Degradé B — "Animated Gradient"

- Estilo: Ribbon Field. Paleta (color @ posición): `#FFFFFF` @ 18%, `#78B8F9` @ 57%, `#5667FF` @ 60%, `#4D2FF9` @ 100%.
- Parámetros: `angle 38, centerX 50, centerY 50, scale 68, softness 24, wave 14, distortion 28, grain 42, vignette 0, count 6, fade 40, envelope "ramp", spread -20, speed 100, motionAmount 0, motionReverse false, seed 174074637, backdrop #0B1220, animated true`. Reloj de onda: de `20.75` a `20.75 + ph * 1.2`.
- CSS de referencia:

```css
.gradient-b {
  background-color: #FFFFFF;
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.210'/></svg>"), linear-gradient(38deg, #FFFFFF 4.32%, #FFFFFF 33.18%, #78B8F9 37.86%, #78B8F9 58.14%, #5667FF 58.86%, #5667FF 79.64%, #4D2FF9 80%, #4D2FF9 100%);
  background-size: 120px 120px, auto;
  background-blend-mode: overlay, normal;
}
```

## 4. Estructura de la web

Una sola página con navegación fija arriba (logo "Baru" a la izquierda, links a las secciones, botón "Descargar CV").

1. **Hero** — fondo: Degradé A animado. Mi nombre enorme, en crema. Una frase corta con humor sobre mí y la IA `[REVISAR]`. Botones: "Ver proyectos" y "Contactame".
2. **Sobre mí** (fondo crema) — quién soy en tono cercano: curioso, creativo, compañero, me gusta organizar y liderar, uso IA todos los días, "me gusta hacer cosas". Con humor y personalidad. Foto `[COMPLETAR: foto]`.
3. **Cómo uso la IA** (fondo negro) — **la sección clave**. Mostrar con humor y de forma visual cómo uso IA en el día a día (Claude, Claude Code, ChatGPT, Gemini, Midjourney, GitHub Copilot, Base44, n8n). Proponeme 2 o 3 ideas interactivas y livianas para esta sección y elegí una. Sin APIs ni servidores: todo tiene que funcionar en el navegador. Aclaración honesta: estoy empezando mi camino en agentes de IA y automatización (Claude Code y n8n).
4. **Recorrido** — una **timeline**. Hitos reales: St. Luke's College (2011–2024), Coderhouse Desarrollo Web (2023), Universidad Torcuato Di Tella (desde ago 2025), wAise (2025), GoStudy! (2025), certificación Anthropic "AI Fluency: Framework & Foundations", SAIBA Studios (2026). Con toques de humor `[REVISAR]`. Banda con Degradé B como encabezado.
5. **Proyectos** — un **visor de archivos** (estilo explorador de carpetas) donde cada proyecto es un "archivo" que se abre. Proyectos:
   - **SAIBA Studios** (Cofundador, 2026 – presente): agencia de automatización con IA para pymes, junto a mi socio. Hoy estamos estructurando la propuesta de servicios y saliendo a buscar a los primeros clientes.
   - **wAise** (Creador, 2025): aplicación con IA que automatiza procesos de Recursos Humanos, desarrollada y presentada en el HR Challenge de Base44.
   - **GoStudy!** (Creador, 2025): plataforma que gamifica el estudio con objetivos diarios y recompensas.
   - Cartel claro y con humor: son proyectos propios en etapa temprana y todavía no facturaron `[REVISAR]`.
6. **Herramientas** — cinta de logos/chips que se mueve sola: IA (Claude, Claude Code, ChatGPT, Gemini, Midjourney, GitHub Copilot, Base44, n8n) y software (Excel, Google Suite, Microsoft Office, Visual Studio, After Effects, Premiere Pro, Blender 3D). Idiomas: español nativo, inglés profesional (certificación Cambridge), portugués intermedio.
7. **Contacto y redes** — fondo: Degradé A, con el componente **SocialIcons** (Apéndice 1) adaptado a mis redes.
8. **Footer** — el componente **HalftoneWordmarkFooter** (Apéndice 2) con mi nombre gigante hecho de puntos.

## 5. Cómo adaptar los dos componentes que ya elegí

Los códigos completos están en los apéndices. Integralos tal cual vienen y adaptalos:

**SocialIcons (Apéndice 1)**
- Dejá `src/components/ui/social-icons.tsx`. Reemplazá las redes de ejemplo por las mías: LinkedIn (`https://linkedin.com/in/bautista-suarez`), mail (`mailto:bautisuarez@gmail.com`), y `[COMPLETAR]` para GitHub e Instagram (si no tengo el link, no inventes uno: dejá el ícono deshabilitado o sin mostrar).
- Adaptá los colores: en vez del neutro oscuro, usá `--black` de fondo con borde sutil y detalles en `--blue-light`. Mantené el tooltip, la subrayada y el hover con escala.
- Como el título de la sección, usá algo con humor, tipo "Escribime, no muerdo" `[REVISAR]`.

**HalftoneWordmarkFooter (Apéndice 2)**
- Dejá `src/components/ui/halftone-wordmark-footer.tsx`. Usá `wordmark="baru"` (en minúscula, como recomienda el componente) o `"bautista"` si queda mejor, y probá cuál se lee más lindo.
- Paleta propia (usá la prop `palette`): `background: #0A0A0B`, `ink: #F4EFE6`, `warm: #64A6E4` (los puntos pasan de crema a azul claro al empujarlos).
- Fuente del wordmark: una grotesca pesada (Inter Tight o Poppins, peso 800). Cargala para que el wordmark no se vea con una tipografía de reemplazo.
- Columnas del footer: Navegar (Inicio, Sobre mí, Recorrido, Proyectos), Contacto (mail, LinkedIn). **No pongas mi teléfono en la web pública.** Línea de estudio: "Bautista Suárez" y meta: "©2026 · Buenos Aires".

## 6. Componentes que todavía te voy a pasar

Voy a mandarte más componentes de 21st.dev (como el visor de archivos y la timeline). No los inventes ahora: dejá las secciones 4 y 5 armadas con una versión simple y fácil de reemplazar, y estructurá el código para que cambiar un componente después sea fácil.

## 7. Cómo quiero que trabajes

1. **Primero mostrame un plan corto** (estructura de carpetas, componentes, cómo vas a hacer el `AnimatedGradient`) y preguntame lo que te falte. No escribas código hasta que te diga que sí.
2. Después armá una primera versión completa de punta a punta, con textos placeholder y los `[COMPLETAR]` / `[REVISAR]`.
3. Dejame todo andando para verlo en el navegador, y explicame en una línea cómo levantarlo en Windows.
4. Desde ahí, cambios de a uno por vez cuando te los pida.

---

# APÉNDICE 1 — SocialIcons (21st.dev)

````
You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
social-icons.tsx
"use client"

import { useState } from "react"

const socials = [
  {
    name: "GitHub",
    href: "https://github.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Dribbble",
    href: "https://dribbble.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
        <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
      </svg>
    ),
  },
]

export function SocialIcons() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="relative flex items-center gap-0.5 px-1.5 py-1.5 rounded-2xl bg-neutral-950 border border-white/[0.08]">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

      {socials.map((social, index) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center size-10 rounded-xl transition-colors duration-200"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          aria-label={social.name}
        >
          <span
            className={`absolute inset-1 rounded-lg bg-white/[0.08] transition-all duration-300 ease-out ${
              hoveredIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          />

          <span
            className={`relative z-10 transition-all duration-300 ease-out ${
              hoveredIndex === index ? "text-white scale-110" : "text-neutral-500"
            }`}
          >
            {social.icon}
          </span>

          <span
            className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-white transition-all duration-300 ease-out ${
              hoveredIndex === index ? "w-3 opacity-100" : "w-0 opacity-0"
            }`}
          />

          <span
            className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-white text-neutral-950 text-[11px] font-medium whitespace-nowrap transition-all duration-300 ease-out ${
              hoveredIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
            }`}
          >
            {social.name}
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rotate-45 bg-white" />
          </span>
        </a>
      ))}
    </div>
  )
}


demo.tsx
import { SocialIcons } from "@/components/ui/social-icons";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 w-full">
      <div className="flex flex-col items-center gap-12">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Connect with me</h1>
          <p className="text-sm text-neutral-400">Hover over the icons below</p>
        </div>

        <SocialIcons />
      </div>
    </main>
  )
}

```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them
````

---

# APÉNDICE 2 — HalftoneWordmarkFooter (21st.dev)

````
You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
halftone-wordmark-footer.tsx
"use client"

// Halftone Wordmark Footer — a site footer whose wordmark is set enormous and
// cropped by the bottom edge, printed as a field of halftone dots. Each dot is
// sized by how much of the letter covers its cell, so the type keeps its edges
// at any scale. Move across it and the dots part around the pointer on springs,
// warming in colour as they are pushed off their place; click and a shock ring
// runs through the word. Above it sit the studio line, tracked link columns and
// a back-to-top, separated by a hairline, all over a fine print grain.
//
// One file, React only. A 2D canvas for the dots and the grain, real anchors
// for the links. Every rule in the scoped <style> is .hwf- prefixed and nothing
// is fetched: the faces come from the host page or the fallback stacks.

import * as React from "react"

export interface HalftonePalette {
  /** The footer background. */
  background: string
  /** The dots at rest, and the text. */
  ink: string
  /** The colour a dot warms toward as it is pushed off its place. */
  warm: string
}

export type HalftonePreset = "night" | "paper" | "ember" | "cobalt"

export interface FooterLink {
  label: string
  href?: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export interface HalftoneWordmarkFooterProps {
  /** The giant word printed in dots. Lowercase reads best. */
  wordmark?: string
  /** Top-left studio line. */
  label?: string
  /** The muted line under it. */
  meta?: string
  /** Link columns along the top. */
  columns?: FooterColumn[]
  /** Show the back-to-top link. It scrolls the window to 0. Defaults to true. */
  backToTop?: boolean
  /** Starting colours. Defaults to "night". */
  preset?: HalftonePreset
  /** Colour overrides, merged over the preset. */
  palette?: { background?: string; ink?: string; warm?: string }
  /** Distance between dot centres, in CSS px. Defaults to 6. */
  dotGap?: number
  /** How far the pointer pushes, in CSS px. Defaults to 80. */
  radius?: number
  /** How much of the word's cap height hangs below the bottom edge, 0–0.6. Defaults to 0.2. */
  crop?: number
  /** Print grain over everything, 0–1. Defaults to 0.5. */
  grain?: number
  /** Pointer and click response. Defaults to true. */
  interactive?: boolean
  /** Face for the wordmark. Heavy grotesks print best. */
  fontFamily?: string
  /** Weight of the wordmark. Defaults to 800. */
  fontWeight?: number
  /** Face for the small type. */
  monoFamily?: string
  /** Root height. A definite length, never a percentage. */
  height?: string
  /** Extra root class names. */
  className?: string
}

const PRESETS: { [K in HalftonePreset]: HalftonePalette } = {
  night: { background: "#0c0c0b", ink: "#e9e4da", warm: "#e9762b" },
  paper: { background: "#efebe3", ink: "#17150f", warm: "#c2361c" },
  ember: { background: "#160a06", ink: "#f2c48c", warm: "#ff5a1f" },
  cobalt: { background: "#0d1b4d", ink: "#dfe7ff", warm: "#ffcd3c" },
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  { title: "Work", links: [{ label: "Index" }, { label: "Archive" }, { label: "Journal" }] },
  { title: "Studio", links: [{ label: "About" }, { label: "Process" }, { label: "Careers" }] },
  { title: "Contact", links: [{ label: "hello@halden.co" }, { label: "+47 22 00 41 00" }] },
]

const SANS_STACK = '"Inter Tight", "Inter Variable", "Inter", "Helvetica Neue", Arial, system-ui, sans-serif'
const MONO_STACK = '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace'

// #region halftone
// Pure helpers, lifted out and executed by tests/halftone-wordmark-footer.test.mjs.

/** Hex → [r, g, b] in 0–255, or null for anything that isn't #rgb / #rrggbb. */
export function hwfHex(hex: string) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim())
  if (!m) return null
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1]
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

/** Dot radius for a cell coverage in [0, 1]: area-true, so tone stays even. */
export function hwfRadius(coverage: number, gap: number) {
  const c = coverage < 0 ? 0 : coverage > 1 ? 1 : coverage
  return Math.sqrt(c) * gap * 0.56
}

/**
 * One step of a dot's spring back to home, plus the push from a pointer at
 * (px, py) within radius r. Returns [x, y, vx, vy]. Away from the pointer a
 * displaced dot always heads home and comes to rest.
 */
export function hwfStep(
  x: number, y: number, vx: number, vy: number,
  hx: number, hy: number, px: number, py: number, r: number,
) {
  const dx = x - px
  const dy = y - py
  const d2 = dx * dx + dy * dy
  if (r > 0 && d2 < r * r) {
    const d = Math.sqrt(d2) + 0.001
    const f = (1 - d / r) * 2.6
    vx += (dx / d) * f
    vy += (dy / d) * f
  }
  vx = (vx + (hx - x) * 0.05) * 0.84
  vy = (vy + (hy - y) * 0.05) * 0.84
  return [x + vx, y + vy, vx, vy]
}

/** How warm a dot is drawn: 0 at home, 1 once it is `span` px or more away. */
export function hwfWarmth(x: number, y: number, hx: number, hy: number, span: number) {
  const d = Math.hypot(x - hx, y - hy)
  return span > 0 ? Math.min(1, d / span) : 0
}

/** Font size that sets `measured` (width at 100px) to fill `width` exactly. */
export function hwfFitSize(measured: number, width: number) {
  return measured > 0 ? (width / measured) * 100 : 0
}
// #endregion

const HWF_CSS = `
.hwf-root {
  position: relative; width: 100%; overflow: hidden; isolation: isolate;
  background: var(--hwf-bg); color: var(--hwf-ink); -webkit-font-smoothing: antialiased;
}
.hwf-root canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; max-width: none; }
.hwf-top {
  position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 1.25fr) repeat(3, minmax(0, 1fr));
  gap: 24px; padding: clamp(22px, 3.4vw, 40px) clamp(20px, 3.4vw, 44px) 0;
  font-family: var(--hwf-mono); font-size: 10.5px; letter-spacing: .18em; text-transform: uppercase; line-height: 1.75;
}
.hwf-brand strong { display: block; font-weight: 500; }
.hwf-brand span { opacity: .45; }
.hwf-col h3 { margin: 0; font: inherit; opacity: .4; font-weight: 500; }
.hwf-col ul { list-style: none; margin: 0; padding: 0; }
.hwf-col a, .hwf-up {
  color: inherit; text-decoration: none; opacity: .78; background: none; border: 0; padding: 0;
  font: inherit; letter-spacing: inherit; text-transform: inherit; cursor: pointer;
  background-image: linear-gradient(currentColor, currentColor); background-size: 0% 1px;
  background-repeat: no-repeat; background-position: 0 100%; transition: opacity .25s ease, background-size .35s cubic-bezier(.2,.7,.1,1);
}
.hwf-col a:hover, .hwf-up:hover { opacity: 1; background-size: 100% 1px; }
.hwf-col a:focus-visible, .hwf-up:focus-visible { outline: 1px solid currentColor; outline-offset: 3px; opacity: 1; }
.hwf-rule {
  position: relative; z-index: 1; display: flex; justify-content: flex-end; align-items: center; gap: 16px;
  margin: clamp(18px, 2.6vw, 30px) clamp(20px, 3.4vw, 44px) 0; padding-top: 12px;
  border-top: 0.5px solid color-mix(in srgb, var(--hwf-ink) 16%, transparent);
  font-family: var(--hwf-mono); font-size: 10.5px; letter-spacing: .18em; text-transform: uppercase;
}
.hwf-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 720px) {
  .hwf-top { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); row-gap: 18px; }
  .hwf-brand { grid-column: 1 / -1; }
}
@media (prefers-reduced-motion: reduce) {
  .hwf-col a, .hwf-up { transition: none; }
}
`

export default function HalftoneWordmarkFooter({
  wordmark = "halden",
  label = "Halden Studio",
  meta = "©2026 · Oslo / Lisbon",
  columns = DEFAULT_COLUMNS,
  backToTop = true,
  preset = "night",
  palette,
  dotGap = 6,
  radius = 80,
  crop = 0.2,
  grain = 0.5,
  interactive = true,
  fontFamily = SANS_STACK,
  fontWeight = 800,
  monoFamily = MONO_STACK,
  height = "560px",
  className = "",
}: HalftoneWordmarkFooterProps) {
  const colors = { ...(PRESETS[preset] || PRESETS.night), ...(palette || {}) }
  const rootRef = React.useRef(null as HTMLElement | null)
  const canvasRef = React.useRef(null as HTMLCanvasElement | null)
  const opts = React.useRef({ colors, dotGap, radius, crop, grain, interactive, fontFamily, fontWeight, wordmark })
  opts.current = { colors, dotGap, radius, crop, grain, interactive, fontFamily, fontWeight, wordmark }
  const key = [wordmark, dotGap, crop, grain, fontFamily, fontWeight, colors.background, colors.ink, colors.warm].join("|")

  React.useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let w = 0
    let h = 0
    let dpr = 1
    let px = -1e5
    let py = -1e5
    let raf = 0
    let visible = true
    let awake = true
    let ring = { x: 0, y: 0, t: -1 }
    // Flat arrays: x, y, vx, vy, hx, hy, r per dot.
    let dots = new Float32Array(0)
    let count = 0
    let grainTile = null as HTMLCanvasElement | null
    const ink = hwfHex(opts.current.colors.ink) || [233, 228, 218]
    const warm = hwfHex(opts.current.colors.warm) || [233, 118, 43]

    const layout = () => {
      const o = opts.current
      const rect = root.getBoundingClientRect()
      w = Math.max(1, Math.round(rect.width))
      h = Math.max(1, Math.round(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)

      // Set the word once, at a size that fills the width, on a 1x mask.
      const mask = document.createElement("canvas")
      mask.width = w
      mask.height = h
      const m = mask.getContext("2d", { willReadFrequently: true })
      if (!m) return
      const face = o.fontWeight + " 100px " + o.fontFamily
      m.font = face
      const word = o.wordmark || " "
      const fit = hwfFitSize(m.measureText(word).width, w * 1.02)
      m.font = o.fontWeight + " " + fit + "px " + o.fontFamily
      const box = m.measureText(word)
      const cap = box.actualBoundingBoxAscent || fit * 0.72
      const c = Math.max(0, Math.min(0.6, o.crop))
      m.fillStyle = "#000"
      m.textBaseline = "alphabetic"
      m.fillText(word, (w - box.width) / 2, h + cap * c)
      const img = m.getImageData(0, 0, w, h).data

      const gap = Math.max(3, o.dotGap)
      const cols = Math.ceil(w / gap)
      const rows = Math.ceil(h / gap)
      const tmp = []
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          // Coverage: average alpha over a 3×3 sample of the cell.
          let sum = 0
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const x = Math.min(w - 1, Math.floor(gx * gap + ((sx + 0.5) * gap) / 3))
              const y = Math.min(h - 1, Math.floor(gy * gap + ((sy + 0.5) * gap) / 3))
              sum += img[(y * w + x) * 4 + 3]
            }
          }
          const cov = sum / (9 * 255)
          if (cov < 0.06) continue
          const hx = gx * gap + gap / 2
          const hy = gy * gap + gap / 2
          tmp.push(hx, hy, 0, 0, hx, hy, hwfRadius(cov, gap))
        }
      }
      dots = new Float32Array(tmp)
      count = tmp.length / 7

      // A fixed tile of print grain, drawn once and laid over every frame.
      grainTile = document.createElement("canvas")
      grainTile.width = 256
      grainTile.height = 256
      const g = grainTile.getContext("2d")
      if (g) {
        const id = g.createImageData(256, 256)
        for (let i = 0; i < id.data.length; i += 4) {
          const v = Math.random() * 255
          id.data[i] = id.data[i + 1] = id.data[i + 2] = v
          id.data[i + 3] = Math.random() < 0.5 ? 0 : 255
        }
        g.putImageData(id, 0, 0)
      }
      awake = true
    }

    const draw = (now: number) => {
      const o = opts.current
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = o.colors.background
      ctx.fillRect(0, 0, w, h)

      const r = o.interactive && !reduced ? Math.max(0, o.radius) : 0
      const ringAge = ring.t < 0 ? 1e9 : now - ring.t
      const ringR = ringAge * 0.9
      let moving = false
      for (let i = 0; i < count; i++) {
        const j = i * 7
        let x = dots[j]
        let y = dots[j + 1]
        let vx = dots[j + 2]
        let vy = dots[j + 3]
        const hx = dots[j + 4]
        const hy = dots[j + 5]
        if (!reduced) {
          if (ringAge < 900) {
            const dx = hx - ring.x
            const dy = hy - ring.y
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001
            const band = 1 - Math.min(1, Math.abs(d - ringR) / 26)
            if (band > 0) {
              const f = band * 3.2 * (1 - ringAge / 900)
              vx += (dx / d) * f
              vy += (dy / d) * f
            }
          }
          const s = hwfStep(x, y, vx, vy, hx, hy, px, py, r)
          x = s[0]
          y = s[1]
          vx = s[2]
          vy = s[3]
          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) moving = true
          else {
            x = hx
            y = hy
            vx = 0
            vy = 0
          }
          dots[j] = x
          dots[j + 1] = y
          dots[j + 2] = vx
          dots[j + 3] = vy
        }
        const k = hwfWarmth(x, y, hx, hy, 28)
        ctx.fillStyle =
          k > 0.02
            ? "rgb(" +
              Math.round(ink[0] + (warm[0] - ink[0]) * k) + "," +
              Math.round(ink[1] + (warm[1] - ink[1]) * k) + "," +
              Math.round(ink[2] + (warm[2] - ink[2]) * k) + ")"
            : o.colors.ink
        ctx.beginPath()
        ctx.arc(x, y, dots[j + 6], 0, 6.2832)
        ctx.fill()
      }

      if (grainTile && o.grain > 0) {
        ctx.globalAlpha = Math.min(1, o.grain) * 0.09
        ctx.globalCompositeOperation = "overlay"
        const pattern = ctx.createPattern(grainTile, "repeat")
        if (pattern) {
          ctx.fillStyle = pattern
          ctx.fillRect(0, 0, w, h)
        }
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = "source-over"
      }
      // Sleep once everything is home and nothing is pushing.
      awake = moving || ringAge < 900 || px > -1e4
    }

    const loop = (now: number) => {
      raf = 0
      if (!visible) return
      draw(now)
      if (awake) raf = requestAnimationFrame(loop)
    }
    const wake = () => {
      awake = true
      if (!raf && visible) raf = requestAnimationFrame(loop)
    }

    const toLocal = (e: PointerEv) => {
      const b = canvas.getBoundingClientRect()
      return [e.clientX - b.left, e.clientY - b.top]
    }
    const onMove = (e: PointerEv) => {
      if (!opts.current.interactive) return
      const p = toLocal(e)
      px = p[0]
      py = p[1]
      wake()
    }
    const onLeave = () => {
      px = -1e5
      py = -1e5
      wake()
    }
    const onDown = (e: PointerEv) => {
      if (!opts.current.interactive || reduced) return
      if ((e.target as HTMLElement).closest("a,button")) return
      const p = toLocal(e)
      ring = { x: p[0], y: p[1], t: performance.now() }
      wake()
    }

    layout()
    draw(performance.now())
    wake()

    root.addEventListener("pointermove", onMove)
    root.addEventListener("pointerleave", onLeave)
    root.addEventListener("pointerdown", onDown)
    const ro = new ResizeObserver(() => {
      layout()
      wake()
    })
    ro.observe(root)
    const io = new IntersectionObserver((entries) => {
      visible = entries[0] ? entries[0].isIntersecting : true
      if (visible) wake()
    })
    io.observe(root)
    // A web font that lands late re-sets the word in its real face.
    let alive = true
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!alive) return
        layout()
        wake()
      })
    }

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      root.removeEventListener("pointermove", onMove)
      root.removeEventListener("pointerleave", onLeave)
      root.removeEventListener("pointerdown", onDown)
    }
  }, [key])

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer
      ref={rootRef}
      className={"hwf-root " + className}
      style={
        {
          height,
          "--hwf-bg": colors.background,
          "--hwf-ink": colors.ink,
          "--hwf-mono": monoFamily,
        } as React.CSSProperties
      }
    >
      <style>{HWF_CSS}</style>
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="hwf-sr">{wordmark}</span>
      <div className="hwf-top">
        <div className="hwf-brand">
          <strong>{label}</strong>
          <span>{meta}</span>
        </div>
        {columns.map((col) => (
          <nav className="hwf-col" key={col.title} aria-label={col.title}>
            <h3>{col.title}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href || "#"}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="hwf-rule">
        {backToTop ? (
          <button type="button" className="hwf-up" onClick={toTop}>
            Back to top ↑
          </button>
        ) : null}
      </div>
    </footer>
  )
}

type PointerEv = PointerEvent


demo.tsx
"use client"

import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer"

export default function Demo() {
  // w-full matters: 21st centres demos in a flex wrapper, and a flex item
  // left at width:auto shrinks the canvas to 0px wide.
  return (
    <div className="w-full">
      <HalftoneWordmarkFooter />
    </div>
  )
}

```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them
````
