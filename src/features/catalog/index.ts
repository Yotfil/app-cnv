// Public entry point of the catalog feature. Other features import only from here.
export type { Catalog } from './domain/catalog'
export type { Point, Region, Side } from './domain/model'
export { CatalogProvider } from './ui/CatalogProvider'
export { MapScreen } from './ui/MapScreen'
export { RegionScreen } from './ui/RegionScreen'
export { useCatalog } from './ui/useCatalog'
