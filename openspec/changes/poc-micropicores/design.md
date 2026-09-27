# Design

## Context

Proyecto nuevo, sin código previo. Fuente de contenido: el PDF del curso (27 láminas, 133 puntos etiquetados, catálogo de láminas en la sesión de diseño del 27 de septiembre de 2026). Existe un proyecto hermano `../app-microexpresiones/` con decisiones de estilo distintas (tinta con lavado gris); este proyecto toma un concepto visual propio y ambos se conectarán más adelante.

Restricciones que dan forma al diseño: móvil primero, publicación estática en Netlify, backend FastAPI y React Native en el futuro, imágenes generadas por el usuario en Gemini Nano Banana, y la regla de que Claude no dibuja figuras en código. Motivación en proposal.md.

## Goals / Non-Goals

**Goals:**
- Validar con una región real (cara) el estilo de imagen, la legibilidad de puntos en móvil y el flujo imagen → puntos → despliegue.
- Dejar el modelo de datos y la separación de capas cerrados para que las once regiones y los otros modos se añadan sin rehacer nada.

**Non-Goals:**
- Optimizar rendimiento o accesibilidad más allá de lo básico (movimiento reducido, áreas táctiles).
- Diseño visual definitivo de la interfaz; el POC usa una paleta neutra y tipografía del sistema.

## Decisions

### D1. React + Vite + TypeScript, CSS Modules, React Router
Alternativas: HTML sin framework (más simple, pero sin camino a React Native), Svelte o Preact (más ligeros, pero fuera de la ruta React Native). Se elige React porque es el requisito explícito del usuario para migrar a React Native. TypeScript para compartir tipos con el móvil y con el contrato de la API. CSS Modules porque no añade dependencias; en React Native no se reutiliza ninguna opción de estilos web, así que se elige por comodidad. React Router para tener URL por región y esconder el editor en una ruta.

### D2. Dos capas: dominio sin DOM y UI React
```
src/
  dominio/        # TypeScript puro, sin React ni DOM
    modelo.ts     # tipos Region, Punto, Progreso
    catalogo.ts   # carga y validación de regiones.json y puntos.json
    practica.ts   # motor de preguntas y selección de distractores
    progreso.ts   # lectura y escritura del progreso (recibe un almacén inyectado)
  ui/
    pantallas/    # Inicio, Mapa, Region, Practica, Editor
    componentes/  # Ilustracion, Marcador, Ficha, RotuloLateralidad, Flecha
  main.tsx
public/
  data/regiones.json, puntos.json
  img/<clave-region>.png
```
Alternativa: todo en componentes. Se descarta porque en React Native se reescriben las vistas pero se reutiliza el dominio; y porque el motor de práctica se prueba con tests unitarios sin navegador. El almacén de progreso se inyecta (interfaz `Almacen` con `leer`/`escribir`) para cambiar localStorage por AsyncStorage o por la API sin tocar la lógica.

### D3. Coordenadas en porcentaje y capa SVG sobre la imagen
Cada región es un contenedor con proporción fija `ancho/alto`; la imagen ocupa el 100 % y encima va un `<svg viewBox="0 0 100 100" preserveAspectRatio="none">` donde los marcadores y flechas se colocan en porcentaje. Así el mismo dato vale para cualquier pantalla y para el móvil nativo. Alternativa: píxeles de la imagen original con escalado en runtime; más propenso a errores al cambiar de imagen.

### D4. Identidad: UUID v4 fijo más clave legible
`id` se genera una vez al crear el catálogo (script `scripts/nuevo-id.ts` o generación en el editor) y nunca cambia; el progreso lo referencia. `clave` es para humanos y para el editor. Alternativa: solo clave; se descarta porque renombrar rompería el progreso guardado y la base de datos futura quiere UUID.

### D5. Datos estáticos con la forma de la API
`public/data/regiones.json` y `puntos.json` son listas planas. `catalogo.ts` expone `cargarCatalogo(fuente)` donde `fuente` es una función que devuelve ambos JSON; hoy hace `fetch` de los archivos, mañana llama al endpoint. El modelo Pydantic de FastAPI se derivará de `modelo.ts` cuando llegue.

### D6. Selección de distractores
Prioridad: (1) punto simétrico (misma región, misma `clave` sin sufijo de lado, lado opuesto), (2) resto de la región, (3) cualquier región. Se excluyen textos iguales al correcto o a sus alternativos. Se implementa como función pura con generador aleatorio inyectable para poder probarla.

### D7. Progreso en localStorage con versión de esquema
Clave `micropicores.progreso.v1`. El documento lleva `version` para migrar. Escritura tras cada respuesta, envuelta en try/catch; si falla, se pasa a almacén en memoria y se avisa una vez.

### D8. Editor como pantalla más de la app
Vive en `/editor`, usa los mismos componentes de ilustración y marcadores, y exporta con `Blob` + descarga. No hay autenticación: la ruta no está enlazada y editar no afecta a nadie hasta que el JSON se sube al repositorio. Alternativa: herramienta aparte en Node; se descarta porque perdería la vista real sobre la imagen.

### D9. Imágenes: maniquí neutro plano generado con referencia
Estilo: ilustración plana tipo infografía, maniquí sin sexo marcado, sin ropa ni genitales, sin pelo, un tono de piel plano claro con sombras mínimas, contorno fino, fondo blanco, vista frontal. Flujo en la web de Gemini: primero el cuerpo entero (formato vertical 9:16), luego cada recorte subiendo el cuerpo entero como referencia. Prompts en inglés en `prompts/`. Se acepta que la geometría entre cuerpo y recorte no sea exacta: los puntos se colocan sobre cada imagen por separado en el editor, así que no hace falta que coincidan píxel a píxel; solo que la figura sea reconociblemente la misma.

### D10. Lateralidad como dato y como rótulo
`lado` siempre se refiere al cuerpo del sujeto. La figura se muestra como la ve un observador, por lo que el lado izquierdo del sujeto queda a la derecha de la pantalla. La UI lo resuelve con el rótulo fijo y con el texto "de la persona" en la ficha. Para la oreja (fuera del POC) la misma imagen se voltea con `transform: scaleX(-1)` y las coordenadas se reflejan como `100 - x`.

### D11. Despliegue
Repositorio en GitHub creado por el usuario; Netlify con `build: npm run build`, `publish: dist`, y `_redirects` con `/* /index.html 200` para React Router. Manifiesto web básico (nombre, iconos, `display: standalone`). Sin service worker.

## Decisiones acordadas para cambios posteriores
Registradas aquí para no perderlas; cada una será su propio cambio de OpenSpec.
- Regiones restantes (nueve imágenes): cuerpo dorsal, ojos, nariz, boca y mentón, oreja (una imagen volteada), torso y brazos frontal, torso y brazos dorsal, piernas frontal, piernas dorsal.
- Modo "¿dónde está?" en dos pasos: elegir región en el mapa y luego tocar el punto; acierto si cae dentro del `radio`; un texto repetido acepta cualquiera de sus posiciones.
- Repaso de fallos: modo que prioriza los puntos con más fallos.
- Filtros por lado y etiqueta en la vista de región.
- Backend FastAPI con cuentas; migrar el progreso local al usuario al iniciar sesión.
- Service worker para uso sin conexión.
- Conexión con la app de microexpresiones.

## Risks / Trade-offs

- [Nano Banana no mantiene la misma figura entre cuerpo y recorte] → Los puntos se colocan por imagen, no por geometría compartida; basta parecido de estilo. Si el estilo no convence, se regenera solo esa imagen.
- [Puntos a milímetros en cara (mentón, bajo el labio, laringe)] → `radio` ajustable por punto en el editor; en la vista, marcadores pequeños y ficha por toque, no por proximidad.
- [Texto literal del PDF es largo para opciones de práctica en móvil] → Opciones en tarjetas de ancho completo con texto envuelto; no se recorta el texto.
- [El usuario debe generar imágenes antes de ver el resultado real] → La app arranca con imágenes de marcador de posición (rectángulo gris con el nombre de la región) para que todo lo demás se pueda construir y probar antes.
- [Coordenadas propuestas por Claude a partir de un render anatómico no coinciden con la ilustración] → Se asume: la propuesta es punto de partida; la corrección en el editor es parte del flujo.
- [Contenido con derechos del curso publicado en URL abierta] → El usuario hablará con el autor; la app lleva crédito y aviso; la URL no se difunde fuera del grupo.

## Migration Plan

No hay datos previos. Despliegue: push a `main` en GitHub dispara Netlify. Reversión: revertir el commit. El progreso local lleva `version` para futuras migraciones.

## Open Questions

- Significado de los códigos "CON ESI", "ASI" y "O1p2": el usuario buscará sus notas de clase; mientras tanto se conservan literalmente. No afecta a specs ni tareas.
