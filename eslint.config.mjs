import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  // Global ignores
  {
    ignores: ['node_modules/**', '.next/**', 'coverage/**', 'dist/**'],
  },

  // TypeScript for all .ts/.tsx files
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@typescript-eslint': tsPlugin },
    languageOptions: {
      parser: tsParser,
    },
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
  // inside core/ is a build-breaking ERROR (not a warning; --max-warnings 0).
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
