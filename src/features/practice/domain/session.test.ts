import { describe, expect, it } from 'vitest'
import type { Catalog, Point, Region } from '@/features/catalog'
import { isCorrect } from './question'
import { answer, createSession, current, next, progress, summary } from './session'

const face: Region = {
  id: 'ccc312f7-a916-4eb8-92dd-e8ad201454eb',
  key: 'face',
  name: 'Cara',
  view: 'front',
  image: '/img/face.png',
  width: 1024,
  height: 1024,
  mirror: false,
}

function point(key: string, meaning: string, region = face.id): Point {
  return {
    id: `id-${key}`,
    key,
    region,
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

// Texts of láminas 3 and 4 of the PDF.
const facePoints = [
  point('forehead-top', 'Reflexiono'),
  point('glabella', 'Necesito indagar'),
  point('below-lip', 'Duda.'),
]
// Placeholder text, not from the PDF: a point of another region that must stay out.
const elsewhere = point('elsewhere', 'Texto de prueba de otra región', 'other-region')
const catalog: Catalog = {
  regions: [face],
  points: [...facePoints, elsewhere],
  invalidPoints: [],
}

/** Deterministic stand-in for Math.random. */
const fixedRandom = () => 0.42

describe('createSession', () => {
  it('goes through every point of the region once, showing its position', () => {
    let session = createSession('face', catalog, fixedRandom)
    const seen: string[] = []
    const positions: string[] = []

    for (let question = current(session); question; question = current(session)) {
      seen.push(question.point.key)
      const { position, total } = progress(session)
      positions.push(`${position} de ${total}`)
      session = next(answer(session, question.point.meaning))
    }

    expect([...seen].sort()).toEqual(['below-lip', 'forehead-top', 'glabella'])
    expect(positions).toEqual(['1 de 3', '2 de 3', '3 de 3'])
  })

  it('sums up hits and misses when every point has been answered', () => {
    let session = createSession('face', catalog, fixedRandom)
    const answerRight = [true, false, true]

    for (const right of answerRight) {
      const question = current(session)!
      const option = question.options.find((text) => isCorrect(question, text) === right)!
      session = next(answer(session, option))
    }

    expect(current(session)).toBeUndefined()
    expect(summary(session)).toEqual({ hits: 2, misses: 1 })
  })
})
