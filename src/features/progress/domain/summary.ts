import type { Point } from '@/features/catalog'
import type { Progress } from './model'

export type PointSummary = {
  point: Point
  hits: number
  misses: number
  /** ISO date of the last answer, or null when the point has not been practised. */
  lastAttempt: string | null
}

export type RegionSummary = {
  regionId: string
  /** Points of the region answered at least once. */
  practiced: number
  total: number
  /** In catalog order. */
  points: PointSummary[]
}

/** What the person has practised, by region and by point, in catalog order. Data only: no mastery rule. */
export function summarizeProgress(progress: Progress | null, points: Point[]): RegionSummary[] {
  const regions = new Map<string, PointSummary[]>()
  for (const point of points) {
    const saved = progress?.points[point.id]
    const summary: PointSummary = saved
      ? { point, hits: saved.hits, misses: saved.misses, lastAttempt: saved.lastAttempt }
      : { point, hits: 0, misses: 0, lastAttempt: null }
    regions.set(point.region, [...(regions.get(point.region) ?? []), summary])
  }
  return [...regions].map(([regionId, list]) => ({
    regionId,
    practiced: list.filter((summary) => summary.lastAttempt !== null).length,
    total: list.length,
    points: list,
  }))
}
