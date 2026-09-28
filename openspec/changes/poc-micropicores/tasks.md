# Tasks

Regla de commits: un commit por tarea, creado por el usuario con el mensaje que Claude entrega en formato `tipo(scope): descripción` (sin espacio antes del paréntesis), en la rama `feat/poc-micropicores`. Las tareas marcadas "(requiere imagen)" dependen de una ilustración generada por el usuario. Las tareas marcadas "(explicar)" se hacen contando al usuario cada paso, porque quiere aprender ese proceso.

## 1. Andamiaje, calidad y despliegue

- [x] 1.1 Crear la rama `feat/poc-micropicores`, el proyecto con `npm create vite@latest . -- --template react-ts`, `.nvmrc` con `24`, alias `@/` y TypeScript `strict`; verificar que `npm run dev` sirve la página de ejemplo y `npx tsc --noEmit` pasa
- [x] 1.2 Crear la estructura `src/app`, `src/features/{catalog,practice,progress,editor,onboarding}/{domain,ui}`, `src/shared/{ui,lib}`, `src/test`, `public/data`, `public/img`, `prompts/`, cada feature con `index.ts`, y `src/shared/ui/tokens.css` con las variables de `docs/design/tokens.md` más la carga de Jost e IBM Plex Mono; verificar que `npm run build` termina sin errores
- [x] 1.3 Sustituir oxlint del template por ESLint: quitar `oxlint` y `.oxlintrc.json`, instalar ESLint 9 (config plana `eslint.config.js`) con typescript-eslint, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-react-refresh y eslint-config-prettier; Prettier con `.prettierrc`; scripts `npm run lint` y `npm run format`; husky y lint-staged en pre-commit. Verificar que un archivo mal formateado bloquea el commit y que tras `format` pasa, y que `npm run lint` no reporta errores en el código del template
- [x] 1.4 Instalar Vitest y React Testing Library con un test de humo en `src/test`; verificar que `npx vitest run` pasa y que `npx vitest src/test/smoke.test.ts` ejecuta solo ese archivo
- [x] 1.5 Instalar react-i18next con `src/shared/lib/i18n/es.json` y la inicialización en `src/app`; verificar que un texto de ejemplo se lee con `t()` y que la regla `react/jsx-no-literals` de eslint-plugin-react, que prohíbe literales de texto en JSX, está activa y falla con un literal de prueba
- [x] 1.6 Añadir `ErrorBoundary` en `src/app` y `reportError()` en `src/shared/lib`; verificar que un error lanzado en un componente muestra la pantalla de error y aparece en consola con su contexto
- [x] 1.7 (explicar) Crear `.github/workflows/ci.yml` que ejecute `npm ci`, `tsc --noEmit`, lint y tests en cada PR y push a `main`; verificar que el workflow pasa en GitHub en el primer PR
- [x] 1.8 (explicar) Configurar Netlify (build `npm run build`, publish `dist`, `public/_redirects` con `/* /index.html 200`) con previsualización por PR; verificar que la URL de previsualización del PR muestra la app y que una ruta profunda recargada no da 404
- [x] 1.9 (explicar) Configurar release-please en Actions y la protección de `main` (solo merge commit, Actions en verde requerido); verificar que tras fusionar el primer commit `feat` release-please abre el PR de versión `v0.1.0`
- [x] 1.10 Añadir `manifest.webmanifest` con nombre, colores e icono provisional y mostrar la versión de `package.json` en la app; verificar que Chrome en Android ofrece "Añadir a pantalla de inicio" y que se lee "v0.1.0"
- [x] 1.11 Revisar `CONTEXT.md`, los ADRs 0001 a 0004 y `docs/workflow.md` (creados en la sesión de diseño) contra lo implementado en el grupo 1 y ajustar lo que difiera; verificar que el usuario sigue `docs/workflow.md` para abrir el primer PR sin ayuda

## 2. Modelo y catálogo

- [x] 2.1 Escribir `src/features/catalog/domain/model.ts` con los tipos `Region`, `Point`, `Side`, `Tag` y `src/features/progress/domain/model.ts` con `Progress` y `Store`, según las specs de catalogo-puntos y progreso-local; verificar que `tsc --noEmit` pasa
- [x] 2.2 TDD sobre `loadCatalog(source)` en `catalog.ts`: tests para catálogo válido, punto con región inexistente y región de cuerpo entero sin puntos; verificar que los tres pasan en rojo-verde
- [x] 2.3 Escribir `scripts/new-id.ts` que genera UUID v4 y `src/shared/lib/uuid.ts`; verificar que dos ejecuciones producen ids distintos con formato válido
- [x] 2.4 Crear `public/data/regions.json` con `front-body` y `face` (ids UUID, `zone` provisional de la cara como rectángulo en porcentaje, `image` apuntando a marcador de posición) y verificar que `loadCatalog` lo acepta
- [x] 2.5 Transcribir a `public/data/points.json` los puntos de las láminas 3, 4 y 13 del PDF (frente ×3, entrecejo, mejilla izquierda, mejilla derecha, bajo el labio "Duda", laringe "CON ESI / ASI", y los 3 de la lámina 13 de cuello y mentón), con `side`, `page`, `muscle` cuando el PDF lo nombra, la `arrow` mejilla → mentón, coordenadas propuestas a partir del render del PDF y `radius` por defecto 4; verificar con un test que cada `meaning` coincide carácter a carácter con el texto extraído del PDF salvo erratas listadas
- [x] 2.6 Documentar en `docs/catalog.md` la convención de lateralidad, los campos, la política de literalidad y los códigos sin leyenda; verificar que un lector puede añadir un punto nuevo siguiendo solo ese documento

## 3. Prompts e imágenes (requiere imagen)

- [x] 3.1 Escribir `prompts/front-body.md` en inglés según D9: figura neutra de línea fina en tono piel con luz difusa, sin relleno pleno, sin sexo, sin ropa, sin pelo, tono de piel medio neutro, fondo blanco, frontal, 9:16, brazos ligeramente separados; con `docs/design/referents/` como guía de estilo (no copiar), prompt negativo y lista de comprobación; verificar que el usuario lo ejecuta en la web de Gemini y guarda `public/img/front-body.png` (requiere imagen)
- [x] 3.2 Escribir `prompts/face.md` con el prompt de recorte de cabeza y cuello usando el cuerpo entero como referencia, formato 1:1, y lista de comprobación (orejas, mentón y base del cuello visibles); verificar que el usuario guarda `public/img/face.png` (requiere imagen)
- [x] 3.3 Actualizar `width` y `height` de ambas regiones en `regions.json` con las dimensiones reales de los PNG; verificar que la ilustración se muestra sin deformación en la vista de región (requiere imagen)

## 4. Componentes de ilustración y vista de región

- [x] 4.1 `shared/ui/Illustration` (contenedor de proporción fija, imagen al 100 %, SVG viewBox 0 0 100 100 encima); verificar con un test de render que un marcador en x=50,y=50 queda centrado a dos anchos distintos
- [x] 4.2 `shared/ui/Marker` con latido CSS y desactivación bajo `prefers-reduced-motion`; verificar visualmente en Chrome con la preferencia activada y desactivada
- [x] 4.3 `shared/ui/Arrow` que dibuja una flecha entre dos coordenadas en porcentaje; verificar con la flecha mejilla → mentón de la cara
- [x] 4.4 `shared/ui/SideLabels` con "Derecha de la persona" a la izquierda y "Izquierda de la persona" a la derecha, textos desde `es.json`; verificar que se mantiene visible en 360 px de ancho
- [x] 4.5 `catalog/ui/PointCard` con nombre de zona, lado en palabras, significado, alternativos con "también", gesto y etiquetas; panel inferior en táctil y tarjeta junto al marcador con puntero; test de Testing Library para "toque abre la ficha y tocar fuera la cierra"; verificar en Chrome escritorio (hover) y en emulación móvil
- [x] 4.6 `catalog/ui/RegionScreen` en ruta `/region/:key` que carga el catálogo por `useCatalog`, aplica el filtro (sin controles) y compone los componentes anteriores; verificar que todos los puntos de `face` se muestran y que la URL directa funciona con botón de volver al mapa

## 5. Inicio y mapa

- [ ] 5.1 `onboarding/ui/HomeScreen` en `/` con crédito, aviso resumido de la página 2, campo alias (máximo 30), versión, botón continuar y acción de borrar progreso con confirmación, todo desde `es.json`; test de Testing Library para "primera visita bloquea, segunda no"; verificar que borrar vuelve al estado inicial
- [ ] 5.2 `catalog/ui/MapScreen` en `/map` con la ilustración de `front-body` y una zona por región hija (polígono SVG con nombre y contador, área táctil mínima 44 px, resaltado en hover y toque); verificar que "Cara · N" navega a `/region/face` y que no hay desplazamiento horizontal a 360 px
- [ ] 5.3 Zonas de regiones sin imagen atenuadas con "próximamente"; test de Testing Library para "zona atenuada no navega"
- [ ] 5.4 (añadida el 28 de septiembre de 2026, a petición del usuario: en la app instalada no hay barra de direcciones) Barra inferior de navegación de `docs/design/tokens.md` con "Estudiar" (mapa; la cara hasta que exista la 5.2) y "Practicar" (atenuado hasta la 6.3), textos desde `es.json`, respetando el área segura del móvil; verificar que desde la app instalada se llega a la cara sin escribir URLs y que no hay desplazamiento horizontal a 360 px

## 6. Motor de práctica y pantalla

- [ ] 6.1 TDD sobre `practice/domain/question.ts`: `generateQuestion(point, catalog, random)` con la prioridad de distractores (simétrico, misma región, cualquiera), exclusión de textos iguales al correcto y a sus alternativos, e `isCorrect(question, option)`; tests para región con suficientes puntos, región con pocos puntos, texto repetido y punto con alternativos
- [ ] 6.2 TDD sobre `practice/domain/session.ts`: `createSession(regionKey, catalog, random)` que recorre los puntos sin repetir y devuelve avance y resumen; tests de orden sin repetición y de resumen final
- [ ] 6.3 `practice/ui/PracticeScreen` en `/practice` con selector de región (solo `face` activa), pregunta con un único marcador visible, cuatro opciones en tarjetas de ancho completo, corrección en rojo y verde, ficha del punto, botón siguiente, avance "n de N" y resumen final con repetir; test de Testing Library para "elegir opción muestra corrección y ficha"; verificar una sesión completa en emulación móvil
- [ ] 6.4 Documentar en `docs/practice.md` la regla de distractores y los casos especiales; verificar que los ejemplos del documento coinciden con los tests

## 7. Progreso local

- [x] 7.1 TDD sobre `progress/domain/progress.ts` con `Store` inyectable, documento versionado `micropicores.progress.v1` con `userId` nulo, `recordAnswer(pointId, mode, hit)` y `clearProgress()`; tests con almacén en memoria para acierto, fallo, recarga y borrado
- [ ] 7.2 `shared/lib/storage/localStorageStore.ts` con try/catch, cambio a memoria si falla y aviso único; verificar en Chrome con almacenamiento bloqueado que la práctica sigue y aparece el aviso
- [ ] 7.3 `progress/ui/useProgress` conectado a la práctica y alias visible en la pantalla de práctica; verificar que tras recargar los contadores del punto se conservan

## 8. Editor de posiciones

- [ ] 8.1 `editor/ui/EditorScreen` en `/editor` (sin enlace) con selector de región, lista lateral de puntos por `key`, arrastre de marcadores en porcentaje y edición de `radius` con círculo visible; verificar arrastrando `glabella` y comprobando que el porcentaje cambia
- [ ] 8.2 Edición de vértices del polígono `zone` de las regiones hijas sobre el mapa; verificar que la zona de `face` se ajusta a la ilustración real
- [ ] 8.3 TDD sobre `editor/domain/export.ts`: `exportCatalog(regions, points)` devuelve ambos JSON completos con ids y orden originales; test de que exportar sin cambios produce archivos idénticos a los cargados
- [ ] 8.4 Documentar en `docs/editor.md` el flujo "abrir /editor, ajustar, exportar, copiar a public/data, commit, push"; verificar que el usuario lo completa una vez con la cara (requiere imagen)

## 9. Integración y cierre del POC

- [ ] 9.1 Recorrido completo en el móvil del usuario desde la URL de previsualización del PR: inicio, mapa, cara, ficha por toque, práctica completa, recarga con progreso conservado; anotar en `docs/poc-result.md` qué falló y qué se ajusta (requiere imagen)
- [ ] 9.2 Verificar con el usuario las tres preguntas del POC (estilo de imagen, legibilidad de puntos en móvil, flujo de exportar y desplegar) y registrar la decisión de continuar o cambiar en `docs/poc-result.md`
- [ ] 9.3 (explicar) Fusionar el PR a `main` con merge commit, revisar y fusionar el PR de release-please, comprobar la etiqueta `v0.1.0` y el `CHANGELOG.md`; verificar que la URL de producción muestra "v0.1.0"
