# ImageBox Component

**Type:** Molecule
**Status:** Production Ready
**Version:** 1.0.0

## Overview

ImageBox is a molecule component that composes Image and Text atoms to create image cards with optional captions. Perfect for galleries, product showcases, blog posts, and media-rich content.

## Features

- ✅ Semantic HTML (`<figure>` and `<figcaption>`)
- ✅ Context API support for parameter inheritance
- ✅ Multiple size variants (sm, md, lg, xl)
- ✅ Flexible image options (aspect ratio, fit, rounded)
- ✅ Optional caption with styling control
- ✅ Custom children support for complex captions
- ✅ Interactive states (clickable, hoverable)
- ✅ Visual variants (border, shadow)
- ✅ Full accessibility (WCAG 2.2 AA)
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Reduced motion support
- ✅ High contrast mode
- ✅ Print-friendly
- ✅ TypeScript strict mode
- ✅ 80%+ test coverage

## Installation

```tsx
import { ImageBox } from '@/components/molecules/ImageBox';
```

## Basic Usage

```tsx
// Simple image with caption
<ImageBox
  src="/photo.jpg"
  alt="Beautiful landscape"
  caption="A stunning mountain view at sunset"
/>

// Without caption
<ImageBox
  src="/banner.jpg"
  alt="Banner"
  aspectRatio="16/9"
/>

// With custom size and styling
<ImageBox
  src="/product.jpg"
  alt="Product"
  caption="Premium leather bag"
  size="lg"
  rounded
  showBorder
  showShadow
/>
```

## Advanced Usage

### With Custom Caption Content

```tsx
<ImageBox src="/photo.jpg" alt="Photo">
  <div className="custom-caption">
    <h3>Custom Title</h3>
    <p>Custom description with <a href="#">links</a></p>
  </div>
</ImageBox>
```

### With Context API

```tsx
import { MoleculeProvider } from '@/context/parameters/ParameterContext';

<MoleculeProvider value={{ size: 'lg', rounded: true, showShadow: true }}>
  <ImageBox src="/photo1.jpg" alt="Photo 1" />
  <ImageBox src="/photo2.jpg" alt="Photo 2" />
  <ImageBox src="/photo3.jpg" alt="Photo 3" size="sm" /> {/* Override */}
</MoleculeProvider>
```

### Interactive ImageBox

```tsx
<ImageBox
  src="/product.jpg"
  alt="Product"
  caption="Click to view details"
  onClick={() => console.log('Clicked!')}
  hoverable
/>
```

### Gallery Grid

```tsx
<div className="grid grid-cols-3 gap-4">
  <ImageBox
    src="/photo1.jpg"
    alt="Photo 1"
    caption="Mountain view"
    aspectRatio="square"
    fit="cover"
    rounded
  />
  <ImageBox
    src="/photo2.jpg"
    alt="Photo 2"
    caption="Ocean sunset"
    aspectRatio="square"
    fit="cover"
    rounded
  />
  <ImageBox
    src="/photo3.jpg"
    alt="Photo 3"
    caption="Forest path"
    aspectRatio="square"
    fit="cover"
    rounded
  />
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **required** | Image source URL |
| `alt` | `string` | **required** | Alternative text for accessibility |
| `caption` | `string` | `undefined` | Optional caption text |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size variant |
| `imageSize` | `ImageSize` | `'full'` | Image size |
| `fit` | `ImageFit` | `'cover'` | Image fit mode |
| `aspectRatio` | `ImageAspectRatio` | `undefined` | Aspect ratio constraint |
| `rounded` | `boolean` | `false` | Apply rounded corners |
| `captionSize` | `TextSize` | `'sm'` | Caption text size |
| `captionColor` | `TextColor` | `'muted'` | Caption text color |
| `captionAlign` | `TextAlign` | `'left'` | Caption alignment |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | Image loading strategy |
| `className` | `string` | `''` | Custom CSS class |
| `id` | `string` | `undefined` | ID attribute |
| `aria-label` | `string` | `undefined` | Accessibility label |
| `aria-describedby` | `string` | `undefined` | Accessibility description |
| `data-testid` | `string` | `'imagebox'` | Test ID |
| `children` | `ReactNode` | `undefined` | Custom caption content |
| `onClick` | `function` | `undefined` | Click handler |
| `hoverable` | `boolean` | `false` | Hover effect |
| `showBorder` | `boolean` | `false` | Show border |
| `showShadow` | `boolean` | `false` | Show shadow |

## Size Variants

- **sm**: Compact spacing for dense layouts
- **md**: Default size for most use cases
- **lg**: Larger spacing for prominent display
- **xl**: Maximum spacing for hero sections

## Aspect Ratios

- **square**: 1:1 (Instagram-style)
- **video**: 16:9 (YouTube-style)
- **4/3**: Traditional photo
- **3/2**: DSLR photo
- **16/9**: Widescreen
- **21/9**: Ultra-wide

## Image Fit Modes

- **contain**: Image fits within bounds (may have empty space)
- **cover**: Image fills bounds (may be cropped)
- **fill**: Image stretches to fill bounds
- **none**: Image maintains original size
- **scale-down**: Smaller of contain or none

## Accessibility

- Uses semantic `<figure>` and `<figcaption>` elements
- Full keyboard navigation for clickable images
- ARIA attributes support
- High contrast mode compatible
- Screen reader friendly

## Styling

The component uses CSS Modules with CSS Variables for easy theming:

```css
:root {
  --imagebox-gap-md: 0.75rem;
  --imagebox-border-color: #e5e7eb;
  --imagebox-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  /* ... more variables */
}
```

## Testing

The component includes comprehensive tests covering:
- Basic rendering
- Size variants
- Visual variants
- Interactions
- Accessibility
- Custom props
- Context API
- Edge cases

Run tests:
```bash
npm test ImageBox
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Android

## Related Components

- **Image** (Atom): Base image component
- **Text** (Atom): Text rendering
- **Gallery** (Organism): Multi-image grid

## Examples

See Storybook for interactive examples:
```bash
npm run storybook
```

## License

MIT - Bubble Gum Project
