const tsPreset = require('ts-jest/jest-preset');
const jestDynamo = require('ts-jest/jest-preset');

module.exports = {
  ...tsPreset,
  ...jestDynamo,
};
