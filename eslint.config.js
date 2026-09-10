import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
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
      // setState в эффекте после fetch/по смене роута — обычный паттерн этого проекта
      'react-hooks/set-state-in-effect': 'off',
      // Хелперы рядом с компонентом (reachGoal, formatDate, useAuth) — HMR от этого не страдает
      'react-refresh/only-export-components': 'off',
    },
  },
  // Бэкенд на Node: process, Buffer и прочее
  {
    files: ['server/**/*.js'],
    languageOptions: { globals: globals.node },
  },
  // Service worker
  {
    files: ['public/sw.js'],
    languageOptions: { globals: globals.serviceworker },
  },
])
