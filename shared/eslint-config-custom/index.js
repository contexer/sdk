module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
    'turbo',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'shared/tsconfig/eslint.json',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'sort-imports': 'error',
  },
}
