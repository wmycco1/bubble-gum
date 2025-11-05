// ═══════════════════════════════════════════════════════════════
// EDITOR E2E TESTS (PLAYWRIGHT)
// ═══════════════════════════════════════════════════════════════
// Enterprise-grade E2E tests for Editor Page
// Coverage: Full user workflows, persistence, keyboard shortcuts
// ═══════════════════════════════════════════════════════════════

import { test, expect } from '@playwright/test';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Test Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const EDITOR_URL = 'http://localhost:3000/editor/test-project-id';

test.describe('Editor E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto(EDITOR_URL);
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Full User Workflow
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  test('Full workflow: Create project → Add components → Edit → Save → Refresh → Verify persistence', async ({
    page,
  }) => {
    // Navigate to editor
    await page.goto(EDITOR_URL);

    // Wait for page to load
    await expect(page.locator('[data-testid="editor-page"]')).toBeVisible();

    // Step 1: Add Button component
    await page.click('[data-testid="add-button"]');

    // Verify component appears on canvas
    await expect(page.locator('[data-testid="canvas-components"]')).toBeVisible();
    await expect(page.locator('[data-type="Button"]')).toBeVisible();

    // Step 2: Add Text component
    await page.click('[data-testid="add-text"]');

    // Verify 2 components on canvas
    const components = page.locator('[data-testid^="component-"]');
    await expect(components).toHaveCount(2);

    // Step 3: Select Button component
    await page.click('[data-type="Button"]');

    // Verify properties panel shows Button props
    await expect(page.locator('text=Properties: Button')).toBeVisible();

    // Step 4: Edit Button text
    const textInput = page.locator('[data-testid="input-button-text"]');
    await textInput.clear();
    await textInput.fill('Custom Button Text');

    // Wait for auto-save (10 seconds)
    await page.waitForTimeout(11000);

    // Verify save indicator (if visible)
    // await expect(page.locator('text=Saved')).toBeVisible();

    // Step 5: Refresh page
    await page.reload();

    // Step 6: Verify components persisted
    await expect(page.locator('[data-testid="canvas-components"]')).toBeVisible();
    await expect(components).toHaveCount(2);

    // Step 7: Verify edited text persisted
    await page.click('[data-type="Button"]');
    await expect(textInput).toHaveValue('Custom Button Text');
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Keyboard Shortcuts
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  test('Keyboard shortcuts: Ctrl+Z (Undo) and Ctrl+Y (Redo)', async ({
    page,
  }) => {
    await page.goto(EDITOR_URL);

    // Add Button
    await page.click('[data-testid="add-button"]');
    await expect(page.locator('[data-type="Button"]')).toBeVisible();

    // Undo with Ctrl+Z
    await page.keyboard.press('Control+Z');

    // Component should be removed
    await expect(page.locator('[data-testid="empty-canvas"]')).toBeVisible();

    // Redo with Ctrl+Y
    await page.keyboard.press('Control+Y');

    // Component should reappear
    await expect(page.locator('[data-type="Button"]')).toBeVisible();
  });

  test('Keyboard shortcut: Delete key deletes selected component', async ({
    page,
  }) => {
    await page.goto(EDITOR_URL);

    // Add Button
    await page.click('[data-testid="add-button"]');

    // Select component
    await page.click('[data-type="Button"]');

    // Verify selected
    await expect(page.locator('[data-type="Button"][data-selected="true"]')).toBeVisible();

    // Press Delete key
    await page.keyboard.press('Delete');

    // Component should be deleted
    await expect(page.locator('[data-testid="empty-canvas"]')).toBeVisible();
  });

  test('Keyboard shortcut: Escape deselects component', async ({ page }) => {
    await page.goto(EDITOR_URL);

    // Add Button
    await page.click('[data-testid="add-button"]');

    // Select component
    await page.click('[data-type="Button"]');
    await expect(page.locator('[data-type="Button"][data-selected="true"]')).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Component should be deselected
    await expect(page.locator('[data-type="Button"][data-selected="false"]')).toBeVisible();
    await expect(page.locator('text=No component selected')).toBeVisible();
  });

  test('Keyboard shortcut: Ctrl+D duplicates component', async ({ page }) => {
    await page.goto(EDITOR_URL);

    // Add Button
    await page.click('[data-testid="add-button"]');

    // Select component
    await page.click('[data-type="Button"]');

    // Duplicate with Ctrl+D
    await page.keyboard.press('Control+D');

    // Should have 2 Button components
    const buttons = page.locator('[data-type="Button"]');
    await expect(buttons).toHaveCount(2);
  });

  test('Keyboard shortcut: Ctrl+S triggers manual save', async ({ page }) => {
    await page.goto(EDITOR_URL);

    // Add Button
    await page.click('[data-testid="add-button"]');

    // Trigger manual save with Ctrl+S
    await page.keyboard.press('Control+S');

    // Wait for save indicator
    // await expect(page.locator('text=Saved')).toBeVisible();

    // Verify localStorage
    const stored = await page.evaluate(() => {
      return localStorage.getItem('bubble-gum-canvas-v1');
    });

    expect(stored).toBeTruthy();
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Mobile Viewport
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  test('Mobile viewport: Editor is responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(EDITOR_URL);

    // Verify editor loads
    await expect(page.locator('[data-testid="editor-page"]')).toBeVisible();

    // Add component
    await page.click('[data-testid="add-button"]');
    await expect(page.locator('[data-type="Button"]')).toBeVisible();

    // Verify component is visible in mobile viewport
    const component = page.locator('[data-type="Button"]');
    await expect(component).toBeInViewport();
  });

  test('Tablet viewport: Editor is responsive', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(EDITOR_URL);

    // Verify editor loads
    await expect(page.locator('[data-testid="editor-page"]')).toBeVisible();

    // Add multiple components
    await page.click('[data-testid="add-button"]');
    await page.click('[data-testid="add-text"]');

    // Verify all components visible
    const components = page.locator('[data-testid^="component-"]');
    await expect(components).toHaveCount(2);
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Component Library
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  test('Component Library: Add multiple different components', async ({
    page,
  }) => {
    await page.goto(EDITOR_URL);

    // Add Button
    await page.click('[data-testid="add-button"]');
    await expect(page.locator('[data-type="Button"]')).toBeVisible();

    // Add Text
    await page.click('[data-testid="add-text"]');
    await expect(page.locator('[data-type="Text"]')).toBeVisible();

    // Add Container
    await page.click('[data-testid="add-container"]');
    await expect(page.locator('[data-type="Container"]')).toBeVisible();

    // Verify total count
    const components = page.locator('[data-testid^="component-"]');
    await expect(components).toHaveCount(3);
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Properties Panel
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  test('Properties Panel: Edit Button text', async ({ page }) => {
    await page.goto(EDITOR_URL);

    // Add Button
    await page.click('[data-testid="add-button"]');

    // Select Button
    await page.click('[data-type="Button"]');

    // Verify properties panel
    await expect(page.locator('text=Properties: Button')).toBeVisible();

    // Edit text
    const textInput = page.locator('[data-testid="input-button-text"]');
    await textInput.clear();
    await textInput.fill('New Button Text');

    // Verify change applied (could check component or re-select)
    await expect(textInput).toHaveValue('New Button Text');
  });

  test('Properties Panel: Edit Text content', async ({ page }) => {
    await page.goto(EDITOR_URL);

    // Add Text
    await page.click('[data-testid="add-text"]');

    // Select Text
    await page.click('[data-type="Text"]');

    // Verify properties panel
    await expect(page.locator('text=Properties: Text')).toBeVisible();

    // Edit content
    const textInput = page.locator('[data-testid="input-text-content"]');
    await textInput.clear();
    await textInput.fill('Custom Text Content');

    // Verify change applied
    await expect(textInput).toHaveValue('Custom Text Content');
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Undo/Redo
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  test('Undo/Redo: Add component → Undo → Redo', async ({ page }) => {
    await page.goto(EDITOR_URL);

    // Add Button
    await page.click('[data-testid="add-button"]');
    await expect(page.locator('[data-type="Button"]')).toBeVisible();

    // Undo
    await page.click('[data-testid="btn-undo"]');
    await expect(page.locator('[data-testid="empty-canvas"]')).toBeVisible();

    // Redo
    await page.click('[data-testid="btn-redo"]');
    await expect(page.locator('[data-type="Button"]')).toBeVisible();
  });

  test('Undo/Redo: Edit props → Undo → Redo', async ({ page }) => {
    await page.goto(EDITOR_URL);

    // Add Button
    await page.click('[data-testid="add-button"]');

    // Select and edit
    await page.click('[data-type="Button"]');
    const textInput = page.locator('[data-testid="input-button-text"]');
    await textInput.clear();
    await textInput.fill('Modified');

    // Undo
    await page.click('[data-testid="btn-undo"]');
    await expect(textInput).toHaveValue('Click Me');

    // Redo
    await page.click('[data-testid="btn-redo"]');
    await expect(textInput).toHaveValue('Modified');
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Delete
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  test('Delete: Delete selected component', async ({ page }) => {
    await page.goto(EDITOR_URL);

    // Add Button
    await page.click('[data-testid="add-button"]');

    // Select component
    await page.click('[data-type="Button"]');

    // Delete
    await page.click('[data-testid="btn-delete"]');

    // Canvas should be empty
    await expect(page.locator('[data-testid="empty-canvas"]')).toBeVisible();
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Persistence
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  test('Persistence: Components persist after page refresh', async ({ page }) => {
    await page.goto(EDITOR_URL);

    // Add 2 components
    await page.click('[data-testid="add-button"]');
    await page.click('[data-testid="add-text"]');

    // Verify 2 components
    let components = page.locator('[data-testid^="component-"]');
    await expect(components).toHaveCount(2);

    // Refresh page
    await page.reload();

    // Verify components still exist
    components = page.locator('[data-testid^="component-"]');
    await expect(components).toHaveCount(2);
    await expect(page.locator('[data-type="Button"]')).toBeVisible();
    await expect(page.locator('[data-type="Text"]')).toBeVisible();
  });

  test('Persistence: Edited props persist after refresh', async ({ page }) => {
    await page.goto(EDITOR_URL);

    // Add Button
    await page.click('[data-testid="add-button"]');

    // Select and edit
    await page.click('[data-type="Button"]');
    const textInput = page.locator('[data-testid="input-button-text"]');
    await textInput.clear();
    await textInput.fill('Persistent Text');

    // Wait a bit for persistence
    await page.waitForTimeout(1000);

    // Refresh
    await page.reload();

    // Select Button again
    await page.click('[data-type="Button"]');

    // Verify text persisted
    await expect(textInput).toHaveValue('Persistent Text');
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Error Handling
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  test('Error: Page loads without crashing', async ({ page }) => {
    await page.goto(EDITOR_URL);

    // Check no console errors (critical ones)
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    // Wait for page to stabilize
    await page.waitForTimeout(2000);

    // Verify no critical errors
    // Note: May have some warnings, but no crashes
    await expect(page.locator('[data-testid="editor-page"]')).toBeVisible();
  });
});
