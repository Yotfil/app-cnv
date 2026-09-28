import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import type { Point } from '../domain/model'
import styles from './PointCard.module.css'

type Props = {
  point: Point
  /** Name of the region the point belongs to, shown in the header ("Cara"). */
  regionName: string
  /**
   * sheet: bottom panel on touch screens · floating: card next to the marker with a pointer ·
   * inline: part of the page flow (after answering in practice).
   */
  variant: 'sheet' | 'floating' | 'inline'
  onClose?: () => void
}

/** Card with the information of a point: side, literal meaning and what else the PDF gives. */
export function PointCard({ point, regionName, variant, onClose }: Props) {
  const { t } = useTranslation()

  // The floating card sits beside the marker, on the side with more room, so it never covers it.
  const position: CSSProperties | undefined =
    variant === 'floating'
      ? {
          top: `${point.y}%`,
          ...(point.x <= 50 ? { left: `${point.x}%` } : { right: `${100 - point.x}%` }),
        }
      : undefined

  return (
    <section
      role={variant === 'inline' ? 'region' : 'dialog'}
      aria-label={t('pointCard.label')}
      className={styles.card}
      data-variant={variant}
      data-tone={point.side}
      data-placement={point.x <= 50 ? 'right' : 'left'}
      data-interactive
      style={position}
    >
      {variant === 'sheet' && <span className={styles.handle} aria-hidden />}
      <header className={styles.header}>
        <p className={styles.label}>
          {t('pointCard.header', { side: t(`pointCard.side.${point.side}`), region: regionName })}
        </p>
        {onClose && (
          <button
            type="button"
            className={styles.close}
            aria-label={t('pointCard.close')}
            onClick={onClose}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        )}
      </header>
      <p className={styles.secondary}>{t(`pointCard.sidePerson.${point.side}`)}</p>
      <blockquote className={styles.meaning}>{point.meaning}</blockquote>
      {point.alternativeMeanings.map((text) => (
        <div key={text} className={styles.alternative}>
          <p className={styles.also}>{t('pointCard.also')}</p>
          <blockquote className={styles.meaning}>{text}</blockquote>
        </div>
      ))}
      {point.gesture && <p className={styles.detail}>{point.gesture}</p>}
      {point.muscle && (
        <p className={styles.detail}>{t('pointCard.muscle', { name: point.muscle })}</p>
      )}
      {point.tags.length > 0 && (
        <p className={styles.detail}>
          {point.tags.map((tag) => t(`pointCard.tags.${tag}`)).join(' · ')}
        </p>
      )}
      <p className={styles.page}>{t('pointCard.page', { page: point.page })}</p>
    </section>
  )
}
