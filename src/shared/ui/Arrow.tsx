import styles from './Arrow.module.css'

type Coordinate = { x: number; y: number }

type Props = {
  /** Start and end in percent of the illustration (0 to 100). */
  from: Coordinate
  to: Coordinate
  /** Width / height of the illustration, so the head keeps its shape on non-square images. */
  ratio: number
}

/** Length of each side of the head, in percent of the illustration width. */
const HEAD = 3
const HEAD_ANGLE = (28 * Math.PI) / 180

/**
 * Gesture arrow drawn inside the SVG layer of an Illustration. The layer stretches
 * 0–100 to the image size, so the head is computed in a space where x and y have
 * the same unit and then mapped back.
 */
export function Arrow({ from, to, ratio }: Props) {
  // Work with y in the same unit as x: percent of the width.
  const dx = to.x - from.x
  const dy = (to.y - from.y) / ratio
  const angle = Math.atan2(dy, dx)

  const side = (turn: number) => {
    const a = angle + Math.PI + turn
    return `${to.x + HEAD * Math.cos(a)},${to.y + HEAD * Math.sin(a) * ratio}`
  }

  return (
    <g className={styles.arrow}>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} vectorEffect="non-scaling-stroke" />
      <polyline
        points={`${side(HEAD_ANGLE)} ${to.x},${to.y} ${side(-HEAD_ANGLE)}`}
        vectorEffect="non-scaling-stroke"
      />
    </g>
  )
}
