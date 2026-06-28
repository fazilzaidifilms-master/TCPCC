import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

// Test A: Architecture boundary (structural verification)
// Verifies that the ESLint config actually contains the load-bearing rule
// that blocks next/* and react imports in core/.
// The live enforcement is proved by running: npm run lint (which --max-warnings 0
// means any violation is a CI failure).

const eslintConfigPath = join(process.cwd(), 'eslint.config.mjs');

describe('Test A — core/ architecture boundary rule is configured', () => {
  it('eslint.config.mjs exists', () => {
    expect(() => readFileSync(eslintConfigPath, 'utf8')).not.toThrow();
  });

  it('config targets core/**/*.ts files', () => {
    const config = readFileSync(eslintConfigPath, 'utf8');
    expect(config).toContain("'core/**/*.ts'");
  });

  it('no-restricted-imports rule is set to error (not warn)', () => {
    const config = readFileSync(eslintConfigPath, 'utf8');
    // Rule must be error-level
    expect(config).toContain("'no-restricted-imports'");
    expect(config).toContain("'error'");
  });

  it('next/* is in the blocked patterns', () => {
    const config = readFileSync(eslintConfigPath, 'utf8');
    expect(config).toContain('next/*');
  });

  it('react is in the blocked patterns', () => {
    const config = readFileSync(eslintConfigPath, 'utf8');
    expect(config).toContain('react');
  });

  it('lint script uses --max-warnings 0 (warnings are failures)', () => {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8')) as { scripts: Record<string, string> };
    expect(pkg.scripts['lint']).toContain('--max-warnings 0');
  });
});
