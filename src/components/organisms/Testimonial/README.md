# Testimonial Component (Organism)

**God-Tier Development Protocol 2025**

A testimonial section organism for displaying customer reviews and social proof. Composed of Image, Heading, Text, StarRating molecules, and Icon atoms.

## Features

- Three layouts: single, grid, carousel
- Three variants: default, card, minimal
- Star rating display
- Quote icon decoration
- Avatar and company logo support
- Carousel navigation with dots
- Responsive design (mobile-first)
- Context API support for parameter inheritance
- Empty state handling
- Full accessibility (WCAG AA)

## Usage

### Basic Usage

```tsx
import { Testimonial } from '@/components/organisms/Testimonial';

const testimonials = [
  {
    id: '1',
    quote: 'This product transformed our business!',
    author: 'Sarah Johnson',
    role: 'CEO',
    company: 'TechCorp Inc.',
    avatar: '/avatar1.jpg',
    rating: 5,
  },
  {
    id: '2',
    quote: 'Absolutely game-changing.',
    author: 'Michael Chen',
    role: 'Marketing Director',
    company: 'Growth Co.',
    rating: 5,
  },
];

<Testimonial testimonials={testimonials} />
```

### Grid Layout

```tsx
<Testimonial
  testimonials={testimonials}
  layout="grid"
  columns={3}
  variant="card"
/>
```

### Single Testimonial

```tsx
<Testimonial
  testimonials={testimonials}
  layout="single"
  variant="minimal"
/>
```

### Carousel Layout

```tsx
<Testimonial
  testimonials={testimonials}
  layout="carousel"
  variant="card"
  showRating
  showQuoteIcon
/>
```

### Without Rating

```tsx
<Testimonial
  testimonials={testimonials}
  showRating={false}
/>
```

### Minimal Variant

```tsx
<Testimonial
  testimonials={testimonials}
  variant="minimal"
  showQuoteIcon={false}
/>
```

### With Context API

```tsx
import { OrganismProvider } from '@/context/parameters/ParameterContext';

<OrganismProvider value={{ variant: 'card' }}>
  <Testimonial testimonials={testimonials} />
</OrganismProvider>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `testimonials` | `TestimonialItem[]` | **required** | Array of testimonial objects |
| `layout` | `'single' \| 'grid' \| 'carousel'` | `'grid'` | Layout variant |
| `variant` | `'default' \| 'card' \| 'minimal'` | `'default'` | Visual variant |
| `showRating` | `boolean` | `true` | Show star rating |
| `showQuoteIcon` | `boolean` | `true` | Show quote icon decoration |
| `columns` | `number` | `3` | Number of columns (grid layout) |
| `className` | `string` | `''` | Custom CSS class |
| `data-testid` | `string` | `'testimonial'` | Test ID for testing |

### TestimonialItem Object

```typescript
interface TestimonialItem {
  id: string;          // Unique identifier
  quote: string;       // Customer quote/review
  author: string;      // Author name
  role?: string;       // Author role/title
  company?: string;    // Company name
  avatar?: string;     // Avatar image URL
  rating?: number;     // Star rating (1-5)
  companyLogo?: string; // Company logo URL
}
```

## Layout Options

### Single Layout
- Shows only the first testimonial
- Centered on page
- Full-width content
- Best for hero sections

### Grid Layout (Default)
- Shows all testimonials in grid
- Desktop: 3 columns (configurable)
- Tablet: 2 columns
- Mobile: 1 column
- Best for testimonial sections

### Carousel Layout
- Shows one testimonial at a time
- Navigation arrows (prev/next)
- Dot indicators
- Keyboard accessible
- Best for limited space

## Variant Options

### Default Variant
- Light background
- Border on cards
- Standard spacing
- Quote icon visible
- Best for general use

### Card Variant
- Elevated cards with shadow
- Hover effect (lift)
- Enhanced visual hierarchy
- Best for marketing pages

### Minimal Variant
- No background
- No borders
- No quote icon
- Compact spacing
- Best for simple designs

## Components Composition

Testimonial organism is composed of:
- **Image** (Atom) - For avatar and company logo
- **Heading** (Atom) - For author name
- **Text** (Atom) - For quote, role, and company
- **StarRating** (Molecule) - For rating display
- **Icon** (Atom) - For quote decoration and navigation

## Carousel Navigation

### Keyboard Support
- Arrow Left: Previous testimonial
- Arrow Right: Next testimonial
- Tab: Navigate between controls
- Enter/Space: Activate button

### Mouse Support
- Click prev/next buttons
- Click dot indicators
- Wraps around (circular navigation)

## Accessibility

- Semantic `<section>` and `<blockquote>` elements
- Proper heading hierarchy (h4 for author names)
- ARIA labels for navigation buttons
- `aria-current` for active carousel dot
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Reduced motion support

## Responsive Design

Mobile-first responsive design with breakpoints:
- Mobile: < 640px
  - 1 column
  - Stacked author info
  - Smaller navigation buttons
- Tablet: 641px - 1024px
  - 2 columns
  - Standard spacing
- Desktop: > 1025px
  - 3-4 columns (based on setting)
  - Full spacing

## Dark Mode

Automatically adapts to system color scheme:
- Light mode: White background, dark text
- Dark mode: Dark background, light text
- Cards adjust border and shadow colors

## Empty State

When no testimonials are provided, displays an empty state:

```tsx
<Testimonial testimonials={[]} />
```

Shows:
- 💬 emoji icon
- "No testimonials added" heading
- Help text to add testimonials

## Performance

- CSS Modules for scoped styling
- No heavy animations by default
- Optimized carousel navigation
- Print-friendly styles
- Lazy loading for images (via Image atom)

## Testing

Comprehensive test coverage (80%+):
- All layouts (single, grid, carousel)
- All variants (default, card, minimal)
- Carousel navigation
- Rating display
- Empty state
- Accessibility (jest-axe)
- Context API integration
- Edge cases

Run tests:
```bash
npm test Testimonial.test.tsx
```

## Best Practices

1. **Testimonial Count**:
   - Single: 1 testimonial (hero)
   - Grid: 3-6 testimonials
   - Carousel: 3-10 testimonials

2. **Quote Length**: Keep quotes concise (2-3 sentences max)

3. **Images**: Always provide avatar images for credibility

4. **Rating**: Include star ratings when possible

5. **Layout Selection**:
   - Single: Above-the-fold testimonials
   - Grid: Dedicated testimonial section
   - Carousel: Limited space, many testimonials

6. **Variant Selection**:
   - Default: General purpose
   - Card: Marketing/sales pages
   - Minimal: Clean, modern designs

## Examples

### Marketing Page

```tsx
<Testimonial
  testimonials={customerReviews}
  layout="grid"
  variant="card"
  columns={3}
  showRating
/>
```

### Hero Section

```tsx
<Testimonial
  testimonials={[featuredTestimonial]}
  layout="single"
  variant="minimal"
  showQuoteIcon
/>
```

### Sidebar Widget

```tsx
<Testimonial
  testimonials={recentReviews}
  layout="carousel"
  variant="default"
  showRating
/>
```

### Product Page

```tsx
<Testimonial
  testimonials={productReviews}
  layout="grid"
  variant="card"
  columns={2}
  showRating
  showQuoteIcon
/>
```

## Advanced Usage

### With Company Logos

```tsx
const testimonials = [
  {
    id: '1',
    quote: 'Excellent service!',
    author: 'John Doe',
    company: 'Acme Corp',
    companyLogo: '/logos/acme.png',
    rating: 5,
  },
];

<Testimonial testimonials={testimonials} variant="card" />
```

### Without Avatars

```tsx
const testimonials = [
  {
    id: '1',
    quote: 'Great product!',
    author: 'Jane Smith',
    role: 'Product Manager',
    rating: 5,
  },
];

<Testimonial testimonials={testimonials} />
```

### Minimal Quote-Only

```tsx
const testimonials = [
  {
    id: '1',
    quote: 'Simple and effective.',
    author: 'Anonymous',
  },
];

<Testimonial
  testimonials={testimonials}
  variant="minimal"
  showRating={false}
  showQuoteIcon={false}
/>
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Android

## Version History

- **v1.0.0** (2025-01-07): Initial God-Tier implementation
  - Three layouts (single, grid, carousel)
  - Three variants (default, card, minimal)
  - Star rating integration
  - Carousel navigation
  - Full accessibility
  - Comprehensive tests (50+ tests)
