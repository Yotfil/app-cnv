import { Navigate, Outlet, useLocation } from 'react-router'
import { useProgress } from '@/features/progress'
import styles from './AppLayout.module.css'
import { BottomNav } from './BottomNav'

/**
 * Frame shared by every screen. On a first visit (no progress saved yet) only the
 * home screen is reachable, so the credit and the caution notice come first.
 */
export function AppLayout() {
  const { progress } = useProgress()
  const { pathname } = useLocation()

  if (!progress && pathname !== '/') return <Navigate to="/" replace />

  return (
    <div className={progress ? styles.withNav : undefined}>
      <Outlet />
      {progress && <BottomNav />}
    </div>
  )
}
