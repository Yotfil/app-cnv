# Spec Delta

## Purpose

Registro en el propio dispositivo de los aciertos y fallos por micropicor y del alias, sin cuentas ni servidor, con una forma que pueda migrarse después a una base de datos.

## ADDED Requirements

### Requirement: Progreso persistente en el dispositivo
La app SHALL guardar en el almacenamiento local del navegador un documento de progreso con `version` del esquema, `alias`, `creado` (fecha ISO) y, por id de punto, `aciertos`, `fallos`, `ultimo_intento` (fecha ISO) y `modo` de la última respuesta.

#### Scenario: Acierto registrado
- **WHEN** la persona acierta el punto con id X en el modo "significado"
- **THEN** `aciertos` de X aumenta en uno, `ultimo_intento` se actualiza y el documento queda guardado antes de la siguiente pregunta

#### Scenario: Recarga de página
- **WHEN** la persona cierra y vuelve a abrir la app en el mismo navegador
- **THEN** el alias y los contadores son los de antes

### Requirement: Sin envío a terceros
El progreso y el alias SHALL permanecer en el dispositivo y no enviarse a ningún servidor en este cambio.

#### Scenario: Sin red
- **WHEN** la app ya está cargada y se pierde la conexión
- **THEN** responder preguntas sigue registrando progreso

### Requirement: Almacenamiento no disponible
Si el almacenamiento local no está disponible o lanza error, la app SHALL seguir funcionando con progreso solo en memoria y avisar una vez con un mensaje discreto.

#### Scenario: Ventana privada con almacenamiento bloqueado
- **WHEN** el navegador rechaza la escritura
- **THEN** la práctica funciona y al terminar se avisa de que el progreso no se guardará

### Requirement: Borrado por la persona
La app SHALL ofrecer en la pantalla inicial una acción para borrar alias y progreso del dispositivo, con confirmación.

#### Scenario: Borrar progreso
- **WHEN** la persona confirma el borrado
- **THEN** el documento local desaparece y la app vuelve al estado de primera visita
