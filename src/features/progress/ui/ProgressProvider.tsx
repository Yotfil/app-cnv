import { useMemo, useState, type ReactNode } from 'react'
import type { Store } from '../domain/model'
import { clearProgress, startProgress } from '../domain/progress'
import { ProgressContext, type ProgressState } from './progressContext'

type Props = {
  /** Where the document lives: localStorage in the app, memory in tests. */
  store: Store
  children: ReactNode
}

/** Holds the progress document for the whole app and keeps it in sync with the store. */
export function ProgressProvider({ store, children }: Props) {
  const [progress, setProgress] = useState(() => store.read())

  const value = useMemo<ProgressState>(
    () => ({
      progress,
      start: (alias) => setProgress(startProgress(store, alias, new Date())),
      clear: () => {
        clearProgress(store)
        setProgress(null)
      },
    }),
    [progress, store],
  )

  return <ProgressContext value={value}>{children}</ProgressContext>
}
