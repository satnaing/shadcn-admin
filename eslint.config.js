import globals from 'globals'
import js from '@eslint/js'
import pluginQuery from '@tanstack/eslint-plugin-query'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
  { ignores: ['dist', 'src/components/ui'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...pluginQuery.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-console': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      // Enforce type-only imports for TypeScript types
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      // Prevent duplicate imports from the same module
      'no-duplicate-imports': 'error',
    },
  },
  // Panel qaydaları (GEMINI.md §1) — qadağalar lint səviyyəsində, grep-ə güvənilmir.
  // Yalnız `src/features/**`: shadcn `ui/` və layout faylları bu hədlərə uyğun deyil.
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      'max-lines': ['error', { max: 150, skipBlankLines: true, skipComments: true }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXAttribute[name.name="style"]',
          message: 'Inline CSS qadağadır (GEMINI.md §1.1) — Tailwind class + cn() istifadə et.',
        },
        {
          selector: 'JSXAttribute[name.name="dangerouslySetInnerHTML"]',
          message: 'dangerouslySetInnerHTML qadağadır (GEMINI.md §1.2).',
        },
        {
          selector: 'MemberExpression[object.name="document"]',
          message: 'Birbaşa DOM müraciəti qadağadır (GEMINI.md §1.2) — React state/useRef istifadə et.',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../../*'],
              message: 'Dərin nisbi import qadağadır (GEMINI.md §1.11) — `@/` alias istifadə et.',
            },
            {
              group: ['axios'],
              message: 'Komponent/feature axios-u birbaşa çağırmır (GEMINI.md §1.5) — data/*.service.ts + requestInstanceClient.',
            },
          ],
        },
      ],
    },
  },
  // data/ qatı React bilmir, hooks/ isə render etmir.
  {
    files: ['src/features/**/data/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react', 'react-dom', '@tanstack/react-query', '@/components/*'],
              message: 'data/ qatı React-dan asılı olmur (GEMINI.md §2) — sorğu hooks/ qatındadır.',
            },
            // Flat config-də sonraki blok eyni qaydanı tam əvəz edir, ona görə təkrarlanır.
            {
              group: ['../../../*'],
              message: 'Dərin nisbi import qadağadır (GEMINI.md §1.11) — `@/` alias istifadə et.',
            },
            {
              group: ['axios'],
              message: 'Service `requestInstanceClient` işlədir, axios-u birbaşa çağırmır (GEMINI.md §1.5).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/**/hooks/*.ts'],
    rules: {
      'max-lines': ['error', { max: 80, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['src/features/**/data/*.service.ts'],
    rules: {
      'max-lines': ['error', { max: 120, skipBlankLines: true, skipComments: true }],
    },
  }
)
