# Menu Component (Organism)

**God-Tier Development Protocol 2025**

Accessible navigation menu component with nested submenu support. Composed of Link and Icon atoms.

## Features

- ✅ Horizontal and vertical orientations
- ✅ Nested submenu support (unlimited depth)
- ✅ Keyboard navigation (Arrow keys, Enter, Escape)
- ✅ Active state indication
- ✅ Disabled items support
- ✅ Accordion behavior (single/multiple open)
- ✅ Icons for menu items
- ✅ Multiple visual variants
- ✅ Context API integration
- ✅ WCAG 2.2 AA compliant
- ✅ Responsive design
- ✅ Dark mode support

## Installation

```tsx
import { Menu } from '@/components/organisms/Menu';
import type { MenuItem } from '@/components/organisms/Menu';
```

## Basic Usage

### Simple Horizontal Menu

```tsx
const items: MenuItem[] = [
  { id: '1', label: 'Home', href: '/' },
  { id: '2', label: 'About', href: '/about' },
  { id: '3', label: 'Contact', href: '/contact' }
];

<Menu items={items} orientation="horizontal" />
```

### Vertical Menu with Icons

```tsx
const items: MenuItem[] = [
  { id: '1', label: 'Dashboard', href: '/dashboard', icon: 'home' },
  { id: '2', label: 'Profile', href: '/profile', icon: 'user' },
  { id: '3', label: 'Settings', href: '/settings', icon: 'settings' }
];

<Menu items={items} orientation="vertical" showIcons={true} />
```

### Nested Menu with Submenus

```tsx
const items: MenuItem[] = [
  {
    id: '1',
    label: 'Products',
    icon: 'box',
    children: [
      { id: '1-1', label: 'Category 1', href: '/products/cat1' },
      { id: '1-2', label: 'Category 2', href: '/products/cat2' },
      {
        id: '1-3',
        label: 'Category 3',
        children: [
          { id: '1-3-1', label: 'Subcategory 1', href: '/products/cat3/sub1' },
          { id: '1-3-2', label: 'Subcategory 2', href: '/products/cat3/sub2' }
        ]
      }
    ]
  },
  { id: '2', label: 'Services', href: '/services', icon: 'briefcase' },
  { id: '3', label: 'Contact', href: '/contact', icon: 'mail' }
];

<Menu
  items={items}
  orientation="vertical"
  variant="bordered"
  showIcons={true}
  showSubmenuIndicators={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `MenuItem[]` | **Required** | Array of menu items |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Menu orientation |
| `variant` | `'default' \| 'minimal' \| 'bordered' \| 'pills'` | `'default'` | Visual variant |
| `activeItemId` | `string` | - | ID of active menu item |
| `onItemClick` | `(item: MenuItem, event: MouseEvent) => void` | - | Item click handler |
| `onSubmenuToggle` | `(itemId: string, isOpen: boolean) => void` | - | Submenu toggle handler |
| `allowMultipleOpen` | `boolean` | `false` | Allow multiple submenus open |
| `defaultOpenIds` | `string[]` | `[]` | IDs of submenus to open by default |
| `collapseOnClick` | `boolean` | `false` | Collapse menu when item is clicked |
| `showIcons` | `boolean` | `true` | Show icons for menu items |
| `showSubmenuIndicators` | `boolean` | `true` | Show chevron indicators for submenus |
| `className` | `string` | - | Custom CSS class |
| `data-testid` | `string` | `'menu'` | Test ID for testing |

### MenuItem Interface

```typescript
interface MenuItem {
  id: string;              // Unique identifier
  label: string;           // Display label
  href?: string;           // Link URL (optional)
  icon?: string;           // Icon name (optional)
  children?: MenuItem[];   // Nested items (optional)
  disabled?: boolean;      // Disabled state (optional)
  data?: Record<string, any>; // Custom data (optional)
}
```

## Variants

### Default
Standard menu with subtle hover effects.

```tsx
<Menu items={items} variant="default" />
```

### Minimal
Clean menu with transparent background.

```tsx
<Menu items={items} variant="minimal" />
```

### Bordered
Menu with border and padding.

```tsx
<Menu items={items} variant="bordered" />
```

### Pills
Menu with pill-shaped items.

```tsx
<Menu items={items} variant="pills" />
```

## Advanced Examples

### With Active State

```tsx
const [activeId, setActiveId] = useState('1');

<Menu
  items={items}
  activeItemId={activeId}
  onItemClick={(item) => setActiveId(item.id)}
/>
```

### With Disabled Items

```tsx
const items: MenuItem[] = [
  { id: '1', label: 'Home', href: '/' },
  { id: '2', label: 'Admin', href: '/admin', disabled: true },
  { id: '3', label: 'Profile', href: '/profile' }
];

<Menu items={items} />
```

### Mobile-Friendly Collapsible Menu

```tsx
<Menu
  items={items}
  orientation="vertical"
  collapseOnClick={true}
  allowMultipleOpen={false}
/>
```

### Default Open Submenus

```tsx
<Menu
  items={items}
  defaultOpenIds={['1', '2']}
  allowMultipleOpen={true}
/>
```

### Custom Event Handlers

```tsx
<Menu
  items={items}
  onItemClick={(item, event) => {
    console.log('Clicked:', item.label);
    // Custom navigation logic
  }}
  onSubmenuToggle={(itemId, isOpen) => {
    console.log(`Submenu ${itemId} is ${isOpen ? 'open' : 'closed'}`);
  }}
/>
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Arrow Down` / `Arrow Right` | Move to next item |
| `Arrow Up` / `Arrow Left` | Move to previous item |
| `Enter` / `Space` | Activate focused item |
| `Escape` | Close all submenus |

## Accessibility

- ✅ Semantic `<nav>` element
- ✅ ARIA roles: `menubar`, `menu`, `none`
- ✅ ARIA attributes: `aria-orientation`, `aria-expanded`, `aria-haspopup`, `aria-current`
- ✅ Full keyboard navigation
- ✅ Focus management
- ✅ Screen reader support
- ✅ High contrast mode support

## Styling

The component uses CSS Modules with CSS variables for theming:

```css
--menu-bg: Background color
--menu-color: Text color
--menu-border: Border color
--menu-hover-bg: Hover background
--menu-active-bg: Active background
--menu-active-color: Active text color
--menu-disabled-color: Disabled text color
--menu-spacing: Item spacing
--menu-radius: Border radius
--menu-transition: Transition timing
```

## Context API

The Menu component supports parameter inheritance through the Context API:

```tsx
<AtomProvider value={{ size: 'lg' }}>
  <Menu items={items} />
</AtomProvider>
```

## Responsive Behavior

- Mobile (< 640px): Horizontal menus become vertical
- Tablet (641px - 1024px): Optimized spacing
- Desktop (> 1025px): Full spacing and layout

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

## Performance

- ✅ Optimized re-renders with React.memo
- ✅ Efficient keyboard navigation
- ✅ Lazy rendering of submenus
- ✅ CSS Modules for scoped styles

## Testing

The component has 45+ tests covering:
- Rendering
- Orientations and variants
- Nested menus
- Active and disabled states
- Interactions
- Keyboard navigation
- Accordion behavior
- Accessibility
- Edge cases

```bash
npm test Menu
```

## Version

**Component Version:** 1.0.0
**Protocol:** God-Tier Development Protocol 2025
**Atomic Level:** Organism

## Related Components

- Link (Atom) - Used for menu items
- Icon (Atom) - Used for icons and indicators
- Navbar (Organism) - Full navigation bar with logo and actions

## License

Copyright © 2025 Bubble Gum Project
