import { useTranslation } from 'react-i18next'
import styles from './NotFoundScreen.module.css'

/** Unknown address. Rendered inside the layout, so the bottom bar is always there to leave. */
export function NotFoundScreen() {
  const { t } = useTranslation()
  return (
    <main className={styles.screen}>
      <h1 className={styles.title}>{t('notFound.title')}</h1>
      <p className={styles.message}>{t('notFound.message')}</p>
    </main>
  )
}
