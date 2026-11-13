# Portfolio — Bautista Suárez

Portfolio personal hecho con React + Vite + TypeScript + Tailwind CSS, `motion` (framer-motion) y lucide-react.

## Correr en local (Windows)

Necesitás tener [Node.js](https://nodejs.org) instalado (v18 o superior).

1. Abrí una terminal (PowerShell o Git Bash) en esta carpeta.
2. Instalá las dependencias:

   ```
   npm install
   ```

3. Levantá el servidor de desarrollo:

   ```
   npm run dev
   ```

4. Abrí el link que te muestra la terminal (por lo general `http://localhost:5173`).

Cada vez que guardás un archivo, la página se actualiza sola.

## Build de producción

```
npm run build
```

Esto genera la carpeta `dist/` lista para publicar. Podés previsualizarla con:

```
npm run preview
```

## Publicar en Netlify

**Opción A — arrastrar y soltar (más simple):**

1. Corré `npm run build`.
2. Entrá a [app.netlify.com](https://app.netlify.com) → "Add new site" → "Deploy manually".
3. Arrastrá la carpeta `dist/` (no la carpeta del proyecto completa) al recuadro de Netlify.

**Opción B — conectado a un repo Git (recomendado para actualizar fácil):**

1. Subí este proyecto a GitHub.
2. En Netlify: "Add new site" → "Import an existing project" → elegí el repo.
3. Netlify va a detectar automáticamente el `netlify.toml` con:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Cada push a la rama principal va a disparar un nuevo deploy automático.

## Cómo está armada (v2 — "el taller")

- **Home**: `src/components/Scene.tsx`. Imagen del taller (`public/scene/taller.webp`) con zonas cliqueables encima. Hover = foco sobre el objeto + etiqueta; click = zoom de cámara hacia el objeto y entra a la sección.
- **Zonas cliqueables**: `src/data/hotspots.ts`. Son polígonos en coordenadas de la imagen original (1677 x 938). Si cambiás la imagen, hay que reajustarlos.
- **HUD**: `src/components/Hud.tsx` (nombre + rol rotativo arriba a la izquierda, fecha y hora arriba a la derecha) y `src/components/Dock.tsx` (barra de abajo).
- **Secciones**: `src/pages/` → `About.tsx` (Mi historia), `Work.tsx` (proyectos), `Garage.tsx` (Under the hood), `Contact.tsx`.
- **Rutas**: por hash (`#/about`, `#/work`, `#/garage`, `#/contact`) en `src/lib/router.ts`.

## Editar contenido

- **Proyectos**: `src/data/projects.ts`
- **Recorrido**: `src/data/timeline.ts`
- **Herramientas e idiomas**: `src/data/tools.ts`
- **Conversaciones de "Cómo uso la IA"**: `src/data/ai-chats.ts`
- **Links, mail y roles del HUD**: `src/data/site.ts`
- **CV**: reemplazá `public/cv.pdf` por tu archivo actualizado (mismo nombre).
