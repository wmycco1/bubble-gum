// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - JEST CONFIGURATION
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0
// Last Updated: November 2, 2025
// Purpose: Complete Jest configuration for unit & integration tests
// ═══════════════════════════════════════════════════════════════

const nextJest = require('next/jest');

// Create Jest config with Next.js
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CUSTOM JEST CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const customJestConfig = {
  // ┌─────────────────────────────────────────────────────────────┐
  // │ SETUP FILES                                                 │
  // └─────────────────────────────────────────────────────────────┘
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // ┌─────────────────────────────────────────────────────────────┐
  // │ MODULE PATHS & ALIASES                                      │
  // └─────────────────────────────────────────────────────────────┘
  moduleNameMapper: {
    // Handle module aliases (same as tsconfig paths)
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/styles/(.*)$': '<rootDir>/src/styles/$1',

    // Handle CSS imports (with CSS modules)
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    // Handle image imports
    '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/__mocks__/fileMock.js',

    // Handle font imports
    '^.+\\.(woff|woff2|ttf|eot|otf)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // ┌─────────────────────────────────────────────────────────────┐
  // │ TEST ENVIRONMENT                                            │
  // └─────────────────────────────────────────────────────────────┘
  testEnvironment: 'jest-environment-jsdom',

  // ┌─────────────────────────────────────────────────────────────┐
  // │ TEST MATCH PATTERNS                                         │
  // └─────────────────────────────────────────────────────────────┘
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // ┌─────────────────────────────────────────────────────────────┐
  // │ TRANSFORM FILES                                             │
  // └─────────────────────────────────────────────────────────────┘
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },

  // ┌─────────────────────────────────────────────────────────────┐
  // │ COVERAGE CONFIGURATION                                      │
  // └─────────────────────────────────────────────────────────────┘
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html',
    'json',
    'clover',
  ],

  // Files to collect coverage from
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/**/node_modules/**',
    '!src/**/.next/**',
    '!src/**/coverage/**',
    '!src/**/dist/**',
  ],

  // Coverage thresholds
  coverageThresholds: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Higher thresholds for critical paths
    './src/lib/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './src/utils/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },

  // ┌─────────────────────────────────────────────────────────────┐
  // │ PATH IGNORE PATTERNS                                        │
  // └─────────────────────────────────────────────────────────────┘
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/out/',
    '/coverage/',
    '/dist/',
    '/build/',
  ],

  modulePathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/out/',
    '<rootDir>/dist/',
  ],

  // ┌─────────────────────────────────────────────────────────────┐
  // │ WATCH PLUGINS                                               │
  // └─────────────────────────────────────────────────────────────┘
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],

  // ┌─────────────────────────────────────────────────────────────┐
  // │ GLOBAL SETTINGS                                             │
  // └─────────────────────────────────────────────────────────────┘
  // Max workers for parallel test execution
  maxWorkers: '50%',

  // Test timeout (milliseconds)
  testTimeout: 30000,

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // ┌─────────────────────────────────────────────────────────────┐
  // │ GLOBALS                                                     │
  // └─────────────────────────────────────────────────────────────┘
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react',
      },
    },
  },

  // ┌─────────────────────────────────────────────────────────────┐
  // │ PROJECT CONFIGURATIONS (Multiple Test Types)                │
  // └─────────────────────────────────────────────────────────────┘
  projects: [
    {
      displayName: 'unit',
      testMatch: [
        '<rootDir>/src/**/__tests__/**/*.test.[jt]s?(x)',
        '<rootDir>/tests/unit/**/*.test.[jt]s?(x)',
      ],
      testEnvironment: 'jest-environment-jsdom',
    },
    {
      displayName: 'integration',
      testMatch: [
        '<rootDir>/tests/integration/**/*.test.[jt]s?(x)',
      ],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/setup/integration.setup.js'],
    },
  ],
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORT CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
module.exports = createJestConfig(customJestConfig);

// ═══════════════════════════════════════════════════════════════
// USAGE COMMANDS
// ═══════════════════════════════════════════════════════════════
//
// Run all tests:
//   npm test
//
// Run unit tests only:
//   npm test -- --selectProjects=unit
//
// Run integration tests only:
//   npm test -- --selectProjects=integration
//
// Run with coverage:
//   npm test -- --coverage
//
// Run in watch mode:
//   npm test -- --watch
//
// Run specific file:
//   npm test -- path/to/file.test.ts
//
// Update snapshots:
//   npm test -- -u
//
// Run tests matching pattern:
//   npm test -- --testNamePattern="should render"
//
// ═══════════════════════════════════════════════════════════════
// PACKAGE.JSON SCRIPTS
// ═══════════════════════════════════════════════════════════════
//
// Add these scripts to package.json:
//
// {
//   "scripts": {
//     "test": "jest",
//     "test:unit": "jest --selectProjects=unit",
//     "test:integration": "jest --selectProjects=integration",
//     "test:watch": "jest --watch",
//     "test:coverage": "jest --coverage",
//     "test:ci": "jest --ci --coverage --maxWorkers=2"
//   }
// }
//
// ═══════════════════════════════════════════════════════════════
