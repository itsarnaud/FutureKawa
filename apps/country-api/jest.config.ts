export default {
  displayName: 'country-api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/country-api',
  // Integration tests hit a real Postgres + HTTP server — run separately via
  // `nx test-e2e country-api` (see jest.e2e.config.ts), not in the fast unit suite.
  testPathIgnorePatterns: ['/node_modules/', '\\.e2e-spec\\.ts$'],
};
