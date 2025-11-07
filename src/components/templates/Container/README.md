# Container Component (Template)

**God-Tier Development Protocol 2025**

A max-width wrapper component for page content. Provides consistent horizontal spacing and centering with responsive breakpoints.

## Overview

The Container component is a fundamental layout primitive that:

- Constrains content to a maximum width
- Provides responsive horizontal padding
- Centers content horizontally (optional)
- Supports polymorphic rendering (div, section, article, etc.)
- Integrates with the Template Context API

## Usage

### Basic Example

```tsx
import { Container } from '@/components/templates/Container';

function Page() {
  return (
    <Container maxWidth="lg">
      <h1>Welcome</h1>
      <p>This content is constrained to 1024px width.</p>
    </Container>
  );
}
```

### Full-Width Container

```tsx
<Container maxWidth="full" padding="none">
  <HeroSection />
</Container>
```

### Custom Padding

```tsx
<Container maxWidth="xl" padding="xl">
  <Article />
</Container>
```

### Semantic HTML

```tsx
<Container as="main" maxWidth="lg">
  <MainContent />
</Container>
```

### No Centering

```tsx
<Container centerContent={false}>
  <LeftAlignedContent />
</Container>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | `'lg'` | Maximum width of container |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Horizontal padding |
| `centerContent` | `boolean` | `true` | Center content horizontally |
| `children` | `React.ReactNode` | **required** | Container children |
| `className` | `string` | `undefined` | Custom CSS class |
| `data-testid` | `string` | `'container'` | Test ID for testing |
| `as` | `'div' \| 'section' \| 'article' \| 'main' \| 'aside' \| 'nav'` | `'div'` | Polymorphic element type |
| `style` | `React.CSSProperties` | `undefined` | Custom inline styles |

## Max-Width Values

| Preset | Width | Use Case |
|--------|-------|----------|
| `sm` | 640px | Narrow content (blog posts, forms) |
| `md` | 768px | Standard content |
| `lg` | 1024px | Default, most pages |
| `xl` | 1280px | Wide layouts |
| `2xl` | 1536px | Extra wide layouts |
| `full` | 100% | Full-width sections |

## Padding Values (Responsive)

| Preset | Mobile | Tablet (768px+) | Desktop (1024px+) |
|--------|--------|-----------------|-------------------|
| `none` | 0 | 0 | 0 |
| `sm` | 16px | 24px | 32px |
| `md` | 24px | 32px | 40px |
| `lg` | 32px | 48px | 64px |
| `xl` | 48px | 64px | 80px |

## Examples

### Nested Containers

```tsx
<Container maxWidth="full" padding="none">
  <Hero />
  <Container maxWidth="lg">
    <Features />
  </Container>
  <CTA />
</Container>
```

### With Context API

```tsx
import { TemplateProvider } from '@/context/parameters/ParameterContext';

<TemplateProvider value={{ padding: 'lg' }}>
  <Container>
    {/* Inherits padding='lg' from context */}
    <Content />
  </Container>
</TemplateProvider>
```

### Semantic Page Layout

```tsx
<Container as="main" maxWidth="xl">
  <article>
    <h1>Article Title</h1>
    <p>Article content...</p>
  </article>
</Container>
```

### Custom Styles

```tsx
<Container
  maxWidth="lg"
  style={{
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
  }}
>
  <Content />
</Container>
```

## Accessibility

- Uses semantic HTML when `as` prop is set (e.g., `<main>`, `<section>`)
- Supports ARIA attributes (`aria-label`, `role`, etc.)
- Responsive design ensures usability across devices

## Testing

The Container component has 38 comprehensive tests covering:

- Basic rendering
- Max-width variants (sm, md, lg, xl, 2xl, full)
- Padding variants (none, sm, md, lg, xl)
- Center content behavior
- Polymorphic element rendering
- Context API integration
- Custom styles
- Accessibility
- Edge cases

Run tests:

```bash
npm test Container.test.tsx
```

## Performance

- Zero JavaScript overhead (pure CSS)
- CSS Modules for scoped styles
- Responsive padding via media queries
- No runtime calculations

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills)

## Related Components

- **Section** - Content section with background
- **Grid** - Multi-column grid layout
- **Layout** - Page-level layout structure

## Migration from Canvas Components

If migrating from the old `ContainerComponent`:

```tsx
// OLD
<ContainerComponent component={canvasComponent} />

// NEW
<Container maxWidth="lg" padding="md">
  {children}
</Container>
```

## Best Practices

1. **Use semantic HTML**: Set `as="main"` for main content, `as="section"` for sections
2. **Nested containers**: Use `maxWidth="full"` for outer, constrained width for inner
3. **Responsive padding**: Default `md` works for most cases, use `lg`/`xl` for spacious layouts
4. **Full-width sections**: Use `padding="none"` with `maxWidth="full"` for hero sections

## License

MIT © Bubble Gum Project
