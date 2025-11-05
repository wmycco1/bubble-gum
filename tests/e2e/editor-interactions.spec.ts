// ═══════════════════════════════════════════════════════════════
// E2E TEST: Editor Component Interactions
// ═══════════════════════════════════════════════════════════════
// Tests critical user flows:
// - Component selection
// - Properties Panel updates
// - Component editing
// - Component deletion
// ═══════════════════════════════════════════════════════════════

import { test, expect } from '@playwright/test';

test.describe('Editor Component Interactions', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to editor with test project
    // TODO: Replace with actual test project ID from test setup
    await page.goto('/editor/4fb698ce-6635-46b6-8614-8abf5e7a5e25');

    // Wait for editor to load
    await page.waitForSelector('text=Components', { timeout: 10000 });
  });

  test('should add component to canvas', async ({ page }) => {
    // Click Text component in palette
    await page.click('button:has-text("Text")');

    // Wait for component to appear in canvas
    await page.waitForTimeout(500);

    // Verify component exists (should have blue ring when selected)
    const canvas = page.locator('[class*="ring-blue-500"]');
    await expect(canvas).toBeVisible();
  });

  test('should select component and open Properties Panel', async ({ page }) => {
    // Add Text component
    await page.click('button:has-text("Text")');
    await page.waitForTimeout(500);

    // Component should be auto-selected after adding
    // Properties Panel should show "Text Component"
    await expect(page.locator('text=Text Component')).toBeVisible();

    // Verify Properties Panel has content input
    const contentInput = page.locator('textarea[placeholder*="Your text"]');
    await expect(contentInput).toBeVisible();
  });

  test('should edit component properties', async ({ page }) => {
    // Add Text component
    await page.click('button:has-text("Text")');
    await page.waitForTimeout(500);

    // Edit text in Properties Panel
    const contentInput = page.locator('textarea[placeholder*="Your text"]');
    await contentInput.fill('Hello World Test');

    // Wait for auto-save
    await page.waitForTimeout(11000); // Auto-save debounce is 10s

    // Verify text appears in canvas (in visual component)
    await expect(page.locator('text=Hello World Test')).toBeVisible();
  });

  test('should delete component via delete button', async ({ page }) => {
    // Add Button component
    await page.click('button:has-text("Button")');
    await page.waitForTimeout(500);

    // Verify component is selected (has blue ring)
    const selectedComponent = page.locator('[class*="ring-blue-500"]').first();
    await expect(selectedComponent).toBeVisible();

    // Click delete button (trash icon)
    const deleteButton = page.locator('button:has-text("🗑️")');
    await deleteButton.click();

    // Wait for deletion animation
    await page.waitForTimeout(500);

    // Verify component removed
    await expect(selectedComponent).not.toBeVisible();

    // Properties Panel should show "No component selected"
    await expect(page.locator('text=No component selected')).toBeVisible();
  });

  test('should delete component via keyboard shortcut', async ({ page }) => {
    // Add Image component
    await page.click('button:has-text("Image")');
    await page.waitForTimeout(500);

    // Press Delete key
    await page.keyboard.press('Delete');

    // Wait for deletion
    await page.waitForTimeout(500);

    // Verify Properties Panel shows "No component selected"
    await expect(page.locator('text=No component selected')).toBeVisible();
  });

  test('should show visual feedback on component click', async ({ page }) => {
    // Add multiple components
    await page.click('button:has-text("Text")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Button")');
    await page.waitForTimeout(300);

    // Click first component (Text)
    const firstComponent = page.locator('[class*="ring-blue-500"]').first();
    await firstComponent.click();

    // Wait for toast notification
    await page.waitForTimeout(200);

    // Verify toast appears (react-hot-toast creates div with role="status")
    const toast = page.locator('div[role="status"]:has-text("Selected")');
    await expect(toast).toBeVisible();
  });

  test('should handle Form component rendering', async ({ page }) => {
    // Add Form component
    await page.click('button:has-text("Form")');
    await page.waitForTimeout(500);

    // Verify form fields render correctly (not just first letter)
    await expect(page.locator('label:has-text("Name")')).toBeVisible();
    await expect(page.locator('label:has-text("Email")')).toBeVisible();

    // Verify submit button
    await expect(page.locator('button[type="submit"]:has-text("Submit")')).toBeVisible();
  });

  test('should deselect component on Escape key', async ({ page }) => {
    // Add component
    await page.click('button:has-text("Button")');
    await page.waitForTimeout(500);

    // Verify component selected
    await expect(page.locator('[class*="ring-blue-500"]')).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    // Properties Panel should show "No component selected"
    await expect(page.locator('text=No component selected')).toBeVisible();
  });

  test('should maintain selection state across re-renders', async ({ page }) => {
    // Add Text component
    await page.click('button:has-text("Text")');
    await page.waitForTimeout(500);

    // Edit text
    const contentInput = page.locator('textarea[placeholder*="Your text"]');
    await contentInput.fill('Test Text');
    await page.waitForTimeout(200);

    // Component should remain selected (blue ring visible)
    await expect(page.locator('[class*="ring-blue-500"]')).toBeVisible();

    // Properties Panel should still show Text Component
    await expect(page.locator('text=Text Component')).toBeVisible();
  });
});
