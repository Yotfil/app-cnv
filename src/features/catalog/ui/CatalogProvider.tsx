import { useEffect, useState, type ReactNode } from 'react'
import { reportError } from '@/shared/lib/reportError'
import { loadCatalog, type CatalogSource } from '../domain/catalog'
import type { Point, Region } from '../domain/model'
import { CatalogContext, type CatalogState } from './catalogContext'

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path)
  if (!response.ok) throw new Error(`${path} answered ${response.status}`)
  return (await response.json()) as T
}

/** Today the static files in public/data; later the FastAPI endpoint with the same shape. */
const staticFiles: CatalogSource = async () => {
  const [regions, points] = await Promise.all([
    fetchJson<Region[]>('/data/regions.json'),
    fetchJson<Point[]>('/data/points.json'),
  ])
  return { regions, points }
}

/** Loads the catalog once for the whole app. */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CatalogState>({ status: 'loading' })

  useEffect(() => {
    let active = true
    loadCatalog(staticFiles)
      .then((catalog) => {
        if (catalog.invalidPoints.length > 0) {
          reportError(new Error('Points with an unknown region were left out'), {
            points: catalog.invalidPoints.map((point) => point.key),
          })
        }
        if (active) setState({ status: 'ready', catalog })
      })
      .catch((error: unknown) => {
        reportError(error, { source: 'CatalogProvider' })
        if (active) setState({ status: 'error' })
      })
    return () => {
      active = false
    }
  }, [])

  return <CatalogContext value={state}>{children}</CatalogContext>
}
