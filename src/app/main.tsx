import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import '@/shared/ui/tokens.css'
import './i18n'
import { CatalogProvider } from '@/features/catalog'
import { ErrorBoundary } from './ErrorBoundary'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <CatalogProvider>
        <RouterProvider router={router} />
      </CatalogProvider>
    </ErrorBoundary>
  </StrictMode>,
)
