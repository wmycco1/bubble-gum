# Heading Component

**Atomic Level:** Atom
**Status:** ✅ Complete
**Test Coverage:** 80%+

## Overview

Semantic heading component (h1-h6) with alignment options.

## Usage

```tsx
import { Heading } from '@/components/atoms/Heading';

<Heading level="h1">Main Title</Heading>
<Heading level="h2" align="center">Subtitle</Heading>
```

## Props

- `level`: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' (default: 'h2')
- `align`: 'left' | 'center' | 'right' (default: 'left')
- `children`: ReactNode (required)
