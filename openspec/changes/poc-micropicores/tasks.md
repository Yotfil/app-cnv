# Tasks

## 1. Andamiaje y despliegue

- [ ] 1.1 Crear el proyecto con `npm create vite@latest . -- --template react-ts`, añadir react-router-dom y verificar que `npm run dev` sirve la página de ejemplo
- [ ] 1.2 Crear la estructura `src/dominio`, `src/ui/pantallas`, `src/ui/componentes`, `public/data`, `public/img`, `prompts/` y verificar que `npm run build` termina sin errores
- [ ] 1.3 Inicializar git, `.gitignore` de Node, primer commit, y verificar que el usuario ha creado el repositorio en GitHub y el push llega a `main`
- [ ] 1.4 Configurar Netlify (build `npm run build`, publish `dist`, `public/_redirects` con `/* /index.html 200`) y verificar que la URL de Netlify muestra la app y que una ruta profunda recargada no da 404
- [ ] 1.5 Añadir `manifest.webmanifest` con nombre, colores e icono provisional y verificar que Chrome en Android ofrece "Añadir a pantalla de inicio"

## 2. Modelo y catálogo

- [ ] 2.1 Escribir `src/dominio/modelo.ts` con los tipos `Region`, `Punto`, `Progreso` y `Almacen` según el spec de catalogo-puntos y progreso-local, y verificar que `tsc --noEmit` pasa
- [ ] 2.2 Escribir `src/dominio/catalogo.ts` con `cargarCatalogo(fuente)` que valida que cada punto referencia una región existente, con tests (Vitest) para punto válido, punto con región inexistente y región de cuerpo entero sin puntos
- [ ] 2.3 Escribir `scripts/nuevo-id.ts` que genera UUID v4 y verificar que dos ejecuciones producen ids distintos y con formato válido
- [ ] 2.4 Crear `public/data/regiones.json` con `cuerpo-frontal` y `cara` (ids UUID, zona provisional de la cara como rectángulo en porcentaje, imagen apuntando a marcador de posición) y verificar que la carga de catálogo pasa
- [ ] 2.5 Transcribir a `public/data/puntos.json` los puntos de las láminas 3, 4 y 13 del PDF (frente ×3, entrecejo, mejilla izquierda, mejilla derecha, bajo el labio "Duda", laringe "CON ESI / ASI", y los 3 de la lámina 13 de cuello y mentón), con lado, página, músculo cuando el PDF lo nombra, la flecha mejilla → mentón, coordenadas propuestas a partir del render del PDF y `radio` por defecto 4; verificar con un test que cada significado coincide carácter a carácter con el texto extraído del PDF salvo erratas listadas
- [ ] 2.6 Documentar en `docs/catalogo.md` la convención de lateralidad, los campos, la política de literalidad y los códigos sin leyenda, y verificar que un lector puede añadir un punto nuevo siguiendo solo ese documento

## 3. Prompts e imágenes (requiere imagen)

- [ ] 3.1 Escribir `prompts/cuerpo-frontal.md` en inglés: prompt maestro del maniquí neutro plano (sin sexo, sin ropa, sin pelo, un tono de piel, contorno fino, fondo blanco, frontal, 9:16, brazos ligeramente separados del cuerpo), prompt negativo y lista de comprobación; verificar que el usuario lo ejecuta en la web de Gemini y guarda `public/img/cuerpo-frontal.png` (requiere imagen)
- [ ] 3.2 Escribir `prompts/cara.md` con el prompt de recorte de cabeza y cuello usando el cuerpo entero como referencia, formato 1:1, y lista de comprobación (orejas, mentón y base del cuello visibles); verificar que el usuario guarda `public/img/cara.png` (requiere imagen)
- [ ] 3.3 Actualizar `ancho` y `alto` de ambas regiones en `regiones.json` con las dimensiones reales de los PNG y verificar que la ilustración se muestra sin deformación en la vista de región (requiere imagen)

## 4. Componentes de ilustración y vista de región

- [ ] 4.1 Componente `Ilustracion` (contenedor de proporción fija, imagen al 100 %, SVG viewBox 0 0 100 100 encima) y verificar con un test de render que un marcador en x=50,y=50 queda centrado a dos anchos distintos
- [ ] 4.2 Componente `Marcador` con latido CSS y desactivación bajo `prefers-reduced-motion`, y verificar visualmente en Chrome con la preferencia activada y desactivada
- [ ] 4.3 Componente `Flecha` que dibuja una flecha entre dos coordenadas en porcentaje y verificar con la flecha mejilla → mentón de la cara
- [ ] 4.4 Componente `RotuloLateralidad` con "Derecha de la persona" a la izquierda y "Izquierda de la persona" a la derecha, y verificar que se mantiene visible en 360 px de ancho
- [ ] 4.5 Componente `Ficha` con nombre de zona, lado en palabras, significado, alternativos con "también", gesto y etiquetas; como panel inferior en táctil y como tarjeta junto al marcador con puntero; verificar en Chrome escritorio (hover) y en emulación móvil (toque, cierre al tocar fuera)
- [ ] 4.6 Pantalla `Region` en ruta `/region/:clave` que carga catálogo, aplica el filtro (sin controles) y compone los componentes anteriores; verificar que todos los puntos de `cara` se muestran y que la URL directa funciona con botón de volver al mapa

## 5. Inicio y mapa

- [ ] 5.1 Pantalla `Inicio` en `/` con crédito, aviso resumido de la página 2, campo alias (máximo 30), botón continuar y acción de borrar progreso con confirmación; verificar que la primera visita bloquea y la segunda no, y que borrar vuelve al estado inicial
- [ ] 5.2 Pantalla `Mapa` en `/mapa` con la ilustración de cuerpo frontal y una zona por región hija (polígono SVG con nombre y contador, área táctil mínima 44 px, resaltado en hover y toque); verificar que "Cara · N" navega a `/region/cara` y que no hay desplazamiento horizontal a 360 px
- [ ] 5.3 Zonas de regiones sin imagen atenuadas con "próximamente" y verificar que no navegan

## 6. Motor de práctica y pantalla

- [ ] 6.1 `src/dominio/practica.ts`: `generarPregunta(punto, catalogo, azar)` con la prioridad de distractores (simétrico, misma región, cualquiera), exclusión de textos iguales al correcto y a sus alternativos, y `esCorrecta(pregunta, opcion)`; tests para región con suficientes puntos, región con pocos puntos, texto repetido y punto con alternativos
- [ ] 6.2 `crearSesion(region, catalogo, azar)` que recorre los puntos sin repetir y devuelve avance y resumen; tests de orden sin repetición y de resumen final
- [ ] 6.3 Pantalla `Practica` en `/practica` con selector de región (solo "cara" activa), pregunta con un único marcador visible, cuatro opciones en tarjetas de ancho completo, corrección en rojo y verde, ficha del punto, botón siguiente, avance "n de N" y resumen final con repetir; verificar una sesión completa en emulación móvil
- [ ] 6.4 Documentar en `docs/practica.md` la regla de distractores y los casos especiales, y verificar que los ejemplos del documento coinciden con los tests

## 7. Progreso local

- [ ] 7.1 `src/dominio/progreso.ts` con `Almacen` inyectable, documento versionado `micropicores.progreso.v1`, `registrarRespuesta(id, modo, acierto)` y `borrar()`; tests con almacén en memoria para acierto, fallo, recarga y borrado
- [ ] 7.2 Implementación `almacenLocalStorage` con try/catch, cambio a memoria si falla y aviso único; verificar en Chrome con almacenamiento bloqueado que la práctica sigue y aparece el aviso
- [ ] 7.3 Conectar la práctica al progreso y mostrar el alias en la pantalla de práctica; verificar que tras recargar los contadores del punto se conservan

## 8. Editor de posiciones

- [ ] 8.1 Pantalla `Editor` en `/editor` (sin enlace) con selector de región, lista lateral de puntos por clave, arrastre de marcadores en porcentaje y edición de `radio` con círculo visible; verificar arrastrando "entrecejo" y comprobando que el porcentaje cambia
- [ ] 8.2 Edición de vértices del polígono `zona` de las regiones hijas sobre el mapa y verificar que la zona de la cara se ajusta a la ilustración real
- [ ] 8.3 Exportación de `regiones.json` y `puntos.json` completos con ids y orden originales; verificar con un test que exportar sin cambios produce archivos idénticos a los cargados
- [ ] 8.4 Documentar en `docs/editor.md` el flujo "abrir /editor, ajustar, exportar, copiar a public/data, commit, push" y verificar que el usuario lo completa una vez con la cara (requiere imagen)

## 9. Integración y cierre del POC

- [ ] 9.1 Recorrido completo en el móvil del usuario desde la URL de Netlify: inicio, mapa, cara, ficha por toque, práctica completa, recarga con progreso conservado; anotar en `docs/poc-resultado.md` qué falló y qué se ajusta (requiere imagen)
- [ ] 9.2 Verificar con el usuario las tres preguntas del POC (estilo de imagen, legibilidad de puntos en móvil, flujo de exportar y desplegar) y registrar la decisión de continuar o cambiar en `docs/poc-resultado.md`
