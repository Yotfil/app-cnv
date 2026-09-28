/** Returns a number in [0, 1), like Math.random; injected so practice can be tested. */
export type Random = () => number

/** Fisher–Yates shuffle driven by the injected random source. */
export function shuffle<T>(items: T[], random: Random): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
