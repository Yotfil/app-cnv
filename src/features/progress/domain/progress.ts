import type { PracticeMode, Progress, Store } from './model'

/** Maximum length of the optional nickname. */
export const ALIAS_MAX_LENGTH = 30

function newProgress(alias: string | null, at: Date): Progress {
  return { version: 1, alias, userId: null, createdAt: at.toISOString(), points: {} }
}

function cleanAlias(alias: string): string | null {
  const trimmed = alias.trim().slice(0, ALIAS_MAX_LENGTH)
  return trimmed === '' ? null : trimmed
}

/**
 * Called when the person continues from the home screen: creates the document on
 * the first visit, or updates the alias on later ones keeping the counters.
 */
export function startProgress(store: Store, alias: string, at: Date): Progress {
  const current = store.read()
  const progress = current
    ? { ...current, alias: cleanAlias(alias) }
    : newProgress(cleanAlias(alias), at)
  store.write(progress)
  return progress
}

/** Records one answer for a point and saves the document before returning it. */
export function recordAnswer(
  store: Store,
  pointId: string,
  mode: PracticeMode,
  hit: boolean,
  at: Date,
): Progress {
  const when = at.toISOString()
  const current = store.read() ?? newProgress(null, at)
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
