module.exports = {
  extends: [
    'airbnb-typescript/base',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 6,
    project: './tsconfig.json',
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['index.ts', './src/config/*', './src/db/*'] }],
  },
};
