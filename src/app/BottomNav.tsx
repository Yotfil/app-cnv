import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router'
import styles from './BottomNav.module.css'

// Until the map exists (task 5.2) "Study" opens the only region with points.
const STUDY_PATH = '/region/face'

/** Bottom navigation: the way to move around in the installed app, which has no address bar. */
export function BottomNav() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const studying = pathname.startsWith('/map') || pathname.startsWith('/region')

  return (
    <nav className={styles.bar} aria-label={t('nav.label')}>
      <NavLink to={STUDY_PATH} className={styles.item} aria-current={studying ? 'page' : undefined}>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="1.6" />
        </svg>
        {t('nav.study')}
      </NavLink>
      {/* Practice arrives in task 6.3. */}
      <span className={styles.item} aria-disabled="true" data-disabled>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <path d="M8 5.5v13l10-6.5z" />
        </svg>
        {t('nav.practice')}
      </span>
    </nav>
  )
}
