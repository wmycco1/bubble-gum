# Modal Component

**Atomic Level:** Molecule
**God-Tier Development Protocol 2025**

An accessible modal dialog component with overlay, focus trap, keyboard navigation, and Portal rendering.

## Features

- ✅ **Portal Rendering** - Renders outside DOM hierarchy using React Portal
- ✅ **Focus Management** - Automatic focus trap and return focus on close
- ✅ **Keyboard Navigation** - Escape to close, Tab for focus trap
- ✅ **Accessible** - ARIA attributes, role="dialog", aria-modal
- ✅ **Multiple Sizes** - sm, md, lg, xl, full
- ✅ **Variants** - default, centered, side, fullscreen
- ✅ **Customizable** - Header, footer, overlay, animations
- ✅ **Body Scroll Lock** - Prevents page scrolling when modal is open
- ✅ **Callbacks** - onBeforeClose, onAfterOpen, onAfterClose
- ✅ **Dark Mode** - CSS variables for theming
- ✅ **Reduced Motion** - Respects prefers-reduced-motion
- ✅ **High Contrast** - Enhanced borders and outlines
- ✅ **Mobile Responsive** - Full-width on small screens
- ✅ **Print Friendly** - Styled for printing

## Installation

```bash
# This component is part of the Bubble Gum project
# No separate installation needed
```

## Usage

### Basic Example

```tsx
import { Modal } from '@/components/molecules/Modal';
import { Text } from '@/components/atoms/Text';
import { useState } from 'react';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Welcome"
      >
        <Text>This is a simple modal dialog.</Text>
      </Modal>
    </>
  );
}
```

### With Custom Footer

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Delete"
  footer={
    <>
      <Button variant="ghost" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </>
  }
>
  <Text>Are you sure you want to delete this item? This action cannot be undone.</Text>
</Modal>
```

### Different Sizes

```tsx
// Small modal
<Modal size="sm" isOpen={isOpen} onClose={handleClose} title="Small">
  <Text>Small modal content</Text>
</Modal>

// Medium modal (default)
<Modal size="md" isOpen={isOpen} onClose={handleClose} title="Medium">
  <Text>Medium modal content</Text>
</Modal>

// Large modal
<Modal size="lg" isOpen={isOpen} onClose={handleClose} title="Large">
  <Text>Large modal content</Text>
</Modal>

// Extra large modal
<Modal size="xl" isOpen={isOpen} onClose={handleClose} title="Extra Large">
  <Text>Extra large modal content</Text>
</Modal>

// Full width modal
<Modal size="full" isOpen={isOpen} onClose={handleClose} title="Full Width">
  <Text>Full width modal content</Text>
</Modal>
```

### Side Panel Variant

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  variant="side"
  title="Settings"
>
  <Text>Sidebar modal content</Text>
</Modal>
```

### Fullscreen Variant

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  variant="fullscreen"
  title="Preview"
>
  <Text>Fullscreen content</Text>
</Modal>
```

### Disable Overlay Close

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  closeOnOverlayClick={false}
  closeOnEscape={false}
  title="Required Action"
>
  <Text>You must complete this form before closing.</Text>
</Modal>
```

### With Callbacks

```tsx
const handleBeforeClose = async () => {
  const hasUnsavedChanges = checkForChanges();

  if (hasUnsavedChanges) {
    const confirmed = window.confirm('You have unsaved changes. Are you sure?');
    return confirmed;
  }

  return true;
};

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  onBeforeClose={handleBeforeClose}
  onAfterOpen={() => console.log('Modal opened')}
  onAfterClose={() => console.log('Modal closed')}
  title="Edit Form"
>
  <form>{/* Form fields */}</form>
</Modal>
```

### Custom Header

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  header={
    <div className="custom-header">
      <Icon name="alert" />
      <Heading level="h2">Custom Header</Heading>
    </div>
  }
>
  <Text>Content with custom header</Text>
</Modal>
```

### With Context API

```tsx
import { MoleculeProvider } from '@/context/parameters/ParameterContext';

<MoleculeProvider value={{ size: 'lg', variant: 'centered' }}>
  <Modal isOpen={isOpen} onClose={handleClose} title="Inherited Props">
    <Text>This modal inherits size and variant from context</Text>
  </Modal>
</MoleculeProvider>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls modal visibility |
| `onClose` | `() => void` | Called when modal should close |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Modal title in header |
| `content` | `ReactNode` | - | Modal content (alternative to children) |
| `children` | `ReactNode` | - | Modal content |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Modal width |
| `variant` | `'default' \| 'centered' \| 'side' \| 'fullscreen'` | `'default'` | Modal positioning style |
| `showCloseButton` | `boolean` | `true` | Show X button in header |
| `closeOnOverlayClick` | `boolean` | `true` | Close when clicking backdrop |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key press |
| `preventBodyScroll` | `boolean` | `true` | Prevent page scroll when open |
| `header` | `ReactNode` | - | Custom header content |
| `footer` | `ReactNode` | - | Footer content (actions) |
| `overlayOpacity` | `number` | `0.5` | Backdrop opacity (0-1) |
| `zIndex` | `number` | `1000` | Stacking order |
| `animationDuration` | `number` | `200` | Animation duration (ms) |
| `initialFocus` | `string` | - | CSS selector for initial focus |
| `returnFocus` | `boolean` | `true` | Return focus on close |
| `trapFocus` | `boolean` | `true` | Trap focus within modal |
| `containerClassName` | `string` | - | Custom container class |
| `contentClassName` | `string` | - | Custom content class |
| `overlayClassName` | `string` | - | Custom overlay class |
| `portalTarget` | `HTMLElement` | `document.body` | Portal render target |
| `onBeforeClose` | `() => boolean \| Promise<boolean>` | - | Before close callback (can prevent) |
| `onAfterClose` | `() => void` | - | After close callback |
| `onAfterOpen` | `() => void` | - | After open callback |

### Inherited from MoleculeParameters

- `className` - Additional CSS class
- `id` - Element ID
- `data-testid` - Test identifier
- `style` - Inline styles

## Accessibility

### ARIA Attributes

- `role="dialog"` - Identifies as dialog
- `aria-modal="true"` - Indicates modal behavior
- `aria-labelledby` - Links to title (when provided)
- `aria-hidden="true"` - On overlay (decorative)

### Keyboard Support

- **Escape** - Closes modal (if `closeOnEscape=true`)
- **Tab** - Moves focus forward within modal (focus trap)
- **Shift+Tab** - Moves focus backward within modal (focus trap)

### Focus Management

1. When modal opens:
   - Previous focus is stored
   - Focus moves to first focusable element (or specified by `initialFocus`)

2. While modal is open:
   - Focus is trapped within modal (if `trapFocus=true`)
   - Tab/Shift+Tab cycles through focusable elements

3. When modal closes:
   - Focus returns to trigger element (if `returnFocus=true`)

## Theming

### CSS Variables

```css
.modal__overlay {
  --modal-z-index: 1000;
  --modal-overlay-bg: rgba(0, 0, 0, 0.5);
  --modal-content-bg: #ffffff;
  --modal-content-color: #1f2937;
  --modal-border-radius: 12px;
  --modal-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --modal-padding: 24px;
  --modal-gap: 16px;
  --modal-header-border: 1px solid #e5e7eb;
  --modal-footer-border: 1px solid #e5e7eb;
  --modal-animation-duration: 200ms;

  /* Size-specific */
  --modal-width-sm: 400px;
  --modal-width-md: 600px;
  --modal-width-lg: 800px;
  --modal-width-xl: 1000px;
  --modal-width-full: calc(100vw - 32px);
}
```

### Dark Mode

Automatically adapts to `prefers-color-scheme: dark`:

```css
@media (prefers-color-scheme: dark) {
  .modal__overlay {
    --modal-content-bg: #1f2937;
    --modal-content-color: #f9fafb;
    --modal-overlay-bg: rgba(0, 0, 0, 0.75);
  }
}
```

## Composability

### Using with Atom Components

```tsx
<Modal isOpen={isOpen} onClose={handleClose} title="User Profile">
  <Heading level="h3">Contact Information</Heading>
  <Text>Email: user@example.com</Text>
  <Text>Phone: +1 (555) 123-4567</Text>

  <Button text="Edit Profile" variant="primary" onClick={handleEdit} />
</Modal>
```

### Complex Form Example

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  size="lg"
  title="Create New Project"
  footer={
    <>
      <Button variant="ghost" onClick={handleClose}>Cancel</Button>
      <Button variant="primary" onClick={handleSubmit}>Create</Button>
    </>
  }
>
  <form>
    <Input label="Project Name" required />
    <Input label="Description" as="textarea" />
    <Select label="Category" options={categories} />
  </form>
</Modal>
```

## Performance

- Portal rendering prevents style inheritance issues
- Body scroll lock prevents layout shift
- Lazy rendering - only renders when `isOpen=true`
- Animation optimization with CSS transforms
- Focus trap uses efficient event delegation

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '@/components/molecules/Modal';

test('opens and closes modal', () => {
  const onClose = jest.fn();

  const { rerender } = render(
    <Modal isOpen={false} onClose={onClose}>
      <div>Content</div>
    </Modal>
  );

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  rerender(
    <Modal isOpen={true} onClose={onClose}>
      <div>Content</div>
    </Modal>
  );

  expect(screen.getByRole('dialog')).toBeInTheDocument();

  fireEvent.keyDown(document, { key: 'Escape' });
  expect(onClose).toHaveBeenCalled();
});
```

## Related Components

- **Alert** - For inline notifications
- **Tooltip** - For contextual hints
- **Button** - For modal actions
- **Heading** - For modal titles
- **Text** - For modal content

## References

- [WAI-ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [React Portal Documentation](https://react.dev/reference/react-dom/createPortal)
- [Focus Trap](https://github.com/focus-trap/focus-trap)

## Changelog

### v1.0.0 (2025-11-07)

- Initial implementation
- Portal rendering
- Focus trap and keyboard navigation
- Multiple sizes and variants
- Accessibility features
- Dark mode support
- Comprehensive test coverage (80%+)
