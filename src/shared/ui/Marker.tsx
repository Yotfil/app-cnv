import type { CSSProperties } from 'react'
import styles from './Marker.module.css'

/** Colour of the centre: wine for the person's right side, rose for the left, ink for the midline. */
export type MarkerTone = 'right' | 'left' | 'center'

/** rest: breathing orb · active: the selected one, larger and still · dimmed: the rest while one is active. */
export type MarkerState = 'rest' | 'active' | 'dimmed'

type Props = {
  /** Position in percent of the illustration (0 to 100). */
  x: number
  y: number
  tone: MarkerTone
  state?: MarkerState
  /** Seconds into the breathing cycle, so that markers do not pulse in unison. */
  phase?: number
  /** Accessible name, read by screen readers. */
  label: string
  onClick?: () => void
}

/**
 * Pearl orb marking a point over an Illustration overlay. HTML rather than SVG so it
 * stays round over images that are not square.
 */
export function Marker({ x, y, tone, state = 'rest', phase = 0, label, onClick }: Props) {
  const style = {
    left: `${x}%`,
    top: `${y}%`,
    '--phase': `-${phase}s`,
  } as CSSProperties

  return (
    <button
      type="button"
      className={styles.hit}
      style={style}
      data-tone={tone}
      data-state={state}
      aria-label={label}
      aria-pressed={state === 'active'}
      onClick={onClick}
    >
      <span className={styles.orb}>
        <span className={styles.ring} />
        <span className={styles.core} />
      </span>
    </button>
  )
}
