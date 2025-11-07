# Text Component

**Atomic Level:** Atom
**Status:** ✅ Complete
**Test Coverage:** 80%+
**God-Tier Protocol:** 2025

## Overview

A versatile text component with size, weight, alignment, color variants, and truncation support.

## Features

- ✅ Multiple sizes (xs → 3xl)
- ✅ Font weights (normal → bold)
- ✅ Text alignment (left, center, right, justify)
- ✅ Color variants (default, primary, success, error, etc.)
- ✅ Text styles (italic, underline, strikethrough)
- ✅ Truncation (single line or multi-line clamp)
- ✅ Polymorphic (render as any element)
- ✅ Full accessibility (WCAG AA)
- ✅ TypeScript strict mode
- ✅ 80%+ test coverage

## Usage

```tsx
import { Text } from '@/components/atoms/Text';

// Basic
<Text>Plain text</Text>

// With size and weight
<Text size="lg" weight="bold">Important text</Text>

// With color
<Text color="primary">Primary text</Text>
<Text color="error">Error text</Text>

// Alignment
<Text align="center">Centered text</Text>

// Styles
<Text italic underline>Styled text</Text>

// Truncation
<Text truncate>Very long text that will be truncated...</Text>
<Text maxLines={3}>Text limited to 3 lines...</Text>

// As different element
<Text as="span">Inline text</Text>
<Text as="label">Label text</Text>
```

## Props

See `Text.types.ts` for complete type definitions.

## Accessibility

- Semantic HTML elements
- ARIA support
- Screen reader friendly

## Testing

```bash
npm test Text.test.tsx
npm run test:coverage Text.test.tsx
```

## Storybook

```bash
npm run storybook
# Navigate to Atoms/Text
```
