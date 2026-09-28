import type { ReactNode } from 'react'
import styles from './Illustration.module.css'

type Props = {
  src: string
  /** Image size in pixels; only its ratio is used, so the illustration keeps its shape at any width. */
  width: number
  height: number
  alt: string
  /** SVG content placed in percent: x and y from 0 to 100 over the image. Lines and polygons. */
  children?: ReactNode
  /** HTML layer on top, for elements that must keep their shape (markers), placed with left/top in percent. */
  overlay?: ReactNode
}

/**
 * Image with a fixed aspect ratio and an SVG layer on top whose coordinates are
 * percentages of the image, so the same data points to the same place at any size.
 */
export function Illustration({ src, width, height, alt, children, overlay }: Props) {
  return (
    <div className={styles.frame} style={{ aspectRatio: `${width} / ${height}` }}>
      <img className={styles.image} src={src} alt={alt} draggable={false} />
      <svg
        className={styles.layer}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden={children ? undefined : true}
      >
        {children}
      </svg>
      {overlay && <div className={styles.overlay}>{overlay}</div>}
    </div>
  )
}
