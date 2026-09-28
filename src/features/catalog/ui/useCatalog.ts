import { useContext } from 'react'
import { CatalogContext, type CatalogState } from './catalogContext'

/** The only way to read the catalog from a component (ADR 0003). */
export function useCatalog(): CatalogState {
  const state = useContext(CatalogContext)
  if (!state) throw new Error('useCatalog must be used inside CatalogProvider')
  return state
}
