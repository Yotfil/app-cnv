# ADR 0003: Sin librería de estado global, y cuándo adoptarla

Fecha: 2026-09-27. Estado: aceptada.

## Contexto
El POC tiene un solo dato compartido, el catálogo cargado una vez, y el resto del estado vive en el dominio (sesión de práctica, progreso). Una librería de estado añadiría una segunda capa de lógica compitiendo con `domain/`.

## Decisión
Sin librería. El catálogo se carga en un proveedor de contexto en `src/app/`. Todo acceso a estado compartido pasa por hooks propios: `useCatalog`, `useProgress`, `useSession`. Ningún componente lee un contexto directamente ni recibe estado global por props desde más de dos niveles arriba.

## Señal para adoptar una librería
Se abre un cambio de OpenSpec para adoptar Zustand (candidata por defecto por añadir menos ceremonia sobre hooks) cuando ocurra cualquiera de estas tres:
1. Tres o más features distintas necesitan leer y escribir el mismo estado.
2. Un dato atraviesa más de dos niveles de componentes solo para llegar abajo.
3. Un contexto provoca rerenders que se notan en el móvil (medido con React DevTools Profiler, no por sospecha).

## Consecuencias
- Adoptar la librería es reescribir el interior de los tres hooks; sus firmas no cambian.
- Los hooks son la única frontera entre React y `domain/`; el dominio nunca sabe qué librería hay encima.
