# Button Component

**Type:** Atom
**Status:** ✅ Template Ready (Awaiting Implementation)
**Test Coverage:** Target 80%+
**Accessibility:** WCAG 2.2 AA Compliant

---

## Overview

A clickable button element with multiple variants, sizes, and states. Supports loading indicators, icons, and full accessibility features.

---

## Usage

### Basic Usage

```tsx
import { Button } from '@/components/atoms/Button';

<Button text="Click me" onClick={() => console.log('Clicked!')} />
```

### With Variant

```tsx
<Button text="Primary" variant="primary" />
<Button text="Secondary" variant="secondary" />
<Button text="Outline" variant="outline" />
<Button text="Ghost" variant="ghost" />
<Button text="Danger" variant="danger" />
```

### With Size

```tsx
<Button text="Small" size="sm" />
<Button text="Medium" size="md" />
<Button text="Large" size="lg" />
<Button text="Extra Large" size="xl" />
```

### With Icons

```tsx
<Button text="Back" leftIcon="←" />
<Button text="Next" rightIcon="→" />
<Button text="Save" leftIcon="💾" />
```

### States

```tsx
<Button text="Disabled" disabled />
<Button text="Loading..." loading />
<Button text="Full Width" fullWidth />
```

### With Context API

```tsx
import { AtomProvider } from '@/context/parameters/ParameterContext';

<AtomProvider value={{ size: 'lg', variant: 'primary' }}>
  {/* All buttons inherit size='lg' and variant='primary' */}
  <Button text="Inherits context" />
  <Button text="Overrides variant" variant="secondary" />
</AtomProvider>
```

---

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `text` | `string` | - | ✅ | Button text label |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | ❌ | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | ❌ | Button size |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | ❌ | HTML button type |
| `disabled` | `boolean` | `false` | ❌ | Disabled state |
| `loading` | `boolean` | `false` | ❌ | Loading state |
| `fullWidth` | `boolean` | `false` | ❌ | Full width button |
| `leftIcon` | `React.ReactNode` | - | ❌ | Icon before text |
| `rightIcon` | `React.ReactNode` | - | ❌ | Icon after text |
| `onClick` | `(event: MouseEvent) => void` | - | ❌ | Click handler |
| `className` | `string` | `''` | ❌ | Additional CSS classes |
| `aria-label` | `string` | `text` value | ❌ | Accessibility label |
| `data-testid` | `string` | `'button'` | ❌ | Test ID |

Extends `AtomParameters` - see [src/types/parameters/atom.ts](../../../types/parameters/atom.ts) for inherited props.

---

## Accessibility

### ARIA Attributes

The Button component includes full ARIA support:

- `aria-label`: Screen reader label (defaults to `text` prop)
- `aria-disabled`: Indicates disabled state
- `aria-busy`: Indicates loading state
- `aria-describedby`: Optional description reference

### Keyboard Navigation

- **Enter/Space**: Activates button
- **Tab**: Focuses button
- **Disabled state**: Prevents focus and interaction

### Screen Reader Announcements

- Loading state announces "Loading..." to screen readers
- Icons are hidden from screen readers with `aria-hidden="true"`
- Button text is always accessible

---

## Styling

### CSS Classes

The component generates these classes:

```css
.button                  /* Base styles */
.button--primary         /* Primary variant */
.button--secondary       /* Secondary variant */
.button--outline         /* Outline variant */
.button--ghost           /* Ghost variant */
.button--danger          /* Danger variant */
.button--sm              /* Small size */
.button--md              /* Medium size */
.button--lg              /* Large size */
.button--xl              /* Extra large size */
.button--disabled        /* Disabled state */
.button--loading         /* Loading state */
.button--full-width      /* Full width */
.button__text            /* Text wrapper */
.button__icon            /* Icon wrapper */
.button__icon--left      /* Left icon */
.button__icon--right     /* Right icon */
.button__spinner         /* Loading spinner */
```

### Customization

You can override styles with CSS or add custom classes:

```tsx
<Button
  text="Custom"
  className="my-custom-button"
  style={{ backgroundColor: '#custom-color' }}
/>
```

---

## Testing

### Test Coverage

- ✅ Rendering with all props
- ✅ Click interactions
- ✅ Disabled state prevents clicks
- ✅ Loading state shows spinner
- ✅ Icons render correctly
- ✅ Accessibility (jest-axe)
- ✅ ARIA attributes
- ✅ Keyboard navigation

### Running Tests

```bash
npm test Button.test.tsx
npm run test:coverage Button.test.tsx
```

---

## Examples

### Submit Button in Form

```tsx
<form onSubmit={handleSubmit}>
  <Button
    text="Submit"
    type="submit"
    variant="primary"
    loading={isSubmitting}
  />
</form>
```

### Confirm Delete

```tsx
<Button
  text="Delete"
  variant="danger"
  leftIcon="🗑️"
  onClick={() => confirm('Are you sure?') && handleDelete()}
/>
```

### Loading State

```tsx
const [loading, setLoading] = useState(false);

const handleClick = async () => {
  setLoading(true);
  await fetchData();
  setLoading(false);
};

<Button text="Load Data" loading={loading} onClick={handleClick} />
```

---

## Related Components

- **InputComponent** - Text input field (Atom)
- **FormComponent** - Form container (Organism)
- **SubmitComponent** - Specialized submit button (Atom)

---

## Migration Notes

**Migrated from:** `components/canvas/ButtonComponent.tsx`

**Changes:**
- Now uses AtomParameters interface
- Supports Context API for parameter inheritance
- Added full ARIA attributes
- Improved TypeScript typing (strict mode)
- Enhanced loading state with spinner
- Added fullWidth prop
- Improved accessibility

**Breaking Changes:**
- Props renamed to match AtomParameters
- Some legacy props removed (check migration guide)

---

## Storybook

View all Button variants in Storybook:

```bash
npm run storybook
# Navigate to Atoms > Button
```

---

## Status

**Current Status:** ✅ Template Ready

**Next Steps:**
1. Implement CSS styles
2. Write unit tests (Button.test.tsx)
3. Create Storybook story (Button.stories.tsx)
4. Run God-Tier checklist
5. Code review
6. Merge to main

**Target Completion:** Week 5, Day 1

---

**Component Version:** 1.0.0 (Template)
**Last Updated:** November 6, 2025
**Follows:** God-Tier Development Protocol 2025
