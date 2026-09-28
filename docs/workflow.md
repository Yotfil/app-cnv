# Guía del proceso de trabajo

Cómo va una tarea desde que se empieza hasta que está publicada con versión. Escrito para seguirlo paso a paso; Claude hace los pasos marcados **[Claude]** y tú los marcados **[tú]**.

## 0. Vocabulario mínimo

- **`main`**: la rama que Netlify publica en la URL del grupo. Nada llega a `main` sin pasar por un pull request.
- **Rama**: una copia de trabajo con nombre. Aquí una rama por cambio de OpenSpec: `feat/<nombre>` para funcionalidad, `fix/<nombre>` para corregir un fallo.
- **Commit**: una foto guardada de los cambios con un mensaje. Aquí, un commit por tarea de `tasks.md`.
- **Pull request (PR)**: la petición en GitHub de llevar una rama a `main`. Tiene descripción, comprobaciones automáticas y una URL de previsualización.
- **GitHub Actions**: robots de GitHub que ejecutan tipos, lint y tests en cada PR. Si fallan, el PR no se puede fusionar.
- **Netlify**: aloja la app. Publica `main` en producción y cada PR en una URL de previsualización propia.
- **release-please**: robot que, leyendo los mensajes de commit, propone la siguiente versión y escribe el `CHANGELOG.md`.

## 1. Empezar un cambio

1. **[tú]** Pide a Claude que aplique el cambio: `/opsx:apply <nombre>`.
2. **[Claude]** Crea la rama y se pasa a ella:
   ```
   git checkout main && git pull
   git checkout -b feat/<nombre>
   ```
3. **[Claude]** Implementa la primera tarea de `tasks.md`.

## 2. Cada tarea termina en un commit

1. **[Claude]** Al terminar una tarea te entrega el mensaje de commit, por ejemplo:
   ```
   feat(practice): 6.1 motor de preguntas y distractores
   ```
   Formato: `tipo(scope): descripción`. Tipos: `feat` (funcionalidad), `fix` (corrección), `chore` (tooling), `docs`, `test`, `refactor`. Sin espacio antes del paréntesis: release-please no lo entiende con espacio.
2. **[tú]** Revisa los archivos cambiados si quieres (`git status`, `git diff`) y haz el commit:
   ```
   git add -A
   git commit -m "feat(practice): 6.1 motor de preguntas y distractores"
   ```
3. Al hacer commit se ejecuta el **gancho de pre-commit** (husky + lint-staged): comprueba con Prettier y ESLint los archivos que vas a guardar. Si alguno falla, el commit se cancela y lo ves en la terminal. Si es de formato (Prettier), ejecuta `npm run format`, vuelve a hacer `git add -A` y repite el commit; si es de lint (ESLint), pide a Claude que lo corrija.
4. **[Claude]** Marca la tarea como `[x]` en `tasks.md`; ese cambio va en el mismo commit o en el siguiente.

## 3. Subir la rama y abrir el pull request

1. **[tú]** La primera vez que subes la rama:
   ```
   git push -u origin feat/<nombre>
   ```
   Las siguientes veces basta `git push`.
2. **[tú]** Ejecuta `/reporte-desarrollo` en Claude. Te devuelve un texto en markdown con "¿Qué se solicitó?", "¿Cómo se solucionó?" y "¿Cómo probarlo?".
3. **[tú]** En GitHub, en el repositorio, aparece un aviso "Compare & pull request" para tu rama. Púlsalo, pon como título el nombre del cambio, pega el reporte en la descripción y crea el PR.
4. En el PR verás, en unos minutos:
   - **Checks**: el workflow de Actions (tipos, lint, tests). Verde o rojo.
   - **Netlify deploy preview**: un enlace a la app tal como está en la rama. Ábrelo en el móvil para probar.
5. Puedes seguir haciendo commits en la rama; cada push actualiza el PR, relanza Actions y regenera la previsualización.

## 4. Fusionar a main

Solo cuando:

- Actions está en verde.
- Has probado la previsualización en el móvil.
- Todas las tareas del cambio están marcadas.

1. **[tú]** En el PR, botón **Merge pull request**. La opción es siempre **Create a merge commit** (la protección de `main` deja solo esa). No uses squash: perderías el commit por tarea en el changelog.
2. Netlify publica `main` en la URL del grupo en uno o dos minutos.
3. **[tú]** En Claude: `/opsx:sync <nombre>` y después `/opsx:archive <nombre>` para que las specs del cambio pasen a `openspec/specs/` y el cambio quede archivado.
4. **[tú]** Borra la rama (GitHub lo ofrece en el PR) y en local:
   ```
   git checkout main && git pull
   git branch -d feat/<nombre>
   ```

## 5. Versión y changelog

1. Al fusionar a `main`, release-please lee los commits nuevos y abre (o actualiza) un PR llamado "chore(main): release X.Y.Z". Dentro está el `CHANGELOG.md` con una línea por commit `feat` y `fix`, y el `package.json` con la versión nueva.
   - Un `feat` sube la versión menor (0.1.0 → 0.2.0).
   - Un `fix` sube la de parche (0.1.0 → 0.1.1).
   - `chore`, `docs`, `test`, `refactor` no aparecen ni suben versión.
2. **[tú]** Abre ese PR, corrige el texto del changelog si algo está mal explicado, y fusiónalo cuando quieras publicar la versión. No hace falta hacerlo tras cada cambio; puedes acumular varios.
3. Al fusionarlo, release-please crea la etiqueta `vX.Y.Z` y una "release" en GitHub. Netlify vuelve a publicar y la pantalla de inicio muestra la versión nueva.

## 6. Cuando algo va mal

- **Actions en rojo**: abre el check, lee qué falló (tipos, lint o tests) y pásaselo a Claude.
- **Gancho de pre-commit bloquea**: es lo mismo que fallaría en Actions, pero antes. Corregir y repetir el commit.
- **Conflicto al fusionar**: GitHub lo avisa en el PR. Pide a Claude que traiga `main` a la rama (`git merge main`) y resuelva; luego commit y push.
- **Hay que deshacer algo ya publicado**: en GitHub, en el PR fusionado, botón **Revert**; crea un PR inverso que se fusiona igual que cualquier otro.

## 7. Resumen en una línea

Rama → tareas con un commit cada una (tú haces el commit con el mensaje de Claude) → push → PR con `/reporte-desarrollo` → Actions verde y prueba en la previsualización → merge commit → sync y archive en OpenSpec → PR de release-please cuando quieras versión.
