import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/shared/ui/tokens.css'
import './i18n'
import App from './App.tsx'
import { ErrorBoundary } from './ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
