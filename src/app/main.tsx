import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import '@/shared/ui/tokens.css'
import './i18n'
import { CatalogProvider } from '@/features/catalog'
import { ProgressProvider, type Progress } from '@/features/progress'
import { createLocalStorageStore } from '@/shared/lib/storage/localStorageStore'
import { ErrorBoundary } from './ErrorBoundary'
import { router } from './router'

// The warning about progress that cannot be saved is shown by the practice screen (task 7.3).
const progressStore = createLocalStorageStore<Progress>('micropicores.progress.v1')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <CatalogProvider>
        <ProgressProvider store={progressStore}>
          <RouterProvider router={router} />
        </ProgressProvider>
      </CatalogProvider>
    </ErrorBoundary>
  </StrictMode>,
)
