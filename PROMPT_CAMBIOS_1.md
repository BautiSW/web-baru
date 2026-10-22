# PROMPT: Primera ronda de cambios al portfolio de Bauti

> Claude Code: leé este archivo completo. Es una ronda de correcciones sobre la web que ya armaste a partir de `PROMPT_WEB_BARU.md`. Mismo stack, misma paleta, mismas reglas de honestidad: no inventes datos, y si falta algo dejá `[COMPLETAR]`. Los textos con humor que escribas marcalos con `[REVISAR]`.
> Antes de tocar nada, mostrame un plan corto de qué vas a cambiar en cada sección y preguntame lo que te falte. Después aplicá todo.

---

## 1. Nombre: ahora es "Bauti", no "Baru"

- "Baru" es un apodo para amigos. En toda la web (nav, hero, textos, títulos de pestaña, `<title>`, comentarios visibles) usá **Bauti**.
- En el logo de la navegación y en el hero, el nombre se escribe **"Bauti"** seguido de un **punto azul** (`Bauti.` con el punto en `--blue-light`, que se note). Dejá el punto como un elemento aparte para poder animarlo (por ejemplo, un pulso suave).
- El wordmark gigante del footer ("bautista") **no se toca**: me encanta como está.
- Donde corresponda el nombre completo, es **Bautista Suárez**.

## 2. Hero

- **Sacá** la frase "estudiante emprendedor" que está abajo del nombre.
- Escribí una frase nueva, corta, con humor, que muestre cómo soy (curioso, hacedor, me gusta crear y experimentar), **sin** nada del estilo "le pido ayuda a la IA". Tono cercano, rioplatense, sin sonar a eslogan de LinkedIn.
- Usá esta como la principal: **"Hago cosas. Algunas salen bien, todas enseñan."** `[REVISAR]`. Dejá en un comentario del código 3 alternativas para que yo las pruebe después.

## 3. Sección "Cómo uso la IA" (rediseño)

Hoy no se entiende bien qué muestran los mensajes. Cambiá el enfoque:

- **Sacá** cualquier frase del estilo "recién estoy arrancando mi camino en agentes de IA". No afirmes ni niegues nada sobre agentes. Solo mostrá las herramientas que uso.
- El mensaje de la sección: **uso la IA todos los días** para experimentar, crear ideas, resolver problemas del día a día, agendar cosas y organizarme.
- Armá **6 pestañas o tarjetas seleccionables**, una por uso: *Experimentar*, *Crear ideas*, *Resolver problemas*, *Agendar*, *Organizarme*, *Aprender*.
- Al elegir una, se muestra una **conversación corta simulada con efecto de tipeo** que ejemplifique ese uso, con humor `[REVISAR]`. Que arranque con la primera ya seleccionada.
- Poné un título claro y una aclaración en letra chica, por ejemplo: "Así le hablo a la IA en un día normal (conversaciones simuladas)". Que cualquiera entienda qué está viendo sin que nadie se lo explique.
- Los ejemplos tienen que ser creíbles y sin resultados inventados (nada de "la IA me consiguió un cliente").
- Agregá cerca del título una línea con mis rasgos: **aprendo rápido, ejecuto, creo, experimento** `[REVISAR]`. Mostralos de forma visual (por ejemplo, palabras que van rotando o chips que aparecen), no como una lista aburrida.

## 4. Nombres y logos

- El proyecto con mi socio se llama **SAIBA Studios**. **No lo renombres**: dejá todo lo de SAIBA exactamente como está hoy en la web. Nada de "Retruco" en ningún lado.
- Descripción de SAIBA: agencia de automatización con IA para pymes, junto a mi socio. Hoy estamos estructurando la propuesta de servicios y saliendo a buscar a los primeros clientes.
- Los logos van a estar en `public/logos/`. Usá estos nombres de archivo exactos. Si alguno todavía no está, mostrá un círculo con las iniciales como fallback, sin romper nada:

| Archivo | Para qué |
|---|---|
| `saiba.png` | Proyecto SAIBA Studios |
| `waise.png` | Proyecto wAise |
| `gostudy.png` | Proyecto GoStudy! |
| `behind-the-door.png` | Proyecto Behind the Door |
| `ditella.png` | Universidad Torcuato Di Tella |
| `itba.png` | ITBA |
| `coderhouse.png` | Coderhouse |
| `cambridge.png` | Cambridge |
| `stlukes.png` | St. Luke's College |
| `anthropic.png` | Certificación de Anthropic |

## 5. Proyectos

Mantené el visor de archivos, que me gusta mucho. Cambios:
- Cada proyecto con su **logo** y un **link a su página web** (botón "Visitar sitio ↗" que abra en pestaña nueva).
- Proyectos: **SAIBA Studios**, **wAise**, **GoStudy!** y uno nuevo: **Behind the Door** (mi colección de NFTs).
- Links (los tengo que pasar; hasta entonces `[COMPLETAR: link]` y el botón deshabilitado): SAIBA Studios, GoStudy!, Behind the Door, y wAise si tiene.
- Si podés leer esas páginas, usalas para escribir descripciones precisas de cada proyecto, sin inventar nada que no esté ahí.
- Para Behind the Door: descripción breve de la colección, sin cifras de ventas ni afirmaciones que no pueda respaldar.
- Mantené el cartel que aclara que son proyectos propios en etapa temprana y que todavía no facturaron, con humor `[REVISAR]`.

## 6. Recorrido (timeline)

Me gusta el estilo de mi web vieja (te paso una captura): línea vertical con círculos, de más nuevo a más viejo, con el **logo** de cada institución, fechas en letra mono azul arriba, título, una descripción corta con humor y chips de etiquetas. Título de la sección: **"El camino hasta acá"** con el subtítulo **"Con un cambio de rumbo incluido — porque darse cuenta a tiempo también es una skill."** Usá esta estructura y estos datos:

1. **SAIBA Studios** (2026 – presente): agencia de automatización con IA para pymes, junto a mi socio `[REVISAR]`
2. **Universidad Torcuato Di Tella** (ago 2025 – presente): Licenciatura en Administración de Empresas. Orientación futura: Marketing.
3. **ITBA — Ingeniería Industrial** (mar 2025 – ago 2025): un semestre que sirvió para confirmar hacia dónde quería ir: los negocios y la creación de productos.
4. **wAise** y **GoStudy!** (2025)
5. **Coderhouse — Desarrollo Web** (feb 2023 – abr 2023): HTML, CSS, JavaScript, diseño UX y marketing digital. Nota final: 7,8.
6. **University of Cambridge — IGCSE** (2024): certificación internacional de inglés (English as a Second Language), nivel profesional acreditado.
7. **St. Luke's College** (2011 – 2024): Bachiller con especialización en Ciencias Exactas. Educación primaria y secundaria completa, con gira deportiva de rugby por Europa.
8. **Certificación de Anthropic**, "AI Fluency: Framework & Foundations" `[COMPLETAR: fecha]`.
9. **Behind the Door** `[COMPLETAR: fecha]`.

- Para el **Di Tella** usá el logo oficial a color (el de `ditella.png`), no el de las rayas amarillas.
- Los chips y las descripciones con humor van marcados `[REVISAR]`.

## 7. Contacto y redes

- Dejá LinkedIn y mail como están (perfecto).
- **Agregá Instagram**: usuario `@bauti.suarez`, link `https://instagram.com/bauti.suarez` `[CONFIRMAR]`. Usá un SVG del logo de Instagram (lucide-react ya no trae logos de marcas).
- El footer ("bautista" de puntos) queda exactamente como está.

## 8. Más animaciones al hacer scroll (IntersectionObserver)

Quiero que la web se sienta más viva mientras bajo. Se hace con **IntersectionObserver**, que detecta cuándo un elemento entra en pantalla para disparar la animación. Implementalo así (un hook reutilizable, `useInView`, o con `motion` si ya lo usás):

- Los títulos, tarjetas y bloques de texto aparecen con **fade + subida suave** al entrar en pantalla, con **stagger** (que no entren todos juntos).
- En la timeline, la **línea vertical se va dibujando** a medida que bajo y los círculos se encienden cuando llegan.
- Los chips de herramientas aparecen en cascada.
- El punto azul de "Bauti." pulsa suave.
- Cada animación se dispara **una sola vez** (no se repite cada vez que subo y bajo).
- Todo respetando `prefers-reduced-motion`, sin saltos de layout, y fluido en celular. No sumes más de lo que se banque un celular normal.

## 9. Lo que sigue igual

- Sobre mí: me gusta como está, no lo cambies (después le sumo foto; dejá el lugar listo).
- Herramientas: perfecta.
- Footer y degradés animados: como están.

## Cómo quiero que trabajes

1. Primero el **plan corto** y las preguntas que tengas.
2. Después aplicá todos los cambios.
3. Dejame una lista al final con los `[COMPLETAR]` y `[REVISAR]` que quedaron, así los repaso.
