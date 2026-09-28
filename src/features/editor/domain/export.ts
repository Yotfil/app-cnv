import type { Point, Region } from '@/features/catalog'

/** Format of the catalog files in public/data: two-space JSON and a final newline. */
function toFile(list: unknown[]): string {
  return `${JSON.stringify(list, null, 2)}\n`
}

/**
 * Text of regions.json and points.json, ready to replace the files in the repository.
 * Ids and order are the ones received, so unedited entries stay byte for byte the same.
 */
export function exportCatalog(
  regions: Region[],
  points: Point[],
): { regions: string; points: string } {
  return { regions: toFile(regions), points: toFile(points) }
}
