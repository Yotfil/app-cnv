export type ErrorContext = Record<string, unknown>

/**
 * Single reporting point for unexpected errors. Today it writes to the console;
 * Sentry will be connected here later. No other module talks to Sentry directly.
 */
export function reportError(error: unknown, context: ErrorContext = {}): void {
  console.error('[reportError]', error, context)
}
