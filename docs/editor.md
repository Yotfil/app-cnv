# Editor de posiciones

Herramienta para colocar los micropicores y las zonas del mapa sobre las ilustraciones reales, y llevar esos ajustes al repositorio. Es solo para quien mantiene el catálogo: está en `/editor` y ninguna pantalla la enlaza.

La app no guarda las posiciones en ningún servidor: las lee de `public/data/points.json` y `public/data/regions.json`. Lo que mueves en el editor vive en la memoria del navegador hasta que lo **exportas** y copias esos archivos al repositorio. No se editan coordenadas a mano en los JSON.

## El flujo, paso a paso

### 1. Abrir el editor en tu rama

Trabaja en local, en una rama, para que lo que exportas parta de los datos de esa rama:

```
git checkout main && git pull
git checkout -b feat/<nombre>        # por ejemplo feat/posiciones-cara
npm run dev
```

Abre **http://localhost:5173/editor** en Chrome de escritorio. No hace falta pasar por la portada.

Evita usar `/editor` en producción o en una previsualización: exportaría los datos de esa versión, que pueden no coincidir con los de tu rama.

### 2. Ajustar los micropicores

En el selector **Región**, elige la región (por ejemplo "Cara").

- **Mover**: arrastra el marcador vino, o selecciónalo y usa las **flechas del teclado** (0,5 % por pulsación).
- **Micropicores solapados**: elígelos en la lista de la derecha por su `key`; el elegido se ve con borde vino.
- **Valores exactos**: escribe `x`, `y` o `radio` en los campos del panel.
- **Radio**: el círculo discontinuo es el área de acierto (en porcentaje del ancho). Por defecto 4.
- **Flechas de gesto**: su inicio acompaña al micropicor al moverlo. El final todavía no se puede mover desde el editor.

Colócalos mirando la lámina del PDF que cita cada micropicor (`page`): su posición relativa respecto a ojos, boca, mentón y cuello.

### 3. Ajustar las zonas del mapa

En **Región**, elige "Cuerpo, de frente". Se ven las zonas de las regiones hijas; la elegida en vino.

- **Mover un vértice**: arrástralo o usa las flechas del teclado.
- **Añadir vértice**: pone uno nuevo a mitad del lado que sale del vértice elegido.
- **Quitar vértice**: borra el elegido (mínimo 3).
- **Crear zona**: para una región hija que aún no la tiene; aparece un rectángulo en el centro para ajustar.

La zona debe cubrir la parte del cuerpo que abre la región (para la cara: cabeza y cuello) sin invadir las vecinas.

### 4. Exportar

Arriba a la derecha hay un botón por archivo, con los cambios que tiene pendientes:

- **Descargar points.json**: las posiciones, radios y flechas de los **micropicores**.
- **Descargar regions.json**: las **zonas** del mapa (y el resto de datos de las regiones).

El botón de un archivo con cambios se ve relleno en vino; descarga solo los que lo estén. Cada clic baja un archivo a `~/Downloads` y deja su contador en 0. Son dos botones porque el navegador bloquea en silencio la segunda descarga si un solo clic intenta bajar dos archivos.

Si cierras o recargas con cambios sin descargar, el navegador avisa: esos cambios se perderían.

### 5. Copiar los archivos al repositorio

Desde la carpeta del proyecto:

Mueve solo los archivos que descargaste:

```
mv ~/Downloads/points.json public/data/points.json      # si ajustaste micropicores
mv ~/Downloads/regions.json public/data/regions.json    # si ajustaste zonas
git diff --stat public/data
```

Usa `mv` con el nombre exacto de destino: en `public/data/` solo deben existir `points.json` y `regions.json`.

Si en `~/Downloads` ya había archivos con esos nombres, Chrome guarda los nuevos como `points (1).json`: usa el más reciente (`ls -lt ~/Downloads | head`).

`git diff` debe mostrar **solo** las líneas que moviste. El formato es el mismo que el del repositorio (Prettier no toca `public/data/`), así que un micropicor sin tocar no aparece en el diff.

### 6. Comprobar

```
npx vitest run
```

Todo en verde: el test de contenido comprueba que los textos siguen siendo los del PDF y que ningún micropicor apunta a una región inexistente. Después, con `npm run dev`, abre `/region/face` y `/map` y revisa que se ven donde esperas, también en la emulación móvil de DevTools.

### 7. Commit, push y PR

```
git add public/data
git commit -m "feat(catalog): posiciones de la cara ajustadas sobre la ilustración"
git push -u origin feat/<nombre>
```

Abre el PR siguiendo `docs/workflow.md` §3. Revisa la previsualización de Netlify en el móvil y fusiona. Netlify publica las nuevas posiciones para el grupo; el progreso de los alumnos no se pierde porque los `id` no cambian.

## Qué no hace el editor

- Añadir o borrar micropicores, ni cambiar sus textos: eso se hace en `points.json` siguiendo `docs/catalog.md`.
- Mover el final de una flecha de gesto.
- Guardar un borrador: si recargas antes de exportar, pierdes los cambios.
