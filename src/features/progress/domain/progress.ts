import type { PracticeMode, Progress, Store } from './model'

/** Records one answer for a point and saves the document before returning it. */
export function recordAnswer(
  store: Store,
  pointId: string,
  mode: PracticeMode,
  hit: boolean,
  at: Date,
): Progress {
  const when = at.toISOString()
  const current = store.read() ?? {
    version: 1,
    alias: null,
    userId: null,
    createdAt: when,
    points: {},
  }
  const before = current.points[pointId] ?? { hits: 0, misses: 0 }
  const progress: Progress = {
    ...current,
    points: {
      ...current.points,
      [pointId]: {
        hits: before.hits + (hit ? 1 : 0),
        misses: before.misses + (hit ? 0 : 1),
        lastAttempt: when,
        mode,
      },
    },
  }
  store.write(progress)
  return progress
}

/** Removes the progress and alias from the device. */
export function clearProgress(store: Store): void {
  store.clear()
}
