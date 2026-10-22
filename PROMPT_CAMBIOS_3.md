# PROMPT: Tercera ronda de cambios al portfolio de Bauti

> Claude Code: leé este archivo completo. Son correcciones y la carga de logos, fotos y links sobre la web que ya tenés armada. Mismo stack, misma paleta y mismas reglas: no inventes datos, dejá `[COMPLETAR]` donde falte algo y marcá con `[REVISAR]` los textos con humor que escribas.
> Si algo de `PROMPT_CAMBIOS_1.md` o `PROMPT_CAMBIOS_2.md` no quedó aplicado, aplicalo también. **El proyecto se llama SAIBA Studios; no uses "Retruco" en ningún lado.**
> Antes de tocar nada, mostrame un plan corto y preguntame lo que te falte.

---

## 1. Assets nuevos (ya están en el proyecto)

Acabo de copiar a `public/` estos archivos. Usalos tal cual vienen:

| Archivo | Uso |
|---|---|
| `public/logos/stlukes.png` | St. Luke's College |
| `public/logos/cambridge.png` | University of Cambridge — IGCSE |
| `public/logos/coderhouse.png` | Coderhouse (es de baja resolución: mostralo chico) |
| `public/logos/anthropic.png` | Certificación de Anthropic |
| `public/logos/itba.png` | ITBA |
| `public/logos/ditella.png` | Universidad Torcuato Di Tella (las rayas amarillas y negras) |
| `public/logos/logo-sol-sin-asignar.png` | Logo de un sol con rayas: **todavía no sé a qué proyecto pertenece. No lo uses hasta que te lo diga.** |
| `public/images/bauti-sobre-mi.png` | Mi foto de cuerpo entero, con fondo transparente, para "Sobre mí" |
| `public/images/bauti-original.png` | La foto original con fondo crema (por si hace falta) |

- **Logos en la timeline:** mostralos dentro de un cuadrado redondeado **blanco** de tamaño fijo (aprox. 56 px), con `object-fit: contain` y un pequeño padding, para que se vean bien sobre fondo oscuro o claro. El logo del ITBA ya es un cuadrado azul: usalo con el mismo tamaño, sin padding.
- **Todavía faltan** los logos de **SAIBA Studios, wAise, GoStudy! y Behind the Door**. Hasta que estén, mostrá un círculo con las iniciales del proyecto en azul marino, sin romper nada. Cuando los agregue como `public/logos/saiba.png`, `waise.png`, `gostudy.png` y `behind-the-door.png`, que los tome automáticamente.
- Si una imagen no carga, que haya un fallback elegante.

## 2. Foto en "Sobre mí"

- Usá `bauti-sobre-mi.png`. Soy yo de cuerpo entero, mirando hacia la **derecha** y con la mano abierta como **presentando** algo hacia ese lado.
- Ubicala a la **izquierda** del texto, para que parezca que estoy **presentando mi propia presentación** (mi mirada y mi gesto apuntan hacia el texto). En celular, arriba del texto.
- Que se integre al fondo crema de la sección (como está recortada, no pongas marco ni sombra de caja). Una sombra suave bajo los pies o un halo con el degradé azul detrás quedaría bien.
- Animación al entrar en pantalla: sube con fade, y el texto entra después, en cascada. Un leve efecto de movimiento con el scroll (parallax) es opcional.
- Optimizá la imagen para web (`loading="lazy"`, dimensiones declaradas para evitar saltos).

## 3. Textos a corregir

- **"Emprendedor en etapa temprana":** sacalo. Empecé a emprender a los 15 años y siempre me gustó emprender. Reemplazalo por algo como **"Emprendo desde los 15"** o una variante con mi tono `[REVISAR]`. No digas "de nacimiento". Ojo: lo de "etapa temprana, todavía no facturó" **sigue aplicando a los proyectos** (el cartel de la sección Proyectos se mantiene); lo que cambia es cómo me describo yo.
- **"Cómo uso la IA", rasgos:** escribilos con mayúscula inicial: **"Creo. Experimento. Aprendo rápido. Ejecuto."** Que cada uno entre animado.
- **Agentes (coming soon):** me encantó, dejalo exactamente como está.
- **Contacto:** sacá "Llegaste hasta acá. Escribime, que ya somos casi amigos." Suena a obligación. Usá: **"Llegaste hasta acá, así que ya me conocés un poco. Si querés conocerme más, escribime."** `[REVISAR]`
- Recordá la regla de estilo: **nunca "hacer cosas"**; si hace falta, "crear".

## 4. Timeline: ajuste en St. Luke's College

El orden y el resto de los hitos quedan como en `PROMPT_CAMBIOS_2.md`. Cambiá **solo** el texto de St. Luke's:

- **Quitá** la frase de "para avanzar hay que pasar la pelota para atrás". No me gustó.
- Escribilo así: en el colegio hice **rugby**, participé de **competencias por equipos entre casas** (las casas eran por colores) y de distintas **actividades en grupo**. Todo eso me ayudó a mejorar el **trabajo en equipo** `[REVISAR]`. Texto corto y natural, sin forzar el chiste. Sacá o minimizá lo del rugby: que no sea lo único que se destaque.
- Chips: **Trabajo en equipo**, **Ciencias Exactas**, y **Rugby 🏉** (chico).
- Bachiller con especialización en Ciencias Exactas, 2011 – 2024.

## 5. Proyectos: links y descripciones

Links (en pestaña nueva, botón "Visitar sitio ↗"):
- **SAIBA Studios:** https://saiba-studios.vercel.app/
- **wAise:** https://waise.base44.app/
- **GoStudy!:** https://gostudy.base44.app/
- **Behind the Door:** https://btd.base44.app/

Antes de escribir las descripciones, **leé cada página** y basate solo en lo que dicen. Lo que sé hasta ahora:
- **SAIBA Studios:** agencia de desarrollo web e IA (sitios, diseño UI/UX e integración de IA, como chatbots y respuestas automáticas). Mi descripción: **impulsar a los negocios a usar la inteligencia artificial en su día a día**. Que la descripción de la web coincida con lo que de verdad ofrece el sitio. No pongas precios ni clientes.
- **wAise:** plataforma de RRHH con IA ("The Intelligent HR Companion"), que desarrollé y presenté en el HR Challenge de Base44.
- **GoStudy!:** app para optimizar el estudio con materias, recordatorios, logros y puntos, gamificada con objetivos diarios y recompensas.
- **Behind the Door (BTD Club):** mi colección de NFTs, con su galería web. Sin cifras de ventas ni afirmaciones que no pueda respaldar.
- Mantené el cartel que aclara que son proyectos propios en etapa temprana y que todavía no facturaron, con humor `[REVISAR]`.

## 6. Lo que no cambia

Hero (degradé y frase), animaciones por scroll, herramientas, redes, footer ("bautista" de puntos), la tarjeta "Agentes (coming soon)" y el resto de la timeline quedan como están.

## Cómo quiero que trabajes

1. Primero el **plan corto** y tus preguntas.
2. Aplicá todo.
3. Al final, la lista de `[COMPLETAR]` y `[REVISAR]` que quedaron.
