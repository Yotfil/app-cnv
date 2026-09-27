# Spec Delta

## Purpose

Herramienta de desarrollo, accesible solo por URL no enlazada, para ajustar las coordenadas y radios de los puntos sobre la ilustración real y exportar el catálogo corregido al repositorio.

## ADDED Requirements

### Requirement: Acceso por ruta oculta
El editor SHALL estar en la ruta `/editor` sin enlace desde ninguna pantalla de la app.

#### Scenario: Abrir el editor
- **WHEN** se escribe la ruta `/editor` en el navegador
- **THEN** se muestra el editor con un selector de región

### Requirement: Mover puntos y ajustar radio
El editor SHALL mostrar la ilustración de la región elegida con todos sus puntos, permitir arrastrar cada punto a una nueva posición, editar su `radio`, y ver el círculo de acierto resultante. Las coordenadas SHALL guardarse en porcentaje.

#### Scenario: Arrastrar un punto
- **WHEN** se arrastra el marcador de "entrecejo" a otro lugar
- **THEN** sus `x` e `y` cambian en porcentaje de la imagen y el marcador queda en el nuevo lugar al soltar

#### Scenario: Puntos muy juntos
- **WHEN** dos puntos se solapan en pantalla
- **THEN** el editor permite seleccionar cada uno por su clave en una lista lateral

### Requirement: Exportar el catálogo
El editor SHALL exportar `puntos.json` y `regiones.json` completos, con los mismos ids y el orden original, listos para sustituir los archivos del repositorio.

#### Scenario: Exportar tras editar
- **WHEN** se pulsa "Exportar"
- **THEN** se descargan los dos archivos JSON con los cambios, y los puntos no editados quedan idénticos a los originales

### Requirement: Añadir zona en el mapa
Para las regiones de cuerpo entero, el editor SHALL permitir dibujar o ajustar el polígono `zona` de cada región hija.

#### Scenario: Ajustar la zona de la cara
- **WHEN** se mueven los vértices del polígono de "cara" sobre el cuerpo frontal
- **THEN** la `zona` exportada refleja los nuevos vértices en porcentaje
