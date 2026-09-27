# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es

App **Micropicores**: estudio y práctica de los micropicores (puntos del cuerpo donde una persona se rasca y su significado, según la sinergología) para el grupo de la clase del curso "Entrenamiento de Micropicores" de El Código del Comportamiento. Fuente única de contenido: `../CC_ENTRENAMIENTO DE MICROPICORES.pdf` (27 láminas; el texto de las etiquetas es extraíble, la posición de cada punto solo se ve en la imagen).

Es una sola app que irá creciendo con features (más regiones, más modos, login, backend, y más adelante la sección de microexpresiones). `../app-microexpresiones/` es trabajo previo con otro estilo; no copiar de allí decisiones.

Idiomas: **código en inglés** (identificadores, archivos, campos JSON, claves de región, URLs, scopes de commit); **español** para la conversación, la documentación, OpenSpec, los mensajes de commit, el contenido del PDF y los textos de interfaz (siempre en `src/shared/lib/i18n/es.json`, nunca en un componente). Prompts para generadores de imágenes en inglés.

## Dónde está cada cosa

- `openspec/changes/<cambio>/`: propuesta, diseño, specs y tareas de cada cambio. **Leer `design.md` y las specs antes de tocar nada.** Cambio actual: `poc-micropicores`.
- `CONTEXT.md`: glosario español → nombre en código. Usar esos términos exactos.
- `docs/adr/`: decisiones transversales (0001 idioma, 0002 estructura por features, 0003 señal para librería de estado, 0004 seams de prueba). No re-litigar.
- `docs/workflow.md`: el proceso rama → commit → PR → CI → fusión → versión, paso a paso. El usuario está aprendiéndolo.
- `.claude/skills/reporte-desarrollo/`: skill que genera el texto del PR.

## Flujo de trabajo: OpenSpec

```
/opsx:explore            # pensar una idea antes de proponer
/opsx:propose <nombre>   # crear proposal, design, specs y tasks; no toca código
/opsx:apply <nombre>     # implementar las tareas
/opsx:update <nombre>    # revisar la planificación si cambia una decisión
/opsx:sync <nombre>      # volcar los delta specs a openspec/specs/
/opsx:archive <nombre>   # archivar el cambio terminado
openspec validate <nombre> --strict   # el nombre va sin --change
```

Un cambio por unidad publicable; `sync` y `archive` al fusionar el PR. Tareas "(requiere imagen)" dependen de una ilustración del usuario; tareas "(explicar)" se hacen narrando cada paso porque el usuario quiere aprender ese proceso.

## Reglas de git que Claude debe respetar

- Claude crea la rama `feat/<nombre>` o `fix/<nombre>` (una por cambio de OpenSpec) y se pasa a ella.
- **Claude no hace commit ni push.** Al terminar cada tarea entrega el mensaje `tipo(scope): descripción` (sin espacio antes del paréntesis; scope en inglés, descripción en español) y para. El usuario ejecuta el commit; el gancho de pre-commit pasa Prettier y ESLint.
- Fusionar a `main` es publicar al grupo y es solo del usuario. Merge commit, nunca squash.
- release-please genera versión y changelog desde los commits; por eso el formato del mensaje importa.

## Comandos

Stack: React + Vite + TypeScript `strict`, CSS Modules, React Router, react-i18next, Vitest, React Testing Library, ESLint, Prettier, husky, lint-staged. npm y `.nvmrc` con Node 24.

```
npm run dev              # servidor local
npm run build            # producción en dist/ (lo ejecuta Netlify)
npx tsc --noEmit         # tipos
npm run lint             # ESLint
npm run format           # Prettier
npx vitest run           # todos los tests
npx vitest src/features/practice/domain/question.test.ts   # un archivo
```

## Arquitectura (ver design.md y ADR 0002 para el porqué)

- **Por features.** `src/app/` (router, providers, ErrorBoundary), `src/features/<feature>/{domain,ui,index.ts}`, `src/shared/{ui,lib}`. Features: `catalog`, `practice`, `progress`, `editor`, `onboarding`.
- **`domain/` es TypeScript puro**: sin React, DOM, `fetch` ni `localStorage`. Lo exterior entra inyectado: `loadCatalog(source)`, `Store` con `read`/`write`, generador aleatorio. Una feature importa de otra solo por su `index.ts`; `shared/` no conoce features.
- **Datos estáticos con forma de API.** `public/data/regions.json` y `points.json` son listas planas con la forma que devolverá el futuro backend FastAPI (repositorio aparte, contrato OpenAPI).
- **Coordenadas en porcentaje.** Imagen con proporción fija y `<svg viewBox="0 0 100 100">` encima; puntos y flechas en `x`, `y` de 0 a 100. Nunca píxeles.
- **Identidad.** `id` UUID v4 fijo (lo referencia el progreso; nunca cambia) y `key` slug en inglés (puede cambiar).
- **Lateralidad.** `side` es siempre del cuerpo del sujeto: `left` = personal / yo, `right` = exterior / el otro. La figura se muestra como la ve un observador; la UI lo resuelve con `SideLabels`. Regiones con `mirror` voltean la imagen y `x` pasa a `100 - x`.
- **Estado.** Sin librería; solo hooks `useCatalog`, `useProgress`, `useSession`. Señal para adoptar Zustand en ADR 0003.
- **Progreso** en localStorage bajo `micropicores.progress.v1`, con `version` y `userId` nulo para el login futuro.
- **Errores.** `ErrorBoundary` + `reportError()` en `shared/lib`; Sentry se conectará ahí después. Nada llama a Sentry directamente.
- **Editor oculto** en `/editor` para corregir posiciones y exportar los JSON al repositorio. No editar coordenadas a ojo.

## Pruebas

TDD estricto (rojo-verde, un test y una implementación por ciclo) solo en los seams de ADR 0004: `loadCatalog`, `generateQuestion` + `isCorrect`, `createSession`, `recordAnswer` + `clearProgress` sobre `Store` en memoria, `exportCatalog`. React Testing Library solo para escenarios de interacción de las specs. Nada de tests de "se renderiza". No añadir seams sin acordarlos con el usuario.

## Reglas fijas

- **No dibujar figuras, rostros ni cuerpos en código** (SVG, canvas, Python). El usuario lo rechazó explícitamente. Las ilustraciones las genera él en la web de Gemini Nano Banana con los prompts que Claude escribe en `prompts/`. Sí se dibujan en SVG los marcadores, flechas de gesto y polígonos de zona.
- **El contenido es solo el del PDF, literal.** `meaning` se transcribe carácter a carácter; solo se corrigen erratas evidentes. Los códigos sin leyenda ("CON ESI", "ASI", "O1p2") se conservan tal cual; el usuario no encontró su significado y no hay que preguntarle. No añadir explicaciones, fiabilidad ni notas de autor. Citar la lámina (`page`) de cada punto.
- **Puntos sin etiqueta del PDF no entran** en el catálogo.
- **Móvil primero.** Toda pantalla funciona a 360 px de ancho sin desplazamiento horizontal; hover solo como mejora en escritorio.
- Descartado y no reabrir sin que lo pida el usuario: cuerpo 3D rotable, control de acceso, apuntes personales, notas de autor.

## Notas de herramientas

- Renderizar una lámina del PDF (no hay `pdftoppm`; sí `gs`):
  `gs -q -dNOPAUSE -dBATCH -sDEVICE=png16m -r110 -dFirstPage=N -dLastPage=N -sOutputFile=out.png "../CC_ENTRENAMIENTO DE MICROPICORES.pdf"`
- Extraer el texto de las etiquetas: `python3 -m pip install --user pypdf` y `PdfReader(...).pages[i].extract_text()`.
- Renderizar un SVG con fidelidad de navegador: Chrome headless en `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless=new --screenshot`. ImageMagick renderiza mal las curvas.
- `gh` no está instalado. Remoto: `https://github.com/Yotfil/app-cnv.git`.
