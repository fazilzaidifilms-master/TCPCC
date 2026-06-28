import { describe, it, expect } from 'vitest';
import { generateId } from '@/core/ids';

// Test C: Opaque ID
// A generated ID must be a non-empty string that is NOT a sequential integer.
describe('generateId', () => {
  it('returns a non-empty string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('is not a sequential integer (opaque ID)', () => {
    const id = generateId();
    // Must not be parseable as a small integer like 1, 2, 3
    const parsed = Number(id);
    const isSmallInt = Number.isInteger(parsed) && parsed < 1_000_000;
    expect(isSmallInt).toBe(false);
  });

  it('generates unique IDs', () => {
    const ids = Array.from({ length: 100 }, () => generateId());
    const unique = new Set(ids);
    expect(unique.size).toBe(100);
  });

  it('matches nanoid character set (URL-safe alphanumeric + _ -)', () => {
    for (let i = 0; i < 50; i++) {
      const id = generateId();
      expect(id).toMatch(/^[A-Za-z0-9_-]+$/);
    }
  });
});
