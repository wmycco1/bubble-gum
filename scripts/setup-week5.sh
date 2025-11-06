#!/bin/bash

# Week 5 Environment Setup Script
# God-Tier Development Protocol 2025
#
# This script sets up testing and Storybook environment for PHASE 1
# Run this once before starting Week 5, Day 1

set -e  # Exit on error

echo "🚀 Setting up Week 5 Environment..."
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================
# STEP 1: Install Testing Dependencies
# ============================================
echo -e "${BLUE}📦 Step 1: Installing Testing Dependencies...${NC}"

npm install --save-dev \
  jest@29 \
  @jest/globals@29 \
  @types/jest@29 \
  jest-environment-jsdom@29 \
  @testing-library/react@16 \
  @testing-library/jest-dom@6 \
  @testing-library/user-event@14 \
  jest-axe@8 \
  @axe-core/react@4 \
  @swc/core@1 \
  @swc/jest@0.2 \
  identity-obj-proxy@3

echo -e "${GREEN}✅ Testing dependencies installed${NC}"
echo ""

# ============================================
# STEP 2: Install Storybook Dependencies
# ============================================
echo -e "${BLUE}📚 Step 2: Installing Storybook Dependencies...${NC}"

npm install --save-dev \
  storybook@8 \
  @storybook/react@8 \
  @storybook/addon-essentials@8 \
  @storybook/addon-interactions@8 \
  @storybook/addon-a11y@8 \
  @storybook/test@8 \
  @storybook/react-vite@8

echo -e "${GREEN}✅ Storybook dependencies installed${NC}"
echo ""

# ============================================
# STEP 3: Create Jest Configuration
# ============================================
echo -e "${BLUE}⚙️  Step 3: Creating Jest Configuration...${NC}"

cat > jest.config.js << 'EOF'
/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['@swc/jest', {
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true,
        },
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }],
  },
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    'src/context/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx)',
    '**/*.(test|spec).(ts|tsx)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/out/',
    '/dist/',
  ],
};

module.exports = config;
EOF

echo -e "${GREEN}✅ jest.config.js created${NC}"

# ============================================
# STEP 4: Create Jest Setup
# ============================================
echo -e "${BLUE}⚙️  Step 4: Creating Jest Setup File...${NC}"

cat > jest.setup.js << 'EOF'
require('@testing-library/jest-dom');
const { toHaveNoViolations } = require('jest-axe');

expect.extend(toHaveNoViolations);

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};
EOF

echo -e "${GREEN}✅ jest.setup.js created${NC}"

# ============================================
# STEP 5: Create File Mocks
# ============================================
echo -e "${BLUE}⚙️  Step 5: Creating File Mocks...${NC}"

mkdir -p __mocks__

cat > __mocks__/fileMock.js << 'EOF'
module.exports = 'test-file-stub';
EOF

echo -e "${GREEN}✅ File mocks created${NC}"

# ============================================
# STEP 6: Create Storybook Configuration
# ============================================
echo -e "${BLUE}⚙️  Step 6: Creating Storybook Configuration...${NC}"

mkdir -p .storybook

cat > .storybook/main.ts << 'EOF'
import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };
    return config;
  },
};

export default config;
EOF

cat > .storybook/preview.ts << 'EOF'
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'landmark-one-main',
            enabled: false,
          },
        ],
      },
    },
  },
};

export default preview;
EOF

echo -e "${GREEN}✅ Storybook configuration created${NC}"

# ============================================
# STEP 7: Update package.json Scripts
# ============================================
echo -e "${BLUE}⚙️  Step 7: Updating package.json Scripts...${NC}"

# Note: This uses npm pkg to safely update package.json
npm pkg set scripts.test="jest"
npm pkg set scripts.test:watch="jest --watch"
npm pkg set scripts.test:coverage="jest --coverage"
npm pkg set scripts.test:ci="jest --ci --coverage"
npm pkg set scripts.storybook="storybook dev -p 6006"
npm pkg set scripts.build-storybook="storybook build"

echo -e "${GREEN}✅ package.json scripts updated${NC}"

# ============================================
# STEP 8: Verify Installation
# ============================================
echo -e "${BLUE}✔️  Step 8: Verifying Installation...${NC}"
echo ""

echo -e "${YELLOW}Testing Jest installation...${NC}"
npx jest --version || echo -e "${YELLOW}⚠️  Jest not found in PATH, but installed in node_modules${NC}"

echo ""
echo -e "${YELLOW}Testing Storybook installation...${NC}"
npx storybook --version || echo -e "${YELLOW}⚠️  Storybook not found in PATH, but installed in node_modules${NC}"

echo ""

# ============================================
# DONE
# ============================================
echo ""
echo -e "${GREEN}=================================="
echo -e "✅ Week 5 Environment Setup Complete!"
echo -e "==================================${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Run tests: npm test"
echo "2. Run Storybook: npm run storybook"
echo "3. Start Week 5, Day 1: Implement Button CSS"
echo ""
echo -e "${BLUE}Quick Commands:${NC}"
echo "  npm test Button.test.tsx          # Run Button tests"
echo "  npm run test:coverage             # View coverage"
echo "  npm run storybook                 # Start Storybook"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
