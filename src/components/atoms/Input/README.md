# Input Component

**Atomic Level:** Atom
**Status:** ✅ Complete
**Test Coverage:** 80%+
**God-Tier Protocol:** 2025

## Overview

A type-safe, accessible text input field with validation, multiple types, and size variants.

## Features

- ✅ Multiple input types (text, email, password, number, etc.)
- ✅ Three size variants (sm, md, lg)
- ✅ Validation states (valid, invalid, warning)
- ✅ Error and helper text support
- ✅ Disabled and readonly states
- ✅ Full accessibility (WCAG AA)
- ✅ TypeScript strict mode
- ✅ 80%+ test coverage

## Usage

```tsx
import { Input } from '@/components/atoms/Input';

// Basic
<Input placeholder="Enter text" />

// Email
<Input type="email" placeholder="Email address" />

// With validation
<Input
  type="email"
  validation="invalid"
  error="Please enter a valid email"
/>

// With helper text
<Input
  type="password"
  helperText="Must be at least 8 characters"
/>

// Sizes
<Input size="sm" />
<Input size="md" />
<Input size="lg" />
```

## Props

See `Input.types.ts` for complete type definitions.

## Accessibility

- Full ARIA support
- Keyboard navigation
- Screen reader friendly
- Error announcements

## Testing

```bash
npm test Input.test.tsx
npm run test:coverage Input.test.tsx
```

## Storybook

```bash
npm run storybook
# Navigate to Atoms/Input
```
