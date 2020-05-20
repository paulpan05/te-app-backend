const tsPreset = require('ts-jest/jest-preset');

module.exports = {
  ...tsPreset,
  globalSetup: './globalSetup.js',
  globalTeardown: './globalTeardown.js',
};
