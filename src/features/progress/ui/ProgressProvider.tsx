import { useMemo, useState, type ReactNode } from 'react'
import type { Store } from '../domain/model'
import { clearProgress, recordAnswer, startProgress } from '../domain/progress'
import { ProgressContext, type ProgressState } from './progressContext'

type Props = {
  /**
   * Where the document lives: localStorage in the app, memory in tests. A store that can
   * lose its persistence (localStorage blocked) tells so through `persistent`.
   */
  store: Store & { persistent?: () => boolean }
  children: ReactNode
}

/** Holds the progress document for the whole app and keeps it in sync with the store. */
export function ProgressProvider({ store, children }: Props) {
  const [progress, setProgress] = useState(() => store.read())
  const [saved, setSaved] = useState(() => store.persistent?.() ?? true)

  const value = useMemo<ProgressState>(() => {
    // After every write, check whether the browser kept it.
    const after = <T,>(result: T): T => {
      setSaved(store.persistent?.() ?? true)
      return result
    }
    return {
      progress,
      saved,
      start: (alias) => setProgress(after(startProgress(store, alias, new Date()))),
      record: (pointId, mode, hit) =>
        setProgress(after(recordAnswer(store, pointId, mode, hit, new Date()))),
      clear: () => {
        clearProgress(store)
        setProgress(after(null))
      },
    }
  }, [progress, saved, store])

  return <ProgressContext value={value}>{children}</ProgressContext>
}
