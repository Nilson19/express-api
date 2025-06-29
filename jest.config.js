/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  testMatch: [
    "**/__tests__/**/*.test.ts",
    "**/e2e/**/*.e2e.test.ts",
    "**/?(*.)+(test).ts"
  ],

  testPathIgnorePatterns: ["/node_modules/"],

  transform: {
    "^.+\\.ts?$": "ts-jest"
  },

  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/application/usecases/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'lcov'],
};
