module.exports = {
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],

  // 0: off, 1: warn, 2: error
  rules: {
    'no-console': 0,
    'prefer-template': 2,
    curly: [2, 'multi-line'],
  },
};
