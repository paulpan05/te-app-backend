module.exports = {
  extends: [
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'airbnb-typescript/base',
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
    'operator-linebreak': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
