/**
 * One-off: backfill `team: "men"` on every `standingsCompetition` document
 * that predates the new `team` field. Without this, existing competitions
 * (and the matches/standings that reference them) won't appear under either
 * the Men's or Women's tabs in Studio.
 *
 * Requires a write token:
 *   SANITY_API_WRITE_TOKEN=... pnpm sanity:backfill-competition-team
 *
 * Uses NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET if set,
 * else falls back to sanity.cli.ts defaults.
 */
import { createClient } from '@sanity/client'

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

const ids = await client.fetch(
  `*[_type == "standingsCompetition" && !defined(team)]._id`
)

if (ids.length === 0) {
  console.log(`No standingsCompetition documents need backfilling in ${dataset}.`)
  process.exit(0)
}

let patched = 0
for (const id of ids) {
  await client.patch(id).setIfMissing({ team: 'men' }).commit()
  patched += 1
}

console.log(
  `Backfilled team="men" on ${patched} standingsCompetition document(s) in ${dataset}.`
)
