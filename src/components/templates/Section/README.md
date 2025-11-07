# Section Component (Template)

**God-Tier Development Protocol 2025**

A content section component with padding, background color/image, and overlay support. Used to structure page content into logical blocks.

## Overview

The Section component is a layout primitive that:

- Provides vertical section padding
- Supports background colors, gradients, and images
- Includes overlay support for background images
- Offers full-width or constrained layouts
- Integrates with the Template Context API

## Usage

### Basic Example

```tsx
import { Section } from '@/components/templates/Section';

function Page() {
  return (
    <Section background="light" padding="lg">
      <h2>Features</h2>
      <FeatureList />
    </Section>
  );
}
```

### Background Image with Overlay

```tsx
<Section
  backgroundImage="/hero-background.jpg"
  overlay={true}
  overlayOpacity={0.7}
  padding="xl"
>
  <Hero />
</Section>
```

### Gradient Section

```tsx
<Section background="gradient" padding="lg">
  <CallToAction />
</Section>
```

### Dark Section

```tsx
<Section background="dark" padding="md">
  <Testimonials />
</Section>
```

### Full-Width Section

```tsx
<Section background="primary" fullWidth={true} padding="xl">
  <Banner />
</Section>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `background` | `'none' \| 'light' \| 'dark' \| 'primary' \| 'gradient'` | `'none'` | Background variant |
| `backgroundImage` | `string` | `undefined` | Background image URL |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Vertical padding |
| `fullWidth` | `boolean` | `false` | Full-width section |
| `overlay` | `boolean` | `false` | Enable overlay for background images |
| `overlayOpacity` | `number` | `0.5` | Overlay opacity (0-1) |
| `overlayColor` | `string` | `'rgba(0, 0, 0, 0.5)'` | Overlay color |
| `children` | `React.ReactNode` | **required** | Section children |
| `className` | `string` | `undefined` | Custom CSS class |
| `data-testid` | `string` | `'section'` | Test ID for testing |
| `as` | `'section' \| 'div' \| 'article'` | `'section'` | Polymorphic element type |
| `style` | `React.CSSProperties` | `undefined` | Custom inline styles |

## Background Variants

| Variant | Description | Use Case |
|---------|-------------|----------|
| `none` | Transparent background | Default, inherits from parent |
| `light` | Light gray background | Alternate sections |
| `dark` | Dark background | High contrast sections |
| `primary` | Primary brand color | Call-to-action sections |
| `gradient` | Primary to accent gradient | Hero sections, CTAs |

## Padding Values (Responsive)

| Preset | Mobile | Tablet (768px+) | Desktop (1024px+) |
|--------|--------|-----------------|-------------------|
| `none` | 0 | 0 | 0 |
| `sm` | 24px | 40px | 48px |
| `md` | 48px | 80px | 96px |
| `lg` | 64px | 112px | 128px |
| `xl` | 80px | 144px | 160px |

## Examples

### Alternating Sections

```tsx
<>
  <Section background="none" padding="lg">
    <Features />
  </Section>

  <Section background="light" padding="lg">
    <Pricing />
  </Section>

  <Section background="none" padding="lg">
    <Testimonials />
  </Section>
</>
```

### Hero Section with Image

```tsx
<Section
  backgroundImage="/hero-bg.jpg"
  overlay={true}
  overlayOpacity={0.6}
  overlayColor="rgba(0, 0, 0, 0.6)"
  padding="xl"
>
  <Container maxWidth="lg">
    <h1>Welcome to Our Product</h1>
    <p>Amazing tagline here</p>
    <Button>Get Started</Button>
  </Container>
</Section>
```

### With Context API

```tsx
import { TemplateProvider } from '@/context/parameters/ParameterContext';

<TemplateProvider value={{ padding: 'lg', background: 'light' }}>
  <Section>
    {/* Inherits padding='lg' and background='light' from context */}
    <Content />
  </Section>
</TemplateProvider>
```

### Custom Overlay

```tsx
<Section
  backgroundImage="/pattern.svg"
  overlay={true}
  overlayOpacity={0.9}
  overlayColor="rgba(34, 139, 230, 0.9)"
  padding="lg"
>
  <PricingCards />
</Section>
```

## Content Wrapper

The Section component automatically wraps children in a content div with relative positioning and z-index above the overlay. This ensures content appears above background overlays.

```html
<section class="section">
  <!-- Overlay (if enabled) -->
  <div class="section-overlay" style="opacity: 0.5;"></div>

  <!-- Content wrapper -->
  <div class="section-content">
    {children}
  </div>
</section>
```

## Accessibility

- Uses semantic `<section>` HTML by default
- Supports `as` prop for alternative semantic elements (`<article>`, `<div>`)
- Supports ARIA attributes (`aria-label`, `role`, etc.)
- Ensures text contrast on dark backgrounds
- Responsive design for all devices

## Testing

The Section component has 42 comprehensive tests covering:

- Basic rendering
- Background variants (none, light, dark, primary, gradient)
- Background images
- Overlay rendering and customization
- Padding variants (none, sm, md, lg, xl)
- Full-width behavior
- Content wrapper
- Polymorphic element rendering
- Context API integration
- Custom styles
- Accessibility
- Edge cases

Run tests:

```bash
npm test Section.test.tsx
```

## Performance

- CSS Modules for scoped styles
- Responsive padding via media queries
- Overlay uses absolute positioning (no layout shift)
- Background images use CSS (no JavaScript)

## Dark Mode

The Section component supports dark mode via CSS media query `prefers-color-scheme: dark`. Background variants automatically adjust:

- `light` → darker shade
- `dark` → even darker

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills)

## Related Components

- **Container** - Max-width wrapper
- **Grid** - Multi-column grid layout
- **Layout** - Page-level layout structure

## Migration from Canvas Components

If migrating from the old `SectionComponent`:

```tsx
// OLD
<SectionComponent component={canvasComponent} />

// NEW
<Section
  background="light"
  padding="lg"
  backgroundImage={component.props.backgroundImage}
>
  {children}
</Section>
```

## Best Practices

1. **Semantic HTML**: Use `as="section"` for main sections, `as="article"` for blog posts
2. **Alternating backgrounds**: Alternate `none` and `light` for visual rhythm
3. **Overlay opacity**: Use 0.5-0.7 for readability on background images
4. **Full-width sparingly**: Reserve for hero sections and CTAs
5. **Padding consistency**: Use same padding across similar sections

## Print Styles

In print mode, the Section component:
- Removes all backgrounds
- Sets padding to 1rem
- Hides overlays
- Avoids page breaks inside sections

## License

MIT © Bubble Gum Project
