import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import { PointCard, useCatalog, type Catalog, type Region } from '@/features/catalog'
import { Illustration } from '@/shared/ui/Illustration'
import { Marker } from '@/shared/ui/Marker'
import { Orb } from '@/shared/ui/Orb'
import { SideLabels } from '@/shared/ui/SideLabels'
import { isCorrect } from '../domain/question'
import styles from './PracticeScreen.module.css'
import { useSession } from './useSession'

type PracticeRegion = Region & { image: string }

/** A region can be practised once it has its illustration and at least one point. */
function isPracticeable(region: Region, catalog: Catalog): region is PracticeRegion {
  return !!region.image && catalog.points.some((point) => point.region === region.id)
}

/** Practice "what does it mean?": /practice to choose a region, /practice/:key to play. */
export function PracticeScreen() {
  const { t } = useTranslation()
  const { key } = useParams()
  const state = useCatalog()

  if (state.status !== 'ready') {
    return (
      <main className={styles.screen}>
        <p className={styles.message}>
          {t(state.status === 'loading' ? 'regionScreen.loading' : 'regionScreen.loadError')}
        </p>
      </main>
    )
  }

  const { catalog } = state
  if (!key) return <RegionPicker catalog={catalog} />

  const region = catalog.regions.find((candidate) => candidate.key === key)
  if (!region || !isPracticeable(region, catalog)) {
    return (
      <main className={styles.screen}>
        <p className={styles.message}>{t('practice.notAvailable')}</p>
        <Link to="/practice" className={styles.link}>
          {t('practice.otherRegion')}
        </Link>
      </main>
    )
  }

  // A new key starts a new session.
  return <PracticeSession key={region.key} region={region} catalog={catalog} />
}

function RegionPicker({ catalog }: { catalog: Catalog }) {
  const { t } = useTranslation()
  const regions = catalog.regions.filter((region) => region.parent)

  return (
    <main className={styles.screen}>
      <h1 className={styles.title}>{t('practice.pickTitle')}</h1>
      <p className={styles.lead}>{t('practice.pickLead')}</p>
      <ul className={styles.regions}>
        {regions.map((region) => {
          const available = isPracticeable(region, catalog)
          const count = catalog.points.filter((point) => point.region === region.id).length
          const detail = available ? t('map.count', { count }) : t('map.soon')
          return (
            <li key={region.id}>
              {available ? (
                <Link to={`/practice/${region.key}`} className={styles.region}>
                  <Orb tone="center" />
                  <span className={styles.regionName}>{region.name}</span>
                  <span className={styles.regionDetail}>{detail}</span>
                </Link>
              ) : (
                <span className={styles.region} data-muted aria-disabled="true">
                  <Orb tone="center" state="muted" />
                  <span className={styles.regionName}>{region.name}</span>
                  <span className={styles.regionDetail}>{detail}</span>
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </main>
  )
}

function PracticeSession({ region, catalog }: { region: PracticeRegion; catalog: Catalog }) {
  const { t } = useTranslation()
  const session = useSession(region.key, catalog)
  const { question, chosen } = session
  const afterRef = useRef<HTMLDivElement>(null)

  // On a phone the verdict, the card and "Next" sit below the options: bring them into view.
  useEffect(() => {
    if (chosen === undefined) return
    const calm = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    afterRef.current?.scrollIntoView?.({ behavior: calm ? 'auto' : 'smooth', block: 'nearest' })
  }, [chosen])

  if (!question) {
    return (
      <main className={styles.screen}>
        <p className={styles.counter}>{region.name}</p>
        <h1 className={styles.title}>{t('practice.resultTitle')}</h1>
        <p className={styles.result}>
          {t('practice.result', {
            hits: t('practice.hits', { count: session.summary.hits }),
            misses: t('practice.misses', { count: session.summary.misses }),
          })}
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={session.restart}>
            {t('practice.repeat')}
          </button>
          <Link to="/practice" className={styles.link}>
            {t('practice.otherRegion')}
          </Link>
        </div>
      </main>
    )
  }

  const { point } = question
  return (
    <main className={styles.screen}>
      <p className={styles.counter}>
        {t('practice.progress', {
          position: session.progress.position,
          total: session.progress.total,
        })}
      </p>
      <h1 className={styles.title}>{t('practice.title')}</h1>

      <Illustration
        src={region.image}
        width={region.width}
        height={region.height}
        alt={region.name}
        overlay={
          <>
            <SideLabels />
            <Marker
              x={point.x}
              y={point.y}
              tone={point.side}
              state="active"
              label={t('practice.markerLabel')}
            />
          </>
        }
      />

      <ul className={styles.options} aria-label={t('practice.title')}>
        {question.options.map((option) => {
          const right = chosen !== undefined && isCorrect(question, option)
          const wrongPick = chosen === option && !right
          return (
            <li key={option}>
              <button
                type="button"
                className={styles.option}
                data-result={right ? 'correct' : wrongPick ? 'incorrect' : undefined}
                data-answered={chosen !== undefined || undefined}
                disabled={chosen !== undefined}
                onClick={() => session.choose(option)}
              >
                <span className={styles.optionText}>{option}</span>
                {right && (
                  <span className={styles.badge} role="img" aria-label={t('practice.correct')}>
                    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden>
                      <path d="M3.5 8.5l3 3 6-7" />
                    </svg>
                  </span>
                )}
                {wrongPick && (
                  <span className={styles.badge} role="img" aria-label={t('practice.incorrect')}>
                    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden>
                      <path d="M4 4l8 8M12 4l-8 8" />
                    </svg>
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>

      {chosen !== undefined && (
        <div className={styles.after} ref={afterRef}>
          <p
            className={styles.verdict}
            data-correct={session.correct || undefined}
            aria-live="polite"
          >
            {t(session.correct ? 'practice.right' : 'practice.wrong')}
          </p>
          <PointCard point={point} regionName={region.name} variant="inline" />
          <button type="button" className={styles.primary} onClick={session.next}>
            {t(session.isLast ? 'practice.seeResult' : 'practice.next')}
          </button>
        </div>
      )}
    </main>
  )
}
