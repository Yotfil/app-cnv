import { useEffect, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useCatalog, type Catalog, type Point } from '@/features/catalog'
import { Arrow } from '@/shared/ui/Arrow'
import { Illustration } from '@/shared/ui/Illustration'
import styles from './EditorScreen.module.css'

/** Coordinates are kept with one decimal: enough precision in percent. */
const round = (value: number) => Math.round(value * 10) / 10
const clamp = (value: number) => Math.min(100, Math.max(0, value))
/** Step of the keyboard arrows, in percent. */
const STEP = 0.5

/** Hidden development tool at /editor: adjust positions and radii over the real illustrations. */
export function EditorScreen() {
  const { t } = useTranslation()
  const state = useCatalog()

  if (state.status !== 'ready') {
    return (
      <main className={styles.screen}>
        <p>{t(state.status === 'loading' ? 'regionScreen.loading' : 'regionScreen.loadError')}</p>
      </main>
    )
  }
  return <Editor catalog={state.catalog} />
}

function Editor({ catalog }: { catalog: Catalog }) {
  const { t } = useTranslation()
  const [points, setPoints] = useState(catalog.points)
  const regions = catalog.regions.filter((region) => region.image)
  const [regionKey, setRegionKey] = useState(
    () =>
      regions.find((region) => catalog.points.some((point) => point.region === region.id))?.key ??
      regions[0]?.key,
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const changed = points.filter(
    (point, index) => JSON.stringify(point) !== JSON.stringify(catalog.points[index]),
  ).length

  // Leaving the page would lose the adjustments that are not exported yet.
  useEffect(() => {
    if (changed === 0) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [changed])

  const region = regions.find((candidate) => candidate.key === regionKey)
  if (!region?.image) return null
  const ratio = region.width / region.height
  const regionPoints = points.filter((point) => point.region === region.id)
  const selected = regionPoints.find((point) => point.id === selectedId)

  const update = (id: string, patch: (point: Point) => Partial<Point>) =>
    setPoints((current) =>
      current.map((point) => (point.id === id ? { ...point, ...patch(point) } : point)),
    )

  // Moving a point carries the start of its gesture arrow when the arrow starts on it.
  const moveTo = (id: string, x: number, y: number) =>
    update(id, (point) => {
      const next = { x: round(clamp(x)), y: round(clamp(y)) }
      const arrowOnPoint =
        point.arrow && point.arrow.from.x === point.x && point.arrow.from.y === point.y
      return arrowOnPoint && point.arrow ? { ...next, arrow: { ...point.arrow, from: next } } : next
    })

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>, id: string) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setSelectedId(id)
  }

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>, id: string) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    const frame = event.currentTarget.parentElement?.getBoundingClientRect()
    if (!frame) return
    moveTo(
      id,
      ((event.clientX - frame.left) / frame.width) * 100,
      ((event.clientY - frame.top) / frame.height) * 100,
    )
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, point: Point) => {
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-STEP, 0],
      ArrowRight: [STEP, 0],
      ArrowUp: [0, -STEP],
      ArrowDown: [0, STEP],
    }
    const move = delta[event.key]
    if (!move) return
    event.preventDefault()
    moveTo(point.id, point.x + move[0], point.y + move[1])
  }

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('editor.title')}</h1>
        <label className={styles.field}>
          <span>{t('editor.region')}</span>
          <select
            value={region.key}
            onChange={(event) => {
              setRegionKey(event.target.value)
              setSelectedId(null)
            }}
          >
            {regions.map((candidate) => (
              <option key={candidate.id} value={candidate.key}>
                {candidate.name}
              </option>
            ))}
          </select>
        </label>
        <p className={styles.changes} role="status">
          {t('editor.changes', { count: changed })}
        </p>
      </header>

      <div className={styles.layout}>
        <div className={styles.canvas}>
          <Illustration
            src={region.image}
            width={region.width}
            height={region.height}
            alt={region.name}
            overlay={regionPoints.map((point) => (
              <button
                key={point.id}
                type="button"
                className={styles.handle}
                data-selected={point.id === selectedId || undefined}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                aria-label={point.key}
                onPointerDown={(event) => onPointerDown(event, point.id)}
                onPointerMove={(event) => onPointerMove(event, point.id)}
                onKeyDown={(event) => onKeyDown(event, point)}
                onFocus={() => setSelectedId(point.id)}
              />
            ))}
          >
            {regionPoints.map(
              (point) =>
                point.arrow && (
                  <Arrow
                    key={`arrow-${point.id}`}
                    from={point.arrow.from}
                    to={point.arrow.to}
                    ratio={ratio}
                  />
                ),
            )}
            {regionPoints.map((point) => (
              <ellipse
                key={point.id}
                className={styles.radius}
                data-selected={point.id === selectedId || undefined}
                cx={point.x}
                cy={point.y}
                // radius is in percent of the width; in the stretched layer y is percent of the height.
                rx={point.radius}
                ry={point.radius * ratio}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </Illustration>
        </div>

        <aside className={styles.panel}>
          <ul className={styles.list} aria-label={t('editor.points')}>
            {regionPoints.map((point) => (
              <li key={point.id}>
                <button
                  type="button"
                  className={styles.item}
                  aria-pressed={point.id === selectedId}
                  onClick={() => setSelectedId(point.id)}
                >
                  <span>{point.key}</span>
                  <span className={styles.coords}>
                    {t('editor.coords', { x: point.x, y: point.y })}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {selected && (
            <section className={styles.detail} aria-label={selected.key}>
              <p className={styles.meaning}>{selected.meaning}</p>
              <div className={styles.fields}>
                <NumberField
                  label="x"
                  value={selected.x}
                  onChange={(x) => moveTo(selected.id, x, selected.y)}
                />
                <NumberField
                  label="y"
                  value={selected.y}
                  onChange={(y) => moveTo(selected.id, selected.x, y)}
                />
                <NumberField
                  label={t('editor.radius')}
                  value={selected.radius}
                  min={0.5}
                  max={20}
                  onChange={(radius) => update(selected.id, () => ({ radius: round(radius) }))}
                />
              </div>
              <p className={styles.hint}>{t('editor.hint')}</p>
            </section>
          )}
        </aside>
      </div>
    </main>
  )
}

type NumberFieldProps = {
  label: string
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
}

function NumberField({ label, value, min = 0, max = 100, onChange }: NumberFieldProps) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input
        type="number"
        inputMode="decimal"
        step={STEP}
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          const next = event.target.valueAsNumber
          if (!Number.isNaN(next)) onChange(Math.min(max, Math.max(min, next)))
        }}
      />
    </label>
  )
}
