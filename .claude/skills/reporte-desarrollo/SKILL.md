---
name: reporte-desarrollo
description: Genera en español el texto para la descripción de un pull request a partir de la rama actual frente a main y de las tareas hechas del cambio de OpenSpec activo. Responde "¿Qué se solicitó?", "¿Cómo se solucionó?" y "¿Cómo probarlo?".
disable-model-invocation: true
---

# Reporte de desarrollo

Produce el texto que el usuario pegará en la descripción del pull request. No escribe archivos ni ejecuta git con cambios; solo lee.

## Pasos

1. Determina la rama actual y confirma que no es `main`:
   `git rev-parse --abbrev-ref HEAD`
2. Recoge lo hecho en la rama frente a `main`:
   - `git log --oneline main..HEAD` (commits, uno por tarea)
   - `git diff --stat main...HEAD` (archivos tocados)
   - Si el usuario pasó argumentos, trátalos como el nombre del cambio de OpenSpec; si no, usa `openspec list --json` y toma el cambio activo cuyo nombre coincida con la rama o el más reciente.
3. Lee `openspec/changes/<cambio>/proposal.md` (sección "Why" y "What Changes") y `tasks.md` (solo tareas marcadas `[x]`). Si la rama cubre un `fix/`, usa además el mensaje de los commits para describir el problema.
4. Escribe el reporte en español, en markdown, con exactamente estas tres secciones:

```markdown
## ¿Qué se solicitó?
<Dos a cinco frases: el problema u objetivo, tomado del proposal o del fix. Sin tecnicismos innecesarios.>

## ¿Cómo se solucionó?
<Lista de viñetas, una por tarea o grupo de commits hechos en la rama: qué se construyó y dónde (carpeta o módulo). Menciona decisiones de diseño relevantes solo si cambian cómo se revisa.>

## ¿Cómo probarlo?
1. Abrir la URL de previsualización de Netlify que aparece en el PR.
<Pasos concretos tomados de la verificación de cada tarea hecha: qué pantalla abrir, qué tocar, qué debe verse. Incluir los comandos si hay tests: `npx vitest run`.>
```

5. Entrega el reporte en el chat dentro de un bloque de código markdown para que se copie tal cual. No añadas comentarios fuera del bloque salvo una línea si falta información (por ejemplo, no hay tareas marcadas).

## Reglas

- Solo tareas marcadas como hechas; nunca describir trabajo pendiente como hecho.
- Vocabulario del glosario `CONTEXT.md` (punto, región, ficha, sesión...).
- Nada de rutas absolutas del disco del usuario; rutas relativas al repositorio.
- Longitud objetivo: cabe en una pantalla de GitHub sin desplazarse.
