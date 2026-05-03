/**
 * Sanity Studio encodes focused-field state in the URL (e.g. ,path=someField).
 * When a field is removed from the schema but the URL still references it,
 * Studio crashes with "Cannot read properties of undefined (reading '_rev')".
 *
 * Instead of maintaining a blocklist, strip ALL ,path=… segments so the
 * document always opens at its root. Studio will re-add the path segment
 * when the user clicks into a valid field.
 */
export function stripLegacyMatchFieldPaths(pathname: string): string {
  return pathname
    // encoded: %2Cpath%3DfieldName (with optional dotted subpath)
    .replace(/%2Cpath%3D[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*/gi, '')
    // plain: ,path=fieldName
    .replace(/,path=[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*/gi, '')
}
