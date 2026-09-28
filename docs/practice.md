# Práctica "¿qué significa?"

Cómo se construye cada pregunta y cómo avanza una sesión. El código está en `src/features/practice/domain/` (`question.ts`, `session.ts`) y lo comprueban `question.test.ts` y `session.test.ts`. Cada ejemplo de este documento es uno de esos tests, con los mismos textos: si cambia la regla, cambian los dos.

## La pregunta

Se muestra la ilustración de la región con **un solo** micropicor resaltado y cuatro opciones de texto en orden aleatorio: el significado del micropicor y tres **distractores** (opciones incorrectas).

### De dónde salen los distractores

Por este orden, hasta tener tres:

1. **El punto simétrico**: misma región, misma `key` sin el sufijo `-left` o `-right`, lado opuesto. Por ejemplo `cheek-right` y `cheek-left`. Es el distractor más útil porque obliga a fijarse en el lado.
2. **Otros micropicores de la misma región**, en orden aleatorio.
3. **Micropicores de cualquier otra región**, en orden aleatorio, solo si la región no da para tres.

Y dos exclusiones:

- Nunca se ofrece como distractor un texto que cuente como correcto: el significado del micropicor ni ninguno de sus `alternativeMeanings`.
- Ningún texto se repite entre las opciones.

Si en todo el catálogo no hay textos suficientes, la pregunta sale con menos de cuatro opciones.

### Qué cuenta como acierto

Elegir el significado principal **o cualquiera de sus alternativos** (`isCorrect`). Las opciones solo incluyen el principal, pero la regla acepta los dos por si en el futuro se ofrece un alternativo.

## Ejemplos (los mismos que los tests)

### Región con micropicores suficientes: entra el simétrico

Pregunta sobre la mejilla derecha (lámina 4), con la cara como catálogo.

- Correcta: "Queremos morder al otro, el otro nos molesta, nos pone nervioso, nos saca de las casillas."
- Entre los distractores está siempre la mejilla izquierda: "Aquí la agresividad es autodirigida, hacia uno mismo y sus propios actos. Suele suceder cuando repetimos errores."
- Los otros dos salen de la cara (por ejemplo "Duda.", "Necesito indagar" o "Reflexiono").

Test: _offers the right meaning and three distractors from the same region, the symmetric point among them_.

### Región con pocos micropicores: se completa con otras

Pregunta sobre "Duda." en una región que solo tiene además "Necesito indagar". Los dos distractores que faltan salen de otra región. En el test son textos marcados como de prueba, porque el POC solo tiene la cara.

Test: _completes the distractors with points from other regions when the region has few_.

### El mismo texto en dos lugares

El caso de la spec: "Necesidad de tomar/estar en su sitio" está en el esternón y en la cadera derecha. En la pregunta del esternón, el texto de la cadera no se ofrece como distractor: habría dos opciones iguales y una "incorrecta" que en realidad es correcta. El texto aparece una sola vez y las cuatro opciones son distintas.

Test: _never offers as a distractor a text equal to the right meaning_.

### Micropicor con significados alternativos

La laringe (lámina 4): significado "CON ESI- Me pone nervioso, posición altiva." y alternativo "ASI- algo escondido me hace dudar".

- Si otro micropicor tuviera "ASI- algo escondido me hace dudar" como texto, no se ofrece como distractor.
- Elegir "ASI- algo escondido me hace dudar" cuenta como acierto, igual que el principal.
- Elegir "Duda." es un fallo.

Test: _accepts an alternative meaning as right and never offers it as a distractor_.

## La sesión

- Recorre **todos** los micropicores de la región elegida, cada uno una vez, en orden aleatorio. Los de otras regiones no entran.
- Muestra el avance como "1 de 3", "2 de 3", "3 de 3".
- Al terminar da el resumen de aciertos y fallos, con la misma regla de acierto que la pregunta. Por ejemplo, acertar, fallar y acertar da "2 aciertos · 1 fallo".

Tests: _goes through every point of the region once, showing its position_ y _sums up hits and misses when every point has been answered_.

## Aleatoriedad

Tanto el orden de las opciones como el de las preguntas dependen de una función `random` inyectada (`src/features/practice/domain/random.ts`). La app usa `Math.random`; los tests usan una función fija para que el resultado no dependa del azar, y comprueban qué opciones hay, no en qué posición salen.

## Cómo se ve la corrección

Tras responder, la opción correcta se marca en verde con ✓ y, si fallaste, tu elección en gris con ✗: en esta app el rojo nunca significa error (`docs/design/tokens.md`). Después aparecen el veredicto ("Acertaste" o "No era ese."), la ficha del micropicor y "Siguiente".
