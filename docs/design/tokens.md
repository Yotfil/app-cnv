# Tokens de diseño

Acordados el 27 de septiembre de 2026 sobre el prototipo https://claude.ai/artifact/KJRHRcYmb733G4dJhZ47Gr (privado). Referencias visuales en `docs/design/referents/`: se toman sus blancos, espacios, líneas finas, orbes y etiquetas flotantes; la temperatura cambia de azul hielo a tonos piel y vino.

Carácter: "cuaderno del observador". Sobrio, preciso, calmado. Lo único que llama la atención es la ilustración con sus orbes; todo lo demás cede.

## Color

| Token CSS            | Nombre         | Hex       | Uso                                                                                            |
| -------------------- | -------------- | --------- | ---------------------------------------------------------------------------------------------- |
| `--color-bg`         | Fondo          | `#F8F8F7` | fondo general, blanco neutro                                                                   |
| `--color-surface`    | Superficie     | `#FFFFFF` | ilustración, ficha, opciones, barra inferior                                                   |
| `--color-ink`        | Tinta          | `#1F1917` | títulos y texto principal                                                                      |
| `--color-ink-2`      | Texto 2        | `#6E655F` | texto secundario, rótulos mono, rótulos de lateralidad                                         |
| `--color-skin-light` | Piel luz       | `#EBD2C0` | brillo difuso de los orbes, anillos en reposo, bordes de la ilustración, luz de la ilustración |
| `--color-skin-line`  | Piel línea     | `#C4977E` | líneas guía, contorno de la ilustración, borde del orbe, línea de cita                         |
| `--color-wine`       | Vino           | `#7A1F3D` | acento: botón principal, enlaces, punto central del orbe, lado derecho (exterior)              |
| `--color-wine-dark`  | Vino oscuro    | `#5C1730` | hover del acento                                                                               |
| `--color-rose`       | Rosado         | `#B4506F` | lado izquierdo (personal): punto central y anillo del orbe, rótulo en la ficha                 |
| `--color-correct`    | Correcto       | `#3F8F63` | solo corrección, siempre con ✓                                                                 |
| `--color-incorrect`  | Incorrecto     | `#8C8480` | solo corrección, siempre con ✗                                                                 |
| `--color-muted-line` | Línea atenuada | `#D9D2CC` | orbes y líneas de zonas "próximamente"                                                         |
| `--color-muted-text` | Texto atenuado | `#B9B1AB` | subtexto de zonas "próximamente"                                                               |

Regla: el lado se codifica con vino (derecho) y rosado (izquierdo); la línea media va en tinta. El rojo nunca significa error: el fallo es gris con ✗.

## Tipografía

Familia única Jost (Google Fonts) más IBM Plex Mono para dos rótulos.

| Rol                         | Fuente        | Peso | Tamaño móvil                       | Notas                                                                                                                        |
| --------------------------- | ------------- | ---- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Marca de palabra            | Jost          | 200  | 44 px                              | "Micropicores", sin logotipo                                                                                                 |
| Título de pantalla          | Jost          | 200  | 30 px                              | "Cuerpo, de frente", "Cara"                                                                                                  |
| Título de práctica          | Jost          | 200  | 26 px                              |                                                                                                                              |
| Significado (cita del PDF)  | Jost          | 300  | 19 px / 1.45                       | línea de 1 px a la izquierda en Piel línea, sangría 14 px                                                                    |
| Cuerpo                      | Jost          | 400  | 16 px / 1.55                       | 300 solo desde 18 px                                                                                                         |
| Opción de práctica          | Jost          | 300  | 15 px / 1.4                        |                                                                                                                              |
| Etiqueta, botón, navegación | Jost          | 400  | 13 a 17 px                         |                                                                                                                              |
| Texto secundario            | Jost          | 300  | 12 a 15 px                         | color Texto 2                                                                                                                |
| Rótulo mono                 | IBM Plex Mono | 400  | 11 px, tracking 0.12em, mayúsculas | solo cabecera de ficha ("LADO DERECHO · MEJILLA") y contador ("4 DE 12"); la versión "v0.1.0" va en mono pero sin mayúsculas |

## Orbes (marcadores)

Revisado el 28 de septiembre de 2026 al ver la cara con sus 11 micropicores: el orbe original (16 px, halo doble, anillo con borde y punto oscuro) parecía acné y, repetido y agrupado, puede afectar a personas con tripofobia. Regla: pocos bordes concéntricos, nada de puntos oscuros en reposo.

| Estado              | Diámetro        | Detalle                                                                                                                                                                                                                                             |
| ------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Punto en reposo     | 12 px           | fondo blanco, borde 1 px Piel línea al 70 %, halo difuso `0 0 12px 4px` Piel luz al 90 % (sin aro de borde nítido), punto central 3 px en el color del lado mezclado al 55 % con blanco                                                             |
| Onda que respira    | nace en el orbe | un solo anillo de 1 px (Piel línea; rosado en lado izquierdo) nace en el centro, crece de 0.3 a 2.6 veces el orbe y se desvanece (opacidad hasta 0.55); al desaparecer nace el siguiente. 5 s por onda con salida suave, desfase distinto por punto |
| Punto activo        | 20 px           | borde vino, punto central 6 px en el color del lado, anillo fijo vino a 1.5 veces y opacidad 0.35, sin onda; el resto de puntos al 45 %, sin halo ni onda                                                                                           |
| Zona en el mapa     | 22 px           | punto central 6 px vino; línea guía 0.9 px en codo a 45° hasta una etiqueta flotante                                                                                                                                                                |
| Zona "próximamente" | 22 px           | borde Línea atenuada, sin brillo, punto central Texto atenuado                                                                                                                                                                                      |

El área táctil de cada punto es siempre de 44 px aunque el orbe sea menor. Con `prefers-reduced-motion: reduce` no hay onda.

## Superficies y componentes

- Etiqueta flotante (mapa): blanco al 78 % con desenfoque 10 px, borde 1 px Piel línea al 35 %, radio 4, padding 6×10. Nombre Jost 400 15 px, subtexto Jost 300 12 px ("12 micropicores").
- Ficha (móvil): panel inferior blanco, radio 14 arriba, borde superior Piel luz, sombra `0 -8px 30px` tinta al 6 %, asa de 36×3. Orden: rótulo mono en vino o rosado, línea secundaria, significado, gesto, etiqueta, lámina. Botón de cierre redondo de 36 px.
- Ficha (escritorio): etiqueta flotante blanca al 72 % con desenfoque 14 px, borde al 8 %, radio 4, sombra al 5 %, unida al marcador por una línea guía.
- Opciones de práctica: ancho completo, blanco, borde 1 px `#E6DED8`, radio 4, padding 14×16, sin sombra. Correcta: borde y anillo interior en Correcto con ✓ blanco en disco de 20 px. Elegida incorrecta: borde en Incorrecto, texto en Texto 2, ✗ blanco en disco gris.
- Botón principal: 52 px de alto, vino, texto blanco Jost 400 17 px, radio 4. Foco visible: contorno 2 px tinta con separación 3 px.
- Campo de texto: 48 px, borde Piel línea, foco en vino con halo Piel luz de 3 px.
- Barra inferior: 64 px, blanco, borde superior Piel luz, dos destinos ("Estudiar", "Practicar"), activo en vino, iconos de trazo 1.4.
- Rótulos de lateralidad: Jost 300 12 px en Texto 2, en las esquinas superiores de la ilustración: "Derecha de la persona" a la izquierda, "Izquierda de la persona" a la derecha.
- Líneas estructurales: siempre 1 px, en Piel luz o Piel línea. Sin sombras salvo la ficha. Radios: 4 en controles y etiquetas, 6 en la ilustración, 14 en la ficha.

## Espaciado

Base de 4 px. Márgenes de pantalla 16 px (24 px en cabeceras de texto, 28 px en inicio). Cabecera a 52 a 56 px del borde superior en móvil. Separaciones entre bloques 10, 14 y 28 px.

## Movimiento

Solo tres: la respiración de los orbes, la apertura de la ficha, y la corrección al responder. Nada al cargar una pantalla.

## Copy

Tuteo, frase corta, sin exclamaciones. Para el alumno se dice "micropicores", nunca "puntos" (que es el término interno del catálogo). Veredictos: "Acertaste", "No era ese. El lado derecho habla del otro." Botones dicen lo que hacen: "Continuar", "Siguiente".
