import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { PointCard, useCatalog } from '@/features/catalog'
import { summarizeProgress } from '../domain/summary'
import styles from './ProgressScreen.module.css'
import { useProgress } from './useProgress'

/** "28 sept", with the year only when it is not the current one. */
function shortDate(iso: string): string {
  const date = new Date(iso)
  const sameYear = date.getFullYear() === new Date().getFullYear()
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  }).format(date)
}

/** What the person has practised, by region and by point. Data only: no mastery rule yet. */
export function ProgressScreen() {
  const { t } = useTranslation()
  const state = useCatalog()
  const { progress } = useProgress()
  const [openId, setOpenId] = useState<string | null>(null)

  // The card closes when tapping outside it or its list, or with Escape.
  useEffect(() => {
    if (!openId) return
    const closeOnOutside = (event: PointerEvent) => {
      if ((event.target as Element | null)?.closest('[role="dialog"], [data-progress-row]')) return
      setOpenId(null)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenId(null)
    }
    document.addEventListener('pointerdown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [openId])

  if (state.status !== 'ready') {
    return (
      <main className={styles.screen}>
        <p className={styles.notice}>
          {t(state.status === 'loading' ? 'regionScreen.loading' : 'regionScreen.loadError')}
        </p>
      </main>
    )
  }

  const { regions, points } = state.catalog
  const summaries = summarizeProgress(progress, points)
  const answered = summaries.some((region) => region.practiced > 0)
  const regionName = (id: string) => regions.find((region) => region.id === id)?.name ?? ''
  const open = points.find((point) => point.id === openId)

  return (
    <main className={styles.screen}>
      <h1 className={styles.title}>{t('progressScreen.title')}</h1>
      {progress?.alias && <p className={styles.alias}>{progress.alias}</p>}

      {!answered && (
        <p className={styles.notice}>
          {t('progressScreen.empty')} <Link to="/practice">{t('progressScreen.goPractice')}</Link>
        </p>
      )}

      {summaries.map((region) => (
        <section key={region.regionId} className={styles.region}>
          <h2 className={styles.regionTitle}>
            {regionName(region.regionId)}
            <span className={styles.practiced}>
              {t('progressScreen.practiced', {
                practiced: region.practiced,
                total: region.total,
              })}
            </span>
          </h2>
          <ul className={styles.list}>
            {region.points.map((summary) => (
              <li key={summary.point.id}>
                <button
                  type="button"
                  className={styles.row}
                  data-progress-row
                  aria-pressed={summary.point.id === openId}
                  onClick={() => setOpenId(summary.point.id)}
                >
                  <span className={styles.side} data-tone={summary.point.side}>
                    {t(`pointCard.side.${summary.point.side}`)}
                  </span>
                  <span className={styles.meaning}>{summary.point.meaning}</span>
                  <span className={styles.stats}>
                    {summary.lastAttempt
                      ? t('progressScreen.stats', {
                          hits: t('practice.hits', { count: summary.hits }),
                          misses: t('practice.misses', { count: summary.misses }),
                          date: shortDate(summary.lastAttempt),
                        })
                      : t('progressScreen.notPracticed')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {open && (
        <PointCard
          point={open}
          regionName={regionName(open.region)}
          variant="sheet"
          onClose={() => setOpenId(null)}
        />
      )}
    </main>
  )
}
