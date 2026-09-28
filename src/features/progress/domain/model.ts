// Progress model, stored on the device under `micropicores.progress.v1`.

/** Practice mode of an answer. The POC only has "¿qué significa?"; `where` comes later. */
export type PracticeMode = 'meaning'

export type PointProgress = {
  hits: number
  misses: number
  /** ISO date of the last answer. */
  lastAttempt: string
  /** Mode of the last answer. */
  mode: PracticeMode
}

export type Progress = {
  /** Schema version, for future migrations. */
  version: 1
  /** Optional nickname of up to 30 characters; null when the person leaves it empty. */
  alias: string | null
  /** Null until login exists; filling it triggers the migration to the API. */
  userId: string | null
  /** ISO date. */
  createdAt: string
  /** Counters by point id. */
  points: Record<string, PointProgress>
}

/** Port where progress is kept. Adapters: localStorage, memory and, later, the API. */
export type Store = {
  read(): Progress | null
  write(progress: Progress): void
}
