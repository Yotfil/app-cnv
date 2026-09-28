import { createBrowserRouter } from 'react-router'
import { RegionScreen } from '@/features/catalog'
import App from './App'
import { AppLayout } from './AppLayout'
import { NotFoundScreen } from './NotFoundScreen'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      // Placeholder until the home screen (task 5.1).
      { path: '/', element: <App /> },
      { path: '/region/:key', element: <RegionScreen /> },
      // Unknown addresses stay inside the layout, so the bottom bar is always there.
      { path: '*', element: <NotFoundScreen /> },
    ],
  },
])
