import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),

  // ── Browser files (components, pages, contexts) ──────────────────────────
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['vite.config.js'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // React 17+ JSX transform — no need to import React
      'react/react-in-jsx-scope': 'off',

      // Allow unused vars that start with underscore (e.g. _err)
      'no-unused-vars': ['warn', {
        vars: 'all',
        args: 'after-used',
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],

      // Downgrade complex hooks rules to warnings (still visible, won't fail CI)
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'warn',

      // Allow empty catch blocks (common pattern for silent error handling)
      'no-empty': ['warn', { allowEmptyCatch: true }],

      // Duplicate keys — keep as error (real bug)
      'no-dupe-keys': 'error',
    },
  },

  // ── Node.js config files (vite.config.js, etc.) ──────────────────────────
  {
    files: ['vite.config.js', '*.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        process: 'readonly',
      },
    },
    rules: {
      'no-undef': 'error',
    },
  },
])
