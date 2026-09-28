import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router'
import styles from './BottomNav.module.css'
import { STUDY_PATH } from './paths'

/** Bottom navigation: the way to move around in the installed app, which has no address bar. */
export function BottomNav() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const studying = pathname.startsWith('/map') || pathname.startsWith('/region')

  return (
    <nav className={styles.bar} aria-label={t('nav.label')}>
      <NavLink to="/" end className={styles.item}>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <path d="M4.5 11 12 4.5l7.5 6.5v8.5h-5v-5h-5v5h-5z" />
        </svg>
        {t('nav.home')}
      </NavLink>
      <NavLink to={STUDY_PATH} className={styles.item} aria-current={studying ? 'page' : undefined}>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="1.6" />
        </svg>
        {t('nav.study')}
      </NavLink>
      <NavLink to="/practice" className={styles.item}>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <path d="M8 5.5v13l10-6.5z" />
        </svg>
        {t('nav.practice')}
      </NavLink>
      <NavLink to="/progress" className={styles.item}>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <path d="M5 19.5v-6M10 19.5v-10M15 19.5v-7M20 19.5V5.5" />
        </svg>
        {t('nav.progress')}
      </NavLink>
    </nav>
  )
}
