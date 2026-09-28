import { useContext } from 'react'
import { ProgressContext, type ProgressState } from './progressContext'

/** The only way to read or change progress from a component (ADR 0003). */
export function useProgress(): ProgressState {
  const state = useContext(ProgressContext)
  if (!state) throw new Error('useProgress must be used inside ProgressProvider')
  return state
}
