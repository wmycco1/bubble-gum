# Features Component (Organism)

**God-Tier Development Protocol 2025**

A features grid section organism for showcasing product/service capabilities. Composed of IconBox molecules with optional section header.

## Features

- Grid layouts: 2, 3, or 4 columns
- List layout for horizontal feature boxes
- Section title and description
- Customizable icon size and color
- Responsive design (mobile-first)
- Context API support for parameter inheritance
- Empty state handling
- Full accessibility (WCAG AA)

## Usage

### Basic Usage

```tsx
import { Features } from '@/components/organisms/Features';

const features = [
  {
    id: '1',
    icon: '🚀',
    title: 'Fast Performance',
    description: 'Lightning-fast load times and smooth interactions',
  },
  {
    id: '2',
    icon: '🔒',
    title: 'Secure',
    description: 'Enterprise-grade security to protect your data',
  },
  {
    id: '3',
    icon: '⚡',
    title: 'Powerful',
    description: 'Advanced features to boost your productivity',
  },
];

<Features features={features} />
```

### With Section Header

```tsx
<Features
  sectionTitle="Why Choose Us"
  sectionDescription="Discover what makes us different"
  features={features}
  layout="grid-3"
/>
```

### Grid 2 Columns

```tsx
<Features
  features={features}
  layout="grid-2"
  iconSize="lg"
  iconColor="primary"
/>
```

### Grid 4 Columns

```tsx
<Features
  features={features}
  layout="grid-4"
  columns={4}
/>
```

### List Layout

```tsx
<Features
  features={features}
  layout="list"
  iconSize="md"
/>
```

### With Context API

```tsx
import { OrganismProvider } from '@/context/parameters/ParameterContext';

<OrganismProvider value={{ iconSize: 'lg', iconColor: 'primary' }}>
  <Features features={features} />
</OrganismProvider>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `features` | `Feature[]` | **required** | Array of feature objects |
| `sectionTitle` | `string` | `undefined` | Section heading |
| `sectionDescription` | `string` | `undefined` | Section description text |
| `layout` | `'grid-2' \| 'grid-3' \| 'grid-4' \| 'list'` | `'grid-3'` | Layout variant |
| `iconSize` | `IconSize` | `'md'` | Icon size |
| `iconColor` | `IconColor` | `'primary'` | Icon color |
| `columns` | `number` | `3` | Number of columns (responsive) |
| `className` | `string` | `''` | Custom CSS class |
| `data-testid` | `string` | `'features'` | Test ID for testing |

### Feature Object

```typescript
interface Feature {
  id: string;          // Unique identifier
  icon: string;        // Emoji or icon name
  title: string;       // Feature title
  description: string; // Feature description
}
```

## Layout Options

### Grid 2 Columns
- Desktop: 2 columns
- Tablet: 2 columns
- Mobile: 1 column

### Grid 3 Columns (Default)
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column

### Grid 4 Columns
- Large Desktop: 4 columns
- Desktop: 4 columns
- Tablet: 2 columns
- Mobile: 1 column

### List Layout
- Desktop: 2 columns (horizontal boxes)
- Tablet: 2 columns
- Mobile: 1 column

## Icon Options

### Icon Size
- `xs` - Extra small (16px)
- `sm` - Small (20px)
- `md` - Medium (24px) - **Default**
- `lg` - Large (32px)
- `xl` - Extra large (48px)

### Icon Color
- `primary` - Primary brand color - **Default**
- `secondary` - Secondary color
- `success` - Green
- `danger` - Red
- `warning` - Yellow
- `info` - Blue
- `muted` - Gray

## Empty State

When no features are provided, displays an empty state with helpful message:

```tsx
<Features features={[]} />
```

Shows:
- ✨ emoji icon
- "No features added" heading
- Help text to add features

## Composition

Features organism is composed of:
- **IconBox** (Molecule) - For each feature item
- **Heading** (Atom) - For section title
- **Text** (Atom) - For section description

## Accessibility

- Semantic `<section>` element
- Proper heading hierarchy (h2 for section title, h3 for features)
- ARIA attributes inherited from IconBox
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Reduced motion support

## Responsive Design

Mobile-first responsive design with breakpoints:
- Mobile: < 640px - 1 column
- Tablet: 641px - 1024px - 2 columns
- Desktop: > 1025px - 3-4 columns (based on layout)

## Dark Mode

Automatically adapts to system color scheme:
- Light mode: White background, dark text
- Dark mode: Dark background, light text

## Performance

- CSS Modules for scoped styling
- No runtime JavaScript overhead
- Optimized grid layouts
- Print-friendly styles

## Testing

Comprehensive test coverage (80%+):
- Rendering all layouts
- Empty state
- Icon customization
- Accessibility (jest-axe)
- Context API integration
- Edge cases

Run tests:
```bash
npm test Features.test.tsx
```

## Best Practices

1. **Feature Count**: 3-6 features work best for grid layouts
2. **Icon Consistency**: Use either emojis OR icon names, not mixed
3. **Description Length**: Keep descriptions concise (1-2 sentences)
4. **Layout Selection**:
   - 2 columns: For detailed features
   - 3 columns: For balanced layout (default)
   - 4 columns: For many simple features
   - List: For feature comparisons

## Examples

### Marketing Page Features

```tsx
<Features
  sectionTitle="Everything You Need"
  sectionDescription="All the tools to build amazing products"
  features={[
    { id: '1', icon: '🎨', title: 'Beautiful Design', description: 'Stunning UI components' },
    { id: '2', icon: '⚡', title: 'Lightning Fast', description: 'Optimized performance' },
    { id: '3', icon: '🔧', title: 'Easy to Use', description: 'Intuitive interface' },
  ]}
  layout="grid-3"
  iconSize="lg"
/>
```

### Product Features

```tsx
<Features
  features={productFeatures}
  layout="grid-4"
  iconColor="primary"
  columns={4}
/>
```

### Service Features

```tsx
<Features
  sectionTitle="Our Services"
  features={serviceFeatures}
  layout="list"
  iconSize="md"
/>
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Android

## Version History

- **v1.0.0** (2025-01-07): Initial God-Tier implementation
  - Grid layouts (2, 3, 4 columns)
  - List layout
  - Icon customization
  - Context API integration
  - Full accessibility
  - Comprehensive tests (48+ tests)
