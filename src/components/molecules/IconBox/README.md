# IconBox Component

**Type:** Molecule
**Status:** ✅ Production Ready
**Version:** 1.0.0
**Last Updated:** November 07, 2025

## Overview

IconBox is a molecule component that composes Icon, Heading, and Text atoms to create feature boxes, benefit cards, and informational blocks. It's commonly used in landing pages, feature sections, and marketing content.

## Features

- ✅ **Composable Architecture** - Built from Icon, Heading, and Text atoms
- ✅ **Context API Integration** - Inherits parameters from MoleculeProvider
- ✅ **Multiple Layouts** - Vertical and horizontal orientations
- ✅ **Flexible Alignment** - Left, center, and right alignment options
- ✅ **Size Variants** - sm, md, lg, xl
- ✅ **Interactive States** - Clickable with hover effects
- ✅ **Visual Variants** - Background and border options
- ✅ **Fully Accessible** - WCAG 2.2 AA compliant
- ✅ **Dark Mode** - Automatic theme support
- ✅ **Responsive** - Mobile-first design
- ✅ **TypeScript** - Full type safety
- ✅ **80%+ Test Coverage** - Comprehensive test suite

## Installation

```bash
# Component is already installed in the project
# Located at: src/components/molecules/IconBox/
```

## Basic Usage

```tsx
import { IconBox } from '@/components/molecules/IconBox';

function Features() {
  return (
    <IconBox
      icon="check"
      heading="Fast Performance"
      description="Lightning-fast load times and smooth interactions"
    />
  );
}
```

## Examples

### Basic IconBox

```tsx
<IconBox
  icon="shield"
  heading="Secure & Safe"
  description="Enterprise-grade security for your data"
/>
```

### With Custom Styling

```tsx
<IconBox
  icon="star"
  heading="Premium Features"
  description="Access all advanced features"
  iconColor="primary"
  iconSize="lg"
  align="center"
  showBackground
  showBorder
/>
```

### Horizontal Layout

```tsx
<IconBox
  icon="zap"
  heading="Lightning Fast"
  description="Built for speed and performance"
  layout="horizontal"
  iconColor="warning"
  size="lg"
/>
```

### Clickable IconBox

```tsx
<IconBox
  icon="arrow-right"
  heading="Learn More"
  description="Click to explore our documentation"
  onClick={() => router.push('/docs')}
  hoverable
/>
```

### With Custom Children

```tsx
<IconBox icon="bell" heading="Notifications">
  <ul>
    <li>Real-time alerts</li>
    <li>Email notifications</li>
    <li>Push notifications</li>
  </ul>
</IconBox>
```

### With Context API

```tsx
import { MoleculeProvider } from '@/context/parameters/ParameterContext';

<MoleculeProvider value={{ size: 'lg', iconColor: 'primary', align: 'center' }}>
  <IconBox icon="check" heading="Feature 1" description="Description 1" />
  <IconBox icon="shield" heading="Feature 2" description="Description 2" />
  <IconBox icon="star" heading="Feature 3" description="Description 3" />
</MoleculeProvider>
```

### Size Variants

```tsx
{/* Small */}
<IconBox icon="check" heading="Small Box" size="sm" />

{/* Medium (default) */}
<IconBox icon="check" heading="Medium Box" size="md" />

{/* Large */}
<IconBox icon="check" heading="Large Box" size="lg" />

{/* Extra Large */}
<IconBox icon="check" heading="Extra Large Box" size="xl" />
```

### Alignment Options

```tsx
{/* Left aligned (default) */}
<IconBox icon="check" heading="Left Aligned" align="left" />

{/* Center aligned */}
<IconBox icon="check" heading="Center Aligned" align="center" />

{/* Right aligned */}
<IconBox icon="check" heading="Right Aligned" align="right" />
```

### Visual Variants

```tsx
{/* With background */}
<IconBox icon="check" heading="Background Box" showBackground />

{/* With border */}
<IconBox icon="check" heading="Bordered Box" showBorder />

{/* With both */}
<IconBox icon="check" heading="Both Styles" showBackground showBorder />
```

### Complete Feature Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <IconBox
    icon="zap"
    heading="Lightning Fast"
    description="Optimized for speed"
    iconColor="warning"
    align="center"
    showBackground
  />
  <IconBox
    icon="shield"
    heading="Secure"
    description="Enterprise-grade security"
    iconColor="success"
    align="center"
    showBackground
  />
  <IconBox
    icon="star"
    heading="Premium"
    description="Access all features"
    iconColor="primary"
    align="center"
    showBackground
  />
</div>
```

## Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string` | **required** | Icon name/identifier |
| `heading` | `string` | **required** | Feature heading/title |
| `description` | `string` | `undefined` | Feature description (optional) |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Content alignment |
| `layout` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size variant |
| `iconColor` | `IconColor` | `'primary'` | Icon color variant |
| `iconSize` | `IconSize` | `'md'` | Icon size |
| `headingLevel` | `HeadingLevel` | `'h3'` | Heading semantic level |
| `headingColor` | `HeadingColor` | `'default'` | Heading color |
| `textSize` | `TextSize` | `'md'` | Description text size |
| `textColor` | `TextColor` | `'muted'` | Description text color |
| `className` | `string` | `''` | Custom CSS class |
| `id` | `string` | `undefined` | HTML id attribute |
| `aria-label` | `string` | `undefined` | Accessibility label |
| `aria-describedby` | `string` | `undefined` | Accessibility description |
| `data-testid` | `string` | `'iconbox'` | Test ID for testing |
| `children` | `ReactNode` | `undefined` | Custom children (replaces description) |
| `onClick` | `(e: MouseEvent) => void` | `undefined` | Click handler |
| `hoverable` | `boolean` | `false` | Enable hover effects |
| `showBackground` | `boolean` | `false` | Show background |
| `showBorder` | `boolean` | `false` | Show border |

## Accessibility

### WCAG 2.2 AA Compliance

- ✅ **Keyboard Navigation** - Full keyboard support for clickable boxes
- ✅ **Screen Reader Support** - Proper ARIA labels and roles
- ✅ **Focus Indicators** - Clear focus states
- ✅ **Semantic HTML** - Proper heading hierarchy
- ✅ **Color Contrast** - Meets WCAG AA standards

### Best Practices

1. **Use Semantic Heading Levels** - Maintain proper heading hierarchy
   ```tsx
   <IconBox headingLevel="h2" heading="Main Feature" />
   <IconBox headingLevel="h3" heading="Sub Feature" />
   ```

2. **Provide aria-label for Clickable Boxes**
   ```tsx
   <IconBox
     icon="arrow-right"
     heading="Learn More"
     onClick={handleClick}
     aria-label="Learn more about our features"
   />
   ```

3. **Icon Decorative Role** - Icons are automatically aria-hidden

4. **Keyboard Support** - Clickable boxes respond to Enter and Space keys

## Styling

### CSS Modules

Component uses CSS Modules for scoped styling. All classes are prefixed with `iconbox--`.

### CSS Variables

Customize appearance using CSS variables:

```css
:root {
  /* Spacing */
  --iconbox-gap-md: 1rem;
  --iconbox-padding-md: 1.5rem;

  /* Colors */
  --iconbox-bg-hover: #f9fafb;
  --iconbox-border-color: #e5e7eb;

  /* Border */
  --iconbox-border-radius: 0.5rem;

  /* Transitions */
  --iconbox-transition: all 0.2s ease-in-out;
}
```

### Custom Styling

```tsx
// Via className
<IconBox
  icon="check"
  heading="Custom Styled"
  className="my-custom-class"
/>

// Via CSS Variables
<style>
  .my-custom-class {
    --iconbox-border-radius: 1rem;
    --iconbox-gap-md: 2rem;
  }
</style>
```

## Responsive Behavior

- **Mobile (< 640px)** - Horizontal layout switches to vertical
- **Tablet (640px - 1023px)** - Maintains default behavior
- **Desktop (≥ 1024px)** - Full layout options

## Dark Mode

Component automatically adapts to system color scheme:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --iconbox-bg-hover: #1f2937;
    --iconbox-border-color: #374151;
  }
}
```

## Performance

- ✅ **Zero Runtime CSS** - CSS Modules compiled at build time
- ✅ **Tree Shakeable** - Import only what you need
- ✅ **Optimized Rendering** - Minimal re-renders with Context API
- ✅ **CSS Variables** - Dynamic theming without JavaScript

## Testing

### Running Tests

```bash
# Run all tests
npm test IconBox

# Run with coverage
npm test IconBox -- --coverage

# Watch mode
npm test IconBox -- --watch
```

### Test Coverage

- ✅ **Basic Rendering** - All variants render correctly
- ✅ **Props** - All props work as expected
- ✅ **Interactions** - Click and keyboard events
- ✅ **Accessibility** - ARIA attributes and keyboard navigation
- ✅ **Context API** - Parameter inheritance
- ✅ **Edge Cases** - Long text, special characters

## Browser Support

- ✅ Chrome/Edge (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ iOS Safari (last 2 versions)
- ✅ Android Chrome (last 2 versions)

## Related Components

- **Icon** (Atom) - Base icon component
- **Heading** (Atom) - Base heading component
- **Text** (Atom) - Base text component
- **Alert** (Molecule) - Similar molecule structure

## Changelog

### v1.0.0 (November 07, 2025)
- ✅ Initial release
- ✅ God-Tier Development Protocol 2025
- ✅ Full TypeScript support
- ✅ 80%+ test coverage
- ✅ WCAG 2.2 AA compliance

## Support

For issues or questions, please contact the development team or open an issue in the project repository.

## License

Proprietary - Bubble Gum Project © 2025
