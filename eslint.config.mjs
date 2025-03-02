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
    ignores: ['**/dist', '**/node_modules', '**/build']
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
            ['node', 'builtin'],
            'fastify',
            'react',
            'type',
            'external',
            ['internal-type', 'parent-type', 'sibling-type', 'index-type'],
            ['internal', 'parent', 'sibling', 'index'],
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
              node: ['node:*'],
              react: ['^react$', '^react-.+'],
              fastify: ['fastify'],
              fastifyPlugins: ['@fastify/*'],
              fastifyCustom: ['fastify-*']
            },
            type: {
              node: ['node:*'],
              react: ['^react$', '^react-.+'],
              fastify: ['fastify'],
              fastifyPlugins: ['@fastify/*'],
              fastifyCustom: ['fastify-*']
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
