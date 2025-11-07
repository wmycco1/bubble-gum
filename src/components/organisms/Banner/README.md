# Banner Component

**Organism Component** | God-Tier Development Protocol 2025

Announcement banner for important messages, promotions, and CTAs.

## Features

- ✅ Title and message content
- ✅ CTA button with customizable variant
- ✅ Multiple variants (info, success, warning, promo)
- ✅ Flexible positioning (top, bottom, relative)
- ✅ Sticky behavior
- ✅ Dismissible with close button
- ✅ Badge support (e.g., "NEW", "SALE")
- ✅ Background image support
- ✅ Context API parameter inheritance
- ✅ Fully accessible (WCAG AA)
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Print optimization

## Composition

Banner is composed of:
- **Heading** (Atom) - for title
- **Text** (Atom) - for message
- **Button** (Atom) - for CTA
- **X Icon** (lucide-react) - for close button
- **Badge** (inline span) - for announcement labels

## Installation

```bash
npm install lucide-react
```

## Usage

### Basic Banner

```tsx
import { Banner } from '@/components/organisms/Banner';

export default function Page() {
  return (
    <Banner
      message="Welcome to our new site!"
      ctaText="Learn More"
      ctaHref="/about"
    />
  );
}
```

### Promo Banner with Badge

```tsx
<Banner
  title="Black Friday Sale"
  message="Get 50% off all products this week only"
  ctaText="Shop Now"
  ctaHref="/shop"
  variant="promo"
  badge="NEW"
  backgroundImage="/promo-bg.jpg"
  position="top"
  sticky={true}
/>
```

### Dismissible Announcement

```tsx
<Banner
  message="We've just launched our mobile app!"
  ctaText="Download"
  ctaHref="/download"
  variant="success"
  dismissible={true}
  onDismiss={() => console.log('Banner dismissed')}
/>
```

### Warning Banner

```tsx
<Banner
  title="Maintenance Scheduled"
  message="Our services will be down for maintenance on Sunday, 2-4 AM"
  variant="warning"
  position="top"
/>
```

### With Context API

```tsx
import { AtomProvider } from '@/context/parameters/ParameterContext';

<AtomProvider value={{ size: 'lg' }}>
  <Banner
    message="This banner inherits size from context"
    ctaText="Action"
    ctaHref="/action"
  />
</AtomProvider>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | **required** | Banner message text |
| `title` | `string` | - | Optional banner title |
| `ctaText` | `string` | - | CTA button text |
| `ctaHref` | `string` | - | CTA button link |
| `ctaVariant` | `ButtonVariant` | `'primary'` | CTA button style |
| `ctaOnClick` | `function` | - | CTA click handler |
| `variant` | `'info' \| 'success' \| 'warning' \| 'promo'` | `'info'` | Banner style |
| `position` | `'top' \| 'bottom' \| 'relative'` | `'relative'` | Banner position |
| `sticky` | `boolean` | `false` | Sticky positioning |
| `dismissible` | `boolean` | `false` | Show close button |
| `onDismiss` | `function` | - | Dismiss callback |
| `badge` | `string` | - | Badge text (e.g., "NEW") |
| `backgroundImage` | `string` | - | Background image URL |
| `showCloseButton` | `boolean` | `false` | Show close button (alias for dismissible) |
| `className` | `string` | - | Additional CSS class |
| `data-testid` | `string` | `'banner'` | Test ID |

## Variants

### `info` (default)
Blue banner for informational messages.

### `success`
Green banner for success messages and confirmations.

### `warning`
Yellow/orange banner for warnings and important notices.

### `promo`
Purple gradient banner for promotions and special offers.

## Positions

### `relative` (default)
Normal document flow positioning.

### `top`
Fixed to top of viewport.

### `bottom`
Fixed to bottom of viewport.

### Sticky
Use `sticky={true}` to make banner stick to top on scroll.

## Accessibility

- ✅ Semantic HTML (`<section>` with `role="region"`)
- ✅ ARIA attributes (`aria-label`, `aria-live="polite"`)
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Screen reader support
- ✅ Focus management
- ✅ High contrast mode support
- ✅ Reduced motion support

## Best Practices

1. **Keep messages concise** - Users should understand the message at a glance
2. **Use appropriate variants** - Match the banner style to the message importance
3. **Provide clear CTAs** - Make it obvious what action users should take
4. **Make important banners dismissible** - Don't force users to see the same message repeatedly
5. **Use badges sparingly** - Only for truly new or special announcements
6. **Consider positioning** - Top banners are more visible but can be intrusive
7. **Test on mobile** - Banners take up more screen space on small devices

## CSS Variables

```css
--banner-bg: var(--color-surface, #ffffff);
--banner-color: var(--color-text, #1f2937);
--banner-border: var(--color-border, #e5e7eb);
--banner-padding: var(--spacing-md, 1rem);
--banner-transition: all 0.3s ease;
```

## Examples

### Newsletter Signup Banner

```tsx
<Banner
  message="Subscribe to our newsletter for updates"
  ctaText="Subscribe"
  ctaHref="/newsletter"
  variant="info"
  position="bottom"
  dismissible={true}
/>
```

### Limited Time Offer

```tsx
<Banner
  title="Flash Sale"
  message="24-hour sale - Everything 30% off"
  ctaText="Shop Now"
  ctaHref="/sale"
  variant="promo"
  badge="ENDING SOON"
  position="top"
  sticky={true}
/>
```

### Cookie Consent

```tsx
<Banner
  message="We use cookies to improve your experience"
  ctaText="Accept"
  ctaOnClick={() => setCookieConsent(true)}
  variant="info"
  position="bottom"
  dismissible={true}
/>
```

## Testing

The Banner component has 40+ comprehensive tests covering:
- Rendering with all prop combinations
- CTA button interactions
- All variants (info, success, warning, promo)
- All positions (top, bottom, relative)
- Sticky behavior
- Dismissible functionality
- Badge rendering
- Background images
- Accessibility compliance
- Context API integration
- Edge cases

Run tests:
```bash
npm test Banner.test.tsx
```

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Related Components

- **Alert** (Molecule) - For inline feedback messages
- **Hero** (Organism) - For hero sections
- **Navbar** (Organism) - For navigation

## License

Part of Bubble Gum Atomic Design System - God-Tier Development Protocol 2025
