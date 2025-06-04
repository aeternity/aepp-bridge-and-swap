import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended, // spread the array

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      'unused-imports': eslintPluginUnusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
      ],
    },
  },
];
