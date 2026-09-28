# ADR 0002: Estructura por features con dominio y UI separados

Fecha: 2026-09-27. Estado: aceptada.

## Contexto

La app va a crecer: más regiones, más modos de práctica, login, backend, microexpresiones como otra sección, y una versión React Native que debe reutilizar la lógica. Un único `src/domain/` y `src/ui/` globales se vuelven carpetas enormes donde cada feature se mezcla con las demás.

## Decisión

```
src/app/                         arranque: router, providers, ErrorBoundary
src/features/<feature>/domain/   TypeScript puro: sin React, DOM, fetch ni localStorage
src/features/<feature>/ui/       componentes, hooks y pantallas de esa feature
src/features/<feature>/index.ts  única puerta de entrada para otras features
src/shared/ui/                   componentes genéricos sin conocimiento de features
src/shared/lib/                  i18n, adaptadores de almacenamiento, reportError, uuid
```

Reglas: `domain/` recibe inyectado lo que necesita del exterior (fuente de datos, almacén, generador aleatorio). Una feature importa de otra solo por su `index.ts`. `shared/` no importa de `features/`. Estas reglas se hacen cumplir con ESLint (`no-restricted-imports`) cuando la primera violación aparezca en revisión.

## Alternativas descartadas

- Capas globales `domain/` y `ui/`: más simple hoy, pero cada feature nueva toca ambas carpetas y no hay unidad extraíble.
- Monorepo con `packages/domain` desde el inicio: coste de workspaces sin segundo consumidor todavía. Se hará cuando exista React Native, moviendo `domain/` de cada feature a un paquete.

## Consecuencias

- Añadir login es crear `features/auth/` y registrar sus rutas en `src/app/`.
- Los seams de prueba (ADR 0004) coinciden con las funciones exportadas de cada `domain/`.
