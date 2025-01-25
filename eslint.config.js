import react from 'eslint-plugin-react';
// @ts-ignore
import pluginReactHooks from 'eslint-plugin-react-hooks';
import sort from 'eslint-plugin-sort';
import tailwind from 'eslint-plugin-tailwindcss';
import ts from 'typescript-eslint';

export default [
  ...ts.configs.recommended,
  ...tailwind.configs['flat/recommended'],
  react.configs.flat?.recommended,
  {
    plugins: {
      sort,
      'react-hooks': pluginReactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      tailwindcss: {
        config: './tailwind.config.ts',
        callees: ['cva', 'cn'],
        ignoredKeys: ['compoundVariants', 'defaultVariants'],
        whitelist: ['dark'],
      },
      react: { version: 'detect' },
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'sort/exports': 'off',
      'sort/import-members': 'off',
      'sort/imports': 'off',
      'no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error', // or "error"
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
];
