# Spec Delta

## Purpose

Pantalla de entrada que da crédito al curso, muestra el aviso de prudencia del PDF, permite fijar un alias local y muestra la versión de la app.

## ADDED Requirements

### Requirement: Crédito y aviso al entrar
La app SHALL mostrar en su pantalla inicial el nombre "Micropicores", el crédito al curso "Entrenamiento de Micropicores" de El Código del Comportamiento, y un resumen del aviso de la página 2 del PDF: la sinergología no cuenta con publicaciones científicas sólidas, el autor solo ha comprobado como fiables unos pocos micropicores, y la interpretación debe integrarse con otros gestos, el contenido verbal, el paraverbal, el estímulo y el contexto.

#### Scenario: Primera visita
- **WHEN** una persona abre la URL por primera vez
- **THEN** ve el crédito y el aviso antes de cualquier contenido de estudio, y un botón para continuar

#### Scenario: Visitas posteriores
- **WHEN** la persona ya continuó una vez desde este dispositivo
- **THEN** la pantalla inicial sigue accesible desde la navegación pero no bloquea la entrada

### Requirement: Alias opcional
La pantalla inicial SHALL permitir escribir un alias de hasta 30 caracteres, o dejarlo vacío.

#### Scenario: Alias guardado
- **WHEN** la persona escribe un alias y continúa
- **THEN** el alias queda asociado al progreso local y se muestra en la pantalla de práctica

#### Scenario: Sin alias
- **WHEN** la persona continúa sin escribir alias
- **THEN** la app funciona igual y el progreso se guarda sin alias

### Requirement: Versión visible
La pantalla inicial SHALL mostrar la versión de la app tal como figura en `package.json`.

#### Scenario: Reporte de un fallo
- **WHEN** un alumno abre la pantalla inicial
- **THEN** puede leer un texto como "v0.1.0" para incluirlo al reportar un problema

### Requirement: Textos de interfaz externalizados
Todos los textos visibles de la pantalla SHALL provenir del archivo de mensajes en español, no del código de los componentes.

#### Scenario: Cambio de un texto
- **WHEN** se corrige la redacción del aviso
- **THEN** solo cambia el archivo de mensajes, no ningún componente
