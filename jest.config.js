export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  // Setup and teardown for all tests
  globalSetup: './tests/setup.js',
  globalTeardown: './tests/teardown.js',
};
