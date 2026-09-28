import { createBrowserRouter } from 'react-router'
import { RegionScreen } from '@/features/catalog'
import { HomeScreen } from '@/features/onboarding'
import { AppLayout } from './AppLayout'
import { NotFoundScreen } from './NotFoundScreen'
import { STUDY_PATH } from './paths'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomeScreen studyPath={STUDY_PATH} /> },
      { path: '/region/:key', element: <RegionScreen /> },
      // Unknown addresses stay inside the layout, so the bottom bar is always there.
      { path: '*', element: <NotFoundScreen /> },
    ],
  },
])
