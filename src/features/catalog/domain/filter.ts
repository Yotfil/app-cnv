import type { Point, Side, Tag } from './model'

/** Criteria to narrow the points of a region. Empty lists or missing fields mean "any". */
export type PointFilter = {
  sides?: Side[]
  tags?: Tag[]
}

/** Points of one region that match the filter. The POC interface passes no filter. */
export function pointsOfRegion(
  points: Point[],
  regionId: string,
  filter: PointFilter = {},
): Point[] {
  const { sides = [], tags = [] } = filter
  return points.filter(
    (point) =>
      point.region === regionId &&
      (sides.length === 0 || sides.includes(point.side)) &&
      (tags.length === 0 || point.tags.some((tag) => tags.includes(tag))),
  )
}
