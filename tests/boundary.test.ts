import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Test A: Architecture boundary
// core/ must not import from next/* or react.
// This test creates a violating file, runs eslint, expects failure;
// then removes it and expects lint to pass.

const VIOLATING_FILE = join(process.cwd(), 'core', '_boundary_test_TEMP.ts');

describe('core/ architecture boundary (ESLint no-restricted-imports)', () => {
  it('FAILS lint when core/ imports from next/*', () => {
    writeFileSync(
      VIOLATING_FILE,
      // Using a string that eslint will parse as an import
      `import { headers } from 'next/headers';\nexport const x = headers;\n`,
    );

    let threw = false;
    try {
      execSync('npx eslint core/_boundary_test_TEMP.ts --max-warnings 0', {
        cwd: process.cwd(),
        stdio: 'pipe',
      });
    } catch {
      threw = true;
    } finally {
      if (existsSync(VIOLATING_FILE)) unlinkSync(VIOLATING_FILE);
    }

    expect(threw).toBe(true);
  });

  it('PASSES lint when core/ has no framework imports', () => {
    const cleanFile = join(process.cwd(), 'core', '_boundary_clean_TEMP.ts');
    writeFileSync(cleanFile, `export function add(a: number, b: number) { return a + b; }\n`);

    let error: unknown = null;
    try {
      execSync('npx eslint core/_boundary_clean_TEMP.ts --max-warnings 0', {
        cwd: process.cwd(),
        stdio: 'pipe',
      });
    } catch (e) {
      error = e;
    } finally {
      if (existsSync(cleanFile)) unlinkSync(cleanFile);
    }

    expect(error).toBeNull();
  });
});
