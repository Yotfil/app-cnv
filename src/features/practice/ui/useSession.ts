import { useState } from 'react'
import type { Catalog } from '@/features/catalog'
import { isCorrect } from '../domain/question'
import type { Random } from '../domain/random'
import { answer, createSession, current, next, progress, summary } from '../domain/session'

/** The only way for a component to run a practice session (ADR 0003). */
export function useSession(regionKey: string, catalog: Catalog, random: Random = Math.random) {
  const [session, setSession] = useState(() => createSession(regionKey, catalog, random))

  const question = current(session)
  // One answer per question, in order: the current one is answered once answers catch up.
  const chosen =
    session.answers.length > session.index ? session.answers[session.index].option : undefined

  return {
    question,
    /** The option picked for the current question, once answered. */
    chosen,
    correct: question !== undefined && chosen !== undefined && isCorrect(question, chosen),
    progress: progress(session),
    summary: summary(session),
    isLast: session.index === session.questions.length - 1,
    choose(option: string) {
      if (chosen === undefined) setSession((state) => answer(state, option))
    },
    next() {
      setSession((state) => next(state))
    },
    restart() {
      setSession(createSession(regionKey, catalog, random))
    },
  }
}
