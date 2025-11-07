# StarRating Component

**Type:** Molecule
**Status:** ✅ Production Ready
**Last Updated:** 2025-11-07

## Overview

A professional star rating component for displaying and collecting user ratings. Supports half-stars, readonly mode, custom maximum ratings, and interactive rating selection.

## Features

- ⭐ **Full & Half Stars**: Supports fractional ratings (e.g., 3.5 stars)
- 🎯 **Interactive Mode**: Click to rate with visual feedback
- 👁️ **Readonly Mode**: Display ratings without interaction
- 🔢 **Custom Max Rating**: Support for any max rating (default: 5)
- 📊 **Value Display**: Optional numeric rating display
- 🎨 **Size Variants**: sm, md, lg, xl
- ♿ **Accessible**: WCAG AA compliant with ARIA attributes
- 🌙 **Dark Mode**: Automatic theme switching
- 📱 **Responsive**: Works on all screen sizes
- 🎯 **Context API**: Parameter inheritance support

## Composition

This molecule is composed of:
- **Icon Atom**: For star display (filled/empty/half)
- **Text Atom**: For numeric rating value

## Usage

### Basic Usage

```tsx
import { StarRating } from '@/components/molecules/StarRating';

// Simple readonly display
<StarRating rating={4.5} />

// With value display
<StarRating rating={4.5} showValue />
```

### Interactive Rating

```tsx
const [rating, setRating] = useState(0);

<StarRating
  rating={rating}
  onChange={(newRating) => setRating(newRating)}
/>
```

### Custom Max Rating

```tsx
// 10-star rating system
<StarRating
  rating={8.5}
  maxRating={10}
  showValue
/>
```

### Size Variants

```tsx
<StarRating rating={4} size="sm" />
<StarRating rating={4} size="md" /> {/* default */}
<StarRating rating={4} size="lg" />
<StarRating rating={4} size="xl" />
```

### Readonly Mode

```tsx
<StarRating
  rating={4.5}
  readonly
  showValue
/>
```

### With Context API

```tsx
import { AtomProvider } from '@/context/parameters/ParameterContext';

<AtomProvider value={{ size: 'lg' }}>
  <StarRating rating={4} />
  <StarRating rating={3.5} />
</AtomProvider>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rating` | `number` | `0` | Current rating value (0 to maxRating) |
| `maxRating` | `number` | `5` | Maximum rating value |
| `readonly` | `boolean` | `false` | Disable interaction |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Star size |
| `showValue` | `boolean` | `false` | Show numeric rating |
| `onChange` | `(rating: number) => void` | - | Rating change callback |
| `className` | `string` | `''` | Additional CSS class |
| `aria-label` | `string` | `'Star rating'` | Accessible label |
| `data-testid` | `string` | `'star-rating'` | Test ID |
| `id` | `string` | - | HTML ID attribute |

## Examples

### Product Rating Display

```tsx
<div className="product-rating">
  <StarRating
    rating={product.averageRating}
    readonly
    showValue
    size="lg"
  />
  <Text size="sm" color="muted">
    ({product.reviewCount} reviews)
  </Text>
</div>
```

### Review Form

```tsx
const [rating, setRating] = useState(0);

<form>
  <label>Rate this product:</label>
  <StarRating
    rating={rating}
    onChange={setRating}
    size="lg"
    aria-label="Product rating"
  />
  {rating > 0 && (
    <Text size="sm" color="success">
      You rated {rating} out of 5 stars
    </Text>
  )}
</form>
```

### Rating Filter

```tsx
const [minRating, setMinRating] = useState(0);

<div className="filter">
  <Text weight="medium">Minimum rating:</Text>
  <StarRating
    rating={minRating}
    onChange={setMinRating}
    showValue
  />
</div>
```

### Custom 10-Point Scale

```tsx
<StarRating
  rating={8.3}
  maxRating={10}
  readonly
  showValue
  aria-label="IMDb rating"
/>
```

## Accessibility

The component implements WCAG AA standards:

- **Keyboard Navigation**: All interactive stars are keyboard accessible
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Indicators**: Visible focus states
- **Role**: `slider` for interactive, `img` for readonly
- **ARIA Attributes**:
  - `aria-label`: Describes the rating with current value
  - `aria-valuenow`: Current rating (interactive mode)
  - `aria-valuemin`: Minimum rating (0)
  - `aria-valuemax`: Maximum rating
  - `aria-readonly`: Indicates readonly state

### Screen Reader Example

```
"Star rating: 3.5 out of 5"
"Rate 1 out of 5" (on star hover/focus)
```

## Styling

### CSS Variables

Customize the component appearance:

```css
.star-rating {
  --star-color-filled: #fbbf24;
  --star-color-empty: #d1d5db;
  --star-color-hover: #f59e0b;
  --star-value-color: #6b7280;
  --star-size-sm: 16px;
  --star-size-md: 24px;
  --star-size-lg: 32px;
  --star-size-xl: 40px;
  --star-gap: 4px;
  --value-gap: 8px;
  --star-transition: all 0.2s ease-in-out;
}
```

### Custom Styling

```tsx
<StarRating
  rating={4}
  className="custom-rating"
  style={{ '--star-color-filled': '#ff0000' } as React.CSSProperties}
/>
```

## Behavior

### Half-Stars

The component automatically determines star fill based on rating:
- Rating 0.0-0.4: Empty star
- Rating 0.5-0.9: Half star
- Rating 1.0+: Full star

### Rating Clamping

Ratings are automatically clamped to valid range:
- Negative values → 0
- Values > maxRating → maxRating

### Interactive Mode

When `onChange` is provided and `readonly` is false:
- Hover shows preview of rating
- Click sets the rating
- Stars are keyboard accessible
- Visual feedback on hover/focus

### Readonly Mode

When `readonly` is true or `onChange` is not provided:
- No interaction possible
- Stars are not clickable
- Optimized for display only

## Performance

- **Memoization**: Uses `useMemo` for computed values
- **Callback Stability**: Uses `useCallback` for event handlers
- **Efficient Rendering**: Only re-renders on prop changes
- **Lightweight**: Minimal DOM elements

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing

```bash
npm test StarRating.test.tsx
```

**Coverage**: 90%+ (all branches covered)

### Test Cases

- Rendering with various props
- Rating values (full, half, zero, clamped)
- Value display (shown/hidden, formatting)
- Size variants
- Readonly mode
- Interactive mode (click, hover, keyboard)
- Context API integration
- Accessibility (ARIA, roles, labels)
- Edge cases (invalid values, large ratings)

## Migration Guide

### From Canvas Component

```tsx
// Old (Canvas component)
<StarRatingComponent
  component={{
    props: {
      rating: 4,
      maxRating: 5,
    }
  }}
/>

// New (Molecule component)
<StarRating
  rating={4}
  maxRating={5}
/>
```

## Related Components

- **Icon** (Atom): Used for star display
- **Text** (Atom): Used for value display
- **Button** (Atom): Similar interactive patterns

## Changelog

### v1.0.0 (2025-11-07)
- Initial release
- Full feature set
- 90%+ test coverage
- WCAG AA compliance

## Contributing

When modifying this component:
1. Update tests to maintain 80%+ coverage
2. Test accessibility with screen readers
3. Verify dark mode appearance
4. Test keyboard navigation
5. Update this README

## License

Part of Bubble Gum project - God-Tier Development Protocol 2025
