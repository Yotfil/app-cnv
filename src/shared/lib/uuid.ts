/** New UUID v4 for a region or point id. Generated once; the id never changes afterwards. */
export function newId(): string {
  return crypto.randomUUID()
}
