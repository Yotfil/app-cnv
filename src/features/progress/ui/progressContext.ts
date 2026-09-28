import { createContext } from 'react'
import type { PracticeMode, Progress } from '../domain/model'

export type ProgressState = {
  /** Null on a first visit: nothing saved on this device yet. */
  progress: Progress | null
  /** False when the browser does not let the app save: progress lasts only until it closes. */
  saved: boolean
  /** Continue from the home screen with an optional alias. */
  start(alias: string): void
  /** Add a hit or a miss to a point. */
  record(pointId: string, mode: PracticeMode, hit: boolean): void
  /** Remove alias and progress from the device. */
  clear(): void
}

export const ProgressContext = createContext<ProgressState | null>(null)
