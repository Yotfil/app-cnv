import type { Point } from '@/features/catalog'

/** A point to identify and the texts offered for it, in random order. */
export type Question = {
  point: Point
  options: string[]
}

/** Returns a number in [0, 1), like Math.random; injected so questions can be tested. */
export type Random = () => number

const DISTRACTORS = 3

/** Key without the side suffix: cheek-left and cheek-right share "cheek". */
function baseKey(key: string): string {
  return key.replace(/-(left|right)$/, '')
}

function shuffle<T>(items: T[], random: Random): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** Texts that count as right for a point: its meaning and its alternative meanings. */
function rightTexts(point: Point): string[] {
  return [point.meaning, ...point.alternativeMeanings]
}

/**
 * Builds a "what does it mean?" question for a point. Distractors come first from the
 * symmetric point, then from the same region, then from any region; a text equal to a
 * right one is never a distractor, and no distractor repeats.
 */
export function generateQuestion(point: Point, points: Point[], random: Random): Question {
  const others = points.filter((candidate) => candidate.id !== point.id)
  const symmetric = others.filter(
    (candidate) =>
      candidate.region === point.region &&
      candidate.side !== point.side &&
      baseKey(candidate.key) === baseKey(point.key),
  )
  const sameRegion = shuffle(
    others.filter(
      (candidate) => candidate.region === point.region && !symmetric.includes(candidate),
    ),
    random,
  )
  const anyRegion = shuffle(
    others.filter((candidate) => candidate.region !== point.region),
    random,
  )
  const right = rightTexts(point)
  const distractors = [
    ...new Set(
      [...symmetric, ...sameRegion, ...anyRegion]
        .map((candidate) => candidate.meaning)
        .filter((text) => !right.includes(text)),
    ),
  ].slice(0, DISTRACTORS)
  return { point, options: shuffle([point.meaning, ...distractors], random) }
}

/** An answer is right when it is the point's meaning or one of its alternative meanings. */
export function isCorrect(question: Question, option: string): boolean {
  return rightTexts(question.point).includes(option)
}
