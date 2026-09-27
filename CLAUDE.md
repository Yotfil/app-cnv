# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es

App **Micropicores**: estudio y práctica de los micropicores (puntos del cuerpo donde una persona se rasca y su significado, según la sinergología) para el grupo de la clase del curso "Entrenamiento de Micropicores" de El Código del Comportamiento. Fuente única de contenido: `../CC_ENTRENAMIENTO DE MICROPICORES.pdf` (27 láminas; el texto de las etiquetas es extraíble, la posición de cada punto solo se ve en la imagen).

Es un proyecto **distinto** de `../app-microexpresiones/` (otra sección, otro estilo visual, otra fuente). Se conectarán más adelante; no copiar de allí decisiones de estilo ni arquitectura.

Idioma con el usuario, en la UI, los datos, la documentación y los commits: español. Prompts para generadores de imágenes: inglés.

## Estado

Todavía no hay código. El diseño está cerrado en `openspec/changes/poc-micropicores/` (proposal, design, siete specs y tasks). **Leer `design.md` y las specs antes de tocar nada**; ahí están el modelo de datos, la separación de capas, la regla de distractores y lo que queda fuera del POC. `openspec/config.yaml` lleva el contexto del proyecto que ven los artefactos.

## Flujo de trabajo: OpenSpec

Los cambios se planifican antes de implementarse (CLI `openspec` 1.13.2, esquema `spec-driven`):

```
/opsx:explore            # pensar una idea antes de proponer
/opsx:propose <nombre>   # crear proposal, design, specs y tasks; no toca código
/opsx:apply <nombre>     # implementar las tareas
/opsx:sync <nombre>      # volcar los delta specs a openspec/specs/
/opsx:archive <nombre>   # archivar el cambio terminado
```

```
openspec list --json                        # cambios activos y raíz
openspec status --change "<nombre>" --json  # estado de artefactos
openspec validate <nombre> --strict         # validar (el nombre va sin --change)
```

Cada tarea de `tasks.md` lleva su verificación; las marcadas "(requiere imagen)" dependen de que el usuario genere una ilustración y no se pueden cerrar sin ella.

## Comandos previstos

Stack decidido: React + Vite + TypeScript, CSS Modules, React Router, Vitest. Se crea en la tarea 1.1 con `npm create vite@latest . -- --template react-ts`. Una vez exista:

```
npm run dev          # servidor local
npm run build        # producción en dist/ (lo ejecuta Netlify)
npx tsc --noEmit     # tipos
npx vitest           # tests; un archivo: npx vitest src/dominio/practica.test.ts
```

## Arquitectura (ver design.md para el porqué)

- **Dos capas.** `src/dominio/` es TypeScript puro sin React ni DOM: `modelo.ts` (tipos), `catalogo.ts` (carga y validación), `practica.ts` (motor de preguntas y distractores), `progreso.ts` (progreso con almacén inyectado). `src/ui/` solo pinta. La separación existe para migrar a React Native reutilizando el dominio; no meter `window`, `fetch` directo ni `localStorage` en el dominio.
- **Datos estáticos con forma de API.** `public/data/regiones.json` y `puntos.json` son listas planas con la forma que devolverá un futuro backend FastAPI. `cargarCatalogo(fuente)` recibe la función que trae los JSON.
- **Coordenadas en porcentaje.** Cada región es una imagen con proporción fija y un `<svg viewBox="0 0 100 100">` encima; los puntos y flechas se posicionan en `x`, `y` de 0 a 100. Nunca en píxeles.
- **Identidad.** Cada región y punto tiene `id` UUID v4 fijo (lo referencia el progreso; nunca cambia) y `clave` legible (puede cambiar).
- **Lateralidad.** `lado` se refiere siempre al cuerpo del sujeto. Convención del PDF: izquierdo = personal / yo / deseo, derecho = exterior / el otro / interés. La figura se muestra como la ve un observador, así que el lado izquierdo del sujeto cae a la derecha de la pantalla; la UI lo resuelve con un rótulo fijo. Para regiones con `espejo` (oreja) se voltea la imagen y `x` pasa a `100 - x`.
- **Progreso** en localStorage bajo `micropicores.progreso.v1`, con `version` para migrar; alias opcional; sin cuentas.
- **Editor oculto** en `/editor` (sin enlace) para arrastrar puntos y exportar los JSON, que luego se copian a `public/data/` y se suben al repositorio. Es la forma de corregir posiciones; no editar coordenadas a ojo.

## Reglas fijas

- **No dibujar figuras, rostros ni cuerpos en código** (SVG, canvas, Python). El usuario lo rechazó explícitamente. Las ilustraciones las genera él en la web de Gemini Nano Banana con los prompts que Claude escribe en `prompts/`. Sí se dibujan en SVG los marcadores, flechas de gesto y polígonos de zona.
- **El contenido es solo el del PDF, literal.** `significado` se transcribe carácter a carácter; solo se corrigen erratas evidentes. Los códigos sin leyenda ("CON ESI", "ASI", "O1p2") se conservan tal cual sin interpretar. No añadir explicaciones, fiabilidad ni notas de autor. Citar la lámina (`pagina`) de cada punto.
- **Puntos sin etiqueta del PDF no entran** en el catálogo.
- **Móvil primero.** Toda pantalla debe funcionar a 360 px de ancho sin desplazamiento horizontal; hover solo como mejora en escritorio, el toque es la interacción base.
- Descartado y no reabrir sin que lo pida el usuario: cuerpo 3D rotable, control de acceso, apuntes personales, notas de autor.

## Notas de herramientas

- Renderizar una lámina del PDF (no hay `pdftoppm`; sí `gs`):
  `gs -q -dNOPAUSE -dBATCH -sDEVICE=png16m -r110 -dFirstPage=N -dLastPage=N -sOutputFile=out.png "../CC_ENTRENAMIENTO DE MICROPICORES.pdf"`
- Extraer el texto de las etiquetas: `python3 -m pip install --user pypdf` y `PdfReader(...).pages[i].extract_text()`.
- Renderizar un SVG con fidelidad de navegador: Chrome headless en `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless=new --screenshot`. ImageMagick renderiza mal las curvas.
- `gh` no está instalado; el repositorio en GitHub lo crea el usuario.
