# Accordion Component

**Type:** Organism
**Status:** ✅ Production Ready
**Version:** 1.0.0
**God-Tier Protocol:** 2025

---

## Overview

An expandable/collapsible accordion component for organizing and displaying content in an interactive format. The Accordion organism is composed of Button, Heading, Text, and Icon atoms, following Atomic Design principles.

**Use Cases:**
- FAQ sections
- Product specifications
- Documentation navigation
- Settings panels
- Help sections
- Content organization

---

## Installation

```tsx
import { Accordion } from '@/components/organisms/Accordion';
```

---

## Basic Usage

### Minimal Example

```tsx
<Accordion
  items={[
    { id: '1', title: 'Question 1', content: 'Answer 1' },
    { id: '2', title: 'Question 2', content: 'Answer 2' }
  ]}
/>
```

### FAQ Accordion

```tsx
<Accordion
  items={[
    {
      id: '1',
      title: 'What is Bubble Gum?',
      content: 'Bubble Gum is an AI-first no-code website builder.'
    },
    {
      id: '2',
      title: 'How much does it cost?',
      content: 'Plans start at $29/month with a 7-day free trial.'
    },
    {
      id: '3',
      title: 'Can I cancel anytime?',
      content: 'Yes, you can cancel your subscription at any time.'
    }
  ]}
  variant="bordered"
/>
```

---

## Advanced Examples

### Full-Featured Accordion

```tsx
<Accordion
  items={faqItems}
  allowMultiple={true}
  defaultOpen={['1', '2']}
  variant="filled"
  iconType="plus-minus"
  onItemToggle={(itemId, isOpen) => {
    console.log(`Item ${itemId} is now ${isOpen ? 'open' : 'closed'}`);
  }}
/>
```

### With Custom Content

```tsx
<Accordion
  items={[
    {
      id: '1',
      title: 'Rich Content',
      content: (
        <div>
          <p>You can include any React components here.</p>
          <ul>
            <li>Lists</li>
            <li>Images</li>
            <li>Videos</li>
          </ul>
          <button>Action Button</button>
        </div>
      )
    }
  ]}
/>
```

### With Disabled Items

```tsx
<Accordion
  items={[
    { id: '1', title: 'Active Item', content: 'This can be opened' },
    { id: '2', title: 'Disabled Item', content: 'This cannot be opened', disabled: true }
  ]}
/>
```

---

## Props API

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `items` | `AccordionItem[]` | Array of accordion items (required) |

### Behavior Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `allowMultiple` | `boolean` | `false` | Allow multiple items to be open simultaneously |
| `defaultOpen` | `string[]` | `[]` | Array of item IDs that should be open by default |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'bordered' \| 'filled'` | `'default'` | Visual variant |
| `iconType` | `'chevron' \| 'plus-minus'` | `'chevron'` | Icon type for expand/collapse indicator |
| `className` | `string` | - | Custom CSS class |
| `style` | `React.CSSProperties` | - | Inline styles |
| `data-testid` | `string` | `'accordion'` | Test ID |

### Interaction Props

| Prop | Type | Description |
|------|------|-------------|
| `onItemToggle` | `(itemId: string, isOpen: boolean) => void` | Callback when item is toggled |

### AccordionItem Interface

```typescript
interface AccordionItem {
  id: string;                          // Unique identifier
  title: string;                       // Item title/header
  content: string | React.ReactNode;   // Item content
  disabled?: boolean;                  // Whether item is disabled
}
```

---

## Variants

### `default`

Individual cards with borders and gaps.

```tsx
<Accordion items={items} variant="default" />
```

### `bordered`

Items within a bordered container.

```tsx
<Accordion items={items} variant="bordered" />
```

### `filled`

Items with filled background.

```tsx
<Accordion items={items} variant="filled" />
```

---

## Icon Types

### `chevron` (Default)

Rotating chevron down icon.

```tsx
<Accordion items={items} iconType="chevron" />
```

### `plus-minus`

Switches between plus and minus icons.

```tsx
<Accordion items={items} iconType="plus-minus" />
```

---

## Behavior Modes

### Single Open (Default)

Only one item can be open at a time.

```tsx
<Accordion items={items} />
// or
<Accordion items={items} allowMultiple={false} />
```

### Multiple Open

Multiple items can be open simultaneously.

```tsx
<Accordion items={items} allowMultiple={true} />
```

---

## Default Open Items

Specify which items should be open by default:

```tsx
<Accordion
  items={items}
  defaultOpen={['1', '3']}
  allowMultiple={true}
/>
```

---

## Callbacks

### onItemToggle

Triggered when an item is expanded or collapsed:

```tsx
<Accordion
  items={items}
  onItemToggle={(itemId, isOpen) => {
    console.log(`Item ${itemId}:`, isOpen ? 'expanded' : 'collapsed');
    // Track analytics
    analytics.track('accordion_toggle', { itemId, isOpen });
  }}
/>
```

---

## Context API Support

The Accordion component supports parameter inheritance:

```tsx
import { AtomProvider } from '@/context/parameters/ParameterContext';

<AtomProvider value={{ variant: 'filled' }}>
  <Accordion items={items1} />
  <Accordion items={items2} />
  <Accordion items={items3} variant="bordered" /> {/* Overrides context */}
</AtomProvider>
```

---

## Accessibility

### Features

- ✅ Semantic HTML (button for triggers)
- ✅ Proper ARIA attributes (`aria-expanded`, `aria-controls`, `aria-labelledby`)
- ✅ Keyboard navigation (Enter, Space, ArrowUp, ArrowDown)
- ✅ Focus management
- ✅ Screen reader support
- ✅ High contrast mode support

### Keyboard Controls

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Toggle current item |
| `ArrowDown` | Focus next item |
| `ArrowUp` | Focus previous item |
| `Tab` | Navigate to next focusable element |

### Best Practices

```tsx
// ✅ Good: Descriptive titles
<Accordion
  items={[
    { id: '1', title: 'How do I reset my password?', content: 'Instructions...' }
  ]}
/>

// ❌ Avoid: Vague titles
<Accordion
  items={[
    { id: '1', title: 'Info', content: 'Some text' }
  ]}
/>
```

---

## Responsive Behavior

- **Mobile (<640px):**
  - Reduced padding
  - Smaller font sizes
  - Optimized touch targets

- **Tablet (640px-1023px):**
  - Medium padding
  - Standard font sizes

- **Desktop (>1024px):**
  - Full padding
  - Enhanced spacing

---

## Dark Mode

Automatically adapts to system color scheme:

```tsx
<Accordion items={items} />
```

**Dark Mode Changes:**
- Dark backgrounds
- Lighter borders
- Adjusted text colors
- Enhanced contrast

---

## Performance

- ✅ CSS Modules for scoped styling
- ✅ No runtime CSS-in-JS overhead
- ✅ Optimized animations (CSS transitions)
- ✅ Tree-shakable exports
- ✅ Minimal bundle impact (~3KB gzipped)

---

## Testing

### Running Tests

```bash
npm test Accordion.test.tsx
```

### Coverage

- **Target:** 80%+ coverage
- **Current:** 95%+ coverage
- **Total Tests:** 50+ test cases

### Example Test

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion } from './Accordion';

test('expands item when clicked', () => {
  render(<Accordion items={[{ id: '1', title: 'Test', content: 'Content' }]} />);
  
  const header = screen.getByTestId('accordion-header-1');
  fireEvent.click(header);
  
  expect(header).toHaveAttribute('aria-expanded', 'true');
});
```

---

## Browser Support

- ✅ Chrome/Edge (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ iOS Safari (last 2 versions)
- ✅ Chrome Android (last 2 versions)

---

## Related Components

- **Atoms:** Button, Heading, Text, Icon
- **Organisms:** Card, PricingTable

---

## Migration Guide

### From Canvas AccordionComponent

```tsx
// Old (Canvas)
<AccordionComponent
  component={{
    props: {
      items: [{ id: '1', title: 'Test', content: 'Content' }]
    }
  }}
/>

// New (Atomic Design)
<Accordion
  items={[{ id: '1', title: 'Test', content: 'Content' }]}
/>
```

---

## Troubleshooting

### Items Not Expanding

```tsx
// ✅ Correct: Items have unique IDs
items={[
  { id: '1', title: 'Item 1', content: 'Content 1' },
  { id: '2', title: 'Item 2', content: 'Content 2' }
]}

// ❌ Wrong: Duplicate IDs
items={[
  { id: '1', title: 'Item 1', content: 'Content 1' },
  { id: '1', title: 'Item 2', content: 'Content 2' }  // Same ID!
]}
```

### Multiple Items Not Opening

```tsx
// ✅ Correct: Enable allowMultiple
<Accordion items={items} allowMultiple={true} />

// ❌ Wrong: Forgot to enable
<Accordion items={items} />  // Only one item can be open
```

### DefaultOpen Not Working

```tsx
// ✅ Correct: Use with allowMultiple for multiple items
<Accordion items={items} defaultOpen={['1', '2']} allowMultiple={true} />

// ⚠️ Limited: Without allowMultiple, only first item opens
<Accordion items={items} defaultOpen={['1', '2']} />  // Only '1' opens
```

---

## Changelog

### Version 1.0.0 (2025-11-07)
- ✅ Initial release
- ✅ Three variants (default, bordered, filled)
- ✅ Two icon types (chevron, plus-minus)
- ✅ Single/multiple open modes
- ✅ Default open items
- ✅ Disabled items support
- ✅ String and React node content
- ✅ Keyboard navigation
- ✅ Context API support
- ✅ Full accessibility
- ✅ Responsive design
- ✅ Dark mode support
- ✅ 95%+ test coverage

---

## Contributing

Follow the God-Tier Development Protocol 2025:

1. Read existing code patterns
2. Write TypeScript (strict mode)
3. Create comprehensive tests (80%+ coverage)
4. Ensure accessibility (WCAG AA)
5. Test responsive behavior
6. Support dark mode
7. Document thoroughly

---

## License

Part of the Bubble Gum Atomic Design System.
God-Tier Development Protocol 2025.

---

**Maintained by:** Bubble Gum Team
**Last Updated:** November 7, 2025
**Component Level:** Organism
