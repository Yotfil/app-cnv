# ADR 0001: Código en inglés, contenido y comunicación en español

Fecha: 2026-09-27. Estado: aceptada.

## Contexto

El curso, el PDF, el grupo de alumnos y la conversación con Claude son en español. El código lo leerán herramientas, librerías y posiblemente otros desarrolladores; el backend FastAPI y la futura app React Native compartirán vocabulario con el front.

## Decisión

Todo lo que es estructura va en inglés: identificadores, nombres de archivo y carpeta, campos de JSON, claves de región, rutas de URL, scopes de commit, nombres de tests. Todo lo que es contenido o comunicación va en español: texto del PDF en el catálogo, textos de interfaz en `es.json`, documentación en `docs/`, OpenSpec, `CONTEXT.md`, mensajes de commit y PR, conversación.

## Consecuencias

- `CONTEXT.md` mapea cada término español a su nombre en código.
- Ningún texto visible se escribe en un componente; siempre `t()` sobre `es.json`.
- Los nombres de campo del catálogo son el contrato con la API; cambiarlos es un cambio de OpenSpec.
- Los comentarios del código y de los archivos de configuración van en inglés, como el código. Los textos que el usuario lee en GitHub van en español: nombres de jobs y pasos de los workflows ("Tipos, lint y tests") y secciones del changelog ("Funcionalidades").
