// Errors are message keys under the "errors" namespace; the client translates them.
export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string; fields?: Record<string, string> };
