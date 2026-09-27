# Spec Delta

## Purpose

Ejercicio "¿qué significa?": se destaca un punto en la ilustración y la persona elige su significado entre cuatro opciones.

## ADDED Requirements

### Requirement: Pregunta con un punto destacado
Cada pregunta SHALL mostrar la ilustración de la región con un único punto resaltado (el resto ocultos), el rótulo de lateralidad y cuatro opciones de texto en orden aleatorio, de las cuales al menos una es correcta.

#### Scenario: Pregunta generada
- **WHEN** empieza una pregunta sobre el punto de la mejilla derecha
- **THEN** solo ese marcador es visible, y entre las cuatro opciones está "En la mejilla derecha queremos morder al otro, el otro nos molesta, nos pone nervioso, nos saca de las casillas."

### Requirement: Distractores de la misma región y lado opuesto
Los distractores SHALL elegirse con esta prioridad: primero el significado del punto simétrico del lado opuesto si existe, después otros puntos de la misma región, y solo si no bastan, puntos de cualquier región. Un distractor nunca SHALL ser igual al significado correcto ni a uno de sus alternativos.

#### Scenario: Región con puntos suficientes
- **WHEN** la región tiene al menos cuatro puntos con significados distintos
- **THEN** las tres opciones incorrectas provienen de esa región, y una de ellas es la del punto simétrico cuando existe

#### Scenario: Mismo texto en dos lugares
- **WHEN** otro punto de la región tiene exactamente el mismo `meaning` que el correcto
- **THEN** ese texto no se usa como distractor

### Requirement: Puntos con varios significados
Si el punto tiene `alternativeMeanings`, elegir cualquiera de ellos o el principal SHALL contar como acierto, y ninguno de ellos SHALL aparecer como distractor.

#### Scenario: Arco de Cupido
- **WHEN** la pregunta es sobre el arco de Cupido y las opciones incluyen "Relación de autoridad"
- **THEN** elegirlo cuenta como acierto aunque el significado principal sea otro

### Requirement: Respuesta y corrección inmediata
Tras elegir, la vista SHALL indicar acierto o fallo, marcar la opción correcta, y mostrar la ficha completa del punto antes de pasar a la siguiente pregunta.

#### Scenario: Fallo
- **WHEN** la persona elige una opción incorrecta
- **THEN** se ve en rojo la elegida, en verde la correcta, la ficha del punto, y un botón "Siguiente"

### Requirement: Sesión de práctica
Una sesión SHALL cubrir los puntos de la región elegida en orden aleatorio sin repetir hasta agotarlos, mostrar el avance ("4 de 12") y, al terminar, el número de aciertos y fallos.

#### Scenario: Fin de sesión
- **WHEN** se responden todos los puntos de la cara
- **THEN** aparece el resumen con aciertos, fallos y un botón para repetir

### Requirement: Alcance del POC
En este cambio la práctica SHALL estar disponible solo para la región `face`.

#### Scenario: Entrada a práctica
- **WHEN** la persona abre `/practice`
- **THEN** solo puede elegir "Cara"; las demás regiones aparecen atenuadas
