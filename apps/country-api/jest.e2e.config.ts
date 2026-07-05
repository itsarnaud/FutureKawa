export default {
  displayName: 'country-api-e2e',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/country-api-e2e',
  testMatch: ['<rootDir>/**/*.e2e-spec.ts'],
  testTimeout: 20000,
};
