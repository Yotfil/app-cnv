import type { CSSProperties } from 'react'
import styles from './Orb.module.css'

/** Colour of the centre: wine for the person's right side, rose for the left, soft ink for the midline. */
export type OrbTone = 'right' | 'left' | 'center'

/**
 * rest: breathing orb · active: selected or highlighted, larger and still · dimmed: the
 * rest while one is active · muted: not available yet ("coming soon").
 */
export type OrbState = 'rest' | 'active' | 'dimmed' | 'muted'

type Props = {
  tone: OrbTone
  state?: OrbState
  /** Seconds into the breathing cycle, so that orbs do not pulse in unison. */
  phase?: number
}

/** The visual orb shared by point markers and map zones. Decorative: its parent carries the meaning. */
export function Orb({ tone, state = 'rest', phase = 0 }: Props) {
  return (
    <span
      className={styles.orb}
      data-tone={tone}
      data-state={state}
      style={{ '--phase': `-${phase}s` } as CSSProperties}
      aria-hidden
    >
      <span className={styles.ring} />
      <span className={styles.core} />
    </span>
  )
}
