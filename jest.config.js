module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  modulePaths: ['<rootDir>/src'],
  testRegex: 'tests/.*\\.test?\\.(js|ts)$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
