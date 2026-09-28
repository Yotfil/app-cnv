# ADR 0004: Seams de prueba y alcance de TDD

Fecha: 2026-09-27. Estado: aceptada.

## Contexto

La skill `tdd` del usuario exige acordar de antemano los seams (interfaces públicas bajo prueba) para que el esfuerzo caiga en la lógica crítica y no en cada detalle. Los tests contra internos se rompen al refactorizar sin que cambie el comportamiento.

## Decisión

TDD estricto (rojo, verde, un test y una implementación por ciclo, cortes verticales, sin refactor dentro del ciclo) en `domain/`, únicamente en estos seams, con Vitest y sin navegador:

1. `loadCatalog(source)`: catálogo válido, punto con región inexistente, región de cuerpo entero sin puntos.
2. `generateQuestion(point, catalog, random)` e `isCorrect(question, option)`: prioridad de distractores, texto repetido, punto con alternativos, región con pocos puntos.
3. `createSession(regionKey, catalog, random)`: sin repetición, avance, resumen.
4. `recordAnswer(pointId, mode, hit)` y `clearProgress()` sobre un `Store` en memoria: acierto, fallo, recarga, borrado.
5. `exportCatalog(regions, points)`: exportar sin cambios produce archivos idénticos.

En UI, React Testing Library solo para los escenarios de interacción que las specs describen (la ficha se abre al tocar y se cierra al tocar fuera; zona atenuada no navega; elegir opción muestra corrección; primera visita bloquea y segunda no). Nada de tests de "se renderiza". Playwright cuando haya más de una región.

Lo que no se ve desde estos seams es implementación y no se prueba por separado. Añadir un seam nuevo se acuerda con el usuario y se anota aquí.

## Consecuencias

- El generador aleatorio, la fuente de datos y el almacén se inyectan para que los tests sean deterministas.
- Los valores esperados de los tests salen del PDF o de las specs, nunca de recalcular lo que hace el código.
