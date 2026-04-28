/**
 * One-off: remove legacy keys from all `match` documents so Studio stops
 * reporting "Unknown fields".
 *
 * Requires a write token:
 *   SANITY_API_WRITE_TOKEN=... pnpm sanity:unset-match-fields
 *
 * Uses NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET if set,
 * else falls back to sanity.cli.ts defaults.
 */
import { createClient } from '@sanity/client'

const ORPHAN_KEYS = [
  'hasTickets',
  'matchStats',
  'ticketAvailability',
  'ticketPrice',
  'homeLineup',
  'awayLineup',
  'homeFormation',
  'awayFormation',
  'matchEvents',
]

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '9jkrup0j'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!token) {
  console.error('Set SANITY_API_WRITE_TOKEN (Sanity → API → Tokens, Editor role).')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const ids = await client.fetch(`*[_type == "match"]._id`)

let patched = 0
for (const id of ids) {
  await client.patch(id).unset(ORPHAN_KEYS).commit()
  patched += 1
}

console.log(`Unset legacy fields on ${patched} match document(s) in ${dataset}.`)
