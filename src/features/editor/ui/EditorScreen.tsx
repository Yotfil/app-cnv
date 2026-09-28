import { useEffect, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useCatalog, type Catalog, type Point, type Region } from '@/features/catalog'
import { Arrow } from '@/shared/ui/Arrow'
import { Illustration } from '@/shared/ui/Illustration'
import { exportCatalog } from '../domain/export'
import styles from './EditorScreen.module.css'

type Coordinate = { x: number; y: number }

/** Coordinates are kept with one decimal: enough precision in percent. */
const round = (value: number) => Math.round(value * 10) / 10
const clamp = (value: number) => Math.min(100, Math.max(0, value))
const toPercent = (x: number, y: number): Coordinate => ({
  x: round(clamp(x)),
  y: round(clamp(y)),
})
/** Step of the keyboard arrows, in percent. */
const STEP = 0.5
/** Minimum corners of a zone. */
const MIN_CORNERS = 3

/** Hidden development tool at /editor: adjust positions, radii and map zones over the real illustrations. */
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

function countChanges<T>(current: T[], original: T[]): number {
  return current.filter((item, index) => JSON.stringify(item) !== JSON.stringify(original[index]))
    .length
}

/** Starts the download of a text file. */
function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

function Editor({ catalog }: { catalog: Catalog }) {
  const { t } = useTranslation()
  const [points, setPoints] = useState(catalog.points)
  const [regions, setRegions] = useState(catalog.regions)
  const editable = regions.filter((region) => region.image)
  const [regionKey, setRegionKey] = useState(
    () =>
      editable.find((region) => catalog.points.some((point) => point.region === region.id))?.key ??
      editable[0]?.key,
  )

  // Changes are counted against the last export (at first, the loaded catalog).
  const [baseline, setBaseline] = useState({ points: catalog.points, regions: catalog.regions })
  const changed = countChanges(points, baseline.points) + countChanges(regions, baseline.regions)

  const onExport = () => {
    const files = exportCatalog(regions, points)
    download('regions.json', files.regions)
    download('points.json', files.points)
    setBaseline({ points, regions })
  }

  // Leaving the page would lose the adjustments that are not exported yet.
  useEffect(() => {
    if (changed === 0) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [changed])

  const region = editable.find((candidate) => candidate.key === regionKey)
  if (!region?.image) return null
  const children = regions.filter((candidate) => candidate.parent === region.id)

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('editor.title')}</h1>
        <label className={styles.field}>
          <span>{t('editor.region')}</span>
          <select value={region.key} onChange={(event) => setRegionKey(event.target.value)}>
            {editable.map((candidate) => (
              <option key={candidate.id} value={candidate.key}>
                {candidate.name}
              </option>
            ))}
          </select>
        </label>
        <p className={styles.changes} role="status">
          {t('editor.changes', { count: changed })}
        </p>
        <button type="button" className={styles.export} onClick={onExport}>
          {t('editor.export')}
        </button>
      </header>

      {children.length > 0 ? (
        <ZonesEditor
          key={region.id}
          map={{ ...region, image: region.image }}
          zones={children}
          onZone={(id, zone) =>
            setRegions((current) =>
              current.map((candidate) =>
                candidate.id === id ? { ...candidate, zone } : candidate,
              ),
            )
          }
        />
      ) : (
        <PointsEditor
          key={region.id}
          region={{ ...region, image: region.image }}
          points={points.filter((point) => point.region === region.id)}
          onChange={(id, patch) =>
            setPoints((current) =>
              current.map((point) => (point.id === id ? { ...point, ...patch(point) } : point)),
            )
          }
        />
      )}
    </main>
  )
}

type DragHandleProps = {
  at: Coordinate
  label: string
  selected: boolean
  onSelect: () => void
  onMove: (to: Coordinate) => void
}

/** A marker that can be dragged with a pointer or moved with the keyboard arrows. */
function DragHandle({ at, label, selected, onSelect, onMove }: DragHandleProps) {
  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    onSelect()
  }

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    const frame = event.currentTarget.parentElement?.getBoundingClientRect()
    if (!frame) return
    onMove(
      toPercent(
        ((event.clientX - frame.left) / frame.width) * 100,
        ((event.clientY - frame.top) / frame.height) * 100,
      ),
    )
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-STEP, 0],
      ArrowRight: [STEP, 0],
      ArrowUp: [0, -STEP],
      ArrowDown: [0, STEP],
    }
    const move = delta[event.key]
    if (!move) return
    event.preventDefault()
    onMove(toPercent(at.x + move[0], at.y + move[1]))
  }

  return (
    <button
      type="button"
      className={styles.handle}
      data-selected={selected || undefined}
      style={{ left: `${at.x}%`, top: `${at.y}%` }}
      aria-label={label}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onKeyDown={onKeyDown}
      onFocus={onSelect}
    />
  )
}

type PointsEditorProps = {
  region: Region & { image: string }
  points: Point[]
  onChange: (id: string, patch: (point: Point) => Partial<Point>) => void
}

/** Moves points and adjusts their hit radius. */
function PointsEditor({ region, points, onChange }: PointsEditorProps) {
  const { t } = useTranslation()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const ratio = region.width / region.height
  const selected = points.find((point) => point.id === selectedId)

  // Moving a point carries the start of its gesture arrow when the arrow starts on it.
  const moveTo = (id: string, to: Coordinate) =>
    onChange(id, (point) => {
      const arrowOnPoint =
        point.arrow && point.arrow.from.x === point.x && point.arrow.from.y === point.y
      return arrowOnPoint && point.arrow ? { ...to, arrow: { ...point.arrow, from: to } } : to
    })

  return (
    <div className={styles.layout}>
      <div className={styles.canvas}>
        <Illustration
          src={region.image}
          width={region.width}
          height={region.height}
          alt={region.name}
          overlay={points.map((point) => (
            <DragHandle
              key={point.id}
              at={point}
              label={point.key}
              selected={point.id === selectedId}
              onSelect={() => setSelectedId(point.id)}
              onMove={(to) => moveTo(point.id, to)}
            />
          ))}
        >
          {points.map(
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
          {points.map((point) => (
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
          {points.map((point) => (
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
                onChange={(x) => moveTo(selected.id, toPercent(x, selected.y))}
              />
              <NumberField
                label="y"
                value={selected.y}
                onChange={(y) => moveTo(selected.id, toPercent(selected.x, y))}
              />
              <NumberField
                label={t('editor.radius')}
                value={selected.radius}
                min={0.5}
                max={20}
                onChange={(radius) => onChange(selected.id, () => ({ radius: round(radius) }))}
              />
            </div>
            <p className={styles.hint}>{t('editor.hint')}</p>
          </section>
        )}
      </aside>
    </div>
  )
}

type ZonesEditorProps = {
  map: Region & { image: string }
  /** Child regions of the map, each with its zone (or none yet). */
  zones: Region[]
  onZone: (regionId: string, zone: Coordinate[]) => void
}

/** Adjusts, on a full-body map, the polygon that opens each child region. */
function ZonesEditor({ map, zones: children, onZone }: ZonesEditorProps) {
  const { t } = useTranslation()
  const [selectedId, setSelectedId] = useState<string | null>(children[0]?.id ?? null)
  const [corner, setCorner] = useState(0)
  const selected = children.find((region) => region.id === selectedId)
  const zone = selected?.zone ?? []

  const moveCorner = (index: number, to: Coordinate) =>
    selected &&
    onZone(
      selected.id,
      zone.map((point, i) => (i === index ? to : point)),
    )

  // A new corner halfway along the side that leaves the selected one.
  const addCorner = () => {
    if (!selected || zone.length === 0) return
    const a = zone[corner]
    const b = zone[(corner + 1) % zone.length]
    const middle = toPercent((a.x + b.x) / 2, (a.y + b.y) / 2)
    onZone(selected.id, [...zone.slice(0, corner + 1), middle, ...zone.slice(corner + 1)])
    setCorner(corner + 1)
  }

  const removeCorner = () => {
    if (!selected || zone.length <= MIN_CORNERS) return
    onZone(
      selected.id,
      zone.filter((_, i) => i !== corner),
    )
    setCorner(Math.max(0, corner - 1))
  }

  // A starting rectangle in the centre, to be adjusted.
  const createZone = (region: Region) =>
    onZone(region.id, [
      { x: 40, y: 40 },
      { x: 60, y: 40 },
      { x: 60, y: 60 },
      { x: 40, y: 60 },
    ])

  return (
    <div className={styles.layout}>
      <div className={styles.canvas}>
        <Illustration
          src={map.image}
          width={map.width}
          height={map.height}
          alt={map.name}
          overlay={zone.map((point, index) => (
            <DragHandle
              key={index}
              at={point}
              label={t('editor.corner', { number: index + 1 })}
              selected={index === corner}
              onSelect={() => setCorner(index)}
              onMove={(to) => moveCorner(index, to)}
            />
          ))}
        >
          {children.map(
            (region) =>
              region.zone && (
                <polygon
                  key={region.id}
                  className={styles.zone}
                  data-selected={region.id === selectedId || undefined}
                  points={region.zone.map((point) => `${point.x},${point.y}`).join(' ')}
                  vectorEffect="non-scaling-stroke"
                />
              ),
          )}
        </Illustration>
      </div>

      <aside className={styles.panel}>
        <ul className={styles.list} aria-label={t('editor.zones')}>
          {children.map((region) => (
            <li key={region.id}>
              <button
                type="button"
                className={styles.item}
                aria-pressed={region.id === selectedId}
                onClick={() => {
                  setSelectedId(region.id)
                  setCorner(0)
                }}
              >
                <span>{region.name}</span>
                <span className={styles.coords}>
                  {region.zone
                    ? t('editor.corners', { count: region.zone.length })
                    : t('editor.noZone')}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {selected && (
          <section className={styles.detail} aria-label={selected.name}>
            {selected.zone ? (
              <>
                <div className={styles.fields}>
                  <NumberField
                    label={t('editor.cornerX', { number: corner + 1 })}
                    value={zone[corner]?.x ?? 0}
                    onChange={(x) => moveCorner(corner, toPercent(x, zone[corner].y))}
                  />
                  <NumberField
                    label={t('editor.cornerY', { number: corner + 1 })}
                    value={zone[corner]?.y ?? 0}
                    onChange={(y) => moveCorner(corner, toPercent(zone[corner].x, y))}
                  />
                </div>
                <div className={styles.buttons}>
                  <button type="button" className={styles.button} onClick={addCorner}>
                    {t('editor.addCorner')}
                  </button>
                  <button
                    type="button"
                    className={styles.button}
                    onClick={removeCorner}
                    disabled={zone.length <= MIN_CORNERS}
                  >
                    {t('editor.removeCorner')}
                  </button>
                </div>
                <p className={styles.hint}>{t('editor.zoneHint')}</p>
              </>
            ) : (
              <button type="button" className={styles.button} onClick={() => createZone(selected)}>
                {t('editor.createZone')}
              </button>
            )}
          </section>
        )}
      </aside>
    </div>
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
