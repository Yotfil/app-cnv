# Prompt: cara, cabeza y cuello (`face`)

Ilustración de la región "Cara": recorte de cabeza y cuello de la misma figura de `front-body`, en formato cuadrado. Sobre ella van los micropicores de las láminas 3, 4 y 13 del PDF: frente (centro y a los dos lados), entrecejo, mejillas junto a las comisuras, bajo el labio, laringe, músculos laterales del cuello y base del cuello. Todos esos lugares tienen que verse y poder señalarse.

## Cómo usarlo en Gemini

1. En https://gemini.google.com, con el modelo de imagen (Nano Banana), mejor en la misma conversación donde generaste el cuerpo.
2. Adjunta `public/img/front-body.png` como referencia de la figura y del estilo.
3. Pega el prompt de abajo tal cual.
4. Revisa el resultado con la lista de comprobación y pide correcciones cortas en inglés sobre la misma imagen si hace falta, por ejemplo: `Same image, zoom out slightly so both ears and the base of the neck are fully visible` o `Same image, without the skin fill, only the fine outline`.
5. Descarga la imagen y guárdala en `public/img/` (sirve en JPG; yo la convierto a `face.png`).

No hace falta que la geometría coincida exactamente con el cuerpo: los micropicores se colocan sobre cada imagen por separado. Basta con que se reconozca la misma figura y el mismo estilo.

## Prompt

```
Using the attached figure as the reference, create a close-up of the same figure: head and neck only, seen perfectly from the front, in a square 1:1 format.

Keep exactly the same style as the reference: a fine, continuous skin-tone outline (#C4977E) with a very soft glow along the lines (#EBD2C0). No skin fill: the inside of the face and neck stays almost white and airy. Pure white background (#FFFFFF).

Figure: the same gender-neutral, completely bald figure, no hair, no eyebrows hair texture (eyebrows only as a fine line), no clothes, no jewelry. Neutral relaxed expression, eyes open looking straight at the viewer, mouth closed, head straight and symmetrical.

Framing: from slightly above the top of the head down to the base of the neck, where the two collarbones begin. The top of the head at about 6% from the top edge, the base of the neck at about 92%. Head centered horizontally, both ears fully visible with white margin at the sides.

Anatomical landmarks drawn with the same fine line, subtle but clearly readable on a phone screen: the forehead with a faint hint of the brow ridge; eyebrows; the space between the eyebrows; eyes; nose; lips with visible mouth corners; the area below the lower lip; the chin; the jaw line and the angle of the jaw; a faint contour of the cheek muscles between the mouth corners and the jaw angle; on the neck, the two lateral neck muscles running from behind the ears down to the base of the neck, a gentle hint of the throat and larynx in the center, and the small notch at the base of the neck between the collarbones.

Avoid: text, labels, letters, numbers, logos, watermarks, arrows, dots, markers, circles, grids, interface elements, frames, borders, background decoration, colored accents, hair, beard, clothing, jewelry, strong gender cues, a prominent Adam's apple, skin fill or skin texture, muscles drawn as anatomy textures, shading, dramatic lighting, 3D render look, photographic realism, head tilted or turned, cropped ears, cropped chin or neck.
```

## Lista de comprobación

Acepta la imagen solo si cumple todo:

- [ ] Cuadrada 1:1 (por ejemplo 1024 × 1024).
- [ ] De la coronilla a la base del cuello, sin cortes; se ve el arranque de las clavículas.
- [ ] Las dos orejas completas, con margen blanco a los lados.
- [ ] De frente, simétrica, mirando al observador (no girada ni volteada).
- [ ] Mismo estilo que el cuerpo: línea fina color piel, interior casi blanco, sin relleno.
- [ ] Fondo blanco liso.
- [ ] Sin pelo, barba, ropa ni rasgos marcados de sexo.
- [ ] Se distinguen: frente, cejas, entrecejo, comisuras de la boca, zona bajo el labio, mentón, ángulo de la mandíbula, músculos laterales del cuello, garganta y hueco de la base del cuello.
- [ ] Ningún texto, número, punto, flecha ni marcador: los pone la app.
- [ ] Se reconoce como la misma figura del cuerpo entero.

## Después de guardarla

Avísame: la convierto a `public/img/face.png`, actualizo `width` y `height` de `face` en `public/data/regions.json` (tarea 3.3) y reviso sobre ella dónde caen los 11 micropicores. Las posiciones finales se ajustan en el editor.
