/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'prettier'
  ],
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    'linebreak-style': 0,
    'quotes': ['error', 'single'],
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'arrow-spacing': ['error', { 'before': true, 'after': true }],
    'semi': ['error', 'never'],
    'no-multiple-empty-lines': 2,
    'no-console': 0,
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
  },
}
