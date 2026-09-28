import type { PointerEventHandler } from 'react'
import styles from './Marker.module.css'
import { Orb, type OrbState, type OrbTone } from './Orb'

export type MarkerTone = OrbTone
export type MarkerState = OrbState

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
  onPointerDown?: PointerEventHandler<HTMLButtonElement>
  onPointerEnter?: PointerEventHandler<HTMLButtonElement>
  onPointerLeave?: PointerEventHandler<HTMLButtonElement>
}

/**
 * Point marker over an Illustration overlay: an orb inside a 44 px hit area. HTML
 * rather than SVG so it stays round over images that are not square.
 */
export function Marker({
  x,
  y,
  tone,
  state = 'rest',
  phase = 0,
  label,
  onClick,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
}: Props) {
  return (
    <button
      type="button"
      className={styles.hit}
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-label={label}
      aria-pressed={state === 'active'}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <Orb tone={tone} state={state} phase={phase} />
    </button>
  )
}
