import { createContext } from 'react'
import type { Catalog } from '../domain/catalog'

export type CatalogState =
  { status: 'loading' } | { status: 'ready'; catalog: Catalog } | { status: 'error' }

export const CatalogContext = createContext<CatalogState | null>(null)
