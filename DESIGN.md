---
name: Mobi Arquitectura
description: Una lámina técnica viva donde el plano cobra vida hasta convertirse en espacio.
colors:
  papel: "#f4f0e6"
  papel-2: "#ebe6d7"
  tinta: "#1b1f1e"
  cian: "#2fb0c2"
  cian-text: "#0d7688"
  cian-ink: "#6fd3e0"
  ambar: "#b97a3f"
  ambar-claro: "#d9a55f"
  noche: "#0a0f12"
  hair: "color-mix(in srgb, #1b1f1e 18%, transparent)"
  hair-soft: "color-mix(in srgb, #1b1f1e 11%, transparent)"
typography:
  display:
    fontFamily: "Georgia, Times New Roman, serif"
    fontSize: "clamp(3.2rem, 8vw, 6.5rem)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Saira Semi Condensed, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 4.2vw, 2.9rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Fragment Mono, ui-monospace, Cascadia Mono, monospace"
    fontSize: "10.5px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.18em"
rounded:
  none: "0"
spacing:
  header: "64px"
  section-block: "clamp(78px, 12vh, 132px)"
  container-inline: "clamp(22px, 5vw, 60px)"
components:
  sello-primary:
    backgroundColor: "transparent"
    textColor: "{colors.cian-text}"
    rounded: "{rounded.none}"
    padding: "1em 1.55em"
  sello-default:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "0.78em 1.15em"
  station:
    backgroundColor: "color-mix(in srgb, #f4f0e6 88%, transparent)"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "26px 24px 28px"
---

# Design System: Mobi Arquitectura

## Overview

**Creative North Star: "El plano técnico"**

La landing se comporta como una lámina de arquitecto viva: papel claro, retícula fina, tinta casi negra, acotaciones y un cajetín fijo. El héroe es el único lienzo oscuro y contiene la transformación visual del plano técnico al interior terminado. El sistema evita depender de fotos de stock o de una galería inventada; la evidencia principal es la secuencia interactiva.

La dirección visual traduce la promesa de Mobi Arquitectura a una cadena legible: un mismo equipo diseña, ejecuta la obra y fabrica la carpintería. La interfaz es técnica y contenida, con cian para información activa y ámbar para el acento de madera. El CTA se presenta como un sello, no como un botón genérico.

**Key Characteristics:**
- Lámina clara con retícula y hairlines.
- Cajetín, códigos, coordenadas y etiquetas monoespaciadas.
- Héroe canvas oscuro con scrub de 300 cuadros.
- Forma rectangular sin radios y acentos de esquina tipo plano.

## Colors

La paleta separa el soporte de papel de la tinta técnica, reservando el cian para estados informativos y el ámbar para la transición hacia el espacio cálido.

### Primary
- **Cian técnico** (`{colors.cian}`): acentos de retícula, esquinas, selección y detalles activos.
- **Cian de texto** (`{colors.cian-text}`): navegación, labels y foco sobre el fondo claro.

### Secondary
- **Ámbar de madera** (`{colors.ambar}`): sello de portafolio pendiente y referencia de materialidad.
- **Ámbar claro** (`{colors.ambar-claro}`): palabra destacada del héroe y estado estático del héroe.

### Neutral
- **Papel de lámina** (`{colors.papel}`): fondo principal, superficies de contenido y texto claro sobre el héroe.
- **Papel secundario** (`{colors.papel-2}`): respuesta hover de filas.
- **Tinta** (`{colors.tinta}`): texto principal, bordes y líneas de dimensión.
- **Noche de blueprint** (`{colors.noche}`): fondo exclusivo del stage del héroe.
- **Hairline** (`{colors.hair}`) y **hairline suave** (`{colors.hair-soft}`): divisores y retícula de baja intensidad.

**The Accent-as-Annotation Rule.** El cian y el ámbar funcionan como anotaciones de un plano; no sustituyen a la tinta ni convierten toda la interfaz en una superficie saturada.

## Typography

**Display Font:** Georgia en itálica (con Times New Roman como fallback)

**Body Font:** Archivo (con `system-ui` como fallback)

**Label/Mono Font:** Fragment Mono (con `ui-monospace` y Cascadia Mono como fallback)

**Character:** Georgia en itálica aporta una voz editorial y elegante al título del héroe. Saira Semi Condensed mantiene la voz rotulada de títulos y sellos; Archivo mantiene legible el texto explicativo y Fragment Mono convierte códigos, estados y anotaciones en instrumentación de la interfaz.

### Hierarchy
- **Display** (400, `{typography.display.fontSize}`, `0.9`): título editorial centrado del héroe; “vida” usa el ámbar claro.
- **Headline** (600, `{typography.headline.fontSize}`, `1.05`): títulos de sección.
- **Title** (700, `19px`, aproximadamente `1.05`): nombres de estaciones, en mayúsculas y con tracking técnico.
- **Body** (400, `16px`, `1.5`): lectura general; los párrafos de apoyo se mantienen en anchos cortos, hasta `58ch` o `46ch` según el contexto.
- **Label** (400, `10–12.5px`, tracking amplio, mayúsculas): códigos, navegación, estados, contador de frames y metadatos.

**The Label-as-Data Rule.** Los labels monoespaciados comunican estado, código o medida; no se usan para sustituir el texto explicativo de una sección.

## Layout

El shell usa un header fijo de `64px` con cuatro columnas en escritorio: marca, metadato de lámina, navegación y sello de WhatsApp pendiente. El contenido se centra en un wrapper de `1160px` con padding horizontal fluido (`clamp(22px, 5vw, 60px)`). Las secciones tienen padding vertical fluido (`clamp(78px, 12vh, 132px)`) y se separan mediante líneas, retícula y cambios de densidad, no mediante tarjetas flotantes.

El héroe ocupa `280vh`; su stage queda sticky a la ventana (`100vh`/`100svh`) para que el scroll controle el frame. En escritorio, las estaciones de servicios forman tres columnas. A menos de `900px` se apilan; las filas de servicios pasan de tres columnas a dos columnas con la descripción en una línea completa a menos de `760px`. A menos de `820px` se ocultan la navegación y el metadato del cajetín para conservar la marca y el sello.

El portafolio mantiene una proporción `16:9` aunque todavía es un plot de espera. El footer es una fila flexible de metadatos que puede envolver su contenido.

## Elevation & Depth

El sistema es plano por defecto. La profundidad se comunica con el cambio de soporte entre papel y noche, transparencias de papel, retículas, hairlines y bordes; no hay un vocabulario de `box-shadow` estructural. La única sombra atmosférica es el gradiente radial detrás del texto del héroe cuando no hay JS o cuando el héroe está estático, para mantener contraste con el frame.

**The Flat-By-Default Rule.** No introducir tarjetas elevadas ni sombras genéricas: la jerarquía debe venir de líneas, contraste tonal, escala tipográfica y anotaciones.

## Shapes

La silueta es ortogonal: los componentes no usan esquinas redondeadas (`{rounded.none}`). El cajetín y los contenidos usan líneas de un píxel; las estaciones agregan remates de cian de `14px` en esquinas opuestas. Los sellos tienen borde doble mediante un inset interior y padding tipográfico. El sello de portafolio pendiente se inclina `-5deg` como marca física de levantamiento.

## Components

### Buttons
- **Character:** sellos de contacto y navegación con apariencia de marcado técnico.
- **Shape:** rectangular, sin radio (`{rounded.none}`), borde exterior de `2px` y borde interior de `1px`.
- **Primary:** el sello grande de WhatsApp usa cian de texto, padding `1em 1.55em` y tipografía Saira Semi Condensed en mayúsculas; actualmente está deshabilitado visualmente con la clase `sello-pending` porque falta el número.
- **Hover / Focus:** el sello activo cambia a cian de texto y en el CTA grande rellena con cian y texto de papel; `:focus-visible` usa outline cian de `2px` con offset de `3px`.
- **Secondary / Ghost / Tertiary:** el enlace de Instagram comparte la forma de sello, con tinta por defecto y cambio a cian al pasar el cursor.

### Cards / Containers
- **Character:** estaciones como fichas de proceso, no como cards decorativas.
- **Corner Style:** sin radio.
- **Background:** papel con mezcla transparente al `88%`.
- **Shadow Strategy:** sin sombra; borde hairline y remates cian en esquinas.
- **Border:** `1px` de hairline.
- **Internal Padding:** `26px 24px 28px`.

### Navigation
- **Style:** cajetín fijo, translúcido sobre papel, con blur de `7px` y borde inferior.
- **Typography:** Fragment Mono, `11px`, mayúsculas y tracking de `0.18em`.
- **States:** tinta atenuada por defecto; hover en cian con subrayado desplazado `6px`; foco visible global.
- **Mobile treatment:** navegación oculta a menos de `820px`; permanece disponible mediante los anclajes del documento y el salto accesible al contenido.

### Signature Component: Héroe canvas
El héroe monta 300 imágenes JPG (`/frames/ezgif-frame-001.jpg` a `/frames/ezgif-frame-300.jpg`) en un canvas que cubre el stage y recorta la imagen con `object-fit: cover` equivalente. Carga primero cada quinto frame y después el resto en lotes de ocho; el progreso del scroll selecciona el frame objetivo y actualiza `F 001/300`. El intro se desvanece después del primer tramo del scrub y la franja de contacto aparece al acercarse al final.

Estados implementados:
- **Loading:** status `CARGANDO SECUENCIA · 300 CUADROS`; el primer frame disponible se dibuja mientras continúa la carga.
- **Reduced motion:** con `prefers-reduced-motion: reduce`, se carga solo el frame final, se muestra `VISTA FINAL · MOVIMIENTO REDUCIDO`, se ocultan HUD y acotación lateral y se desactivan las revelaciones animadas.
- **Error/fallback:** si fallan los primeros ocho intentos antes de cargar alguno, se muestra `VISTA DE RESPALDO` junto con `ezgif-frame-300.jpg` como fallback visible.
- **No JavaScript:** `noscript` entrega `ezgif-frame-300.jpg`, oculta los elementos de HUD y conserva el copy sobre un gradiente de contraste.

### Signature Component: Portafolio pendiente
El bloque `#portafolio` es un plot `16:9` con coordenadas, sello `En levantamiento` y texto explícito de que aún no hay proyectos publicados. Es un placeholder de contenido, no una galería ni una afirmación de obra realizada.

## Do's and Don'ts

### Do:
- **Do** mantener la dirección “El plano técnico”: papel cuadriculado, anotaciones, cajetín, códigos y líneas finas.
- **Do** usar Saira Semi Condensed para títulos/sellos, Archivo para lectura y Fragment Mono para instrumentación.
- **Do** reservar el fondo noche para el héroe y mantener cian/ámbar como acentos puntuales.
- **Do** conservar el foco visible, el enlace para saltar al contenido y textos alternativos del canvas/fallback.
- **Do** mantener visibles los estados de carga, movimiento reducido y respaldo del héroe.
- **Do** sustituir el número de WhatsApp y el plot de portafolio solo cuando exista información confirmada.

### Don't:
- **Don't** inventar fotos de proyectos, testimonios, clientes, métricas o precios.
- **Don't** convertir el placeholder de WhatsApp en un enlace activo hasta confirmar el número.
- **Don't** tratar `@mobi_arquitectura` como sustituto de un portafolio propio: es el enlace vivo disponible mientras el portafolio sigue pendiente.
- **Don't** añadir radios, sombras genéricas, hero de stock o una cuadrícula de cards que contradiga la lámina técnica.
- **Don't** recomponer o redistribuir el material de frames sin resolver la provenance y los derechos del video fuente.

### Maintenance Notes
- **Provenance de frames:** los 300 JPG provienen de la animación 3D “plano arquitectónico cobra vida”, recortada de un video de internet. El origen y los derechos de uso del video fuente siguen sin confirmar; resolverlo antes de presentar el material como activo definitivo.
- **WhatsApp:** el número está pendiente. Los sellos visibles son placeholders deliberados y tienen `sello-pending`; no convertirlos en CTA enlazado hasta confirmar el dato.
- **Portafolio:** el bloque está pendiente de fotos reales de obra. Sustituir el plot y su copy únicamente con material propio confirmado; no rellenarlo con imágenes o resultados inventados.
