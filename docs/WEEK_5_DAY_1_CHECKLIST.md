# Week 5, Day 1: Implementation Checklist

**Date:** Week 5, Day 1 (Monday)
**Goal:** Complete ButtonComponent migration + establish pattern for remaining Atoms
**Protocol:** God-Tier Development Protocol 2025

---

## 📊 Overview

**Component:** ButtonComponent (First Atom)
**Status:** Template 100% ready (1,300+ lines)
**Team:** Dev 1
**Estimated Time:** 6-8 hours (1 day)

**What's Already Done:**
✅ Button.tsx (120 lines) - Implementation
✅ Button.types.ts (90 lines) - TypeScript interfaces
✅ Button.test.tsx (400+ lines) - 62 tests
✅ Button.stories.tsx (400+ lines) - 30+ stories
✅ README.md (380+ lines) - Documentation
✅ index.ts (6 lines) - Barrel export

**What Needs To Be Done:**
🎯 Install dependencies
🎯 Implement CSS styles
🎯 Run and verify tests
🎯 Run and verify Storybook
🎯 Code review
🎯 Merge to main

---

## ⏰ Timeline

### Morning Session (9:00 AM - 12:00 PM)

**9:00 - 9:30 AM: Environment Setup (30 min)**
- [ ] Team standup meeting
- [ ] Review PHASE 1 kickoff document
- [ ] Assign tasks (Dev 1: Button, Dev 2: Input, Dev 3: Text)

**9:30 - 10:30 AM: Dependencies Installation (1 hour)**
- [ ] Install testing dependencies
- [ ] Install Storybook dependencies
- [ ] Configure Jest
- [ ] Configure Storybook
- [ ] Verify installations

**10:30 - 12:00 PM: CSS Implementation (1.5 hours)**
- [ ] Create Button.module.css or styled-components
- [ ] Implement base styles
- [ ] Implement variant styles (primary, secondary, outline, ghost, danger)
- [ ] Implement size styles (sm, md, lg, xl)
- [ ] Implement state styles (disabled, loading, fullWidth)
- [ ] Test visual appearance in browser

### Lunch Break (12:00 PM - 1:00 PM)

### Afternoon Session (1:00 PM - 5:00 PM)

**1:00 - 2:00 PM: Testing (1 hour)**
- [ ] Run all 62 tests
- [ ] Fix any failing tests
- [ ] Verify 80%+ coverage
- [ ] Check accessibility (jest-axe)
- [ ] Fix any violations

**2:00 - 3:30 PM: Storybook Verification (1.5 hours)**
- [ ] Start Storybook server
- [ ] Verify all 30+ stories render
- [ ] Test interactive controls
- [ ] Check responsive behavior (viewport addon)
- [ ] Verify accessibility tab (0 violations)
- [ ] Test all variants visually

**3:30 - 4:30 PM: Quality Checks (1 hour)**
- [ ] Run TypeScript type-check (0 errors)
- [ ] Run linting (0 errors, 0 warnings)
- [ ] Run God-Tier checklist
- [ ] Test Context API integration
- [ ] Verify parameter inheritance

**4:30 - 5:00 PM: Code Review & Merge (30 min)**
- [ ] Create pull request
- [ ] Self-review using checklist
- [ ] Request peer review
- [ ] Address feedback
- [ ] Merge to main

### Evening Wrap-up (5:00 PM - 5:30 PM)

**5:00 - 5:30 PM: Documentation & Standup (30 min)**
- [ ] Update migration tracking
- [ ] Document lessons learned
- [ ] Evening standup (what worked, what didn't)
- [ ] Plan Day 2 (InputComponent, IconComponent)

---

## ✅ Detailed Checklist

### Phase 1: Environment Setup

#### 1.1 Install Testing Dependencies

```bash
# Core testing libraries
npm install --save-dev \
  jest@29 \
  @jest/globals@29 \
  @types/jest@29 \
  jest-environment-jsdom@29

# React Testing Library
npm install --save-dev \
  @testing-library/react@14 \
  @testing-library/jest-dom@6 \
  @testing-library/user-event@14

# Accessibility testing
npm install --save-dev \
  jest-axe@8 \
  @axe-core/react@4

# SWC for fast transforms
npm install --save-dev \
  @swc/core@1 \
  @swc/jest@0.2
```

- [ ] Run installation command
- [ ] Verify no errors in output
- [ ] Check package.json for new dependencies

#### 1.2 Configure Jest

Create `jest.config.js`:

```bash
# Copy from TESTING_SETUP_GUIDE.md
```

- [ ] Create jest.config.js in project root
- [ ] Configure testEnvironment: 'jsdom'
- [ ] Configure moduleNameMapper for @/ alias
- [ ] Set coverage thresholds to 80%
- [ ] Add test patterns

Create `jest.setup.js`:

- [ ] Create jest.setup.js in project root
- [ ] Import @testing-library/jest-dom
- [ ] Extend jest matchers with jest-axe
- [ ] Mock window.matchMedia
- [ ] Mock IntersectionObserver

Create `__mocks__/fileMock.js`:

- [ ] Create __mocks__ directory
- [ ] Create fileMock.js for images/CSS

#### 1.3 Install Storybook Dependencies

```bash
# Initialize Storybook (auto-detects React)
npx storybook@latest init

# Or install manually
npm install --save-dev \
  storybook@8 \
  @storybook/react@8 \
  @storybook/addon-essentials@8 \
  @storybook/addon-interactions@8 \
  @storybook/addon-a11y@8 \
  @storybook/test@8
```

- [ ] Run Storybook installation
- [ ] Verify .storybook/ directory created
- [ ] Check for main.ts and preview.ts files

#### 1.4 Configure Storybook

Update `.storybook/main.ts`:

- [ ] Configure story patterns
- [ ] Add required addons
- [ ] Configure Vite with @/ alias
- [ ] Enable autodocs

Update `.storybook/preview.ts`:

- [ ] Import global CSS
- [ ] Configure parameters (a11y, viewport, controls)
- [ ] Add global decorators if needed

#### 1.5 Add npm Scripts

Update `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

- [ ] Add test scripts
- [ ] Add Storybook scripts
- [ ] Verify scripts work: `npm test -- --version`

---

### Phase 2: CSS Implementation

#### 2.1 Choose CSS Approach

**Option A: CSS Modules** (Recommended)
```css
/* Button.module.css */
.button { /* base styles */ }
.button--primary { /* variant */ }
.button--sm { /* size */ }
```

**Option B: Styled Components**
```typescript
const StyledButton = styled.button`
  /* styles */
`;
```

**Option C: Tailwind CSS**
```typescript
className="px-4 py-2 bg-blue-500..."
```

- [ ] Choose CSS approach
- [ ] Create CSS file (Button.module.css or styled component)

#### 2.2 Implement Base Styles

```css
.button {
  /* Reset */
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  font: inherit;
  cursor: pointer;

  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;

  /* Focus visible */
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
}
```

- [ ] Reset browser default styles
- [ ] Add base display and layout
- [ ] Add focus styles (accessibility)
- [ ] Add transitions

#### 2.3 Implement Variant Styles

```css
.button--primary {
  background-color: #3b82f6;
  color: white;
}

.button--primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.button--secondary {
  background-color: #6b7280;
  color: white;
}

.button--outline {
  background-color: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
}

.button--ghost {
  background-color: transparent;
  color: #374151;
}

.button--danger {
  background-color: #ef4444;
  color: white;
}
```

- [ ] Implement primary variant
- [ ] Implement secondary variant
- [ ] Implement outline variant
- [ ] Implement ghost variant
- [ ] Implement danger variant
- [ ] Add hover states for each
- [ ] Ensure disabled state works (`:not(:disabled)`)

#### 2.4 Implement Size Styles

```css
.button--sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.button--md {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  line-height: 1.5rem;
}

.button--lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.button--xl {
  padding: 1rem 2rem;
  font-size: 1.25rem;
  line-height: 1.75rem;
}
```

- [ ] Implement small size
- [ ] Implement medium size
- [ ] Implement large size
- [ ] Implement extra large size

#### 2.5 Implement State Styles

```css
.button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button--loading {
  position: relative;
  color: transparent;
}

.button__spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* Add spinner animation */
}

.button--full-width {
  width: 100%;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

- [ ] Implement disabled state
- [ ] Implement loading state
- [ ] Implement loading spinner
- [ ] Implement full-width state
- [ ] Add visually-hidden utility

#### 2.6 Import CSS in Component

```typescript
// Button.tsx
import styles from './Button.module.css';

// Update classes
const classes = [
  styles.button,
  styles[`button--${variant}`],
  styles[`button--${size}`],
  disabled && styles['button--disabled'],
  loading && styles['button--loading'],
  fullWidth && styles['button--full-width'],
  className,
]
  .filter(Boolean)
  .join(' ');
```

- [ ] Import CSS module
- [ ] Update className logic
- [ ] Test in browser

---

### Phase 3: Testing

#### 3.1 Run Tests

```bash
# Run all Button tests
npm test Button.test.tsx

# Run with coverage
npm run test:coverage Button.test.tsx

# Watch mode
npm test Button.test.tsx -- --watch
```

- [ ] Run test command
- [ ] Verify all 62 tests pass
- [ ] Check test output for failures

#### 3.2 Fix Failing Tests

If tests fail:

- [ ] Read error messages carefully
- [ ] Check which test suite failed
- [ ] Fix implementation or test
- [ ] Re-run tests
- [ ] Repeat until all pass

Common fixes:
- CSS class names mismatch → Update test or implementation
- Missing props → Add default values
- Event handlers not called → Check disabled/loading guards

#### 3.3 Verify Coverage

```bash
npm run test:coverage Button.test.tsx
```

Check coverage report:

- [ ] Statements ≥ 80%
- [ ] Branches ≥ 80%
- [ ] Functions ≥ 90%
- [ ] Lines ≥ 80%

If coverage is low:
- [ ] Add tests for uncovered lines
- [ ] Test edge cases
- [ ] Test all variants

#### 3.4 Verify Accessibility

- [ ] Check jest-axe results in test output
- [ ] Ensure 0 accessibility violations
- [ ] If violations found:
  - Read violation description
  - Fix implementation
  - Re-run tests

---

### Phase 4: Storybook Verification

#### 4.1 Start Storybook

```bash
npm run storybook
```

- [ ] Run Storybook command
- [ ] Wait for server to start
- [ ] Open http://localhost:6006
- [ ] Navigate to Atoms > Button

#### 4.2 Visual Verification

Test each story:

- [ ] Default story renders
- [ ] Primary variant looks correct
- [ ] Secondary variant looks correct
- [ ] Outline variant looks correct
- [ ] Ghost variant looks correct
- [ ] Danger variant looks correct
- [ ] All sizes render (sm, md, lg, xl)
- [ ] Disabled state shows opacity
- [ ] Loading state shows spinner
- [ ] Icons render correctly
- [ ] Full width button spans container

#### 4.3 Interactive Controls

- [ ] Change "text" control → button updates
- [ ] Change "variant" control → styles update
- [ ] Change "size" control → size updates
- [ ] Toggle "disabled" → button becomes disabled
- [ ] Toggle "loading" → spinner appears
- [ ] Click button → Actions panel logs onClick

#### 4.4 Responsive Testing

- [ ] Click viewport addon (toolbar)
- [ ] Test Mobile (375px)
- [ ] Test Tablet (768px)
- [ ] Test Desktop (1920px)
- [ ] Verify button looks good at all sizes

#### 4.5 Accessibility Testing

- [ ] Click "Accessibility" tab
- [ ] Verify 0 violations shown
- [ ] Test keyboard navigation (Tab to focus)
- [ ] Test Enter/Space to click
- [ ] Check contrast ratios pass

---

### Phase 5: Quality Checks

#### 5.1 TypeScript Type Check

```bash
npm run type-check
# or
npx tsc --noEmit
```

- [ ] Run type-check command
- [ ] Verify 0 errors
- [ ] If errors, fix and re-run

#### 5.2 Linting

```bash
npm run lint

# Auto-fix if available
npm run lint:fix
```

- [ ] Run linting
- [ ] Verify 0 errors, 0 warnings
- [ ] Fix any issues
- [ ] Re-run until clean

#### 5.3 God-Tier Checklist

Run through God-Tier checklist:

**Code Quality:**
- [ ] TypeScript strict mode (0 errors)
- [ ] No `any` types used
- [ ] All props properly typed
- [ ] JSDoc documentation complete

**Testing:**
- [ ] All tests pass (62/62)
- [ ] Coverage ≥80% (statements, branches, functions, lines)
- [ ] Accessibility tests pass (jest-axe)
- [ ] Edge cases tested

**Storybook:**
- [ ] All stories render (30+)
- [ ] Controls work
- [ ] Documentation clear
- [ ] Accessibility tab shows 0 violations

**Accessibility:**
- [ ] ARIA attributes present
- [ ] Keyboard navigation works
- [ ] Focus visible
- [ ] Screen reader compatible
- [ ] Color contrast passes

**Performance:**
- [ ] No unnecessary re-renders
- [ ] useMemo used where appropriate
- [ ] Event handlers stable

#### 5.4 Context API Integration

Test parameter inheritance:

- [ ] Create test page with AtomProvider
- [ ] Wrap Button in provider
- [ ] Verify inherited parameters work
- [ ] Verify props override context

#### 5.5 Cross-Browser Testing (Optional)

- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari (if available)
- [ ] Test on mobile device

---

### Phase 6: Code Review & Merge

#### 6.1 Create Pull Request

```bash
git checkout -b feat/button-component
git add src/components/atoms/Button/
git commit -m "feat: complete ButtonComponent migration (Atom)

- Implement CSS styles (all variants, sizes, states)
- Verify 62 tests pass (80%+ coverage)
- Verify 30+ Storybook stories
- 0 accessibility violations
- Context API integration working
- God-Tier checklist complete"

git push origin feat/button-component
```

- [ ] Create feature branch
- [ ] Add Button files
- [ ] Write descriptive commit message
- [ ] Push to remote
- [ ] Create PR on GitHub

#### 6.2 Self-Review Checklist

Review your own code:

- [ ] Read through all changed files
- [ ] Check for console.logs (remove)
- [ ] Check for TODO comments (resolve)
- [ ] Verify naming conventions
- [ ] Check formatting consistency
- [ ] Run all checks one more time

#### 6.3 Request Peer Review

- [ ] Assign reviewer (Dev 2 or Dev 3)
- [ ] Add PR description with:
  - What changed
  - How to test
  - Screenshots (optional)
  - Checklist of completed items
- [ ] Link to PHASE_1_KICKOFF.md

#### 6.4 Address Feedback

- [ ] Read reviewer comments
- [ ] Make requested changes
- [ ] Push additional commits
- [ ] Re-request review
- [ ] Repeat until approved

#### 6.5 Merge to Main

Once approved:

- [ ] Squash and merge (or regular merge)
- [ ] Delete feature branch
- [ ] Pull latest main
- [ ] Verify Button in main branch

---

### Phase 7: Documentation & Wrap-up

#### 7.1 Update Tracking

- [ ] Mark ButtonComponent as COMPLETE in tracking
- [ ] Update PHASE_1 progress (1/15 Atoms done)
- [ ] Document time spent
- [ ] Note any blockers encountered

#### 7.2 Lessons Learned

Document what you learned:

- [ ] What went well?
- [ ] What took longer than expected?
- [ ] What shortcuts can be used for next component?
- [ ] Any patterns to reuse?
- [ ] Any issues to watch out for?

#### 7.3 Evening Standup

Share with team:

- [ ] What you completed today
- [ ] ButtonComponent fully migrated ✅
- [ ] Blockers (if any)
- [ ] Plan for tomorrow (InputComponent, IconComponent)

#### 7.4 Prepare for Day 2

- [ ] Review InputComponent audit
- [ ] Review IconComponent audit
- [ ] Assign components for Day 2:
  - Dev 1: IconComponent
  - Dev 2: InputComponent (already started)
  - Dev 3: TextComponent (already started)

---

## 📊 Success Criteria

By end of Day 1, ButtonComponent should have:

- [x] CSS implementation complete
- [x] 62/62 tests passing
- [x] 80%+ test coverage
- [x] 30+ Storybook stories working
- [x] 0 accessibility violations
- [x] 0 TypeScript errors
- [x] 0 linting errors
- [x] Context API integration verified
- [x] Code review approved
- [x] Merged to main

---

## 🚨 Common Issues & Solutions

### Issue: Tests fail after adding CSS

**Symptom:** `className is not defined`

**Solution:**
```javascript
// jest.config.js
moduleNameMapper: {
  '\\.(css|scss)$': 'identity-obj-proxy',
}
```

### Issue: Storybook doesn't show styles

**Symptom:** Button renders but has no styles

**Solution:**
```typescript
// .storybook/preview.ts
import '../src/styles/globals.css';
import '../src/components/atoms/Button/Button.module.css';
```

### Issue: Coverage below 80%

**Symptom:** Coverage report shows 75%

**Solution:**
- Add tests for missing branches
- Test all error states
- Test all variants
- Test edge cases

### Issue: Accessibility violations

**Symptom:** jest-axe reports color contrast issue

**Solution:**
- Check color contrast ratio (must be ≥4.5:1)
- Use online contrast checker
- Adjust colors
- Re-test

---

## ✅ Final Checklist

Before marking day complete:

- [ ] All tests pass (62/62)
- [ ] Coverage ≥80%
- [ ] All Storybook stories work (30+)
- [ ] 0 TypeScript errors
- [ ] 0 linting errors
- [ ] 0 accessibility violations
- [ ] Code review approved
- [ ] Merged to main
- [ ] Documentation updated
- [ ] Team notified

---

**Checklist Version:** 1.0.0
**Target Completion:** Week 5, Day 1 (6-8 hours)
**Next:** Week 5, Day 2 (IconComponent, InputComponent, TextComponent)
