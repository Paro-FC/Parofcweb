/** True when the user closed the system share sheet — not an app error. */
export function isShareUserCanceled(err: unknown): boolean {
  if (err == null) return false;
  if (typeof DOMException !== "undefined" && err instanceof DOMException) {
    return err.name === "AbortError";
  }
  if (typeof err === "object" && err !== null && "name" in err) {
    if ((err as { name: string }).name === "AbortError") return true;
  }
  if (typeof err === "object" && err !== null && "message" in err) {
    const msg = String((err as { message: unknown }).message);
    if (/share canceled/i.test(msg)) return true;
  }
  return false;
}
