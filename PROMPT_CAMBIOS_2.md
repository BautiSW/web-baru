# PROMPT: Segunda ronda de cambios al portfolio de Bauti

> Claude Code: leé este archivo completo. Son correcciones sobre la web que ya tenés armada. Mismo stack, misma paleta y mismas reglas: no inventes datos, dejá `[COMPLETAR]` donde falte algo y marcá con `[REVISAR]` los textos con humor que escribas.
> Si algo de `PROMPT_CAMBIOS_1.md` no quedó aplicado (por ejemplo "Bauti." con el punto azul, o SAIBA Studios sin renombrar), aplicalo también ahora. **El proyecto se llama SAIBA Studios; no uses "Retruco" en ningún lado.**
> Antes de tocar nada, mostrame un plan corto de lo que vas a cambiar y preguntame lo que te falte.

---

## 1. Hero

- El degradé del principio me encanta: **no lo toques**.
- Reemplazá la frase de abajo del nombre. "Hago cosas. Algunas salen bien, todas enseñan." **no me gusta**.
- Usá esta, simple y con humor: **"Curioso, creativo y con Claude abierto en otra pestaña."** `[REVISAR]`.
- Regla de estilo para toda la web: **nunca uses "me gusta hacer cosas" ni "hago cosas"**. Si hace falta decirlo, es **"me gusta crear"**. Buscá esa expresión en todo el proyecto y corregila.

## 2. Animaciones al hacer scroll (importante: que SE NOTEN)

Ya te pedí esto y no quiero que sea sutil al punto de no verse. Quiero que al bajar "pase algo" en cada sección. Implementalo con **IntersectionObserver** (hook `useInView`, o `whileInView` de `motion`) y con `useScroll` de `motion` para lo que dependa del avance del scroll:

- **Hero al cargar:** el nombre y la frase entran palabra por palabra o letra por letra, con un pequeño delay entre cada una.
- **Títulos de sección:** aparecen con un reveal tipo máscara (el texto sube desde abajo de una línea).
- **Tarjetas, textos y bloques:** fade + subida de **24 a 40 px**, duración **0,6 a 0,9 s**, con **stagger** de 80–120 ms entre elementos. Se disparan **una sola vez**.
- **Barra de progreso de scroll** fina arriba de todo, en `--blue-light`.
- **Timeline:** la línea vertical **se dibuja con el avance del scroll** y cada punto se enciende cuando la línea lo alcanza.
- **Herramientas:** los chips entran en cascada.
- **Navegación:** se esconde al bajar y reaparece al subir.
- **Degradés:** un leve parallax (el fondo se mueve más lento que el contenido).
- Todo con `prefers-reduced-motion` respetado, sin saltos de layout y fluido en celular. Si algo se traba en un celular normal, bajá la intensidad antes que sacarlo.
- Cuando termines, decime exactamente qué animación pusiste en cada sección, para que yo verifique que se ven.

## 3. Sección "Cómo uso la IA": agregar "Agentes (coming soon)"

Hoy tengo seis usos: *Experimentar, Crear ideas, Resolver problemas, Agendar, Organizarme, Aprender*. Agregá una **séptima tarjeta: "Agentes"**, con una vuelta de tuerca:

- Se ve bloqueada o "en construcción": borde punteado animado, un brillo (shimmer) que pasa, un candado o un ícono de engranaje, y una etiqueta **"Próximamente"** / "Coming soon".
- Al tocarla, en vez de una conversación se muestra un mensaje corto y gracioso, tipo: "Estoy aprendiendo a armar agentes. Volvé en unos meses y te muestro uno funcionando." `[REVISAR]`
- Tiene que quedar clarísimo que es un adelanto: **no afirmes que ya hago agentes**. La gracia es mostrar que lo próximo es esto.
- Quitá cualquier mención a "hacer cosas" en esta sección (ver regla del punto 1).

## 4. "El camino hasta acá" (timeline) — reordenar y corregir

**No incluyas en la timeline** SAIBA Studios, wAise, GoStudy! ni Behind the Door. Esos son proyectos y ya están en la sección Proyectos. Sacalos de acá.

**Orden (de arriba hacia abajo):**
1. St. Luke's College
2. University of Cambridge — IGCSE
3. Coderhouse
4. Certificación de Anthropic
5. ITBA
6. Universidad Torcuato Di Tella

Mantené el título **"El camino hasta acá"**, el subtítulo **"Con un cambio de rumbo incluido — porque darse cuenta a tiempo también es una skill."**, el logo de cada institución, la fecha en letra mono azul y los chips. Contenido de cada hito (los textos con humor, `[REVISAR]`):

1. **St. Luke's College** (2011 – 2024): bachiller con especialización en Ciencias Exactas. Primaria y secundaria completa. Jugué en el equipo de rugby del colegio, con gira deportiva por Europa. Agregale chiche al trabajo en equipo, por ejemplo: "En rugby, para avanzar hay que pasar la pelota para atrás. Ahí entendí que nadie gana solo." Chips: Ciencias Exactas, Rugby 🏉, Trabajo en equipo.
2. **University of Cambridge — IGCSE** (2024): certificación internacional de inglés (English as a Second Language), nivel profesional acreditado. Chips: English as a Second Language, Certificación internacional.
3. **Coderhouse — Desarrollo Web** (feb 2023 – abr 2023): HTML, CSS, JavaScript, diseño UX y marketing digital. Nota final: 7,8. **No pongas** nada del estilo "lo dejé / lo dejé de lado". El enfoque: "Las bases de cómo se construye una web. Hoy me sirven para dirigir mejor a la IA cuando creo." Chips: HTML/CSS, JavaScript, UX.
4. **Certificación de Anthropic — AI Fluency: Framework & Foundations** `[COMPLETAR: fecha]`: uso eficaz, ético y seguro de la IA. Logo: `anthropic.png`.
5. **ITBA — Ingeniería Industrial** (mar 2025 – ago 2025): un semestre que sirvió para confirmar hacia dónde quería ir: los negocios y la creación de productos. **No menciones ecuaciones diferenciales ni nada parecido.**
6. **Universidad Torcuato Di Tella** (ago 2025 – presente): Licenciatura en Administración de Empresas, con una futura especialización en marketing. Usá el logo oficial a color (`ditella.png`).

## 5. Proyectos

- Está perfecto como está (visor de archivos, logos, link a cada sitio).
- **SAIBA Studios:** sumale a la descripción que es **impulsar a los negocios a usar la inteligencia artificial en su día a día**. Dejala simple, sin sonar a eslogan de consultora.
- Links de cada proyecto: los voy a pasar. Mientras tanto `[COMPLETAR: link]`. Cuando tengas los links, leé cada página y escribí descripciones precisas, sin inventar nada que no esté ahí (sin cifras ni clientes). Links:
  - SAIBA Studios: `[COMPLETAR]`
  - wAise: `[COMPLETAR]`
  - GoStudy!: `[COMPLETAR]`
  - Behind the Door: `[COMPLETAR]`

## 6. Contacto

- LinkedIn, mail e Instagram están bien. La sección de pasantía está bien.
- Cambiá el título "Escribime, no muerdo". No me convence. Usá un mini chiste, por ejemplo: **"Llegaste hasta acá. Escribime, que ya somos casi amigos."** `[REVISAR]`

## 7. Lo que no cambia

Herramientas, footer ("bautista" de puntos), Sobre mí y los degradés quedan como están.

## 8. Imágenes

Voy a sumar imágenes en `public/images/` y logos en `public/logos/`. Dejá listos los lugares para fotos (Sobre mí y donde tenga sentido) con un placeholder elegante hasta que estén, y con `object-fit: cover` y bordes redondeados. No inventes fotos ni uses imágenes de stock.

## Cómo quiero que trabajes

1. Primero el **plan corto** y tus preguntas.
2. Aplicá todo.
3. Al final, la lista de animaciones por sección y la lista de `[COMPLETAR]` / `[REVISAR]` que quedaron.
