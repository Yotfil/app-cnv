# Proposal

## Why

El grupo de la clase del curso "Entrenamiento de Micropicores" solo dispone de un PDF de 27 láminas con fotos anatómicas y 133 puntos etiquetados; no hay forma de practicar la ubicación ni el significado de cada punto desde el móvil. Antes de construir la app completa hay tres riesgos que solo se despejan construyendo: si el estilo de ilustración generada por IA sirve para ubicar puntos, si los puntos se leen en pantalla de móvil, y si el flujo de generar imagen, colocar puntos y desplegar es llevadero.

## What Changes

- Proyecto nuevo React + Vite + TypeScript en `app-micropicores/`, publicado en Netlify desde GitHub.
- Pantalla de inicio con crédito al curso y el aviso de prudencia de la página 2 del PDF.
- Mapa de cuerpo entero frontal con zonas clicables y contador de puntos por zona. En el POC solo la zona "cara" está activa.
- Vista de región "cara frontal" con sus puntos marcados con latido sutil; al tocar o pasar el ratón se abre la ficha del punto con zona, lado y significado literal del PDF. Rótulo fijo de lateralidad.
- Modo de práctica "¿qué significa?" restringido a los puntos de la cara: se ilumina un punto y se eligen 4 significados.
- Progreso por punto y alias opcional guardados en localStorage.
- Editor oculto de posiciones (ruta no enlazada) que permite mover puntos sobre la imagen y exportar el JSON para subirlo al repositorio.
- Catálogo de datos `regiones.json` y `puntos.json` con la forma del futuro endpoint de FastAPI. En el POC solo se rellenan las regiones cuerpo-frontal y cara con sus puntos.
- Prompts en inglés para generar en Gemini Nano Banana el cuerpo entero frontal y la cara frontal (los genera el usuario).

## Capabilities

### New Capabilities
- `catalogo-puntos`: modelo y contenido de regiones y puntos extraído del PDF, con identidad estable, lateralidad, coordenadas en porcentaje y significado literal.
- `inicio-aviso`: pantalla de entrada con crédito al curso, aviso de prudencia y alias opcional.
- `navegacion-cuerpo`: mapa de cuerpo entero con zonas que abren regiones.
- `estudio-region`: visualización de los puntos de una región, ficha por punto y rótulo de lateralidad.
- `practica-significado`: ejercicio de elección múltiple "¿qué significa?" con distractores de la misma región y tratamiento de duplicados.
- `progreso-local`: registro de aciertos y fallos por punto y alias en el dispositivo.
- `editor-posiciones`: herramienta de desarrollo para ajustar coordenadas y exportar el catálogo.

### Modified Capabilities
(ninguna; el proyecto no tiene especificaciones previas)

## Impact

- Código nuevo en `src/` (lógica sin DOM en `src/dominio/`, componentes en `src/ui/`), datos en `public/data/`, imágenes en `public/img/`.
- Dependencias: react, react-dom, react-router-dom, vite, typescript. Sin backend.
- Sistemas externos: GitHub (repositorio), Netlify (hosting), Gemini Nano Banana (imágenes, operado por el usuario).
- Depende de que el usuario genere dos imágenes (cuerpo frontal y cara frontal) con geometría compatible; hasta entonces la app funciona con imágenes de marcador de posición.

## Fuera de alcance

- Cuerpo dorsal y el resto de las nueve regiones (ojos, nariz, boca, oreja, torso, piernas).
- Modo "¿dónde está?" y repaso de fallos.
- Filtros por lado o etiqueta (el modelo los soporta; la UI no los muestra).
- Backend FastAPI, cuentas de usuario, base de datos.
- Service worker y funcionamiento sin conexión (solo manifiesto).
- Cuerpo 3D rotable (descartado).
- Notas o fiabilidad de autor y apuntes personales (descartado: el contenido es exclusivamente el del PDF).
- Control de acceso a la URL.
- React Native.
