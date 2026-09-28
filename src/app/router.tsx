import { createBrowserRouter } from 'react-router'
import { MapScreen, RegionScreen } from '@/features/catalog'
import { HomeScreen } from '@/features/onboarding'
import { PracticeScreen } from '@/features/practice'
import { AppLayout } from './AppLayout'
import { NotFoundScreen } from './NotFoundScreen'
import { STUDY_PATH } from './paths'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomeScreen studyPath={STUDY_PATH} /> },
      { path: '/map', element: <MapScreen /> },
      { path: '/region/:key', element: <RegionScreen /> },
      { path: '/practice', element: <PracticeScreen /> },
      { path: '/practice/:key', element: <PracticeScreen /> },
      // Unknown addresses stay inside the layout, so the bottom bar is always there.
      { path: '*', element: <NotFoundScreen /> },
    ],
  },
])
