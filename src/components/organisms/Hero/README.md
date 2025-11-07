# Hero Component (Organism)

**God-Tier Development Protocol 2025**

Hero section component for landing pages and key marketing pages. Composed of Heading, Text, Button, and Image atoms.

## Features

- ✅ Title and subtitle support
- ✅ Primary and secondary CTA buttons
- ✅ Background image or gradient
- ✅ Background overlay for readability
- ✅ Content alignment (left, center, right)
- ✅ Full viewport height option
- ✅ Split layout with side image
- ✅ Responsive design
- ✅ Context API integration
- ✅ WCAG 2.2 AA compliant
- ✅ Dark mode support
- ✅ Print-friendly

## Installation

```tsx
import { Hero } from '@/components/organisms/Hero';
```

## Basic Usage

### Simple Hero

```tsx
<Hero
  title="Welcome to Our Platform"
  subtitle="Build amazing products with our tools"
  ctaText="Get Started"
  ctaHref="/signup"
/>
```

### Hero with Background Image

```tsx
<Hero
  title="Transform Your Business"
  subtitle="AI-powered solutions for modern companies"
  ctaText="Start Free Trial"
  ctaHref="/trial"
  backgroundImage="/hero-bg.jpg"
  backgroundOverlay={true}
/>
```

### Full-Height Hero

```tsx
<Hero
  title="Create. Innovate. Succeed."
  subtitle="Join thousands of successful businesses"
  ctaText="Get Started"
  ctaHref="/signup"
  fullHeight={true}
  align="center"
/>
```

### Hero with Split Layout

```tsx
<Hero
  title="Next-Gen Solutions"
  subtitle="Everything you need to scale your business"
  ctaText="Learn More"
  ctaHref="/features"
  sideImage="/product-screenshot.png"
  sideImageAlt="Product preview"
  sideImagePosition="right"
  align="left"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **Required** | Main heading |
| `subtitle` | `string` | - | Secondary text |
| `ctaText` | `string` | - | Primary button text |
| `ctaHref` | `string` | - | Primary button link |
| `ctaVariant` | `ButtonVariant` | `'primary'` | Primary button variant |
| `ctaOnClick` | `(event) => void` | - | Primary button click handler |
| `secondaryCtaText` | `string` | - | Secondary button text |
| `secondaryCtaHref` | `string` | - | Secondary button link |
| `secondaryCtaVariant` | `ButtonVariant` | `'secondary'` | Secondary button variant |
| `secondaryCtaOnClick` | `(event) => void` | - | Secondary button click handler |
| `backgroundImage` | `string` | - | Background image URL |
| `backgroundGradient` | `string` | - | CSS gradient string |
| `backgroundOverlay` | `boolean` | `false` | Add dark overlay |
| `overlayOpacity` | `number` | `0.5` | Overlay opacity (0-1) |
| `align` | `'left' \| 'center' \| 'right'` | `'center'` | Content alignment |
| `fullHeight` | `boolean` | `false` | Full viewport height |
| `minHeight` | `string` | `'500px'` | Minimum height |
| `sideImage` | `string` | - | Side image URL |
| `sideImageAlt` | `string` | `'Hero image'` | Side image alt text |
| `sideImagePosition` | `'left' \| 'right'` | `'right'` | Side image position |
| `className` | `string` | - | Custom CSS class |
| `data-testid` | `string` | `'hero'` | Test ID |

## Advanced Examples

### Hero with Both CTAs

```tsx
<Hero
  title="Powerful Analytics"
  subtitle="Make data-driven decisions"
  ctaText="Start Free Trial"
  ctaHref="/trial"
  ctaVariant="primary"
  secondaryCtaText="Watch Demo"
  secondaryCtaHref="/demo"
  secondaryCtaVariant="outline"
/>
```

### Hero with Gradient Background

```tsx
<Hero
  title="Innovative Design"
  subtitle="Beautiful, functional, and fast"
  ctaText="Explore"
  ctaHref="/explore"
  backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  backgroundOverlay={false}
  fullHeight={true}
/>
```

### Hero with Custom Handlers

```tsx
const handlePrimaryClick = (e) => {
  e.preventDefault();
  // Custom logic (analytics, modals, etc.)
  console.log('Primary CTA clicked');
};

const handleSecondaryClick = (e) => {
  e.preventDefault();
  // Custom logic
  console.log('Secondary CTA clicked');
};

<Hero
  title="Get Started Today"
  ctaText="Sign Up"
  ctaOnClick={handlePrimaryClick}
  secondaryCtaText="Learn More"
  secondaryCtaOnClick={handleSecondaryClick}
/>
```

### Left-Aligned Hero with Image

```tsx
<Hero
  title="Professional Tools"
  subtitle="Everything you need to succeed"
  ctaText="Get Started"
  ctaHref="/signup"
  align="left"
  sideImage="/dashboard-preview.png"
  sideImageAlt="Dashboard preview"
  sideImagePosition="right"
/>
```

### Dark Hero with Overlay

```tsx
<Hero
  title="Elevate Your Brand"
  subtitle="Stand out from the competition"
  ctaText="Start Now"
  ctaHref="/start"
  backgroundImage="/dark-hero-bg.jpg"
  backgroundOverlay={true}
  overlayOpacity={0.7}
  fullHeight={true}
/>
```

## Alignment Options

### Left Alignment
Best for: Landing pages with side images, text-heavy content

```tsx
<Hero title="Title" subtitle="Text" align="left" />
```

### Center Alignment (Default)
Best for: Announcements, product launches, event pages

```tsx
<Hero title="Title" subtitle="Text" align="center" />
```

### Right Alignment
Best for: Alternative layouts, creative designs

```tsx
<Hero title="Title" subtitle="Text" align="right" />
```

## Background Options

### Solid Color (CSS Variable)
```tsx
<Hero title="Title" style={{ backgroundColor: 'var(--color-primary)' }} />
```

### Image
```tsx
<Hero title="Title" backgroundImage="/hero.jpg" backgroundOverlay={true} />
```

### Gradient
```tsx
<Hero
  title="Title"
  backgroundGradient="linear-gradient(to right, #ff7e5f, #feb47b)"
/>
```

### Video (Custom)
For video backgrounds, use custom styling:

```tsx
<Hero
  title="Title"
  className="hero-with-video"
  style={{ position: 'relative' }}
/>
// Add video element with custom CSS
```

## Accessibility

- ✅ Semantic `<section>` element
- ✅ Proper heading hierarchy (h1)
- ✅ Overlay marked as `aria-hidden`
- ✅ Accessible button/link CTAs
- ✅ Image alt text required
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ High contrast mode support

## Styling

The component uses CSS Modules with CSS variables:

```css
--hero-bg: Background color
--hero-color: Text color
--hero-title-color: Title color
--hero-subtitle-color: Subtitle color
--hero-overlay-color: Overlay color
--hero-spacing: Section padding
--hero-max-width: Content max width
--hero-transition: Transition timing
```

## Context API

Supports parameter inheritance:

```tsx
<AtomProvider value={{ align: 'center' }}>
  <Hero title="Centered Hero" />
</AtomProvider>
```

## Responsive Behavior

### Mobile (< 640px)
- Stack side images vertically
- Center align content
- Full-width buttons
- Smaller font sizes

### Tablet (641px - 1024px)
- Optimized spacing
- Adjusted font sizes
- 55/45 content/image split

### Desktop (> 1025px)
- Full spacing
- Larger font sizes
- 50/50 content/image split

### Large Desktop (> 1440px)
- Maximum spacing
- Largest font sizes

## Performance

- ✅ Lazy load background images
- ✅ Priority loading for above-fold images
- ✅ CSS Modules for scoped styles
- ✅ Optimized re-renders

## Use Cases

1. **Landing Pages** - Main hero with CTA
2. **Product Pages** - Feature showcase with image
3. **Event Pages** - Announcement with full-height background
4. **About Pages** - Team/mission statement
5. **Campaign Pages** - Marketing campaigns with CTAs

## Testing

The component has 40+ tests covering:
- Rendering variations
- CTA buttons
- Background options
- Alignment
- Height options
- Side images
- Accessibility
- Edge cases

```bash
npm test Hero
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

## Version

**Component Version:** 1.0.0
**Protocol:** God-Tier Development Protocol 2025
**Atomic Level:** Organism

## Related Components

- Heading (Atom) - Used for title
- Text (Atom) - Used for subtitle
- Button (Atom) - Used for CTAs
- Image (Atom) - Used for side images

## Best Practices

1. **Always provide a title** - Required for SEO and accessibility
2. **Use overlay with background images** - Improves text readability
3. **Provide alt text for images** - Essential for accessibility
4. **Test on mobile** - Ensure responsive behavior works
5. **Use semantic variants** - Primary for main action, Secondary for alternatives
6. **Optimize images** - Use WebP/AVIF for background images
7. **Consider performance** - Use `loading="eager"` for hero images

## Common Patterns

### SaaS Landing Page
```tsx
<Hero
  title="Scale Your Business"
  subtitle="All-in-one platform for growth"
  ctaText="Start Free Trial"
  ctaHref="/trial"
  secondaryCtaText="Book Demo"
  secondaryCtaHref="/demo"
  backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  fullHeight={true}
/>
```

### E-commerce
```tsx
<Hero
  title="Summer Collection 2025"
  subtitle="Discover the latest trends"
  ctaText="Shop Now"
  ctaHref="/shop"
  sideImage="/collection-preview.jpg"
  sideImageAlt="Summer collection preview"
  align="left"
/>
```

### Portfolio
```tsx
<Hero
  title="John Doe"
  subtitle="Designer & Developer"
  ctaText="View Work"
  ctaHref="/portfolio"
  secondaryCtaText="Contact"
  secondaryCtaHref="/contact"
  align="center"
  minHeight="600px"
/>
```

## License

Copyright © 2025 Bubble Gum Project
