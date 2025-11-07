# Tabs Component

**Type:** Organism
**Status:** ✅ Production Ready
**Version:** 1.0.0
**God-Tier Protocol:** 2025

---

## Overview

A tabbed interface component for organizing and displaying content in separate panels with navigation. The Tabs organism is composed of Button, Text, and Icon atoms, following Atomic Design principles.

**Use Cases:**
- Content organization (Overview, Details, Settings)
- Product information sections
- Multi-step forms navigation
- Dashboard panels
- Profile sections
- Documentation navigation

---

## Installation

```tsx
import { Tabs } from '@/components/organisms/Tabs';
```

---

## Basic Usage

### Minimal Example

```tsx
<Tabs
  tabs={[
    { id: '1', label: 'Tab 1', content: 'Content 1' },
    { id: '2', label: 'Tab 2', content: 'Content 2' }
  ]}
/>
```

### Product Information Tabs

```tsx
<Tabs
  tabs={[
    {
      id: 'overview',
      label: 'Overview',
      content: 'Product overview and key features'
    },
    {
      id: 'specs',
      label: 'Specifications',
      content: 'Technical specifications and details'
    },
    {
      id: 'reviews',
      label: 'Reviews',
      content: 'Customer reviews and ratings'
    }
  ]}
  variant="underline"
/>
```

---

## Advanced Examples

### Full-Featured Tabs

```tsx
<Tabs
  tabs={productTabs}
  defaultActiveTab="overview"
  variant="pills"
  orientation="horizontal"
  fullWidth={true}
  lazyMount={true}
  onTabChange={(tabId) => {
    console.log(`Active tab: ${tabId}`);
    analytics.track('tab_view', { tabId });
  }}
/>
```

### Tabs with Icons

```tsx
<Tabs
  tabs={[
    {
      id: 'home',
      label: 'Home',
      content: <HomePage />,
      icon: 'home'
    },
    {
      id: 'settings',
      label: 'Settings',
      content: <SettingsPage />,
      icon: 'settings'
    },
    {
      id: 'profile',
      label: 'Profile',
      content: <ProfilePage />,
      icon: 'user'
    }
  ]}
  variant="pills"
/>
```

### Vertical Tabs

```tsx
<Tabs
  tabs={dashboardTabs}
  orientation="vertical"
  variant="default"
/>
```

### With Disabled Tabs

```tsx
<Tabs
  tabs={[
    { id: '1', label: 'Active Tab', content: 'This can be accessed' },
    { id: '2', label: 'Premium Feature', content: 'Locked content', disabled: true }
  ]}
/>
```

---

## Props API

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `tabs` | `TabItem[]` | Array of tab items (required) |

### Behavior Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultActiveTab` | `string` | First tab ID | Default active tab ID |
| `lazyMount` | `boolean` | `false` | Only mount tab content when first activated |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'underline' \| 'pills' \| 'enclosed'` | `'default'` | Visual variant |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientation of tabs |
| `fullWidth` | `boolean` | `false` | Make tabs span full width |
| `className` | `string` | - | Custom CSS class |
| `style` | `React.CSSProperties` | - | Inline styles |
| `data-testid` | `string` | `'tabs'` | Test ID |

### Interaction Props

| Prop | Type | Description |
|------|------|-------------|
| `onTabChange` | `(tabId: string) => void` | Callback when active tab changes |

### TabItem Interface

```typescript
interface TabItem {
  id: string;                 // Unique identifier
  label: string;              // Tab label text
  content: React.ReactNode;   // Tab content
  icon?: string;              // Optional icon name
  disabled?: boolean;         // Whether tab is disabled
}
```

---

## Variants

### `default`

Standard tabs with bottom border indicator.

```tsx
<Tabs tabs={tabs} variant="default" />
```

### `underline`

Minimal underline style.

```tsx
<Tabs tabs={tabs} variant="underline" />
```

### `pills`

Pill-shaped buttons.

```tsx
<Tabs tabs={tabs} variant="pills" />
```

### `enclosed`

Enclosed tabs with borders.

```tsx
<Tabs tabs={tabs} variant="enclosed" />
```

---

## Orientation

### Horizontal (Default)

Tabs arranged horizontally at the top.

```tsx
<Tabs tabs={tabs} orientation="horizontal" />
```

### Vertical

Tabs arranged vertically on the left side.

```tsx
<Tabs tabs={tabs} orientation="vertical" />
```

---

## Performance Optimization

### Lazy Mounting

Only mount tab content when first activated (improves initial render performance):

```tsx
<Tabs
  tabs={heavyContentTabs}
  lazyMount={true}
/>
```

**Benefits:**
- Faster initial render
- Reduced memory usage
- Better for large datasets
- Content persists once mounted

---

## Callbacks

### onTabChange

Triggered when the active tab changes:

```tsx
<Tabs
  tabs={tabs}
  onTabChange={(tabId) => {
    console.log(`Switched to tab: ${tabId}`);

    // Track analytics
    analytics.track('tab_change', { tabId });

    // Update URL
    router.push(`?tab=${tabId}`);
  }}
/>
```

---

## Context API Support

The Tabs component supports parameter inheritance:

```tsx
import { AtomProvider } from '@/context/parameters/ParameterContext';

<AtomProvider value={{ variant: 'pills' }}>
  <Tabs tabs={tabs1} />
  <Tabs tabs={tabs2} />
  <Tabs tabs={tabs3} variant="underline" /> {/* Overrides context */}
</AtomProvider>
```

---

## Accessibility

### Features

- ✅ Semantic HTML (button for triggers)
- ✅ Proper ARIA attributes (`aria-selected`, `aria-controls`, `aria-labelledby`, `aria-hidden`)
- ✅ Keyboard navigation (Arrow keys, Home, End)
- ✅ Focus management (roving tabindex)
- ✅ Screen reader support
- ✅ High contrast mode support

### Keyboard Controls

| Key | Action (Horizontal) | Action (Vertical) |
|-----|---------------------|-------------------|
| `ArrowRight` | Next tab | - |
| `ArrowLeft` | Previous tab | - |
| `ArrowDown` | - | Next tab |
| `ArrowUp` | - | Previous tab |
| `Home` | First tab | First tab |
| `End` | Last tab | Last tab |
| `Tab` | Navigate to next focusable | Navigate to next focusable |

### Best Practices

```tsx
// ✅ Good: Descriptive labels
<Tabs
  tabs={[
    { id: 'overview', label: 'Product Overview', content: '...' },
    { id: 'specs', label: 'Technical Specifications', content: '...' }
  ]}
/>

// ❌ Avoid: Vague labels
<Tabs
  tabs={[
    { id: '1', label: 'Tab 1', content: '...' },
    { id: '2', label: 'Tab 2', content: '...' }
  ]}
/>
```

---

## Responsive Behavior

- **Mobile (<640px):**
  - Horizontal scrolling for tab list
  - Reduced padding
  - Smaller font sizes
  - Vertical tabs become horizontal

- **Tablet (640px-1023px):**
  - Standard padding
  - Medium font sizes

- **Desktop (>1024px):**
  - Full padding
  - Enhanced spacing
  - Vertical orientation supported

---

## Dark Mode

Automatically adapts to system color scheme:

```tsx
<Tabs tabs={tabs} />
```

**Dark Mode Changes:**
- Dark backgrounds
- Lighter borders
- Adjusted text colors
- Enhanced contrast for active state

---

## Performance

- ✅ CSS Modules for scoped styling
- ✅ No runtime CSS-in-JS overhead
- ✅ Optimized animations (CSS transitions)
- ✅ Tree-shakable exports
- ✅ Minimal bundle impact (~4KB gzipped)
- ✅ Lazy mounting option for heavy content

---

## Testing

### Running Tests

```bash
npm test Tabs.test.tsx
```

### Coverage

- **Target:** 80%+ coverage
- **Current:** 95%+ coverage
- **Total Tests:** 55+ test cases

### Example Test

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from './Tabs';

test('switches tab when clicked', () => {
  const tabs = [
    { id: '1', label: 'Tab 1', content: 'Content 1' },
    { id: '2', label: 'Tab 2', content: 'Content 2' }
  ];

  render(<Tabs tabs={tabs} />);

  const secondTab = screen.getByTestId('tabs-trigger-2');
  fireEvent.click(secondTab);

  expect(secondTab).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByText('Content 2')).toBeInTheDocument();
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

- **Atoms:** Button, Text, Icon
- **Organisms:** Accordion, Carousel

---

## Migration Guide

### From Canvas TabsComponent

```tsx
// Old (Canvas)
<TabsComponent
  component={{
    props: {
      tabs: [{ id: '1', label: 'Test', content: 'Content' }]
    }
  }}
/>

// New (Atomic Design)
<Tabs
  tabs={[{ id: '1', label: 'Test', content: 'Content' }]}
/>
```

---

## Troubleshooting

### Tabs Not Switching

```tsx
// ✅ Correct: Tabs have unique IDs
tabs={[
  { id: '1', label: 'Tab 1', content: 'Content 1' },
  { id: '2', label: 'Tab 2', content: 'Content 2' }
]}

// ❌ Wrong: Duplicate IDs
tabs={[
  { id: '1', label: 'Tab 1', content: 'Content 1' },
  { id: '1', label: 'Tab 2', content: 'Content 2' }  // Same ID!
]}
```

### Default Tab Not Working

```tsx
// ✅ Correct: Use valid tab ID
<Tabs tabs={tabs} defaultActiveTab="overview" />

// ❌ Wrong: Non-existent ID
<Tabs tabs={tabs} defaultActiveTab="invalid-id" />  // Won't work
```

### Content Not Showing

```tsx
// ✅ Correct: Content in all tabs
tabs={[
  { id: '1', label: 'Tab 1', content: 'Content here' },
  { id: '2', label: 'Tab 2', content: <Component /> }
]}

// ❌ Wrong: Missing content
tabs={[
  { id: '1', label: 'Tab 1' }  // No content!
]}
```

---

## Changelog

### Version 1.0.0 (2025-11-07)
- ✅ Initial release
- ✅ Four variants (default, underline, pills, enclosed)
- ✅ Horizontal/vertical orientation
- ✅ Full width option
- ✅ Icon support
- ✅ Disabled tabs support
- ✅ Lazy mounting optimization
- ✅ Keyboard navigation (Arrow keys, Home, End)
- ✅ Context API support
- ✅ Full accessibility (WCAG AA)
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
