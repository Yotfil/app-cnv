# Catálogo de micropicores

Cómo está hecho el catálogo y cómo se añade un micropicor o una región. Fuente única del contenido: el PDF del curso, `../CC_ENTRENAMIENTO DE MICROPICORES.pdf` (27 láminas), fuera del repositorio.

## Archivos

| Archivo                                | Qué contiene                                                                              |
| -------------------------------------- | ----------------------------------------------------------------------------------------- |
| `public/data/regions.json`             | Lista de regiones: cada ilustración y su lugar en el cuerpo                               |
| `public/data/points.json`              | Lista de micropicores (en el código, **puntos**)                                          |
| `public/img/<key>.png`                 | Ilustración de cada región, con el nombre de su `key`                                     |
| `src/features/catalog/domain/model.ts` | Tipos `Region` y `Point`: la definición exacta de cada campo                              |
| `src/test/fixtures/pdf-text.json`      | Texto extraído de cada lámina usada, para comprobar que el catálogo es literal            |
| `src/test/catalog-content.test.ts`     | Test que compara cada significado con el texto de su lámina y lista las erratas aceptadas |

Las dos listas tienen la forma que devolverá el futuro backend FastAPI. Los nombres de campo son el contrato: cambiar uno es un cambio de OpenSpec, no una edición suelta.

## Lateralidad

`side` es **siempre el lado del cuerpo de la persona observada**, nunca el de la pantalla.

- `left`: lado izquierdo de la persona. En el PDF, lo personal: yo, mis deseos.
- `right`: lado derecho de la persona. En el PDF, lo exterior: el otro, los intereses.
- `center`: sobre la línea media (frente al centro, entrecejo, mentón, laringe).

Las láminas y las ilustraciones muestran a la persona de frente, mirando al observador, así que **su lado izquierdo queda a la derecha de la imagen**. Al transcribir, un punto que en la lámina está a la derecha de la imagen es `left`. La app lo recuerda con los rótulos "Derecha de la persona" e "Izquierda de la persona".

Regiones con `mirror: true` (la oreja, en el futuro) usan la misma imagen volteada para el lado contrario; ahí la `x` se refleja como `100 - x`.

## Campos

### Región

| Campo             | Obligatorio | Qué es                                                                                                                       |
| ----------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `id`              | sí          | UUID v4 generado con `npm run new-id`. No cambia nunca                                                                       |
| `key`             | sí          | Slug en inglés, minúsculas y guiones, único (`face`, `front-torso`). Va en la URL                                            |
| `name`            | sí          | Nombre en español para la interfaz ("Cara")                                                                                  |
| `view`            | sí          | `front`, `back` o `side`                                                                                                     |
| `image`           | no          | Ruta de la ilustración (`/img/face.png`). Si se omite, la región aparece en el mapa atenuada con "próximamente" y no se abre |
| `width`, `height` | sí          | Tamaño real del PNG en píxeles; fija la proporción de la ilustración                                                         |
| `parent`          | no          | `id` de la región de cuerpo entero desde la que se abre. Sin `parent`, la región es un mapa                                  |
| `zone`            | no          | Polígono en porcentaje sobre la imagen del `parent` que abre esta región                                                     |
| `mirror`          | sí          | `true` solo si la imagen se usa volteada para el lado contrario                                                              |

### Punto

| Campo                 | Obligatorio | Qué es                                                                                                                   |
| --------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| `id`                  | sí          | UUID v4 generado con `npm run new-id`. No cambia nunca: el progreso de los alumnos lo usa                                |
| `key`                 | sí          | Nombre legible en inglés. Puede cambiar. Ver convención abajo                                                            |
| `region`              | sí          | `id` de la región a la que pertenece                                                                                     |
| `side`                | sí          | `left`, `right` o `center`, del cuerpo de la persona                                                                     |
| `x`, `y`              | sí          | Posición en porcentaje del ancho y del alto de la ilustración (0 a 100). Nunca píxeles                                   |
| `radius`              | sí          | Radio de acierto en porcentaje del ancho. Por defecto `4`                                                                |
| `meaning`             | sí          | Texto literal del PDF (ver política)                                                                                     |
| `alternativeMeanings` | sí          | Otros textos que el PDF da para el mismo lugar. `[]` si no hay                                                           |
| `tags`                | sí          | Subconjunto de `personal`, `external`, `micro-caress`, `inner-side`, solo si la lámina lo marca expresamente. `[]` si no |
| `gesture`             | no          | Texto del PDF que describe la dirección del rascado, si lo hay                                                           |
| `arrow`               | no          | Flecha dibujada en la lámina: `{ "from": { "x", "y" }, "to": { "x", "y" } }` en porcentaje                               |
| `muscle`              | no          | Músculo, solo si el PDF lo nombra ("masetero")                                                                           |
| `page`                | sí          | Número de lámina del PDF (la página 1 es la portada)                                                                     |

Los campos opcionales se omiten cuando no aplican; no se escriben con `null`.

### Convención de `key`

- Lugar en inglés, en minúsculas con guiones: `glabella`, `below-lip`, `neck-base`.
- Los puntos con pareja en el otro lado terminan en `-left` o `-right` con la misma base: `cheek-left` y `cheek-right`. La práctica usa esa base para encontrar el **punto simétrico**, que es el distractor preferente. Un punto central no lleva sufijo.

## Política de literalidad

El contenido es solo el del PDF. No se añaden explicaciones, fiabilidad, notas del autor ni interpretaciones.

1. **Carácter a carácter.** `meaning` se copia tal cual, con su puntuación ("Duda." lleva punto). Los saltos de línea de la lámina se sustituyen por espacios.
2. **Erratas evidentes.** Solo se corrige lo que es claramente un error de escritura ("qque" → "que"). Cada corrección se anota en la lista `errata` de `src/test/catalog-content.test.ts` con su motivo; si no, el test falla.
3. **Texto que nombra el lugar.** Si la frase empieza diciendo dónde está el punto ("En la mejilla derecha queremos morder al otro…"), se quita esa parte y se pone mayúscula a la primera palabra ("Queremos morder al otro…"): en la práctica una opción que nombra el lugar delata la respuesta. Se anota en `errata`.
4. **Instrucciones para localizar el punto.** Las frases que explican cómo encontrarlo ("Para ubicarlo correctamente, podemos realizar una presión fuerte con la mandíbula…") no van en `meaning`. Si nombran el músculo, este va en `muscle`.
5. **Dos significados en el mismo lugar.** El primero en `meaning`, el resto en `alternativeMeanings`, en el orden del PDF. Vale también para lecturas que dependen de un código ("CON ESI-…" y "ASI-…").
6. **El mismo significado en dos lugares.** Dos puntos con `id` distintos y el mismo `meaning`.
7. **Puntos sin etiqueta.** Los marcadores de la lámina sin texto asociado no entran. Por ejemplo, la lámina 4 repite en rojo los puntos de la frente de la lámina 3 sin texto, y marca el mentón sin texto.
8. **Citar la lámina.** Cada punto lleva su `page`.

### Códigos sin leyenda

El PDF usa códigos cuyo significado no explica: "CON ESI", "ASI", "O1p2". Se conservan exactamente como aparecen, sin expandirlos ni interpretarlos. Si algún día aparece su significado, se actualiza el catálogo en un cambio propio.

## Añadir un micropicor

Requisito: la región ya existe en `regions.json` con su ilustración. Si no, primero "Añadir una región".

1. **Ver la lámina.** Renderízala para saber qué etiqueta va con qué punto:
   ```
   gs -q -dNOPAUSE -dBATCH -sDEVICE=png16m -r110 -dFirstPage=N -dLastPage=N -sOutputFile=lamina-N.png "../CC_ENTRENAMIENTO DE MICROPICORES.pdf"
   ```
2. **Extraer el texto.** Con Python y pypdf (`python3 -m pip install --user pypdf`):
   ```
   python3 -c "from pypdf import PdfReader; print(PdfReader('../CC_ENTRENAMIENTO DE MICROPICORES.pdf').pages[N-1].extract_text())"
   ```
   Si la lámina `N` no está aún en `src/test/fixtures/pdf-text.json`, añade `"N": "<texto extraído>"` tal como sale.
3. **Decidir el lado** mirando la lámina: a la derecha de la imagen es `left` (ver Lateralidad).
4. **Generar el id:** `npm run new-id` (o `npm run new-id -- 5` para varios).
5. **Añadir la entrada** a `public/data/points.json` con todos los campos obligatorios. `x`, `y` aproximados y `radius` 4; se afinan en el paso 7.
6. **Comprobar:**
   ```
   npx vitest run src/test/catalog-content.test.ts
   ```
   Debe salir en verde el caso `<key> (lámina N) is literal`. Si falla, el texto no coincide con la lámina: corrígelo o, si es una errata o un ajuste de los puntos 2 o 3 de la política, anótalo en `errata`.
7. **Ajustar la posición** sobre la ilustración real en el editor oculto (`/editor`), exportar y copiar el JSON a `public/data/`. No se editan coordenadas a ojo. Ver `docs/editor.md`.
8. **Commit** con un mensaje como `feat(catalog): micropicores del torso de la lámina 17`.

## Añadir una región

1. Generar la ilustración con el prompt de `prompts/<key>.md` y guardarla en `public/img/<key>.png`.
2. `npm run new-id` para su `id`.
3. Añadirla a `public/data/regions.json` con `width` y `height` reales del PNG y, si se abre desde un mapa, `parent` y una `zone` aproximada.
4. Ajustar la `zone` en el editor, sobre el mapa.
5. Añadir sus micropicores como arriba.
