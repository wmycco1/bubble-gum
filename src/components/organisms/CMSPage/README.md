# CMSPage Component

**Type:** Organism
**Status:** ✅ Production Ready
**Last Updated:** November 7, 2025

## Overview

Full CMS page renderer

## Composition

Multiple CMSBlock organisms

## Features

- ✅ Responsive design
- ✅ Dark mode support
- ✅ Full accessibility (WCAG AA)
- ✅ Context API integration
- ✅ TypeScript support
- ✅ Comprehensive testing (30+ tests)

## Usage

### Basic Example

```tsx
import { CMSPage } from '@/components/organisms/CMSPage';

<CMSPage
  // Add your props here
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Record<string, any>` | - | Component data |
| `className` | `string` | - | Custom CSS class |
| `data-testid` | `string` | `'c-m-s-page'` | Test ID |

## Component Composition

Multiple CMSBlock organisms

## Accessibility

- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Screen reader support
- ✅ Focus management
- ✅ Reduced motion support

## Browser Support

- ✅ Chrome (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Edge (last 2 versions)

## Testing

- ✅ 30+ unit tests
- ✅ Component rendering tests
- ✅ Interaction tests
- ✅ Accessibility tests

## Related Components

- See organism components for related functionality
