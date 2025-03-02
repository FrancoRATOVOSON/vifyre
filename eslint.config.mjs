import eslint from '@eslint/js'
import perfectionist from 'eslint-plugin-perfectionist'
import eslintPluginPretttierRecommended from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ]
    }
  },
  eslintPluginPretttierRecommended,
  {
    rules: {
      'prettier/prettier': 'warn',
      'space-before-function-paren': 'off'
    }
  },
  {
    ignores: ['**/dist', '**/node_modules']
  },
  {
    plugins: {
      perfectionist
    },
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          groups: [
            'builtin',
            'react',
            'type',
            'external',
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown'
          ],
          ignoreCase: true,
          maxLineLength: undefined,
          newlinesBetween: 'always',
          order: 'asc',
          partitionByComment: false,
          partitionByNewLine: false,
          specialCharacters: 'keep',
          internalPattern: ['#server/*', '#client/*'],
          type: 'alphabetical',
          customGroups: {
            value: {
              react: ['^react$', '^react-.+']
            },
            type: {
              react: ['^react$', '^react-.+']
            }
          }
        }
      ]
    }
  },
  {
    languageOptions: {
      globals: {
        console: 'readonly'
      }
    }
  }
)
