/** Keeps one document in memory. Used by tests and as the fallback when localStorage fails. */
export function createMemoryStore<T>(initial: T | null = null) {
  let document = initial
  return {
    read: (): T | null => document,
    write: (value: T): void => {
      document = value
    },
    clear: (): void => {
      document = null
    },
  }
}
