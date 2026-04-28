/**
 * Sanity Studio encodes focused field state in the path (e.g. ,path=matchEvents).
 * After removing fields from the schema, those URLs crash the form (undefined _rev).
 * Strip known-removed segments so the document root opens instead.
 */
const LEGACY_MATCH_FIELD_PATHS = [
  'matchEvents',
  'homeLineup',
  'awayLineup',
  'homeFormation',
  'awayFormation',
  'hasTickets',
  'matchStats',
  'ticketAvailability',
  'ticketPrice',
] as const

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Optional dot-separated subpath (e.g. matchEvents.0.type, matchStats.homeShots). */
const SUBPATH = '(?:\\.[a-zA-Z0-9_-]+)*'

export function stripLegacyMatchFieldPaths(pathname: string): string {
  let out = pathname
  for (const field of LEGACY_MATCH_FIELD_PATHS) {
    const enc = new RegExp(
      `%2Cpath%3D${escapeRegExp(field)}${SUBPATH}`,
      'gi',
    )
    const plain = new RegExp(`,path=${escapeRegExp(field)}${SUBPATH}`, 'gi')
    out = out.replace(enc, '').replace(plain, '')
  }
  return out
}
