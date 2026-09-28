import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import { pointsOfRegion } from '../domain/filter'
import { RegionIllustration } from './RegionIllustration'
import styles from './RegionScreen.module.css'
import { useCatalog } from './useCatalog'

/** Study view of one region: /region/:key. */
export function RegionScreen() {
  const { t } = useTranslation()
  const { key } = useParams()
  const state = useCatalog()

  const back = (
    <Link to="/map" className={styles.back}>
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
        <path d="M10 3L5 8l5 5" />
      </svg>
      {t('regionScreen.backToMap')}
    </Link>
  )

  if (state.status !== 'ready') {
    return (
      <main className={styles.screen}>
        {back}
        <p className={styles.message}>
          {t(state.status === 'loading' ? 'regionScreen.loading' : 'regionScreen.loadError')}
        </p>
      </main>
    )
  }

  const region = state.catalog.regions.find((candidate) => candidate.key === key)
  if (!region) {
    return (
      <main className={styles.screen}>
        {back}
        <p className={styles.message}>{t('regionScreen.notFound')}</p>
      </main>
    )
  }

  if (!region.image) {
    return (
      <main className={styles.screen}>
        {back}
        <h1 className={styles.title}>{region.name}</h1>
        <p className={styles.message}>{t('regionScreen.comingSoon')}</p>
      </main>
    )
  }

  return (
    <main className={styles.screen}>
      {back}
      <h1 className={styles.title}>{region.name}</h1>
      <RegionIllustration
        region={{ ...region, image: region.image }}
        points={pointsOfRegion(state.catalog.points, region.id)}
      />
    </main>
  )
}
