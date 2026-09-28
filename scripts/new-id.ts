// Prints new UUID v4 ids for the catalog, one per line.
// Usage: npm run new-id [-- <count>]
import { newId } from '../src/shared/lib/uuid.ts'

const count = Number(process.argv[2] ?? 1)

if (!Number.isInteger(count) || count < 1) {
  console.error('Usage: npm run new-id [-- <count>]  (count is a positive integer)')
  process.exit(1)
}

for (let i = 0; i < count; i++) {
  console.log(newId())
}
