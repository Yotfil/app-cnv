import type { Point, Region } from './model'

/** Brings both catalog documents: today by fetching the JSON files, later from the API. */
export type CatalogSource = () => Promise<{ regions: Region[]; points: Point[] }>

export type Catalog = {
  regions: Region[]
  points: Point[]
  /** Points left out of the catalog; the UI reports them. */
  invalidPoints: Point[]
}

export async function loadCatalog(source: CatalogSource): Promise<Catalog> {
  const { regions, points } = await source()
  const regionIds = new Set(regions.map((region) => region.id))
  return {
    regions,
    points: points.filter((point) => regionIds.has(point.region)),
    invalidPoints: points.filter((point) => !regionIds.has(point.region)),
  }
}
