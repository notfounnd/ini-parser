module.exports = {
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: [],
  testMatch: ['**/test/**/*.test.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['cobertura', 'lcov','json', 'text'],
  reporters: [
    'default',
    [ 
      "jest-junit", {
        outputDirectory: "coverage",
        outputName: "junit-coverage.xml"
      }
    ]
  ],
  testTimeout: 10000,
  // Transformar módulos ESM problemáticos para CommonJS
  transformIgnorePatterns: [
    'node_modules/(?!(chalk|ansi-styles|#ansi-styles)/)'
  ],
  // Mock de módulos problemáticos
  // TODO: Uncomment if chalk mock is needed in CLI tests
  // moduleNameMapper: {
  //   '^chalk$': '<rootDir>/test/__mocks__/chalk.js'
  // }
};
