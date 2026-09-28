// Catalog model. Field names are the contract with the future FastAPI endpoint
// (regions.json and points.json have exactly this shape).

/** Always the side of the observed person's body, never the side of the screen. */
export type Side = 'left' | 'right' | 'center'

export type View = 'front' | 'back' | 'side'

export type Tag = 'personal' | 'external' | 'micro-caress' | 'inner-side'

/** Position in percent of the image width (x) and height (y), from 0 to 100. */
export type Coordinate = {
  x: number
  y: number
}

export type Region = {
  /** UUID v4, fixed forever. */
  id: string
  /** English slug, lowercase with hyphens, unique. Used in URLs. */
  key: string
  /** Spanish name shown in the interface. */
  name: string
  view: View
  /** Image path relative to the site root. */
  image: string
  /** Image size in pixels; gives the fixed aspect ratio of the illustration. */
  width: number
  height: number
  /** Id of the full-body region this one opens from. Absent on full-body regions (maps). */
  parent?: string
  /** Polygon over the parent image that opens this region. */
  zone?: Coordinate[]
  /** True only when the same image is shown flipped for the opposite side. */
  mirror: boolean
}

/** Direction of the scratching gesture, drawn as an arrow over the image. */
export type Arrow = {
  from: Coordinate
  to: Coordinate
}

export type Point = {
  /** UUID v4 generated once and never changed; progress references it. */
  id: string
  /** Readable English key; may change. */
  key: string
  /** Id of the region the point belongs to. */
  region: string
  side: Side
  x: number
  y: number
  /** Hit radius in percent of the image width. */
  radius: number
  /** Literal text from the PDF. */
  meaning: string
  /** Other literal texts the PDF gives for the same place. */
  alternativeMeanings: string[]
  tags: Tag[]
  gesture?: string
  arrow?: Arrow
  muscle?: string
  /** Page (lámina) of the PDF the point comes from. */
  page: number
}
