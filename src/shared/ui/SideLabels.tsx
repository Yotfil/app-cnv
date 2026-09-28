import { useTranslation } from 'react-i18next'
import styles from './SideLabels.module.css'

/**
 * Fixed reminder that the figure faces the viewer: the person's right side is on
 * the left of the screen. Placed in the overlay of an Illustration.
 */
export function SideLabels() {
  const { t } = useTranslation()
  return (
    <>
      <span className={`${styles.label} ${styles.start}`}>{t('sideLabels.personRight')}</span>
      <span className={`${styles.label} ${styles.end}`}>{t('sideLabels.personLeft')}</span>
    </>
  )
}
