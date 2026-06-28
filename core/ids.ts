import { nanoid } from 'nanoid';

/**
 * Generates a cryptographically random opaque ID.
 * All PKs use this — never sequential integers.
 */
export function generateId(): string {
  return nanoid();
}
