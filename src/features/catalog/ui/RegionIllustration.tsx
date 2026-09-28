import { useEffect, useRef, useState } from 'react'
import { Arrow } from '@/shared/ui/Arrow'
import { Illustration } from '@/shared/ui/Illustration'
import { Marker } from '@/shared/ui/Marker'
import { SideLabels } from '@/shared/ui/SideLabels'
import type { Point, Region } from '../domain/model'
import { PointCard } from './PointCard'

type Props = {
  region: Region
  points: Point[]
}

/** Seconds between the breathing phases of consecutive markers. */
const PHASE_STEP = 0.7

/**
 * A region's illustration with all its points. A mouse shows the card while hovering
 * a marker (and pins it on click); a touch opens it as a bottom panel. Tapping
 * outside, pressing Escape or choosing another point closes it.
 */
export function RegionIllustration({ region, points }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [pinnedWithMouse, setPinnedWithMouse] = useState(false)
  const lastPointer = useRef<string>('')

  useEffect(() => {
    if (!selectedId) return
    const closeOnOutside = (event: PointerEvent) => {
      const target = event.target as Element | null
      if (target?.closest('[role="dialog"], button[aria-pressed]')) return
      setSelectedId(null)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedId(null)
    }
    document.addEventListener('pointerdown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [selectedId])

  const shownId = selectedId ?? hoveredId
  const shown = points.find((point) => point.id === shownId)
  const variant = selectedId && !pinnedWithMouse ? 'sheet' : 'floating'
  const close = () => setSelectedId(null)

  const select = (id: string) => {
    setPinnedWithMouse(lastPointer.current === 'mouse')
    setSelectedId((current) => (current === id ? null : id))
  }

  return (
    <>
      <Illustration
        src={region.image}
        width={region.width}
        height={region.height}
        alt={region.name}
        overlay={
          <>
            <SideLabels />
            {points.map((point, index) => (
              <Marker
                key={point.id}
                x={point.x}
                y={point.y}
                tone={point.side}
                phase={index * PHASE_STEP}
                label={point.meaning}
                state={!shownId ? 'rest' : point.id === shownId ? 'active' : 'dimmed'}
                onPointerDown={(event) => {
                  lastPointer.current = event.pointerType
                }}
                onPointerEnter={(event) => {
                  if (event.pointerType === 'mouse') setHoveredId(point.id)
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === 'mouse') setHoveredId(null)
                }}
                onClick={() => select(point.id)}
              />
            ))}
            {shown && variant === 'floating' && (
              <PointCard
                point={shown}
                regionName={region.name}
                variant="floating"
                onClose={selectedId ? close : undefined}
              />
            )}
          </>
        }
      >
        {points.map(
          (point) =>
            point.arrow && (
              <Arrow
                key={point.id}
                from={point.arrow.from}
                to={point.arrow.to}
                ratio={region.width / region.height}
              />
            ),
        )}
      </Illustration>
      {shown && variant === 'sheet' && (
        <PointCard point={shown} regionName={region.name} variant="sheet" onClose={close} />
      )}
    </>
  )
}
