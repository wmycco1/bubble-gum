# Tooltip Component

**Atomic Level:** Molecule
**God-Tier Development Protocol 2025**

An accessible tooltip component with multiple triggers, positioning, and Portal rendering.

## Features

- ✅ **Multiple Triggers** - hover, click, focus, manual
- ✅ **Positioning** - top, bottom, left, right with auto-adjustment
- ✅ **Portal Rendering** - Renders outside DOM hierarchy
- ✅ **Accessible** - ARIA attributes, role="tooltip"
- ✅ **Variants** - default, primary, success, warning, danger, light
- ✅ **Arrow Indicator** - Optional arrow pointing to trigger
- ✅ **Delay Control** - Configurable show/hide delays
- ✅ **Interactive Mode** - Keep tooltip open on hover
- ✅ **Follow Cursor** - Tooltip follows mouse movement
- ✅ **Controlled/Uncontrolled** - Both modes supported
- ✅ **Prevent Overflow** - Auto-adjust to stay in viewport
- ✅ **Keyboard Support** - Escape to close, focus trigger
- ✅ **Callbacks** - onBeforeOpen, onAfterOpen, onBeforeClose, onAfterClose
- ✅ **Dark Mode** - CSS variables for theming
- ✅ **Reduced Motion** - Respects prefers-reduced-motion
- ✅ **Mobile Friendly** - Touch-optimized
- ✅ **Print Friendly** - Shows content inline when printing

## Installation

```bash
# This component is part of the Bubble Gum project
# No separate installation needed
```

## Usage

### Basic Example

```tsx
import { Tooltip } from '@/components/molecules/Tooltip';
import { Button } from '@/components/atoms/Button';

function App() {
  return (
    <Tooltip content="Click to edit this item">
      <Button text="Edit" />
    </Tooltip>
  );
}
```

### Different Placements

```tsx
// Top (default)
<Tooltip content="Top tooltip" placement="top">
  <button>Hover me</button>
</Tooltip>

// Bottom
<Tooltip content="Bottom tooltip" placement="bottom">
  <button>Hover me</button>
</Tooltip>

// Left
<Tooltip content="Left tooltip" placement="left">
  <button>Hover me</button>
</Tooltip>

// Right
<Tooltip content="Right tooltip" placement="right">
  <button>Hover me</button>
</Tooltip>
```

### Different Triggers

```tsx
// Hover (default)
<Tooltip content="Appears on hover" trigger="hover">
  <span>Hover me</span>
</Tooltip>

// Click
<Tooltip content="Appears on click" trigger="click">
  <button>Click me</button>
</Tooltip>

// Focus
<Tooltip content="Appears on focus" trigger="focus">
  <input placeholder="Focus me" />
</Tooltip>

// Manual (controlled)
function ControlledTooltip() {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip
      content="Manually controlled"
      trigger="manual"
      open={open}
      onOpenChange={setOpen}
    >
      <button onClick={() => setOpen(!open)}>Toggle</button>
    </Tooltip>
  );
}
```

### Different Variants

```tsx
// Default (dark)
<Tooltip content="Default tooltip" variant="default">
  <button>Default</button>
</Tooltip>

// Primary
<Tooltip content="Primary action" variant="primary">
  <button>Primary</button>
</Tooltip>

// Success
<Tooltip content="Saved successfully" variant="success">
  <Icon name="check" />
</Tooltip>

// Warning
<Tooltip content="Please review" variant="warning">
  <Icon name="alert" />
</Tooltip>

// Danger
<Tooltip content="Cannot be undone" variant="danger">
  <button>Delete</button>
</Tooltip>

// Light
<Tooltip content="Light background" variant="light">
  <button>Light</button>
</Tooltip>
```

### With Custom Delays

```tsx
// Show after 500ms, hide immediately
<Tooltip content="Delayed tooltip" delay={500} hideDelay={0}>
  <button>Hover me</button>
</Tooltip>

// Show immediately, hide after 300ms
<Tooltip content="Quick tooltip" delay={0} hideDelay={300}>
  <button>Hover me</button>
</Tooltip>
```

### Interactive Tooltip

```tsx
// Tooltip stays open when hovering over it
<Tooltip
  content={
    <div>
      <Text>Interactive content</Text>
      <Button text="Click me" size="sm" />
    </div>
  }
  interactive={true}
>
  <button>Hover me</button>
</Tooltip>
```

### Follow Cursor

```tsx
// Tooltip follows mouse movement
<Tooltip content="I follow your cursor" followCursor={true}>
  <div style={{ width: 200, height: 200, border: '1px solid' }}>
    Move cursor here
  </div>
</Tooltip>
```

### Without Arrow

```tsx
<Tooltip content="No arrow" arrow={false}>
  <button>Hover me</button>
</Tooltip>
```

### With Callbacks

```tsx
<Tooltip
  content="Tooltip with callbacks"
  onBeforeOpen={() => {
    console.log('About to open');
    return true; // return false to prevent opening
  }}
  onAfterOpen={() => {
    console.log('Opened');
  }}
  onBeforeClose={() => {
    console.log('About to close');
    return true; // return false to prevent closing
  }}
  onAfterClose={() => {
    console.log('Closed');
  }}
>
  <button>Hover me</button>
</Tooltip>
```

### Disabled State

```tsx
// Tooltip won't show when disabled
<Tooltip content="This won't show" disabled={true}>
  <button>Disabled tooltip</button>
</Tooltip>
```

### Custom Max Width

```tsx
<Tooltip content="This is a very long tooltip text that needs more space to display properly" maxWidth="400px">
  <button>Long content</button>
</Tooltip>
```

### Rich Content

```tsx
<Tooltip
  content={
    <div>
      <Heading level="h4">Help</Heading>
      <Text>Click the button to perform the action.</Text>
      <Text size="sm" color="muted">Keyboard: Ctrl+E</Text>
    </div>
  }
  maxWidth="300px"
>
  <Icon name="help" />
</Tooltip>
```

### With Context API

```tsx
import { MoleculeProvider } from '@/context/parameters/ParameterContext';

<MoleculeProvider value={{ variant: 'primary', placement: 'right' }}>
  <Tooltip content="Inherits from context">
    <button>Button 1</button>
  </Tooltip>
  <Tooltip content="Also inherits">
    <button>Button 2</button>
  </Tooltip>
</MoleculeProvider>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `content` | `ReactNode` | Tooltip content to display |
| `children` | `ReactNode` | Trigger element |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position relative to trigger |
| `trigger` | `'hover' \| 'click' \| 'focus' \| 'manual'` | `'hover'` | How tooltip is activated |
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'light'` | `'default'` | Visual style |
| `arrow` | `boolean` | `true` | Show arrow indicator |
| `delay` | `number` | `200` | Delay before showing (ms) |
| `hideDelay` | `number` | `0` | Delay before hiding (ms) |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | - | Open state change handler |
| `disabled` | `boolean` | `false` | Disable tooltip |
| `maxWidth` | `string \| number` | `'250px'` | Maximum width |
| `offset` | `number` | `8` | Distance from trigger (px) |
| `zIndex` | `number` | `1000` | Stacking order |
| `animationDuration` | `number` | `150` | Animation duration (ms) |
| `interactive` | `boolean` | `false` | Keep open on hover |
| `followCursor` | `boolean` | `false` | Follow mouse cursor |
| `tooltipClassName` | `string` | - | Custom tooltip class |
| `wrapperClassName` | `string` | - | Custom wrapper class |
| `arrowClassName` | `string` | - | Custom arrow class |
| `portalTarget` | `HTMLElement` | `document.body` | Portal render target |
| `preventOverflow` | `boolean` | `true` | Auto-adjust to viewport |
| `closeOnClickOutside` | `boolean` | `true` | Close on outside click (click trigger) |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key |
| `onBeforeOpen` | `() => boolean` | - | Before open callback |
| `onAfterOpen` | `() => void` | - | After open callback |
| `onBeforeClose` | `() => boolean` | - | Before close callback |
| `onAfterClose` | `() => void` | - | After close callback |
| `as` | `'div' \| 'span' \| 'button'` | `'div'` | Wrapper element type |

### Inherited from MoleculeParameters

- `className` - Additional CSS class
- `id` - Element ID
- `data-testid` - Test identifier
- `style` - Inline styles

## Accessibility

### ARIA Attributes

- `role="tooltip"` - Identifies as tooltip
- `aria-describedby` - Links trigger to tooltip (when open)
- `aria-hidden="true"` - On arrow (decorative)

### Keyboard Support

- **Escape** - Closes tooltip (if `closeOnEscape=true`)
- **Tab** - Can focus trigger element (focus trigger)

### Focus Management

- Focus trigger activates tooltip with `trigger="focus"`
- Blur closes tooltip
- No focus trap (tooltip is informational, not interactive by default)

### Screen Reader Support

- Tooltip content announced via `aria-describedby`
- Trigger element maintains semantic meaning
- Arrow is decorative and hidden from screen readers

## Theming

### CSS Variables

```css
.tooltip {
  --tooltip-z-index: 1000;
  --tooltip-bg: #111827;
  --tooltip-color: #ffffff;
  --tooltip-border-radius: 8px;
  --tooltip-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --tooltip-padding: 8px 12px;
  --tooltip-font-size: 14px;
  --tooltip-line-height: 1.5;
  --tooltip-max-width: 250px;
  --tooltip-arrow-size: 6px;
  --tooltip-animation-duration: 150ms;
}
```

### Dark Mode

Automatically adapts to `prefers-color-scheme: dark`:

```css
@media (prefers-color-scheme: dark) {
  .tooltip {
    --tooltip-bg: #374151;
    --tooltip-color: #ffffff;
  }
}
```

## Composability

### Using with Atom Components

```tsx
<Tooltip content="Save your changes">
  <Button text="Save" variant="primary" />
</Tooltip>

<Tooltip content="More information" placement="right">
  <Icon name="info" size="sm" />
</Tooltip>

<Tooltip content="Username must be unique">
  <Input label="Username" />
</Tooltip>
```

### Using with Custom Components

```tsx
<Tooltip content="Custom component tooltip">
  <CustomCard>
    <Text>Card content</Text>
  </CustomCard>
</Tooltip>
```

### Nested Tooltips

```tsx
// Outer tooltip
<Tooltip content="Outer tooltip" trigger="click">
  <div>
    {/* Inner tooltip */}
    <Tooltip content="Inner tooltip" trigger="hover">
      <button>Nested button</button>
    </Tooltip>
  </div>
</Tooltip>
```

## Performance

- Portal rendering prevents style inheritance issues
- Lazy rendering - only creates tooltip when needed
- Efficient event handling with debounced position calculations
- Animation optimization with CSS transforms
- Automatic cleanup of timeouts and event listeners

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Testing

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from '@/components/molecules/Tooltip';

test('shows tooltip on hover', async () => {
  render(
    <Tooltip content="Tooltip text">
      <button>Trigger</button>
    </Tooltip>
  );

  const trigger = screen.getByText('Trigger');
  await userEvent.hover(trigger);

  await waitFor(() => {
    expect(screen.getByText('Tooltip text')).toBeInTheDocument();
  });
});
```

## Common Patterns

### Help Icon with Tooltip

```tsx
function HelpTooltip({ content }: { content: string }) {
  return (
    <Tooltip content={content} placement="top">
      <Icon name="help-circle" size="sm" color="muted" />
    </Tooltip>
  );
}

// Usage
<HelpTooltip content="Enter your full legal name" />
```

### Button with Disabled Tooltip

```tsx
function TooltipButton({
  text,
  disabled,
  tooltip,
  onClick,
}: {
  text: string;
  disabled?: boolean;
  tooltip?: string;
  onClick?: () => void;
}) {
  const button = (
    <Button text={text} disabled={disabled} onClick={onClick} />
  );

  if (disabled && tooltip) {
    return (
      <Tooltip content={tooltip}>
        <span>{button}</span>
      </Tooltip>
    );
  }

  return button;
}

// Usage
<TooltipButton
  text="Submit"
  disabled={true}
  tooltip="Please fill all required fields"
/>
```

### Action Tooltip

```tsx
<Tooltip
  content={
    <div>
      <Text weight="bold">Delete Item</Text>
      <Text size="sm">This action cannot be undone</Text>
    </div>
  }
  variant="danger"
  placement="left"
>
  <Button text="Delete" variant="danger" leftIcon={<Icon name="trash" />} />
</Tooltip>
```

## Troubleshooting

### Tooltip not showing

1. Check if `disabled={true}`
2. Verify `content` is not empty
3. Ensure trigger element is visible
4. Check z-index conflicts

### Tooltip positioning issues

1. Ensure trigger element has proper positioning
2. Check if `preventOverflow={true}` (default)
3. Verify container doesn't have `overflow: hidden`
4. Try different `placement` values

### Tooltip stays open

1. Check if `trigger="manual"` without control
2. Verify callbacks don't prevent closing
3. Ensure no JavaScript errors in console
4. Check if `interactive={true}` is intended

## Related Components

- **Modal** - For larger overlay dialogs
- **Popover** - For interactive overlay content
- **Alert** - For inline notifications
- **Icon** - Often used as tooltip triggers
- **Button** - Common tooltip trigger

## References

- [WAI-ARIA Tooltip Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
- [React Portal Documentation](https://react.dev/reference/react-dom/createPortal)
- [Floating UI](https://floating-ui.com/) - Positioning inspiration

## Changelog

### v1.0.0 (2025-11-07)

- Initial implementation
- Multiple trigger types (hover, click, focus, manual)
- Portal rendering
- Four placement options with auto-adjustment
- Six visual variants
- Interactive mode
- Follow cursor mode
- Comprehensive accessibility
- Dark mode support
- Comprehensive test coverage (80%+)
