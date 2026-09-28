import { useTranslation } from 'react-i18next'
import styles from './ErrorScreen.module.css'

export function ErrorScreen() {
  const { t } = useTranslation()
  return (
    <main className={styles.screen} role="alert">
      <h1 className={styles.title}>{t('error.title')}</h1>
      <p className={styles.message}>{t('error.message')}</p>
      <button className={styles.button} type="button" onClick={() => window.location.reload()}>
        {t('error.reload')}
      </button>
    </main>
  )
}
