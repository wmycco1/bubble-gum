# Testing Setup Guide

**Purpose:** Complete guide for setting up and running tests in Bubble Gum project
**Protocol:** God-Tier Development Protocol 2025
**Target:** 80%+ test coverage, 0 accessibility violations

---

## 📊 Testing Stack

### Core Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **Jest** | 29+ | Test runner and assertion framework |
| **React Testing Library** | 14+ | Component testing utilities |
| **@testing-library/user-event** | 14+ | User interaction simulation |
| **@testing-library/jest-dom** | 6+ | Custom Jest matchers for DOM |
| **jest-axe** | 8+ | Accessibility testing (WCAG 2.2 AA) |
| **@testing-library/react-hooks** | 8+ | Hook testing utilities |

---

## 🚀 Installation

### Step 1: Install Dependencies

```bash
npm install --save-dev \
  jest \
  @jest/globals \
  @types/jest \
  jest-environment-jsdom \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jest-axe \
  @axe-core/react
```

### Step 2: Configure Jest

Create `jest.config.js` in project root:

```javascript
/** @type {import('jest').Config} */
const config = {
  // Test environment
  testEnvironment: 'jsdom',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Module paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // Transform files
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

  // Coverage configuration
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    'src/context/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/index.ts',
  ],

  coverageThresholds: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },

  // Test patterns
  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx)',
    '**/*.(test|spec).(ts|tsx)',
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/out/',
    '/dist/',
  ],

  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};

module.exports = config;
```

### Step 3: Create Jest Setup File

Create `jest.setup.js` in project root:

```javascript
// Import custom matchers
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock window.matchMedia
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

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Suppress console errors in tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

### Step 4: Create File Mocks

Create `__mocks__/fileMock.js`:

```javascript
module.exports = 'test-file-stub';
```

### Step 5: Update package.json

Add test scripts to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "test:update": "jest --updateSnapshot"
  }
}
```

---

## 📝 Writing Tests

### Basic Test Template

```typescript
/**
 * ComponentName Tests
 * God-Tier Development Protocol 2025
 */

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ComponentName } from './ComponentName';

expect.extend(toHaveNoViolations);

describe('ComponentName', () => {
  describe('Rendering', () => {
    it('renders with required props', () => {
      render(<ComponentName requiredProp="value" />);
      expect(screen.getByText('value')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('handles click events', () => {
      const handleClick = jest.fn();
      render(<ComponentName onClick={handleClick} />);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<ComponentName />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

---

## 🎯 Testing Patterns

### Pattern 1: Rendering Tests

```typescript
describe('Rendering', () => {
  it('renders with default props', () => {
    render(<Button text="Click" />);
    expect(screen.getByText('Click')).toBeInTheDocument();
  });

  it('applies CSS classes', () => {
    const { container } = render(<Button text="Test" className="custom" />);
    expect(container.firstChild).toHaveClass('button', 'custom');
  });

  it('renders children', () => {
    render(<Container><span>Child</span></Container>);
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});
```

### Pattern 2: Interaction Tests

```typescript
describe('Interactions', () => {
  it('calls onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button text="Click" onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('supports keyboard navigation', async () => {
    const handleClick = jest.fn();
    render(<Button text="Click" onClick={handleClick} />);

    const button = screen.getByRole('button');
    button.focus();
    await userEvent.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalled();
  });

  it('prevents action when disabled', () => {
    const handleClick = jest.fn();
    render(<Button text="Click" disabled onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### Pattern 3: State Tests

```typescript
describe('State', () => {
  it('updates on user input', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(input).toHaveValue('Hello');
  });

  it('shows loading state', () => {
    const { rerender } = render(<Button text="Submit" loading={false} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    rerender(<Button text="Submit" loading={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
```

### Pattern 4: Accessibility Tests

```typescript
describe('Accessibility', () => {
  it('has no violations', async () => {
    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has correct ARIA attributes', () => {
    render(<Button text="Close" aria-label="Close dialog" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close dialog');
  });

  it('is keyboard accessible', () => {
    render(<Button text="Click" />);
    const button = screen.getByRole('button');

    button.focus();
    expect(button).toHaveFocus();
  });

  it('has sufficient color contrast', async () => {
    const { container } = render(<Button text="Click" variant="primary" />);
    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: true } },
    });
    expect(results).toHaveNoViolations();
  });
});
```

### Pattern 5: Context API Tests

```typescript
describe('Context API', () => {
  it('inherits from provider', () => {
    const { container } = render(
      <AtomProvider value={{ size: 'lg' }}>
        <Button text="Test" />
      </AtomProvider>
    );
    expect(container.firstChild).toHaveClass('button--lg');
  });

  it('props override context', () => {
    const { container } = render(
      <AtomProvider value={{ size: 'lg' }}>
        <Button text="Test" size="sm" />
      </AtomProvider>
    );
    expect(container.firstChild).toHaveClass('button--sm');
    expect(container.firstChild).not.toHaveClass('button--lg');
  });
});
```

---

## 🏃 Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test File

```bash
npm test Button.test.tsx
```

### Run Tests Matching Pattern

```bash
npm test -- -t "Accessibility"
```

### Watch Mode

```bash
npm test -- --watch
```

### Coverage Report

```bash
npm run test:coverage
```

### Update Snapshots

```bash
npm test -- --updateSnapshot
# or
npm run test:update
```

### Debug Mode

```bash
npm run test:debug
# Then open chrome://inspect in Chrome
```

---

## 📊 Coverage Reports

### View Coverage

After running `npm run test:coverage`:

```bash
# Open HTML report
open coverage/lcov-report/index.html
```

### Coverage Thresholds

Minimum required coverage (configured in jest.config.js):

```
Statements   : 80%
Branches     : 80%
Functions    : 80%
Lines        : 80%
```

### Component-Specific Coverage

```bash
npm run test:coverage Button.test.tsx
```

---

## ✅ Best Practices

### 1. Test Behavior, Not Implementation

**❌ Bad:**
```typescript
it('has state variable', () => {
  const wrapper = shallow(<Component />);
  expect(wrapper.state('count')).toBe(0);
});
```

**✅ Good:**
```typescript
it('displays initial count', () => {
  render(<Component />);
  expect(screen.getByText('Count: 0')).toBeInTheDocument();
});
```

### 2. Use Accessible Queries

**Priority order:**
1. `getByRole` - Most accessible
2. `getByLabelText` - Form fields
3. `getByPlaceholderText` - If no label
4. `getByText` - Non-interactive content
5. `getByTestId` - Last resort

**✅ Good:**
```typescript
const button = screen.getByRole('button', { name: /submit/i });
const input = screen.getByLabelText(/email/i);
```

### 3. Clean Up After Tests

```typescript
afterEach(() => {
  cleanup(); // React Testing Library auto-cleanup
  jest.clearAllMocks();
});
```

### 4. Mock External Dependencies

```typescript
jest.mock('@/lib/api', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'mocked' })),
}));
```

### 5. Test Edge Cases

```typescript
describe('Edge Cases', () => {
  it('handles empty string', () => {
    render(<Component text="" />);
    // Assert behavior
  });

  it('handles very long text', () => {
    render(<Component text={'A'.repeat(1000)} />);
    // Assert behavior
  });

  it('handles special characters', () => {
    render(<Component text="<>&\"'" />);
    // Assert behavior
  });
});
```

---

## 🚨 Common Issues

### Issue 1: "Cannot find module '@/...'"

**Solution:** Check `moduleNameMapper` in `jest.config.js`:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### Issue 2: "ReferenceError: window is not defined"

**Solution:** Ensure `testEnvironment: 'jsdom'` in `jest.config.js`

### Issue 3: CSS import errors

**Solution:** Mock CSS in `moduleNameMapper`:

```javascript
'\\.(css|less|scss)$': 'identity-obj-proxy',
```

### Issue 4: "Act warnings"

**Solution:** Wrap state updates in `act()`:

```typescript
import { act } from '@testing-library/react';

await act(async () => {
  // State updates
});
```

---

## 📚 Resources

### Documentation
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [jest-axe](https://github.com/nickcolley/jest-axe)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

### Cheat Sheets
- [React Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
- [Jest Cheatsheet](https://github.com/sapegin/jest-cheat-sheet)

---

## ✅ Checklist

Before merging component:

- [ ] All tests passing
- [ ] Coverage ≥80% (statements, branches, functions, lines)
- [ ] 0 accessibility violations (jest-axe)
- [ ] Keyboard navigation tested
- [ ] Screen reader compatibility tested
- [ ] Edge cases covered
- [ ] Context API integration tested
- [ ] Snapshots updated (if needed)

---

**Guide Version:** 1.0.0
**Last Updated:** November 6, 2025
**Follows:** God-Tier Development Protocol 2025
