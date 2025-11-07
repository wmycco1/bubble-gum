# Progress Component

**Type:** Molecule
**Status:** Production Ready
**Version:** 1.0.0

## Overview

Progress is a molecule component that composes Text atoms and styled dividers to create progress bars with labels, percentages, and multiple visual variants. Perfect for file uploads, loading states, task completion, and any scenario requiring progress indication.

## Features

- ✅ Context API support for parameter inheritance
- ✅ Multiple size variants (sm, md, lg)
- ✅ Five color variants (default, success, warning, error, info)
- ✅ Animated transitions
- ✅ Striped pattern option
- ✅ Indeterminate loading state
- ✅ Optional label and percentage display
- ✅ Custom children support for complex labels
- ✅ Custom colors via inline styles
- ✅ Value clamping (0-100)
- ✅ Full accessibility (WCAG 2.2 AA)
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Reduced motion support
- ✅ High contrast mode
- ✅ RTL support
- ✅ Print-friendly
- ✅ TypeScript strict mode
- ✅ 80%+ test coverage

## Installation

```tsx
import { Progress } from '@/components/molecules/Progress';
```

## Basic Usage

```tsx
// Simple progress bar
<Progress value={75} />

// With label
<Progress value={60} label="Upload Progress" />

// Without percentage
<Progress value={50} label="Loading" showPercentage={false} />

// Success state
<Progress value={100} label="Complete" variant="success" />
```

## Advanced Usage

### Color Variants

```tsx
// Default (blue)
<Progress value={50} variant="default" />

// Success (green)
<Progress value={90} label="Upload Complete" variant="success" />

// Warning (yellow)
<Progress value={30} label="Low Storage" variant="warning" />

// Error (red)
<Progress value={10} label="Failed" variant="error" />

// Info (cyan)
<Progress value={60} label="Processing" variant="info" />
```

### Size Variants

```tsx
// Small
<Progress value={50} size="sm" />

// Medium (default)
<Progress value={50} size="md" />

// Large
<Progress value={50} size="lg" />
```

### Animated & Striped

```tsx
// Animated progress (default)
<Progress value={75} animated />

// Striped pattern
<Progress value={60} striped />

// Both animated and striped
<Progress value={80} animated striped />

// Disable animation
<Progress value={50} animated={false} />
```

### Indeterminate Loading

```tsx
// For unknown progress duration
<Progress value={0} label="Loading..." indeterminate />
```

### Custom Colors

```tsx
// Custom progress bar color
<Progress value={70} color="#ff00ff" label="Custom Purple" />

// Custom background color
<Progress value={50} backgroundColor="#f0f0f0" />

// Both
<Progress
  value={60}
  color="#00ff00"
  backgroundColor="#222222"
/>
```

### With Context API

```tsx
import { MoleculeProvider } from '@/context/parameters/ParameterContext';

// All progress bars inherit size and variant
<MoleculeProvider value={{ size: 'lg', variant: 'success', animated: true }}>
  <Progress value={25} label="Step 1" />
  <Progress value={50} label="Step 2" />
  <Progress value={75} label="Step 3" />
  <Progress value={100} label="Complete" variant="info" /> {/* Override */}
</MoleculeProvider>
```

### Custom Label Content

```tsx
<Progress value={65}>
  <div className="flex items-center gap-2">
    <span className="font-bold">Processing</span>
    <span className="text-muted">3 of 10 files</span>
  </div>
</Progress>
```

### Multi-Step Progress

```tsx
const steps = [
  { label: 'Upload Files', value: 100, variant: 'success' },
  { label: 'Processing', value: 60, variant: 'default' },
  { label: 'Finalizing', value: 0, variant: 'default' },
];

<div className="space-y-4">
  {steps.map((step, index) => (
    <Progress
      key={index}
      value={step.value}
      label={step.label}
      variant={step.variant}
    />
  ))}
</div>
```

### File Upload Progress

```tsx
function FileUpload() {
  const [progress, setProgress] = useState(0);

  const handleUpload = async (file: File) => {
    // Simulate upload with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <Progress
      value={progress}
      label={`Uploading ${file.name}`}
      variant={progress === 100 ? 'success' : 'default'}
      animated
      striped
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | **required** | Progress value (0-100), will be clamped |
| `label` | `string` | `undefined` | Optional label text |
| `showPercentage` | `boolean` | `true` | Show percentage value |
| `variant` | `'default' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `animated` | `boolean` | `true` | Enable animation |
| `striped` | `boolean` | `false` | Show striped pattern |
| `labelSize` | `TextSize` | `'sm'` | Label text size |
| `labelColor` | `TextColor` | `'default'` | Label text color |
| `percentageSize` | `TextSize` | `'sm'` | Percentage text size |
| `percentageColor` | `TextColor` | `'muted'` | Percentage text color |
| `className` | `string` | `''` | Custom CSS class |
| `id` | `string` | `undefined` | ID attribute |
| `aria-label` | `string` | `undefined` | Accessibility label |
| `aria-describedby` | `string` | `undefined` | Accessibility description |
| `data-testid` | `string` | `'progress'` | Test ID |
| `children` | `ReactNode` | `undefined` | Custom label content |
| `indeterminate` | `boolean` | `false` | Indeterminate loading state |
| `color` | `string` | `undefined` | Custom progress bar color |
| `backgroundColor` | `string` | `undefined` | Custom track background color |

## Variants

### Color Variants

- **default**: Blue - General purpose
- **success**: Green - Completion, success states
- **warning**: Yellow - Caution, low values
- **error**: Red - Errors, failures
- **info**: Cyan - Information, processing

### Size Variants

- **sm**: 0.5rem height - Compact UI
- **md**: 0.75rem height - Default size
- **lg**: 1rem height - Prominent display

## Accessibility

- Uses `role="progressbar"` for screen readers
- Includes `aria-valuenow`, `aria-valuemin`, `aria-valuemax` attributes
- Supports `aria-label` and `aria-describedby`
- Keyboard navigable (when interactive)
- High contrast mode compatible
- Reduced motion support (disables animations)
- Semantic HTML structure

## Behavior

### Value Clamping

All values are automatically clamped to 0-100 range:
- Negative values → 0
- Values > 100 → 100
- NaN → 0
- Infinity → 100

### Indeterminate State

When `indeterminate={true}`:
- Percentage is hidden
- Bar shows continuous animation
- `aria-valuenow` is not set
- Perfect for unknown duration tasks

### Animation Behavior

- **animated={true}**: Smooth width transitions
- **striped={true}**: Diagonal stripe pattern
- **Both**: Animated stripes moving left-to-right
- **reduced-motion**: All animations disabled automatically

## Styling

The component uses CSS Modules with CSS Variables for easy theming:

```css
:root {
  /* Track */
  --progress-track-bg: #e5e7eb;
  --progress-track-height-md: 0.75rem;

  /* Bar colors */
  --progress-bar-default: #3b82f6;
  --progress-bar-success: #10b981;
  --progress-bar-warning: #f59e0b;
  --progress-bar-error: #ef4444;
  --progress-bar-info: #06b6d4;

  /* Transitions */
  --progress-transition: width 0.3s ease-in-out;
}
```

## Testing

The component includes comprehensive tests covering:
- Basic rendering
- Value clamping
- Size variants
- Color variants
- Animation states
- Indeterminate state
- Accessibility
- Custom props
- Context API
- Edge cases

Run tests:
```bash
npm test Progress
```

## Performance

- Uses `will-change: width` for optimized animations
- CSS-only animations (no JavaScript)
- Efficient re-renders (only when value changes)
- No external dependencies beyond atoms

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Android

## Related Components

- **Text** (Atom): Label and percentage rendering
- **Spinner** (Atom): Alternative loading indicator
- **Skeleton** (Molecule): Content placeholders

## Examples

See Storybook for interactive examples:
```bash
npm run storybook
```

## License

MIT - Bubble Gum Project
