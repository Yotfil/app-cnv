import { createBrowserRouter } from 'react-router'
import { RegionScreen } from '@/features/catalog'
import App from './App'

export const router = createBrowserRouter([
  // Placeholder until the home screen (task 5.1).
  { path: '/', element: <App /> },
  { path: '/region/:key', element: <RegionScreen /> },
])
