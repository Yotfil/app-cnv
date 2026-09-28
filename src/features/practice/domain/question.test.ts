import { describe, expect, it } from 'vitest'
import type { Point } from '@/features/catalog'
import { generateQuestion, isCorrect } from './question'

// Face points from public/data/points.json (láminas 3, 4 and 13 of the PDF).
const FACE = 'ccc312f7-a916-4eb8-92dd-e8ad201454eb'

function point(
  key: string,
  side: Point['side'],
  meaning: string,
  extra: Partial<Point> = {},
): Point {
  return {
    id: `id-${key}`,
    key,
    region: FACE,
    side,
    x: 50,
    y: 50,
    radius: 4,
    meaning,
    alternativeMeanings: [],
    tags: [],
    page: 4,
    ...extra,
  }
}

const cheekRight = point(
  'cheek-right',
  'right',
  'Queremos morder al otro, el otro nos molesta, nos pone nervioso, nos saca de las casillas.',
)
const cheekLeft = point(
  'cheek-left',
  'left',
  'Aquí la agresividad es autodirigida, hacia uno mismo y sus propios actos. Suele suceder cuando repetimos errores.',
)
const belowLip = point('below-lip', 'center', 'Duda.')
const glabella = point('glabella', 'center', 'Necesito indagar', { page: 3 })
const foreheadTop = point('forehead-top', 'center', 'Reflexiono', { page: 3 })
const face = [cheekRight, cheekLeft, belowLip, glabella, foreheadTop]

/** Deterministic stand-in for Math.random. */
const fixedRandom = () => 0.42

describe('generateQuestion', () => {
  it('offers the right meaning and three distractors from the same region, the symmetric point among them', () => {
    const question = generateQuestion(cheekRight, face, fixedRandom)

    const distractors = question.options.filter((option) => option !== cheekRight.meaning)
    expect(question.options).toHaveLength(4)
    expect(question.options).toContain(cheekRight.meaning)
    expect(distractors).toContain(cheekLeft.meaning)
    for (const text of distractors) {
      expect(face.map((candidate) => candidate.meaning)).toContain(text)
    }
  })

  it('completes the distractors with points from other regions when the region has few', () => {
    // Placeholder texts, not from the PDF: they only stand for "any other region".
    const otherRegion = [
      point('other-a', 'left', 'Texto de prueba de otra región A', { region: 'other-region' }),
      point('other-b', 'right', 'Texto de prueba de otra región B', { region: 'other-region' }),
    ]

    const question = generateQuestion(belowLip, [belowLip, glabella, ...otherRegion], fixedRandom)

    expect([...question.options].sort()).toEqual(
      [belowLip.meaning, glabella.meaning, ...otherRegion.map((p) => p.meaning)].sort(),
    )
  })

  it('never offers as a distractor a text equal to the right meaning', () => {
    // The spec's example: the same text on the sternum and on the right hip.
    const sternum = point('sternum', 'center', 'Necesidad de tomar/estar en su sitio')
    const hipRight = point('hip-right', 'right', 'Necesidad de tomar/estar en su sitio')

    const question = generateQuestion(sternum, [sternum, hipRight, ...face], fixedRandom)

    expect(question.options.filter((option) => option === sternum.meaning)).toHaveLength(1)
    expect(new Set(question.options).size).toBe(4)
  })

  it('accepts an alternative meaning as right and never offers it as a distractor', () => {
    const larynx = point('larynx', 'center', 'CON ESI- Me pone nervioso, posición altiva.', {
      alternativeMeanings: ['ASI- algo escondido me hace dudar'],
    })
    // Another point whose text is the larynx's alternative meaning.
    const sameAsAlternative = point('neck-base', 'center', 'ASI- algo escondido me hace dudar')

    const question = generateQuestion(larynx, [larynx, sameAsAlternative, ...face], fixedRandom)

    expect(question.options).not.toContain('ASI- algo escondido me hace dudar')
    expect(isCorrect(question, 'ASI- algo escondido me hace dudar')).toBe(true)
    expect(isCorrect(question, larynx.meaning)).toBe(true)
    expect(isCorrect(question, 'Duda.')).toBe(false)
  })
})
