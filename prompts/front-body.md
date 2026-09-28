# Prompt: cuerpo entero de frente (`front-body`)

Ilustración del mapa: la figura sobre la que se tocan las zonas (cara, y más adelante torso, piernas…). Estilo acordado en `openspec/changes/poc-micropicores/design.md` (D9) y en `docs/design/tokens.md`.

## Cómo usarlo en Gemini

1. Abre https://gemini.google.com y elige el modelo de imagen (Nano Banana).
2. Adjunta como guía de estilo `docs/design/referents/Gemini_Generated_Image_ejaj1eejaj1eejaj.jpeg` (la figura de cuerpo entero). El prompt le pide tomar solo el trazo y la luz, no la página ni los colores.
3. Pega el prompt de abajo tal cual.
4. Revisa el resultado con la lista de comprobación. Si algo falla, pide la corrección en una frase corta en inglés sobre la misma imagen, por ejemplo: `Same image, 9:16 portrait, more margin above the head`. Si sale rellena de color piel (pasó en el primer intento, el 28 de septiembre de 2026), esta corrección funcionó: `Same image and same pose, but without the skin fill: keep only the fine skin-tone outline with a very soft glow along the lines, and leave the inside of the figure almost white and airy. Also remove the two curves under the chest.`
5. Descarga la imagen y guárdala en WebP como `public/img/front-body.webp` (sirve igual si Gemini la descarga en JPG o PNG):
   ```
   cwebp -q 85 ~/Downloads/<archivo> -o public/img/front-body.webp
   ```
6. Guarda también la conversación o la imagen original: la usarás como referencia para la cara (`prompts/face.md`).

## Prompt

```
Create a medical-style illustration of a single neutral human figure standing, seen from the front, full body from the top of the head to the feet, in a vertical 9:16 portrait format.

Style: use the attached image only as a style reference for the drawing technique — a fine, continuous, even outline with a soft diffuse inner glow, semi-transparent and airy, lots of white space. Do not copy its layout, interface, text, circles or colors.

Colors: the outline is a warm skin tone line (#C4977E); the soft glow and light inside the figure is a pale warm skin light (#EBD2C0); warm neutral mid skin tone overall. No skin fill: the inside of the figure stays almost white and airy, with the soft glow only along the lines. No shading blocks, no gradients outside the figure. Pure white background (#FFFFFF), no floor, no shadow under the feet.

Figure: gender-neutral and anatomically simplified, like an anatomy mannequin. Completely bald, no hair anywhere, no clothes. No genitals, no nipples, no breast or chest shapes or curves under the chest, no navel emphasis. Relaxed neutral stance, perfectly frontal and symmetrical, facing the viewer, head straight, looking forward. Arms slightly away from the body so there is clear white space between each arm and the torso, palms facing forward, fingers relaxed and together. Feet slightly apart, pointing forward.

Anatomical landmarks drawn with the same fine line, subtle but clearly readable at small size: eyebrows, eyes, nose, lips and chin; jaw line; neck with the two lateral neck muscles and a hint of the throat; collarbones; shoulder line; elbows, wrists and knees as gentle contour changes.

Framing: the figure centered horizontally, occupying about 85% of the image height, with equal white margins above the head and below the feet.

Avoid: text, labels, letters, numbers, logos, watermarks, arrows, dots, markers, circles, grids, interface elements, frames, borders, background decoration, colored accents (blue, green, yellow), hair, clothing, jewelry, sex characteristics, dramatic lighting, 3D render look, photographic realism, muscles or skin texture, heavy outlines, cropped hands or feet.
```

## Lista de comprobación

Acepta la imagen solo si cumple todo:

- [ ] Formato vertical 9:16 (por ejemplo 900 × 1600 o 1080 × 1920).
- [ ] Cuerpo entero visible, de la coronilla a los pies, sin cortes, con margen blanco arriba y abajo.
- [ ] Figura de frente, simétrica, mirando al observador (no de tres cuartos, no volteada).
- [ ] Línea fina color piel con luz difusa; sin rellenos sólidos ni azules, verdes o amarillos.
- [ ] Fondo blanco liso, sin suelo, sombras ni decoración.
- [ ] Sin pelo, ropa, genitales, pezones ni forma de pecho.
- [ ] Brazos separados del torso: se ve blanco entre brazo y cuerpo.
- [ ] Se distinguen cejas, ojos, nariz, boca, mentón, mandíbula, cuello y clavículas.
- [ ] Ningún texto, número, punto, flecha ni marcador en la imagen: los pone la app.

## Después de guardarla

Dime el tamaño real del PNG (o déjalo guardado y lo leo yo) para actualizar `width` y `height` en `public/data/regions.json` (tarea 3.3). La zona de la cara se ajusta después en el editor.
