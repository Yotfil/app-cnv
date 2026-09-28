import type { Catalog } from '@/features/catalog'
import { generateQuestion, isCorrect, type Question } from './question'
import { shuffle, type Random } from './random'

export type Answer = {
  pointId: string
  option: string
}

/** A practice run over the points of one region, in random order and without repeats. */
export type Session = {
  regionKey: string
  questions: Question[]
  /** Index of the current question; equal to questions.length when finished. */
  index: number
  answers: Answer[]
}

export function createSession(regionKey: string, catalog: Catalog, random: Random): Session {
  const region = catalog.regions.find((candidate) => candidate.key === regionKey)
  const points = catalog.points.filter((point) => point.region === region?.id)
  const questions = shuffle(points, random).map((point) =>
    generateQuestion(point, catalog.points, random),
  )
  return { regionKey, questions, index: 0, answers: [] }
}

/** The question to answer now, or undefined when the session is over. */
export function current(session: Session): Question | undefined {
  return session.questions[session.index]
}

/** Records the chosen option for the current question. */
export function answer(session: Session, option: string): Session {
  const question = current(session)
  if (!question) return session
  return { ...session, answers: [...session.answers, { pointId: question.point.id, option }] }
}

/** Moves to the next question. */
export function next(session: Session): Session {
  return { ...session, index: session.index + 1 }
}

/** Position of the current question, counting from 1: "4 de 11". */
export function progress(session: Session): { position: number; total: number } {
  return { position: session.index + 1, total: session.questions.length }
}

/** Hits and misses of the answers given so far; the final result once the session is over. */
export function summary(session: Session): { hits: number; misses: number } {
  const hits = session.answers.filter((given) => {
    const question = session.questions.find((candidate) => candidate.point.id === given.pointId)
    return question !== undefined && isCorrect(question, given.option)
  }).length
  return { hits, misses: session.answers.length - hits }
}
