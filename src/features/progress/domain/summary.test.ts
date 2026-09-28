import { describe, expect, it } from 'vitest'
import type { Point } from '@/features/catalog'
import type { Progress } from './model'
import { summarizeProgress } from './summary'

const FACE = 'ccc312f7-a916-4eb8-92dd-e8ad201454eb'

function point(key: string, meaning: string): Point {
  return {
    id: `id-${key}`,
    key,
    region: FACE,
    side: 'center',
    x: 50,
    y: 50,
    radius: 4,
    meaning,
    alternativeMeanings: [],
    tags: [],
    page: 3,
  }
}

// Catalog order, texts of lámina 3 of the PDF.
const foreheadTop = point('forehead-top', 'Reflexiono')
const glabella = point('glabella', 'Necesito indagar')
const face = [foreheadTop, glabella]

describe('summarizeProgress', () => {
  it('lists every point of a region as not practised when there is no progress yet', () => {
    expect(summarizeProgress(null, face)).toEqual([
      {
        regionId: FACE,
        practiced: 0,
        total: 2,
        points: [
          { point: foreheadTop, hits: 0, misses: 0, lastAttempt: null },
          { point: glabella, hits: 0, misses: 0, lastAttempt: null },
        ],
      },
    ])
  })

  it('counts the practised points of a region and shows their hits, misses and last attempt', () => {
    const progress: Progress = {
      version: 1,
      alias: 'Ana',
      userId: null,
      createdAt: '2026-09-20T08:00:00.000Z',
      points: {
        [glabella.id]: {
          hits: 2,
          misses: 1,
          lastAttempt: '2026-09-28T10:00:00.000Z',
          mode: 'meaning',
        },
      },
    }

    const [cara] = summarizeProgress(progress, face)

    expect(cara.practiced).toBe(1)
    expect(cara.total).toBe(2)
    expect(cara.points).toEqual([
      { point: foreheadTop, hits: 0, misses: 0, lastAttempt: null },
      { point: glabella, hits: 2, misses: 1, lastAttempt: '2026-09-28T10:00:00.000Z' },
    ])
  })

  it('ignores progress of a point that is no longer in the catalog, without changing it', () => {
    const retired = 'id-retired-point'
    const progress: Progress = {
      version: 1,
      alias: null,
      userId: null,
      createdAt: '2026-09-20T08:00:00.000Z',
      points: {
        [retired]: { hits: 5, misses: 0, lastAttempt: '2026-09-21T09:00:00.000Z', mode: 'meaning' },
      },
    }
    const saved = structuredClone(progress)

    const [cara] = summarizeProgress(progress, face)

    expect(cara.practiced).toBe(0)
    expect(cara.points.map((summary) => summary.point.id)).toEqual([foreheadTop.id, glabella.id])
    expect(progress).toEqual(saved)
  })
})
