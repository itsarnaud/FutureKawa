const nextJest = require('next/jest.js');

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  displayName: 'fe',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/fe',
  testEnvironment: 'jsdom',
  // *.e2e.spec.ts files are Playwright specs (see playwright.config.ts), not Jest specs.
  testPathIgnorePatterns: ['/node_modules/', '\\.e2e\\.spec\\.ts$'],
  moduleNameMapper: {
    '^react$': '<rootDir>/../../node_modules/react',
    '^react-dom$': '<rootDir>/../../node_modules/react-dom',
  },
};

module.exports = createJestConfig(config);
