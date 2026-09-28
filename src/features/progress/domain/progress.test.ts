import { describe, expect, it } from 'vitest'
import { createMemoryStore } from '@/shared/lib/storage/memoryStore'
import type { Progress } from './model'
import { clearProgress, recordAnswer } from './progress'

// Point ids from public/data/points.json.
const glabella = '9655f726-9282-47cd-93e1-e8d3a3f0382f'
const larynx = 'fbb37b6d-8ade-42f1-837b-ef646fd646ab'

describe('progress', () => {
  it('records a hit for a point in a new document', () => {
    const store = createMemoryStore<Progress>()

    recordAnswer(store, glabella, 'meaning', true, new Date('2026-09-28T10:00:00.000Z'))

    expect(store.read()).toEqual({
      version: 1,
      alias: null,
      userId: null,
      createdAt: '2026-09-28T10:00:00.000Z',
      points: {
        [glabella]: {
          hits: 1,
          misses: 0,
          lastAttempt: '2026-09-28T10:00:00.000Z',
          mode: 'meaning',
        },
      },
    })
  })

  it('adds a miss to the counters of a point already answered', () => {
    const store = createMemoryStore<Progress>()
    recordAnswer(store, glabella, 'meaning', true, new Date('2026-09-28T10:00:00.000Z'))

    recordAnswer(store, glabella, 'meaning', false, new Date('2026-09-28T10:05:00.000Z'))

    expect(store.read()?.points[glabella]).toEqual({
      hits: 1,
      misses: 1,
      lastAttempt: '2026-09-28T10:05:00.000Z',
      mode: 'meaning',
    })
  })

  it('keeps what a previous session saved: alias, creation date and other points', () => {
    const saved: Progress = {
      version: 1,
      alias: 'Ana',
      userId: null,
      createdAt: '2026-09-20T08:00:00.000Z',
      points: {
        [larynx]: { hits: 2, misses: 3, lastAttempt: '2026-09-20T08:10:00.000Z', mode: 'meaning' },
      },
    }
    const store = createMemoryStore<Progress>(saved)

    recordAnswer(store, glabella, 'meaning', true, new Date('2026-09-28T10:00:00.000Z'))

    expect(store.read()).toEqual({
      ...saved,
      points: {
        ...saved.points,
        [glabella]: {
          hits: 1,
          misses: 0,
          lastAttempt: '2026-09-28T10:00:00.000Z',
          mode: 'meaning',
        },
      },
    })
  })

  it('clears the document so the device is back to a first visit', () => {
    const store = createMemoryStore<Progress>()
    recordAnswer(store, glabella, 'meaning', true, new Date('2026-09-28T10:00:00.000Z'))

    clearProgress(store)

    expect(store.read()).toBeNull()
  })
})
