# Glosario del proyecto Micropicores

Vocabulario del dominio. En la conversación y la documentación se usa el término en español; en el código, el término en inglés indicado entre paréntesis. Cada entrada dice qué no llamar así.

- **Micropicor**: gesto de rascarse en un lugar concreto del cuerpo que la sinergología asocia a un significado. En el catálogo cada micropicor es un **punto**. No usar "picor" ni "gesto" a secas. En los textos que ve el alumno se dice siempre "micropicor" o "micropicores", nunca "punto".
- **Punto** (`Point`): entrada del catálogo con identidad estable, región, lado, posición en porcentaje y significado literal del PDF. No confundir con **marcador**, que es el círculo dibujado en pantalla para representarlo.
- **Marcador** (`Marker`): componente visual que dibuja un punto sobre la ilustración, con latido sutil. No es un dato; se deriva del punto.
- **Región** (`Region`): una ilustración con su lugar en el cuerpo: cuerpo entero frontal, cara, ojos, oreja, torso frontal... Tiene `key` en inglés (`face`, `front-body`) y `name` en español para la interfaz. No usar "vista" para esto; **vista** (`view`) es solo `front`, `back` o `side`.
- **Mapa** (`map`): región de cuerpo entero sin puntos propios, con **zonas** que abren regiones de detalle.
- **Zona** (`zone`): polígono en porcentaje sobre un mapa que, al tocarlo, abre una región hija. No confundir con región.
- **Lado** (`side`): `left`, `right` o `center`, siempre referido al cuerpo de la persona observada, nunca a la pantalla. Convención del PDF: izquierdo = personal / yo / deseo; derecho = exterior / el otro / interés.
- **Rótulo de lateralidad** (`SideLabels`): los dos textos fijos a cada lado de la ilustración que recuerdan que la figura mira al observador.
- **Significado** (`meaning`): texto literal del PDF asociado a un punto. **Significados alternativos** (`alternativeMeanings`): otros textos que el PDF da al mismo lugar. Nunca se reformulan.
- **Gesto** (`gesture`) y **flecha** (`arrow`): cuando el PDF indica una dirección del rascado, el texto que lo describe y las dos coordenadas de la flecha dibujada.
- **Etiqueta** (`tag`): `personal`, `external`, `micro-caress`, `inner-side`. Anotaciones del PDF sobre un punto.
- **Catálogo** (`catalog`): el conjunto de regiones y puntos, servido como `regions.json` y `points.json` con la forma de la futura API.
- **Ficha** (`PointCard`): panel con la información de un punto que aparece al tocarlo o pasar el ratón.
- **Práctica** (`practice`): cualquier ejercicio. **Modo** (`mode`): tipo de ejercicio; en el POC solo `meaning` ("¿qué significa?"); después `where` ("¿dónde está?").
- **Pregunta** (`Question`): un punto destacado y cuatro **opciones** (`options`), de las que una o más son correctas. **Distractor** (`distractor`): opción incorrecta.
- **Punto simétrico** (`mirror point`): el punto del lado opuesto con la misma `key` base. Distractor preferente.
- **Sesión** (`Session`): recorrido de todos los puntos de una región en orden aleatorio sin repetir, con avance y resumen.
- **Progreso** (`Progress`): documento por dispositivo con alias, `userId` (nulo hasta que haya login) y, por punto, aciertos (`hits`), fallos (`misses`), último intento y modo.
- **Almacén** (`Store`): puerto con `read` y `write` donde se guarda el progreso. Adaptadores: localStorage, memoria, y más adelante la API.
- **Editor** (`editor`): pantalla oculta en `/editor` para mover puntos, ajustar radios y zonas, y **exportar** (`exportCatalog`) los JSON al repositorio.
- **Radio** (`radius`): distancia en porcentaje del ancho dentro de la cual un toque cuenta como acierto en el modo "¿dónde está?".
- **Feature**: carpeta bajo `src/features/` con su `domain/` y su `ui/`. **Dominio** (`domain`): lógica sin React ni DOM. No usar "servicio", "componente" ni "API" para hablar de módulos del dominio.
