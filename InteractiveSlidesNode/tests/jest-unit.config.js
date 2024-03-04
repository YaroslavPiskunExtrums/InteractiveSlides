export default {
  clearMocks: true,

  collectCoverage: false,

  coverageDirectory: '../coverage/unit',

  coverageProvider: 'v8',

  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '#(.*)': '<rootDir>/node_modules/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },

  preset: 'ts-jest/presets/default-esm',
  rootDir: '../',
  testEnvironment: 'node',
  testMatch: ['**/tests/unit/**/*.spec.ts'],
}
