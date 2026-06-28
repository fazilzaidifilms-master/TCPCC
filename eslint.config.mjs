import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

/** @type {import('eslint').Linter.Config[]} */
const config = [
  // Global ignores
  {
    ignores: ['node_modules/**', '.next/**', 'coverage/**', 'dist/**'],
  },

  // TypeScript for all files
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@typescript-eslint': tsPlugin },
    languageOptions: { parser: tsParser, parserOptions: { project: './tsconfig.json' } },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },

  // ████████████████████████████████████████████████████████████████████████████████
  // ARCHITECTURE BOUNDARY — load-bearing rule.
  // core/ must be framework-agnostic so business logic stays portable and
  // testable without a browser. Any import of next/*, react, or react-dom
  // inside core/ is a build-breaking error, not a warning.
  // ████████████████████████████████████████████████████████████████████████████████
  {
    files: ['core/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['next', 'next/*', 'next/**'],
              message:
                'core/ must not import from next/*. Keep business logic framework-agnostic.',
            },
            {
              group: ['react', 'react/*', 'react/**', 'react-dom', 'react-dom/*'],
              message:
                'core/ must not import from react or react-dom. Keep business logic framework-agnostic.',
            },
          ],
        },
      ],
    },
  },
];

export default config;
