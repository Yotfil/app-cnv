# Design

## Context

Proyecto nuevo, sin código previo. Fuente de contenido: el PDF del curso (27 láminas, 133 puntos etiquetados, catálogo de láminas en la sesión de diseño del 27 de septiembre de 2026). Existe un proyecto hermano `../app-microexpresiones/` con decisiones de estilo distintas (tinta con lavado gris); este proyecto toma un concepto visual propio y ambos se conectarán más adelante como features de una misma app.

Restricciones que dan forma al diseño: móvil primero, publicación estática en Netlify, backend FastAPI (repositorio aparte) y React Native en el futuro, la app crecerá con más features (login, más regiones, más modos), imágenes generadas por el usuario en Gemini Nano Banana, y la regla de que Claude no dibuja figuras en código. Motivación en proposal.md.

Las decisiones transversales que no pertenecen a este cambio (idioma del código, estructura por features, señal para librería de estado, seams de prueba) viven en `docs/adr/`; el glosario en `CONTEXT.md`; el proceso de trabajo en `docs/workflow.md`.

## Goals / Non-Goals

**Goals:**
- Validar con una región real (cara) el estilo de imagen, la legibilidad de puntos en móvil y el flujo imagen → puntos → despliegue.
- Dejar el modelo de datos, la estructura por features y la tooling cerrados para que las once regiones, los otros modos y el login se añadan sin rehacer nada.

**Non-Goals:**
- Optimizar rendimiento o accesibilidad más allá de lo básico (movimiento reducido, áreas táctiles, contraste).
- Diseño visual definitivo de la interfaz; el POC usa una paleta neutra y tipografía del sistema.

## Decisions

### D1. React + Vite + TypeScript estricto, CSS Modules, React Router, react-i18next
Alternativas: HTML sin framework (más simple, pero sin camino a React Native), Svelte o Preact (más ligeros, pero fuera de la ruta React Native). Se elige React por el requisito de migrar a React Native. TypeScript en modo `strict` para compartir tipos con el móvil y con el contrato de la API. CSS Modules porque no añade dependencias. React Router para tener URL por región y esconder el editor. react-i18next desde el principio con un único `es.json`: añadir idioma después es añadir un archivo; hacerlo tarde es tocar cada componente. Alias `@/` hacia `src/`. npm y `.nvmrc` con Node 24.

### D2. Estructura por features con dominio y UI separados dentro de cada una
```
src/
  app/                    # arranque: router, providers, ErrorBoundary, main.tsx
  features/
    catalog/
      domain/             # model.ts (Region, Point), catalog.ts (loadCatalog)
      ui/                 # MapScreen, RegionScreen, PointCard
      index.ts            # única puerta de entrada para otras features
    practice/
      domain/             # question.ts (generateQuestion, isCorrect), session.ts (createSession)
      ui/                 # PracticeScreen
    progress/
      domain/             # progress.ts (recordAnswer, clearProgress), store.ts (Store port)
      ui/                 # useProgress
    editor/
      domain/             # export.ts (exportCatalog)
      ui/                 # EditorScreen
    onboarding/
      ui/                 # HomeScreen
  shared/
    ui/                   # Illustration, Marker, Arrow, SideLabels
    lib/                  # i18n/, storage/, reportError.ts, uuid.ts
  test/                   # utilidades de test
public/
  data/regions.json, points.json
  img/<region-key>.png
```
Reglas: `domain/` no importa React, DOM, `fetch` ni `localStorage`; lo que necesita del exterior entra inyectado (`loadCatalog(source)`, `Store` con `read`/`write`, generador aleatorio). Una feature importa de otra solo a través de su `index.ts`. `shared/` no conoce ninguna feature. Alternativa descartada: capas globales `src/domain/` y `src/ui/`; con login y más modos en camino, la estructura por features concentra cada cambio en una carpeta y permite extraer una feature a paquete cuando llegue React Native. Detalle y razones en `docs/adr/0002-feature-structure.md`.

### D3. Coordenadas en porcentaje y capa SVG sobre la imagen
Cada región es un contenedor con proporción fija `width/height`; la imagen ocupa el 100 % y encima va un `<svg viewBox="0 0 100 100" preserveAspectRatio="none">` donde los marcadores y flechas se colocan en porcentaje. El mismo dato vale para cualquier pantalla y para el móvil nativo. Alternativa: píxeles de la imagen original con escalado en runtime; más propenso a errores al cambiar de imagen.

### D4. Identidad: UUID v4 fijo más clave legible
`id` se genera una vez al crear el catálogo (`scripts/new-id.ts` o el editor) y nunca cambia; el progreso lo referencia. `key` es un slug en inglés para humanos, para el editor y para las URLs. Alternativa: solo clave; se descarta porque renombrar rompería el progreso guardado y la base de datos futura quiere UUID.

### D5. Datos estáticos con la forma de la API
`public/data/regions.json` y `points.json` son listas planas con nombres de campo en inglés. `catalog.ts` expone `loadCatalog(source)` donde `source` es una función que devuelve ambos JSON; hoy hace `fetch` de los archivos, mañana llama al endpoint. El contrato con FastAPI (repositorio aparte) será un esquema OpenAPI del que el front generará sus tipos.

### D6. Selección de distractores
Prioridad: (1) punto simétrico (misma región, misma `key` sin sufijo de lado, lado opuesto), (2) resto de la región, (3) cualquier región. Se excluyen textos iguales al correcto o a sus alternativos. Función pura con generador aleatorio inyectable para poder probarla.

### D7. Progreso en localStorage con versión de esquema y `userId`
Clave `micropicores.progress.v1`. El documento lleva `version` para migrar y `userId` nulo, que el login futuro rellenará para disparar la migración a la API. Escritura tras cada respuesta, envuelta en try/catch; si falla, se pasa a almacén en memoria y se avisa una vez.

### D8. Editor como pantalla más de la app
Vive en `/editor`, usa los mismos componentes de ilustración y marcadores, y exporta con `Blob` + descarga. Sin autenticación: la ruta no está enlazada y editar no afecta a nadie hasta que el JSON se sube al repositorio. Alternativa: herramienta aparte en Node; se descarta porque perdería la vista real sobre la imagen.

### D9. Imágenes: maniquí neutro plano generado con referencia
Estilo: ilustración plana tipo infografía, maniquí sin sexo marcado, sin ropa ni genitales, sin pelo, un tono de piel plano claro con sombras mínimas, contorno fino, fondo blanco, vista frontal. Flujo en la web de Gemini: primero el cuerpo entero (formato vertical 9:16), luego cada recorte subiendo el cuerpo entero como referencia. Prompts en inglés en `prompts/`. Se acepta que la geometría entre cuerpo y recorte no sea exacta: los puntos se colocan sobre cada imagen por separado en el editor; solo hace falta que la figura sea reconociblemente la misma.

### D10. Lateralidad como dato y como rótulo
`side` siempre se refiere al cuerpo del sujeto. La figura se muestra como la ve un observador, por lo que el lado izquierdo del sujeto queda a la derecha de la pantalla. La UI lo resuelve con el rótulo fijo y con el texto "de la persona" en la ficha. Para la oreja (fuera del POC) la misma imagen se voltea con `transform: scaleX(-1)` y las coordenadas se reflejan como `100 - x`.

### D11. Despliegue, ramas y CI
Repositorio en GitHub (`Yotfil/app-cnv`). Netlify despliega `main` a producción y crea una previsualización por PR; `build: npm run build`, `publish: dist`, `_redirects` con `/* /index.html 200`. Ramas `feat/<nombre>` o `fix/<nombre>`, una por cambio de OpenSpec; PR a `main` con merge commit; GitHub Actions ejecuta `tsc --noEmit`, lint y tests en cada PR y es requisito para fusionar. Manifiesto web básico; sin service worker. Proceso paso a paso en `docs/workflow.md`.

### D12. Textos de interfaz solo en el archivo de mensajes
Ningún texto visible se escribe en un componente; todos viven en `src/shared/lib/i18n/es.json` y se leen con `t()`. El contenido del PDF (`meaning`, `gesture`, `name` de región) viene del catálogo, no de i18n.

### D13. Punto de conexión para errores
`ErrorBoundary` en `src/app/` y `reportError(error, context)` en `shared/lib/`, que hoy escribe en consola. Sentry se conectará ahí en un cambio posterior cuando el grupo use la app; el resto del código nunca llama a Sentry directamente.

### D14. Estado global solo a través de hooks propios
Sin librería de estado. El catálogo se carga una vez en un proveedor de contexto; `useCatalog`, `useProgress` y `useSession` son la única forma de tocar estado compartido, de modo que adoptar Zustand sea reescribir el interior de esos hooks. La señal para dar el paso está en `docs/adr/0003-state-library-trigger.md`.

### D15. Versiones y changelog
Versionado semántico con etiquetas de git; release-please en GitHub Actions abre un PR de versión con el `CHANGELOG.md` generado a partir de los commits convencionales (`tipo(scope): descripción`, sin espacio antes del paréntesis); el usuario revisa el texto y al fusionar se crea la etiqueta. La versión de `package.json` se muestra en la pantalla de inicio. El POC será `v0.1.0`.

### D16. Calidad en local
ESLint y Prettier con husky y lint-staged en pre-commit; el usuario ejecuta los commits (uno por tarea) con el mensaje que Claude le entrega. TDD estricto en `domain/` sobre los seams acordados en `docs/adr/0004-test-seams.md`; React Testing Library solo para los escenarios de interacción de las specs.

## Decisiones acordadas para cambios posteriores
Registradas aquí para no perderlas; cada una será su propio cambio de OpenSpec.
- Regiones restantes (nueve imágenes): `back-body`, `eyes`, `nose`, `mouth`, `ear` (una imagen volteada), `front-torso`, `back-torso`, `front-legs`, `back-legs`.
- Modo "¿dónde está?" en dos pasos: elegir región en el mapa y luego tocar el punto; acierto si cae dentro del `radius`; un texto repetido acepta cualquiera de sus posiciones.
- Repaso de fallos: modo que prioriza los puntos con más `misses`.
- Filtros por lado y etiqueta en la vista de región.
- Login y rutas protegidas contra el backend FastAPI; migrar el progreso local al `userId` al iniciar sesión.
- Sentry conectado a `reportError`.
- Segundo idioma de interfaz.
- Accesibilidad ampliada: etiquetas para lector de pantalla en los marcadores, navegación por teclado entre puntos, auditoría WCAG AA.
- Playwright de extremo a extremo cuando haya más de una región.
- Service worker para uso sin conexión.
- Conexión con la sección de microexpresiones como feature de esta misma app.

## Risks / Trade-offs

- [Nano Banana no mantiene la misma figura entre cuerpo y recorte] → Los puntos se colocan por imagen, no por geometría compartida; basta parecido de estilo. Si el estilo no convence, se regenera solo esa imagen.
- [Puntos a milímetros en cara (mentón, bajo el labio, laringe)] → `radius` ajustable por punto en el editor; en la vista, marcadores pequeños y ficha por toque, no por proximidad.
- [Texto literal del PDF es largo para opciones de práctica en móvil] → Opciones en tarjetas de ancho completo con texto envuelto; no se recorta el texto.
- [El usuario debe generar imágenes antes de ver el resultado real] → La app arranca con imágenes de marcador de posición (rectángulo gris con el nombre de la región) para que todo lo demás se pueda construir y probar antes.
- [Coordenadas propuestas por Claude a partir de un render anatómico no coinciden con la ilustración] → La propuesta es punto de partida; la corrección en el editor es parte del flujo.
- [Contenido con derechos del curso publicado en URL abierta] → El usuario hablará con el autor; la app lleva crédito y aviso; la URL no se difunde fuera del grupo.
- [Tooling amplia para un POC (CI, release-please, husky, i18n)] → Se monta una vez y se explica paso a paso; el coste es de horas y evita rehacer cuando el grupo ya use la app.

## Migration Plan

No hay datos previos. Despliegue: PR a `main` con Actions en verde, fusión con merge commit, Netlify publica. Reversión: revertir el merge commit. El progreso local lleva `version` para futuras migraciones.

## Open Questions

- Significado de los códigos "CON ESI", "ASI" y "O1p2": el usuario no los encontró en sus notas; se conservan literalmente y él actualizará el catálogo si aparece la información. No afecta a specs ni tareas.
