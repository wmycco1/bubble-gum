# Image Component

**Type:** Atom
**Status:** ✅ Complete
**Test Coverage:** 80%+

## Description

Optimized image component with Context API support, aspect ratios, and multiple fit modes.

## Features

- ✅ Context API integration (useAtomContext)
- ✅ CSS Modules with CSS Variables
- ✅ Multiple sizes (xs, sm, md, lg, xl, full)
- ✅ Fit modes (contain, cover, fill, none, scale-down)
- ✅ Aspect ratios (square, video, 4/3, 3/2, 16/9, 21/9)
- ✅ Rounded corners option
- ✅ Lazy loading support
- ✅ Dark mode support
- ✅ Reduced motion support
- ✅ High contrast mode
- ✅ WCAG 2.2 AA accessibility
- ✅ TypeScript strict mode
- ✅ 80%+ test coverage

## Usage

### Basic

```tsx
import { Image } from '@/components/atoms/Image';

<Image src="/photo.jpg" alt="Description" />
<Image src="/photo.jpg" alt="Photo" size="md" rounded />
```

### With Context API

```tsx
import { Image } from '@/components/atoms/Image';
import { AtomProvider } from '@/context/parameters/ParameterContext';

<AtomProvider value={{ size: 'lg' }}>
  <Image src="/photo.jpg" alt="Large photo" />
</AtomProvider>
```

### With Aspect Ratio

```tsx
<Image
  src="/photo.jpg"
  alt="Photo"
  aspectRatio="16/9"
  fit="cover"
/>
```

### Rounded Image

```tsx
<Image
  src="/avatar.jpg"
  alt="User avatar"
  size="sm"
  aspectRatio="square"
  rounded
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image source URL (required) |
| `alt` | `string` | - | Alternative text (required) |
| `size` | `ImageSize` | `'full'` | Image size |
| `fit` | `ImageFit` | `'cover'` | Object fit mode |
| `aspectRatio` | `ImageAspectRatio` | - | Aspect ratio constraint |
| `rounded` | `boolean` | `false` | Apply rounded corners |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | Loading strategy |
| `className` | `string` | - | Additional CSS classes |
| `data-testid` | `string` | `'image'` | Test identifier |

## Implementation Notes

- Container wrapper ensures proper aspect ratio and sizing
- Uses native `<img>` tag for compatibility
- Lazy loading enabled by default for performance
- Object-fit CSS property for flexible image fitting
- Filter applied in dark mode for better contrast

## God-Tier Standards Met

- ✅ Context API (useAtomContext, mergeParameters)
- ✅ CSS Modules with design tokens
- ✅ Dark mode + reduced motion + high contrast + print
- ✅ TypeScript strict (no any types)
- ✅ WCAG 2.2 AA compliance
- ✅ Comprehensive tests (32 tests)
- ✅ Professional documentation
