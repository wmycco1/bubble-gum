# 🎭 E2E TESTS EXAMPLES (PLAYWRIGHT)

**Generated:** November 2, 2025  
**Tool:** Playwright  
**Coverage:** Critical User Flows

---

## 📋 TABLE OF CONTENTS

1. [Authentication Flow](#authentication-flow)
2. [Page Creation Flow](#page-creation-flow)
3. [Payment Flow](#payment-flow)
4. [Editor Flow](#editor-flow)
5. [Publishing Flow](#publishing-flow)

---

## 🔐 AUTHENTICATION FLOW

### Test 1: Sign Up

```typescript
// tests/e2e/auth/signup.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Sign Up Flow', () => {
  test('user can sign up successfully', async ({ page }) => {
    await page.goto('/sign-up');

    // Fill in sign-up form
    await page.fill('[name="email"]', `test-${Date.now()}@example.com`);
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.fill('[name="confirm-password"]', 'SecurePass123!');
    
    // Submit
    await page.click('button[type="submit"]');

    // Wait for redirect
    await expect(page).toHaveURL('/onboarding');
    
    // Check welcome message
    await expect(page.locator('h1')).toContainText('Welcome');
  });

  test('shows validation errors for invalid email', async ({ page }) => {
    await page.goto('/sign-up');

    await page.fill('[name="email"]', 'invalid-email');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error')).toContainText('Invalid email');
  });

  test('shows error for weak password', async ({ page }) => {
    await page.goto('/sign-up');

    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', '123');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error')).toContainText('Password too weak');
  });
});
```

### Test 2: Sign In

```typescript
// tests/e2e/auth/signin.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Sign In Flow', () => {
  test('user can sign in with valid credentials', async ({ page }) => {
    await page.goto('/sign-in');

    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/sign-in');

    await page.fill('[name="email"]', 'wrong@example.com');
    await page.fill('[name="password"]', 'WrongPassword');
    
    await page.click('button:has-text("Sign In")');

    await expect(page.locator('.alert-error')).toContainText('Invalid credentials');
  });

  test('remembers me checkbox works', async ({ page, context }) => {
    await page.goto('/sign-in');

    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.check('[name="remember-me"]');
    
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL('/dashboard');

    // Check for persistent session cookie
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name === 'session');
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.expires).toBeGreaterThan(Date.now() / 1000 + 86400);
  });
});
```

---

## 📄 PAGE CREATION FLOW

```typescript
// tests/e2e/pages/create-page.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Page Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/sign-in');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL('/dashboard');
  });

  test('creates new page from blank template', async ({ page }) => {
    await page.click('[data-testid="create-page"]');
    
    // Select blank template
    await page.click('[data-template="blank"]');
    
    // Fill page details
    await page.fill('[name="title"]', 'My Landing Page');
    await page.fill('[name="description"]', 'A beautiful landing page');
    
    await page.click('button:has-text("Create Page")');

    // Should redirect to editor
    await expect(page).toHaveURL(/\/editor\/[a-z0-9]+/);
    
    // Check page title
    await expect(page.locator('[data-testid="page-title"]')).toHaveValue('My Landing Page');
  });

  test('creates page from template', async ({ page }) => {
    await page.click('[data-testid="create-page"]');
    
    // Browse templates
    await page.click('[data-testid="browse-templates"]');
    
    // Select a template
    await page.click('[data-template="startup-landing"]');
    
    await page.fill('[name="title"]', 'Startup Homepage');
    await page.click('button:has-text("Use Template")');

    await expect(page).toHaveURL(/\/editor/);
    
    // Check that template content is loaded
    await expect(page.locator('.block')).toHaveCount(5); // Template has 5 blocks
  });

  test('validates required fields', async ({ page }) => {
    await page.click('[data-testid="create-page"]');
    await page.click('[data-template="blank"]');
    
    // Try to create without title
    await page.click('button:has-text("Create Page")');
    
    await expect(page.locator('.error')).toContainText('Title is required');
  });

  test('generates unique slug', async ({ page }) => {
    await page.click('[data-testid="create-page"]');
    await page.click('[data-template="blank"]');
    
    await page.fill('[name="title"]', 'My Amazing Page!');
    
    // Check generated slug
    const slugInput = page.locator('[name="slug"]');
    await expect(slugInput).toHaveValue('my-amazing-page');
  });
});
```

---

## 💳 PAYMENT FLOW

```typescript
// tests/e2e/payment/subscription.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Subscription Payment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.click('button:has-text("Sign In")');
  });

  test('upgrades to Pro plan successfully', async ({ page }) => {
    await page.goto('/pricing');
    
    // Click upgrade on Pro plan
    await page.click('[data-plan="pro"] button:has-text("Upgrade")');
    
    // Fill payment form (test card)
    await page.waitForSelector('[data-testid="payment-form"]');
    
    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');
    await page.fill('[data-testid="card-name"]', 'John Doe');
    
    // Submit payment
    await page.click('button:has-text("Subscribe")');
    
    // Wait for success
    await expect(page.locator('.toast-success')).toContainText('Successfully subscribed');
    
    // Check redirect
    await expect(page).toHaveURL('/dashboard?upgraded=true');
    
    // Verify Pro badge
    await expect(page.locator('[data-testid="plan-badge"]')).toContainText('Pro');
  });

  test('handles card decline', async ({ page }) => {
    await page.goto('/pricing');
    await page.click('[data-plan="pro"] button:has-text("Upgrade")');
    
    // Use test declined card
    await page.fill('[data-testid="card-number"]', '4000000000000002');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');
    
    await page.click('button:has-text("Subscribe")');
    
    await expect(page.locator('.alert-error')).toContainText('Your card was declined');
  });

  test('validates card information', async ({ page }) => {
    await page.goto('/pricing');
    await page.click('[data-plan="pro"] button:has-text("Upgrade")');
    
    // Invalid card number
    await page.fill('[data-testid="card-number"]', '1234');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.click('button:has-text("Subscribe")');
    
    await expect(page.locator('.error')).toContainText('Invalid card number');
  });
});
```

---

## ✏️ EDITOR FLOW

```typescript
// tests/e2e/editor/edit-page.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Page Editor', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Login and create a page
    await page.goto('/sign-in');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.click('button:has-text("Sign In")');
    
    // Create test page
    await page.click('[data-testid="create-page"]');
    await page.click('[data-template="blank"]');
    await page.fill('[name="title"]', 'Test Page');
    await page.click('button:has-text("Create Page")');
    
    await expect(page).toHaveURL(/\/editor/);
  });

  test('adds heading block', async ({ page }) => {
    // Click add block button
    await page.click('[data-testid="add-block"]');
    
    // Select heading
    await page.click('[data-block-type="heading"]');
    
    // Type heading text
    const heading = page.locator('[data-block-id]').last();
    await heading.click();
    await page.keyboard.type('Welcome to my page');
    
    // Verify
    await expect(heading).toContainText('Welcome to my page');
  });

  test('adds paragraph block', async ({ page }) => {
    await page.click('[data-testid="add-block"]');
    await page.click('[data-block-type="paragraph"]');
    
    const paragraph = page.locator('[data-block-id]').last();
    await paragraph.click();
    await page.keyboard.type('This is a paragraph');
    
    await expect(paragraph).toContainText('This is a paragraph');
  });

  test('adds image block', async ({ page }) => {
    await page.click('[data-testid="add-block"]');
    await page.click('[data-block-type="image"]');
    
    // Upload image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./tests/fixtures/test-image.jpg');
    
    // Wait for upload
    await expect(page.locator('img[src*="amazonaws.com"]')).toBeVisible();
  });

  test('reorders blocks with drag and drop', async ({ page }) => {
    // Add two blocks
    await page.click('[data-testid="add-block"]');
    await page.click('[data-block-type="heading"]');
    await page.keyboard.type('First');
    
    await page.click('[data-testid="add-block"]');
    await page.click('[data-block-type="heading"]');
    await page.keyboard.type('Second');
    
    // Get block handles
    const firstBlock = page.locator('[data-block-id]').first();
    const secondBlock = page.locator('[data-block-id]').last();
    
    // Drag second to first position
    await secondBlock.dragTo(firstBlock);
    
    // Verify order changed
    const blocks = page.locator('[data-block-id]');
    await expect(blocks.first()).toContainText('Second');
    await expect(blocks.last()).toContainText('First');
  });

  test('deletes block', async ({ page }) => {
    await page.click('[data-testid="add-block"]');
    await page.click('[data-block-type="heading"]');
    
    // Hover and click delete
    const block = page.locator('[data-block-id]').last();
    await block.hover();
    await page.click('[data-testid="delete-block"]');
    
    // Confirm deletion
    await page.click('button:has-text("Delete")');
    
    // Verify removed
    await expect(block).not.toBeVisible();
  });

  test('autosaves changes', async ({ page }) => {
    await page.click('[data-testid="add-block"]');
    await page.click('[data-block-type="heading"]');
    await page.keyboard.type('Test content');
    
    // Wait for autosave
    await expect(page.locator('[data-testid="save-status"]')).toContainText('Saved');
    
    // Reload page
    await page.reload();
    
    // Content should persist
    await expect(page.locator('[data-block-id]')).toContainText('Test content');
  });
});
```

---

## 🚀 PUBLISHING FLOW

```typescript
// tests/e2e/publishing/publish-page.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Page Publishing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.click('button:has-text("Sign In")');
    
    // Create and edit page
    await page.click('[data-testid="create-page"]');
    await page.click('[data-template="blank"]');
    await page.fill('[name="title"]', 'Publish Test');
    await page.click('button:has-text("Create Page")');
    
    // Add some content
    await page.click('[data-testid="add-block"]');
    await page.click('[data-block-type="heading"]');
    await page.keyboard.type('Hello World');
  });

  test('publishes page successfully', async ({ page }) => {
    await page.click('button:has-text("Publish")');
    
    // Confirm publishing
    await page.click('button:has-text("Publish Now")');
    
    // Success toast
    await expect(page.locator('.toast-success')).toContainText('Page published');
    
    // Status changes to published
    await expect(page.locator('[data-testid="publish-status"]')).toContainText('Published');
    
    // Get live URL
    const liveUrl = await page.locator('[data-testid="live-url"]').textContent();
    expect(liveUrl).toMatch(/https:\/\/.+\.bubblegum\.app/);
  });

  test('previews page before publishing', async ({ page, context }) => {
    await page.click('button:has-text("Preview")');
    
    // Opens new tab
    const [previewPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click('button:has-text("Preview")'),
    ]);
    
    await previewPage.waitForLoadState();
    
    // Check content
    await expect(previewPage.locator('h1')).toContainText('Hello World');
    
    // Close preview
    await previewPage.close();
  });

  test('configures custom domain', async ({ page }) => {
    await page.click('button:has-text("Publish")');
    await page.click('[data-testid="configure-domain"]');
    
    // Enter custom domain
    await page.fill('[name="custom-domain"]', 'mysite.com');
    await page.click('button:has-text("Save Domain")');
    
    // Shows DNS instructions
    await expect(page.locator('.dns-instructions')).toBeVisible();
  });

  test('unpublishes page', async ({ page }) => {
    // Publish first
    await page.click('button:has-text("Publish")');
    await page.click('button:has-text("Publish Now")');
    await expect(page.locator('.toast-success')).toBeVisible();
    
    // Now unpublish
    await page.click('button:has-text("Unpublish")');
    await page.click('button:has-text("Confirm Unpublish")');
    
    await expect(page.locator('.toast-success')).toContainText('Page unpublished');
    await expect(page.locator('[data-testid="publish-status"]')).toContainText('Draft');
  });
});
```

---

## 📊 VISUAL REGRESSION TESTS

```typescript
// tests/e2e/visual/homepage.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage matches snapshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png', {
      maxDiffPixels: 100,
    });
  });

  test('dashboard matches snapshot', async ({ page }) => {
    await page.goto('/sign-in');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.click('button:has-text("Sign In")');
    
    await expect(page).toHaveScreenshot('dashboard.png', {
      maxDiffPixels: 150,
    });
  });

  test('mobile homepage matches snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage-mobile.png');
  });
});
```

---

**E2E Tests Status:** ✅ Complete  
**Last Updated:** November 2, 2025
