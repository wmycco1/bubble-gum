# 🧪 BUBBLE GUM - TESTING STRATEGY

**Generated:** November 2, 2025  
**Version:** 1.0.0  
**Coverage Goal:** 80%+ overall

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Testing Pyramid](#testing-pyramid)
3. [Unit Testing](#unit-testing)
4. [Integration Testing](#integration-testing)
5. [E2E Testing](#e2e-testing)
6. [Performance Testing](#performance-testing)
7. [Security Testing](#security-testing)
8. [Test Coverage](#test-coverage)
9. [CI/CD Integration](#cicd-integration)
10. [Best Practices](#best-practices)

---

## 🌐 OVERVIEW

### Testing Goals

- **Quality Assurance:** Catch bugs before production
- **Confidence:** Deploy with confidence
- **Documentation:** Tests as living documentation
- **Regression Prevention:** Prevent old bugs from returning
- **Performance:** Ensure app meets performance standards

### Testing Layers

```
        E2E Tests (5%)          ← Few, slow, expensive
       /              \
    Integration (15%)             ← Some, moderate
   /                    \
Unit Tests (80%)                  ← Many, fast, cheap
```

### Coverage Goals by Layer

| Layer | Target Coverage | Priority |
|-------|----------------|----------|
| Unit Tests | 80%+ | High |
| Integration Tests | 60%+ | Medium |
| E2E Tests | Critical paths | High |

---

## 🔺 TESTING PYRAMID

### 1. Unit Tests (80% of tests)

**What:** Test individual functions, components, utilities in isolation

**Tools:**
- Jest (test runner)
- React Testing Library (component testing)
- @testing-library/jest-dom (matchers)

**When to write:**
- Every utility function
- Every React component
- Every hook
- Every helper module
- Business logic functions

**Example:**
```typescript
// utils/formatPrice.test.ts
import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
  it('formats USD correctly', () => {
    expect(formatPrice(1234.56, 'USD')).toBe('$1,234.56');
  });
  
  it('handles zero', () => {
    expect(formatPrice(0, 'USD')).toBe('$0.00');
  });
  
  it('rounds to 2 decimals', () => {
    expect(formatPrice(1.999, 'USD')).toBe('$2.00');
  });
});
```

---

### 2. Integration Tests (15% of tests)

**What:** Test multiple units working together, including database, APIs, external services

**Tools:**
- Jest (test runner)
- Supertest (API testing)
- Prisma (test database)
- MSW (API mocking)

**When to write:**
- API routes
- Database operations
- Third-party integrations
- Complex workflows

**Example:**
```typescript
// tests/integration/api/pages.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/pages';
import { prisma } from '@/lib/prisma';

describe('/api/pages', () => {
  beforeEach(async () => {
    await prisma.page.deleteMany();
  });

  it('creates a new page', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { title: 'Test Page' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.title).toBe('Test Page');
  });
});
```

---

### 3. E2E Tests (5% of tests)

**What:** Test complete user flows from browser perspective

**Tools:**
- Playwright (browser automation)
- @playwright/test (test runner)

**When to write:**
- Critical user journeys
- Payment flows
- Authentication
- Core features
- Cross-browser compatibility

**Example:**
```typescript
// tests/e2e/page-creation.spec.ts
import { test, expect } from '@playwright/test';

test('user can create a page', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('text=Create Page');
  await page.fill('[name="title"]', 'My New Page');
  await page.click('button:has-text("Create")');
  
  await expect(page).toHaveURL(/\/editor\/[a-z0-9]+/);
  await expect(page.locator('h1')).toContainText('My New Page');
});
```

---

## 🧪 UNIT TESTING

### What to Test

#### ✅ DO Test:
- **Business logic** - calculations, validations, transformations
- **Utilities** - pure functions, helpers
- **Components** - rendering, user interactions, state
- **Hooks** - custom React hooks
- **Services** - API clients, data fetching
- **Reducers** - state management logic

#### ❌ DON'T Test:
- Third-party libraries (already tested)
- Implementation details (how, not what)
- Trivial code (getters/setters)
- Framework internals

---

### Component Testing Principles

#### 1. Test User Behavior (Not Implementation)

**❌ Bad (Implementation):**
```typescript
it('sets loading state to true', () => {
  const { result } = renderHook(() => useFetch('/api/data'));
  expect(result.current.loading).toBe(true);
});
```

**✅ Good (User Behavior):**
```typescript
it('shows loading spinner while fetching', () => {
  render(<DataComponent />);
  expect(screen.getByRole('status')).toBeInTheDocument();
});
```

#### 2. Test Accessibility

```typescript
it('has accessible form fields', () => {
  render(<ContactForm />);
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
});
```

#### 3. Test User Interactions

```typescript
it('submits form on enter key', async () => {
  const onSubmit = jest.fn();
  render(<Form onSubmit={onSubmit} />);
  
  const input = screen.getByRole('textbox');
  await userEvent.type(input, 'test{enter}');
  
  expect(onSubmit).toHaveBeenCalledWith({ text: 'test' });
});
```

---

### Testing Async Code

```typescript
// ✅ Use async/await
it('fetches data successfully', async () => {
  const promise = fetchData();
  await expect(promise).resolves.toEqual(expectedData);
});

// ✅ Use waitFor for async state updates
it('displays fetched data', async () => {
  render(<DataComponent />);
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

---

### Mocking Best Practices

#### Mock External Dependencies

```typescript
// Mock API calls
jest.mock('@/lib/api', () => ({
  fetchPages: jest.fn().mockResolvedValue([{ id: '1', title: 'Test' }]),
}));

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/dashboard',
  }),
}));

// Mock authentication
jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    userId: 'user-123',
    isSignedIn: true,
  }),
}));
```

---

## 🔗 INTEGRATION TESTING

### Database Testing

#### Setup Test Database

```typescript
// tests/setup/database.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

export async function cleanDatabase() {
  await prisma.$transaction([
    prisma.page.deleteMany(),
    prisma.user.deleteMany(),
    prisma.template.deleteMany(),
  ]);
}

// In jest.setup.js
beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

#### Test Database Operations

```typescript
describe('Page Repository', () => {
  it('creates page with associated blocks', async () => {
    const page = await createPage({
      title: 'Test',
      blocks: [
        { type: 'heading', content: 'Hello' },
        { type: 'paragraph', content: 'World' },
      ],
    });

    expect(page.blocks).toHaveLength(2);
    expect(page.blocks[0].type).toBe('heading');
  });

  it('deletes page and cascades to blocks', async () => {
    const page = await createPage({ title: 'Test' });
    await deletePage(page.id);

    const blocks = await prisma.block.findMany({
      where: { pageId: page.id },
    });
    expect(blocks).toHaveLength(0);
  });
});
```

---

### API Testing

```typescript
import request from 'supertest';
import { app } from '@/app';

describe('POST /api/pages', () => {
  it('requires authentication', async () => {
    const response = await request(app)
      .post('/api/pages')
      .send({ title: 'Test' });

    expect(response.status).toBe(401);
  });

  it('validates required fields', async () => {
    const response = await request(app)
      .post('/api/pages')
      .set('Authorization', 'Bearer valid-token')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('title is required');
  });

  it('creates page successfully', async () => {
    const response = await request(app)
      .post('/api/pages')
      .set('Authorization', 'Bearer valid-token')
      .send({ title: 'My Page' });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('My Page');
  });
});
```

---

### Third-Party Integration Testing

#### Mock External APIs

```typescript
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.post('https://api.stripe.com/v1/charges', (req, res, ctx) => {
    return res(ctx.json({ id: 'ch_123', status: 'succeeded' }));
  }),
  
  rest.post('https://api.anthropic.com/v1/messages', (req, res, ctx) => {
    return res(ctx.json({ 
      content: [{ type: 'text', text: 'AI response' }] 
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 🎭 E2E TESTING

### Critical User Flows

#### 1. Authentication Flow
```typescript
test('complete authentication flow', async ({ page }) => {
  // Sign up
  await page.goto('/sign-up');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'SecurePass123!');
  await page.click('button:has-text("Sign Up")');
  
  // Verify email (mock)
  await page.goto('/verify-email?token=mock-token');
  
  // Redirected to onboarding
  await expect(page).toHaveURL('/onboarding');
});
```

#### 2. Page Creation Flow
```typescript
test('create and publish page', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Create page
  await page.click('[data-testid="create-page"]');
  await page.fill('[name="title"]', 'Landing Page');
  await page.click('text=Create');
  
  // Add content
  await page.click('[data-testid="add-heading"]');
  await page.fill('[contenteditable]', 'Welcome!');
  
  // Publish
  await page.click('button:has-text("Publish")');
  await expect(page.locator('.toast')).toContainText('Published');
});
```

#### 3. Payment Flow
```typescript
test('complete payment for pro plan', async ({ page }) => {
  await page.goto('/pricing');
  await page.click('[data-plan="pro"]');
  
  // Fill payment form
  await page.fill('[data-testid="card-number"]', '4242424242424242');
  await page.fill('[data-testid="card-expiry"]', '12/25');
  await page.fill('[data-testid="card-cvc"]', '123');
  
  // Submit
  await page.click('button:has-text("Subscribe")');
  
  // Verify success
  await expect(page).toHaveURL('/dashboard?upgraded=true');
  await expect(page.locator('.badge')).toContainText('Pro');
});
```

---

### Visual Regression Testing

```typescript
test('homepage looks correct', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixels: 100,
  });
});

test('mobile view matches design', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage-mobile.png');
});
```

---

### Cross-Browser Testing

```typescript
// playwright.config.ts
export default {
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  ],
};
```

---

## 📊 TEST COVERAGE

### Coverage Goals

| Type | Target | Critical Path |
|------|--------|---------------|
| Statements | 80% | 100% |
| Branches | 75% | 100% |
| Functions | 80% | 100% |
| Lines | 80% | 100% |

### Generate Coverage Report

```bash
# Unit tests
npm run test:coverage

# View HTML report
open coverage/index.html
```

### Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThresholds: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/lib/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/__tests__/**',
  ],
};
```

---

## 🔄 CI/CD INTEGRATION

### GitHub Actions Workflow

```yaml
# Already in github-actions-ci-cd.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm run test:unit -- --coverage
        
      - name: Run integration tests
        run: npm run test:integration
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload coverage
        uses: codecov/codecov-action@v4
```

---

## ✅ BEST PRACTICES

### 1. Test Naming Convention

**Pattern:** `should [expected behavior] when [condition]`

```typescript
describe('LoginForm', () => {
  it('should show error when password is too short', () => {});
  it('should submit successfully when valid credentials provided', () => {});
  it('should disable submit button when form is invalid', () => {});
});
```

### 2. AAA Pattern (Arrange, Act, Assert)

```typescript
it('formats currency correctly', () => {
  // Arrange
  const amount = 1234.56;
  const currency = 'USD';
  
  // Act
  const result = formatCurrency(amount, currency);
  
  // Assert
  expect(result).toBe('$1,234.56');
});
```

### 3. One Assertion Per Test (When Possible)

```typescript
// ✅ Good - focused
it('returns 404 when page not found', () => {
  expect(response.status).toBe(404);
});

it('returns error message when page not found', () => {
  expect(response.body.error).toBe('Page not found');
});

// ❌ Avoid - testing multiple things
it('handles not found error', () => {
  expect(response.status).toBe(404);
  expect(response.body.error).toBe('Page not found');
  expect(response.headers['content-type']).toContain('json');
});
```

### 4. Test Data Builders

```typescript
// tests/builders/page.builder.ts
export class PageBuilder {
  private data = {
    title: 'Test Page',
    slug: 'test-page',
    blocks: [],
    published: false,
  };

  withTitle(title: string) {
    this.data.title = title;
    return this;
  }

  published() {
    this.data.published = true;
    return this;
  }

  withBlocks(blocks: any[]) {
    this.data.blocks = blocks;
    return this;
  }

  build() {
    return this.data;
  }
}

// Usage
const page = new PageBuilder()
  .withTitle('My Page')
  .published()
  .build();
```

### 5. Avoid Test Interdependence

```typescript
// ❌ Bad - tests depend on each other
let userId;

it('creates user', () => {
  userId = createUser();
});

it('updates user', () => {
  updateUser(userId); // Depends on previous test
});

// ✅ Good - independent tests
it('creates user', () => {
  const userId = createUser();
  expect(userId).toBeDefined();
});

it('updates user', () => {
  const userId = createUser(); // Create own data
  updateUser(userId);
});
```

---

## 🎯 TESTING CHECKLIST

### Before Merging PR

- [ ] All tests pass locally
- [ ] New code has 80%+ coverage
- [ ] E2E tests for new features
- [ ] No skipped/disabled tests without reason
- [ ] Tests are fast (<5s for unit)
- [ ] No console errors/warnings
- [ ] Tests are deterministic (no flakiness)

### Critical Paths Must Have

- [ ] Unit tests (components, utilities)
- [ ] Integration tests (APIs, database)
- [ ] E2E tests (user flows)
- [ ] Performance tests
- [ ] Security tests
- [ ] Accessibility tests

---

## 📚 RESOURCES

### Documentation
- [Jest Docs](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Docs](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)

### Tools
- [MSW](https://mswjs.io/) - API mocking
- [Faker.js](https://fakerjs.dev/) - Test data generation
- [Codecov](https://codecov.io/) - Coverage reports

---

**Testing Strategy Status:** ✅ Complete  
**Last Updated:** November 2, 2025  
**Next:** See test examples in `/tests` directory
