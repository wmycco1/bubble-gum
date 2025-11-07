# Grid Component (Template)

**God-Tier Development Protocol 2025**

A multi-column grid layout component with responsive column control, custom column widths, and gap management.

## Overview

The Grid component is a layout primitive that:

- Creates multi-column grid layouts (1-12 columns)
- Supports responsive column configuration per breakpoint
- Allows custom column widths (fr, px, %, etc.)
- Provides gap control
- Integrates with the Template Context API

## Usage

### Basic Example

```tsx
import { Grid } from '@/components/templates/Grid';

function Page() {
  return (
    <Grid columns={3} gap="md">
      <Card />
      <Card />
      <Card />
    </Grid>
  );
}
```

### Responsive Grid

```tsx
<Grid
  responsive={{ mobile: 1, tablet: 2, desktop: 3, wide: 4 }}
  gap="lg"
>
  <Card />
  <Card />
  <Card />
  <Card />
</Grid>
```

### Custom Column Widths

```tsx
<Grid columnWidths={['1fr', '2fr', '1fr']} gap="md">
  <Sidebar />
  <MainContent />
  <Aside />
</Grid>
```

### Two-Column Layout

```tsx
<Grid columns={2} gap="xl">
  <ImageGallery />
  <TextContent />
</Grid>
```

### List Grid

```tsx
<Grid as="ul" columns={4} gap="md">
  <li><ProductCard /></li>
  <li><ProductCard /></li>
  <li><ProductCard /></li>
  <li><ProductCard /></li>
</Grid>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `number` (1-12) | `3` | Number of columns |
| `columnWidths` | `string[]` | `undefined` | Custom column widths (overrides columns) |
| `gap` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Gap between grid items |
| `responsive` | `GridResponsive` | `undefined` | Responsive column configuration |
| `children` | `React.ReactNode` | **required** | Grid children |
| `className` | `string` | `undefined` | Custom CSS class |
| `data-testid` | `string` | `'grid'` | Test ID for testing |
| `as` | `'div' \| 'section' \| 'article' \| 'ul' \| 'ol'` | `'div'` | Polymorphic element type |
| `style` | `React.CSSProperties` | `undefined` | Custom inline styles |

## Responsive Configuration

The `responsive` prop accepts an object with breakpoint keys:

```tsx
interface GridResponsive {
  mobile?: number;   // Default (all sizes)
  tablet?: number;   // 768px+
  desktop?: number;  // 1024px+
  wide?: number;     // 1280px+
}
```

### Example:

```tsx
<Grid responsive={{ mobile: 1, tablet: 2, desktop: 3, wide: 4 }}>
  {/* 1 column on mobile, 2 on tablet, 3 on desktop, 4 on wide */}
  <Card />
  <Card />
  <Card />
  <Card />
</Grid>
```

## Gap Values

| Preset | Value | Use Case |
|--------|-------|----------|
| `none` | 0 | No spacing |
| `sm` | 0.5rem (8px) | Tight layouts |
| `md` | 1rem (16px) | Default spacing |
| `lg` | 1.5rem (24px) | Comfortable spacing |
| `xl` | 2rem (32px) | Generous spacing |

## Column Widths

Custom column widths override the `columns` prop and allow precise control:

```tsx
// Sidebar layout (200px sidebar, flexible content)
<Grid columnWidths={['200px', '1fr']} gap="md">
  <Sidebar />
  <MainContent />
</Grid>

// Three-column with emphasis on center
<Grid columnWidths={['1fr', '2fr', '1fr']} gap="lg">
  <LeftSidebar />
  <Article />
  <RightSidebar />
</Grid>

// Fixed-width columns
<Grid columnWidths={['250px', '250px', '250px']} gap="md">
  <Card />
  <Card />
  <Card />
</Grid>

// Mixed units
<Grid columnWidths={['100px', '2fr', '25%']} gap="md">
  <Icon />
  <Content />
  <Actions />
</Grid>
```

## Examples

### Product Grid

```tsx
<Grid
  responsive={{ mobile: 1, tablet: 2, desktop: 3, wide: 4 }}
  gap="lg"
>
  {products.map(product => (
    <ProductCard key={product.id} {...product} />
  ))}
</Grid>
```

### Blog Layout

```tsx
<Grid columnWidths={['2fr', '1fr']} gap="xl">
  <article>
    <BlogPost />
  </article>
  <aside>
    <Sidebar />
  </aside>
</Grid>
```

### Feature Grid

```tsx
<Grid columns={3} gap="md">
  <FeatureCard icon="zap" title="Fast" />
  <FeatureCard icon="shield" title="Secure" />
  <FeatureCard icon="heart" title="Loved" />
</Grid>
```

### Dashboard Grid

```tsx
<Grid
  columnWidths={['1fr', '1fr', '1fr']}
  gap="lg"
  style={{ gridAutoRows: 'minmax(200px, auto)' }}
>
  <StatCard title="Users" value={1234} />
  <StatCard title="Revenue" value="$45K" />
  <StatCard title="Growth" value="+23%" />
  <ChartWidget />
  <TableWidget />
  <AlertsWidget />
</Grid>
```

### With Context API

```tsx
import { TemplateProvider } from '@/context/parameters/ParameterContext';

<TemplateProvider value={{ gap: 'lg', columns: 3 }}>
  <Grid>
    {/* Inherits gap='lg' and columns=3 from context */}
    <Card />
    <Card />
    <Card />
  </Grid>
</TemplateProvider>
```

## Responsive Breakpoints

| Breakpoint | Min Width | Class Suffix |
|------------|-----------|--------------|
| Mobile | 0px | `-mobile` |
| Tablet | 768px | `-tablet` |
| Desktop | 1024px | `-desktop` |
| Wide | 1280px | `-wide` |

## Accessibility

- Supports semantic HTML via `as` prop
- Can render as `<ul>` or `<ol>` for list grids
- Supports ARIA attributes
- Responsive design ensures usability across devices
- Print-friendly (collapses to single column)

## Testing

The Grid component has 50 comprehensive tests covering:

- Basic rendering
- Column variants (1-12)
- Gap variants (none, sm, md, lg, xl)
- Custom column widths
- Responsive configuration
- Polymorphic element rendering
- Context API integration
- Custom styles
- Accessibility
- Edge cases

Run tests:

```bash
npm test Grid.test.tsx
```

## Performance

- Pure CSS Grid (no JavaScript calculations)
- CSS Modules for scoped styles
- Responsive classes via media queries
- Zero runtime overhead

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid support required
- IE11 requires polyfills

## Related Components

- **Container** - Max-width wrapper
- **Section** - Content section with background
- **Layout** - Page-level layout structure

## Migration from Canvas Components

If migrating from the old `GridComponent`:

```tsx
// OLD
<GridComponent component={canvasComponent} />

// NEW
<Grid
  columns={component.props.columns}
  gap="md"
  columnWidths={component.props.columnWidths}
>
  {children}
</Grid>
```

## Best Practices

1. **Responsive first**: Use `responsive` prop for mobile-friendly layouts
2. **Equal columns**: Use `columns` for even distribution
3. **Custom widths**: Use `columnWidths` for precise control (sidebars, etc.)
4. **Gap consistency**: Stick to `md` or `lg` for most layouts
5. **Semantic HTML**: Use `as="ul"` for lists of items

## Common Patterns

### Holy Grail Layout

```tsx
<Grid columnWidths={['200px', '1fr', '200px']} gap="lg">
  <nav>Navigation</nav>
  <main>Main Content</main>
  <aside>Sidebar</aside>
</Grid>
```

### Card Grid

```tsx
<Grid
  responsive={{ mobile: 1, tablet: 2, desktop: 3 }}
  gap="lg"
>
  {items.map(item => <Card key={item.id} {...item} />)}
</Grid>
```

### Dashboard Layout

```tsx
<Grid
  columnWidths={['repeat(4, 1fr)']}
  style={{ gridTemplateRows: 'repeat(3, minmax(150px, auto))' }}
  gap="md"
>
  <Widget gridArea="1 / 1 / 2 / 3" />
  <Widget gridArea="1 / 3 / 2 / 5" />
  <Widget gridArea="2 / 1 / 4 / 3" />
  <Widget gridArea="2 / 3 / 3 / 5" />
</Grid>
```

## License

MIT © Bubble Gum Project
