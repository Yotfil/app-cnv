# Spec Delta

## Purpose

Mapa de cuerpo entero desde el que se accede a cada región de detalle, con indicación de cuántos puntos hay en cada zona.

## ADDED Requirements

### Requirement: Mapa con zonas clicables
La app SHALL mostrar la ilustración de cuerpo entero frontal con una zona por región de detalle que declara ese mapa como `padre`. Cada zona SHALL mostrar el nombre de la región y el número de puntos que contiene.

#### Scenario: Abrir una región
- **WHEN** la persona toca o hace clic dentro de la zona "Cara"
- **THEN** la app navega a la vista de estudio de la región "cara"

#### Scenario: Región sin imagen todavía
- **WHEN** una zona corresponde a una región cuya imagen no existe en este cambio
- **THEN** la zona se muestra atenuada con el texto "próximamente" y no navega

### Requirement: Zonas usables en móvil
Las zonas SHALL tener un área táctil mínima de 44 por 44 píxeles CSS y resaltarse visiblemente al tocarlas o pasar el ratón.

#### Scenario: Toque en pantalla estrecha
- **WHEN** la pantalla mide 360 píxeles de ancho
- **THEN** el mapa completo cabe en el ancho sin desplazamiento horizontal y la zona "Cara" sigue siendo tocable

### Requirement: Sin puntos en el mapa
El mapa SHALL mostrar únicamente zonas y contadores, nunca los puntos individuales.

#### Scenario: Densidad de la cara
- **WHEN** la región "cara" tiene 12 puntos
- **THEN** el mapa muestra "Cara · 12" y ningún marcador de punto

### Requirement: Enlace directo por URL
Cada mapa y cada región SHALL tener una URL propia que se pueda compartir.

#### Scenario: Compartir región
- **WHEN** alguien abre la URL de la región "cara" directamente
- **THEN** ve la vista de estudio de esa región con un control para volver al mapa
