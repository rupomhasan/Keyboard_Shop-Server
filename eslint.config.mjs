import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  {
    ignores: ['/dist', '/node_modules'],  // Replaced `ignorePatterns` with `ignores`
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,   // Use browser globals
        ...globals.node,      // Use Node.js globals
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      'no-console': 'warn',
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
    },
  },
];
