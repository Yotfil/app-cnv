# Spec Delta

## Purpose

Vista de estudio de una región: la ilustración con todos sus micropicores marcados de forma sutil, la ficha de cada uno al interactuar y el rótulo permanente de lateralidad.

## ADDED Requirements

### Requirement: Puntos visibles con animación sutil
La vista SHALL dibujar cada punto de la región sobre la ilustración en su posición relativa, con un marcador pequeño y una animación de latido lenta que indique que es interactivo. Todos los puntos de la región se muestran a la vez.

#### Scenario: Región cargada
- **WHEN** se abre la región "cara"
- **THEN** cada punto de `puntos.json` cuya `region` es "cara" aparece en la ilustración con latido, sin texto junto al marcador

#### Scenario: Preferencia de movimiento reducido
- **WHEN** el sistema operativo indica preferencia por movimiento reducido
- **THEN** los marcadores se muestran sin animación

### Requirement: Ficha del punto
Al pasar el ratón por un marcador (en dispositivos con puntero) o al tocarlo (en táctiles) la vista SHALL mostrar una ficha con: nombre de la zona, lado en palabras ("Lado izquierdo de la persona"), significado literal y, si existen, significados alternativos, gesto y etiquetas. La ficha SHALL cerrarse al tocar fuera o al elegir otro punto.

#### Scenario: Hover en escritorio
- **WHEN** el puntero entra en un marcador
- **THEN** la ficha aparece junto al marcador sin tapar el punto y desaparece al salir

#### Scenario: Toque en móvil
- **WHEN** se toca un marcador en pantalla táctil
- **THEN** la ficha aparece como panel inferior fijo y el marcador queda resaltado hasta que se cierra

#### Scenario: Punto con significados alternativos
- **WHEN** el punto tiene entradas en `significados_alternativos`
- **THEN** la ficha muestra el significado principal y debajo cada alternativo con la indicación "también"

### Requirement: Rótulo fijo de lateralidad
La vista SHALL mostrar de forma permanente, a cada lado de la ilustración, un rótulo que indique "Derecha de la persona" en el borde izquierdo de la pantalla y "Izquierda de la persona" en el borde derecho, porque la figura mira al observador.

#### Scenario: Región volteada
- **WHEN** la región tiene `espejo` verdadero y se muestra el lado contrario
- **THEN** los rótulos y las posiciones de los puntos se invierten juntos

### Requirement: Flechas de gesto
Cuando un punto declara `flecha`, la vista SHALL dibujar una flecha discreta entre sus dos coordenadas sobre la ilustración, y la ficha SHALL mostrar el texto de `gesto`.

#### Scenario: Mejilla hacia el mentón
- **WHEN** el punto de la mejilla declara una flecha hacia el mentón
- **THEN** se ve una flecha fina sobre la mejilla y la ficha dice el gesto en palabras

### Requirement: Preparado para filtros
La lógica de la vista SHALL aceptar un criterio de filtrado por lado y por etiqueta aunque la interfaz de este cambio no exponga controles para ello.

#### Scenario: Sin filtro
- **WHEN** no se aplica ningún criterio
- **THEN** se muestran todos los puntos de la región
