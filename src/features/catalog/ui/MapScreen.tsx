import { useState, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Illustration } from '@/shared/ui/Illustration'
import { Orb } from '@/shared/ui/Orb'
import { pointsOfRegion } from '../domain/filter'
import type { Coordinate, Region } from '../domain/model'
import styles from './MapScreen.module.css'
import { useCatalog } from './useCatalog'

function bounds(zone: Coordinate[]) {
  const xs = zone.map((corner) => corner.x)
  const ys = zone.map((corner) => corner.y)
  const left = Math.min(...xs)
  const top = Math.min(...ys)
  return { left, top, width: Math.max(...xs) - left, height: Math.max(...ys) - top }
}

/** Full-body map: one zone per detail region, with its name and number of points. */
export function MapScreen() {
  const { t } = useTranslation()
  const state = useCatalog()
  const [highlighted, setHighlighted] = useState<string | null>(null)

  if (state.status !== 'ready') {
    return (
      <main className={styles.screen}>
        <p className={styles.message}>
          {t(state.status === 'loading' ? 'regionScreen.loading' : 'regionScreen.loadError')}
        </p>
      </main>
    )
  }

  const { regions, points } = state.catalog
  const map = regions.find((region) => !region.parent)
  if (!map?.image) return null
  const zones = regions.filter(
    (region): region is Region & { zone: Coordinate[] } =>
      region.parent === map.id && !!region.zone,
  )

  return (
    <main className={styles.screen}>
      <h1 className={styles.title}>{map.name}</h1>
      <div className={styles.map} style={{ '--ratio': map.width / map.height } as CSSProperties}>
        <Illustration
          src={map.image}
          width={map.width}
          height={map.height}
          alt={map.name}
          overlay={zones.map((region) => {
            const box = bounds(region.zone)
            const available = !!region.image
            const detail = available
              ? t('map.count', { count: pointsOfRegion(points, region.id).length })
              : t('map.soon')
            const position = {
              left: `${box.left}%`,
              top: `${box.top}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
            }
            const content = (
              <>
                <Orb
                  tone="center"
                  state={!available ? 'muted' : highlighted === region.id ? 'active' : 'rest'}
                />
                <span className={styles.callout} aria-hidden>
                  <svg className={styles.guide} viewBox="0 0 32 20" width="32" height="20">
                    <path d="M0 20 L14 6 H32" />
                  </svg>
                  <span className={styles.tag}>
                    <span className={styles.name}>{region.name}</span>
                    <span className={styles.count}>{detail}</span>
                  </span>
                </span>
              </>
            )

            // A region without illustration keeps its place on the map but does not open.
            if (!available) {
              return (
                <span
                  key={region.id}
                  className={styles.zone}
                  data-muted
                  style={position}
                  role="img"
                  aria-disabled="true"
                  aria-label={`${region.name}, ${detail}`}
                >
                  {content}
                </span>
              )
            }

            return (
              <Link
                key={region.id}
                to={`/region/${region.key}`}
                className={styles.zone}
                data-highlighted={highlighted === region.id || undefined}
                style={position}
                aria-label={`${region.name}, ${detail}`}
                onPointerEnter={() => setHighlighted(region.id)}
                onPointerLeave={() => setHighlighted(null)}
                onFocus={() => setHighlighted(region.id)}
                onBlur={() => setHighlighted(null)}
              >
                {content}
              </Link>
            )
          })}
        >
          {zones.map((region) => (
            <polygon
              key={region.id}
              className={styles.area}
              data-highlighted={highlighted === region.id || undefined}
              data-muted={!region.image || undefined}
              points={region.zone.map((corner) => `${corner.x},${corner.y}`).join(' ')}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </Illustration>
      </div>
    </main>
  )
}
