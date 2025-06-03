module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/models/index.js',
    '!src/utils/dbSync.js',
    '!src/app.js'
  ],
  coverageReporters: ['text', 'lcov'],
  testTimeout: 10000,
  setupFiles: ['./tests/setup.js']
}; 