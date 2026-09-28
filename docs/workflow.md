# Guía del proceso de trabajo

Cómo va una tarea desde que se empieza hasta que está publicada con versión. Escrito para seguirlo paso a paso; Claude hace los pasos marcados **[Claude]** y tú los marcados **[tú]**.

## 0. Vocabulario mínimo

- **`main`**: la rama que Netlify publica en la URL del grupo. Nada llega a `main` sin pasar por un pull request.
- **Rama**: una copia de trabajo con nombre. Aquí una rama por cambio de OpenSpec: `feat/<nombre>` para funcionalidad, `fix/<nombre>` para corregir un fallo.
- **Commit**: una foto guardada de los cambios con un mensaje. Aquí, un commit por tarea de `tasks.md`.
- **Pull request (PR)**: la petición en GitHub de llevar una rama a `main`. Tiene descripción, comprobaciones automáticas y una URL de previsualización.
- **GitHub Actions**: robots de GitHub. El workflow `CI` comprueba tipos, lint, formato y tests en cada PR; si falla, el PR no se puede fusionar. El workflow `Release` ejecuta release-please en cada fusión a `main`.
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
   Formato: `tipo(scope): descripción`. Tipos: `feat` (funcionalidad), `fix` (corrección), `chore` (tooling), `ci` (workflows de GitHub Actions), `docs`, `test`, `refactor`. Solo `feat` y `fix` salen en el changelog. Sin espacio antes del paréntesis: release-please no lo entiende con espacio.
2. **[tú]** Revisa los archivos cambiados si quieres (`git status`, `git diff`) y haz el commit:
   ```
   git add -A
   git commit -m "feat(practice): 6.1 motor de preguntas y distractores"
   ```
3. Al hacer commit se ejecuta el **gancho de pre-commit** (husky + lint-staged): comprueba con Prettier y ESLint los archivos que vas a guardar. Si alguno falla, el commit se cancela y lo ves en la terminal. Si es de formato (Prettier), ejecuta `npm run format`, vuelve a hacer `git add -A` y repite el commit; si es de lint (ESLint), pide a Claude que lo corrija.
4. **[Claude]** Marca la tarea como `[x]` en `tasks.md`; ese cambio va en el mismo commit o en el siguiente. Si la verificación de la tarea ocurre fuera del ordenador (en GitHub, en la previsualización o en el móvil), se marca cuando se comprueba, en un commit posterior.

## 3. Subir la rama y abrir el pull request

1. **[tú]** La primera vez que subes la rama:
   ```
   git push -u origin feat/<nombre>
   ```
   Las siguientes veces basta `git push`.
2. **[tú]** Ejecuta `/reporte-desarrollo` en Claude. Te devuelve un texto en markdown con "¿Qué se solicitó?", "¿Cómo se solucionó?" y "¿Cómo probarlo?".
3. **[tú]** En GitHub, en el repositorio, aparece un aviso "Compare & pull request" para tu rama. Púlsalo, pon como título el nombre del cambio y lo que incluye (por ejemplo "poc-micropicores: base del proyecto"), pega el reporte en la descripción y crea el PR. Si aún no está para fusionar, elige **Create draft pull request**.
4. En el PR verás, en unos minutos:
   - **Checks**: `CI / Tipos, lint y tests`, marcado como _Required_. Verde o rojo.
   - **Netlify**: un comentario con el enlace `deploy-preview-N--…netlify.app` y un QR para abrirlo en el móvil, más cuatro checks propios. _Header rules_ y _Pages changed_ salen en gris (neutral) y es normal.
5. Puedes seguir haciendo commits en la rama; cada push actualiza el PR, relanza Actions y regenera la previsualización.

## 4. Fusionar a main

Un cambio de OpenSpec puede llegar a `main` en varios PRs, uno por grupo de tareas terminado (por ejemplo, el grupo 1 "Base del proyecto"). Cada fusión publica al grupo, así que fusiona solo cuando:

- Actions está en verde.
- Has probado la previsualización en el móvil.
- Las tareas que incluye el PR están marcadas y lo que se ve en la app no confunde a quien la abra.

1. **[tú]** En el PR, botón **Merge pull request**. La opción es siempre **Create a merge commit** (la protección de `main` deja solo esa). No uses squash: perderías el commit por tarea en el changelog.
2. Netlify publica `main` en la URL del grupo en uno o dos minutos.
3. Solo tras el **último** PR del cambio (todas las tareas de `tasks.md` marcadas):
   - **[tú]** En Claude: `/opsx:sync <nombre>` y después `/opsx:archive <nombre>` para que las specs del cambio pasen a `openspec/specs/` y el cambio quede archivado.
   - **[tú]** Borra la rama (GitHub lo ofrece en el PR) y en local:
     ```
     git checkout main && git pull
     git branch -d feat/<nombre>
     ```

## 5. Versión y changelog

1. Al fusionar a `main`, release-please lee los commits nuevos y abre (o actualiza) un PR llamado "chore(main): release X.Y.Z". Dentro está el `CHANGELOG.md` con una línea por commit `feat` y `fix`, y el `package.json` con la versión nueva.
   - Un `feat` sube la versión menor (0.1.0 → 0.2.0).
   - Un `fix` sube la de parche (0.1.0 → 0.1.1).
   - `chore`, `ci`, `docs`, `test`, `refactor` no aparecen ni suben versión.
   - Las secciones del changelog están en español ("Funcionalidades", "Correcciones"); se configuran en `release-please-config.json`.
2. **[tú]** Abre ese PR, corrige el texto del changelog si algo está mal explicado, y fusiónalo cuando quieras publicar la versión. No hace falta hacerlo tras cada cambio; puedes acumular varios. Como el PR lo abrió Actions, GitHub no lanza el CI hasta que lo apruebas: en el PR o en la pestaña Actions aparece **Approve and run**; púlsalo y espera el check verde como en cualquier PR. Si release-please actualiza el PR, puede volver a pedirlo. Cualquier corrección manual del changelog hazla justo antes de fusionar: release-please reescribe el PR con cada fusión a `main`.
3. Al fusionarlo, release-please crea la etiqueta `vX.Y.Z` y una "release" en GitHub. Netlify vuelve a publicar y la pantalla de inicio muestra la versión nueva.

## 6. Cuando algo va mal

- **Actions en rojo**: abre el check, lee qué falló (tipos, lint o tests) y pásaselo a Claude.
- **Gancho de pre-commit bloquea**: es lo mismo que fallaría en Actions, pero antes. Corregir y repetir el commit.
- **Un workflow falla por algo ajeno al código** (un permiso de GitHub, una caída del servicio): corrige la causa y en la pestaña Actions abre la ejecución roja y pulsa **Re-run jobs → Re-run failed jobs**. No hace falta commit.
- **Un workflow pide Approve and run**: pasa con los PRs que abre release-please. Púlsalo; es seguro porque el PR lo generó tu propio repositorio.
- **Conflicto al fusionar**: GitHub lo avisa en el PR. Pide a Claude que traiga `main` a la rama (`git merge main`) y resuelva; luego commit y push.
- **Hay que deshacer algo ya publicado**: en GitHub, en el PR fusionado, botón **Revert**; crea un PR inverso que se fusiona igual que cualquier otro.

## 7. Configuración de GitHub (una sola vez)

Hecha el 28 de septiembre de 2026 en la tarea 1.9. Si se crea otro repositorio, repetir estos pasos.

### A. Actions puede abrir PRs

**Settings → Actions → General → Workflow permissions**: marcar **Allow GitHub Actions to create and approve pull requests**. Sin esto release-please no puede abrir su PR.

### B. Solo merge commit

**Settings → General → Pull Requests**: solo **Allow merge commits**; squash y rebase desmarcados. **Automatically delete head branches** desmarcado, porque una rama sigue viva mientras su cambio de OpenSpec no esté terminado.

### C. Ruleset `proteger-main`

**Settings → Rules → Rulesets**. Se aplica a la rama por defecto (`main`). Dos palabras que usa GitHub:

- **Ref**: una rama o una etiqueta.
- **Bypass**: permiso para saltarse las reglas. Lo tiene "Repository admin" (tú) como salida de emergencia, por ejemplo si GitHub Actions está caído y hay que publicar una corrección. GitHub lo ofrece como casilla explícita (**Merge without waiting for requirements to be met**); en uso normal no se marca nunca.

Reglas marcadas:

| Regla                                 | Qué hace                                                    | Por qué                                                                                                                                   |
| ------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Restrict deletions                    | Nadie sin bypass puede borrar `main`                        | Sin `main` Netlify no tiene qué publicar                                                                                                  |
| Require a pull request before merging | Prohíbe `git push` directo a `main`                         | El PR es donde corren el CI y la previsualización. Aprobaciones: 0 (no puedes aprobar tu propio PR). Métodos permitidos: solo _Merge_     |
| Require status checks to pass         | No se fusiona sin el check **Tipos, lint y tests** en verde | Convierte el CI en barrera. _Require branches to be up to date_ desmarcado: con un solo desarrollador `main` casi no cambia durante un PR |
| Block force pushes                    | Prohíbe `git push --force`                                  | Reescribir la historia de `main` borraría versiones y rompería el changelog                                                               |

Reglas sin marcar:

| Regla                                     | Qué hace                                                  | Por qué no                                                                             |
| ----------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Restrict creations                        | Solo con bypass se crean refs que coincidan               | Útil con patrones como `release/*`; `main` ya existe                                   |
| Restrict updates                          | Solo con bypass se puede mover la rama                    | Bloquearía también las fusiones normales; es para congelar ramas viejas                |
| Require linear history                    | Prohíbe merge commits (solo squash o rebase)              | Queremos un commit por tarea en el changelog y poder revertir un PR con un solo commit |
| Require deployments to succeed            | Exige un despliegue correcto a un _environment_ de GitHub | No usamos environments; una caída de Netlify impediría fusionar                        |
| Require signed commits                    | Exige commits firmados con GPG o SSH ("Verified")         | Requiere claves; tiene sentido en equipos. Se puede activar más adelante               |
| Require code scanning results             | Exige análisis de seguridad (CodeQL) sin hallazgos graves | App estática sin datos sensibles; reconsiderar con backend y login                     |
| Require code quality results              | Exige análisis de mantenibilidad                          | ESLint ya cubre lo que importa                                                         |
| Restrict code coverage                    | Exige un porcentaje mínimo de cobertura                   | Contradice el ADR 0004: se prueban seams elegidos, no porcentajes                      |
| Automatically request Copilot code review | Copilot comenta cada PR nuevo                             | Gasta cuota premium; la revisión la haces tú con la previsualización                   |

## 8. Resumen en una línea

Rama → tareas con un commit cada una (tú haces el commit con el mensaje de Claude) → push → PR con `/reporte-desarrollo` por cada grupo de tareas → Actions verde y prueba en la previsualización → merge commit → sync y archive en OpenSpec tras el último PR del cambio → PR de release-please cuando quieras versión.
