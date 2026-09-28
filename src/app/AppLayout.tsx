import { Outlet } from 'react-router'
import styles from './AppLayout.module.css'
import { BottomNav } from './BottomNav'

/** Frame shared by every screen: the screen itself and the bottom navigation. */
export function AppLayout() {
  return (
    <div className={styles.layout}>
      <Outlet />
      <BottomNav />
    </div>
  )
}
