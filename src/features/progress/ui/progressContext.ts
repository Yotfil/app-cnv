import { createContext } from 'react'
import type { Progress } from '../domain/model'

export type ProgressState = {
  /** Null on a first visit: nothing saved on this device yet. */
  progress: Progress | null
  /** Continue from the home screen with an optional alias. */
  start(alias: string): void
  /** Remove alias and progress from the device. */
  clear(): void
}

export const ProgressContext = createContext<ProgressState | null>(null)
