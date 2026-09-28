import { createMemoryStore } from './memoryStore'

type Options = {
  /** Called once, the first time the browser refuses the storage; later calls go to memory. */
  onUnavailable?: () => void
}

/**
 * Keeps one JSON document in localStorage under `key`. If the browser blocks or
 * rejects the storage (private window, blocked site data, full quota), it switches
 * to memory without losing what the app already wrote, and warns once.
 */
export function createLocalStorageStore<T>(key: string, { onUnavailable }: Options = {}) {
  let fallback: ReturnType<typeof createMemoryStore<T>> | null = null

  const switchToMemory = (current: T | null) => {
    if (fallback) return fallback
    fallback = createMemoryStore<T>(current)
    onUnavailable?.()
    return fallback
  }

  const read = (): T | null => {
    if (fallback) return fallback.read()
    let raw: string | null
    try {
      raw = localStorage.getItem(key)
    } catch {
      return switchToMemory(null).read()
    }
    if (raw === null) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      // A damaged document counts as no document rather than breaking the app.
      return null
    }
  }

  return {
    read,
    write(value: T): void {
      if (fallback) return fallback.write(value)
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch {
        switchToMemory(value)
      }
    },
    clear(): void {
      if (fallback) return fallback.clear()
      try {
        localStorage.removeItem(key)
      } catch {
        switchToMemory(null)
      }
    },
  }
}
