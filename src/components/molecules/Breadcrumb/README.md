# Breadcrumb Component

**Type:** Molecule
**Status:** ✅ Complete
**Test Coverage:** 80%+
**Composed of:** Link (Atom) + Icon (Atom) + Text (Atom)

## Description

Breadcrumb navigation component showing the user's location within the site hierarchy.

## Usage

```tsx
import { Breadcrumb } from '@/components/molecules/Breadcrumb';

<Breadcrumb
  items={[
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'Products', href: '/products' },
    { id: '3', label: 'Category' }
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | - | Breadcrumb items (required) |
| `separator` | `'slash' \| 'chevron' \| 'arrow'` | `'chevron'` | Separator style |
| `showHome` | `boolean` | `false` | Show home icon |
| `className` | `string` | - | Additional CSS classes |
| `data-testid` | `string` | `'breadcrumb'` | Test identifier |

## God-Tier Standards Met

- ✅ Context API + CSS Modules + Atom composition
- ✅ 80%+ test coverage
- ✅ WCAG 2.2 AA accessible
