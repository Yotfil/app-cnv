# Spec Delta

## Purpose

Define el catálogo de regiones y micropicores extraído del PDF del curso: identidad estable de cada punto, región e imagen a la que pertenece, lado del cuerpo, posición relativa y significado literal.

## ADDED Requirements

### Requirement: Cada región describe una imagen y su lugar en el cuerpo
El catálogo SHALL contener una entrada por región con: `id` (UUID v4 fijo), `clave` legible, `nombre`, `vista` (frontal, dorsal o lateral), `imagen` (ruta relativa), `ancho` y `alto` de la imagen en píxeles, `padre` opcional (id de la región de cuerpo entero desde la que se abre), `zona` opcional (polígono en porcentaje sobre la imagen padre) y `espejo` (booleano, verdadero solo cuando la misma imagen se usa volteada para el lado contrario).

#### Scenario: Región de detalle enlazada a su mapa
- **WHEN** la región "cara" declara `padre` igual al id de "cuerpo-frontal" y una `zona` poligonal
- **THEN** el sistema puede resolver desde la zona del mapa qué región abrir y desde la región a qué mapa volver

#### Scenario: Región de cuerpo entero
- **WHEN** una región no declara `padre`
- **THEN** el sistema la trata como mapa de navegación y no espera puntos en ella

### Requirement: Cada punto tiene identidad estable y posición relativa
El catálogo SHALL contener una entrada por micropicor con: `id` (UUID v4 generado una sola vez y nunca cambiado), `clave` legible (puede cambiar), `region` (id de región), `lado` (izquierdo, derecho o centro, siempre referido al cuerpo del sujeto), `x` e `y` en porcentaje del ancho y alto de la imagen de la región (0 a 100), `radio` de acierto en porcentaje del ancho, `significado` (texto literal del PDF), `significados_alternativos` (lista, vacía por defecto), `etiquetas` (subconjunto de personal, exterior, micro-caricia, cara-interna), `gesto` opcional (texto), `flecha` opcional (dos coordenadas en porcentaje), `musculo` opcional y `pagina` del PDF.

#### Scenario: Punto con dos significados en el PDF
- **WHEN** el PDF asigna dos significados al mismo lugar (arco de Cupido: "Estoy excitado. Connotación sexual" y "Relación de autoridad")
- **THEN** el catálogo tiene un solo punto con el primero en `significado` y el segundo en `significados_alternativos`

#### Scenario: Mismo significado en dos lugares
- **WHEN** el PDF repite un texto en dos posiciones distintas ("Necesidad de tomar/estar en su sitio" en esternón y cadera derecha)
- **THEN** el catálogo tiene dos puntos con ids distintos y el mismo `significado`

#### Scenario: Coordenadas independientes de la pantalla
- **WHEN** la imagen de una región se muestra a cualquier tamaño
- **THEN** la posición del punto se calcula a partir de `x` e `y` en porcentaje y coincide con el mismo lugar de la ilustración

### Requirement: El contenido es exclusivamente el del PDF
El `significado` de cada punto SHALL ser el texto del PDF sin reformular; solo se corrigen erratas evidentes (por ejemplo "qque" por "que") y se conservan tal cual los códigos sin definir ("CON ESI", "ASI", "O1p2").

#### Scenario: Código sin leyenda
- **WHEN** un texto del PDF contiene "O1p2"
- **THEN** el catálogo lo conserva literalmente y no añade interpretación

### Requirement: Los puntos sin etiqueta no forman parte del catálogo
Los marcadores del PDF que no tienen texto asociado SHALL quedar fuera del catálogo.

#### Scenario: Marcadores rojos de recapitulación
- **WHEN** la lámina 4 repite en rojo cuatro puntos de la lámina 3 sin etiqueta
- **THEN** el catálogo no crea puntos nuevos por ellos

### Requirement: El catálogo se sirve con la forma de la futura API
El catálogo SHALL exponerse como dos documentos JSON, `regiones.json` y `puntos.json`, cada uno una lista de objetos con los campos anteriores, de modo que sustituir la lectura de archivos por un endpoint no cambie la forma de los datos.

#### Scenario: Carga del catálogo
- **WHEN** la app arranca
- **THEN** obtiene ambas listas y valida que cada `region` de un punto exista en `regiones.json`; si no, registra el punto como inválido y no lo muestra

### Requirement: Alcance de contenido del POC
En este cambio el catálogo SHALL incluir las regiones `cuerpo-frontal` y `cara` y los puntos de las láminas 3, 4 y 13 del PDF (frente, entrecejo, mejillas, mentón, laringe, base del cuello) más las zonas de cara del mapa. El esquema admite el resto de regiones sin cambios.

#### Scenario: Punto fuera del POC
- **WHEN** un punto pertenece a una región que aún no tiene imagen
- **THEN** no se incluye en `puntos.json` de este cambio
