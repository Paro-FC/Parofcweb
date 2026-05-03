/**
 * Sanity Studio encodes focused-field state in the URL (e.g. ,path=someField).
 * When a field is removed from the schema but the URL still references it,
 * Studio crashes with "Cannot read properties of undefined (reading '_rev')".
 *
 * Also fix double-encoded array item paths (%255B → %5B) caused by Next.js
 * router re-encoding Sanity's bracket-based item selectors.
 */
export function stripLegacyMatchFieldPaths(pathname: string): string {
  let cleaned = pathname
    // Fix double-encoded brackets: %255B → %5B, %255D → %5D, %253D → %3D, %2522 → %22
    .replace(/%25([0-9A-Fa-f]{2})/g, '%$1')
    // Strip encoded ,path= segments
    .replace(/%2Cpath%3D[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*/gi, '')
    // Strip plain ,path= segments
    .replace(/,path=[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*/gi, '')
  return cleaned
}
