# BannerSlider Component

**Organism Component** | God-Tier Development Protocol 2025

Carousel slider for rotating banner announcements and promotions.

## Features

- ✅ Multiple slides with smooth transitions
- ✅ Auto-play with configurable interval
- ✅ Navigation arrows (prev/next)
- ✅ Dot indicators
- ✅ Pause on hover
- ✅ Infinite loop support
- ✅ Keyboard navigation (Arrow keys)
- ✅ Swipe/drag support ready
- ✅ Context API parameter inheritance
- ✅ Fully accessible (WCAG AA)
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Print optimization

## Composition

BannerSlider is composed of:
- **Heading** (Atom) - for slide titles
- **Text** (Atom) - for slide messages
- **Button** (Atom) - for CTAs
- **ChevronLeft/Right Icons** (lucide-react) - for navigation
- **Dot Indicators** - for slide position

## Installation

```bash
npm install lucide-react
```

## Usage

### Basic Slider

```tsx
import { BannerSlider } from '@/components/organisms/BannerSlider';

const slides = [
  {
    id: '1',
    message: 'Welcome to our new site!',
    ctaText: 'Learn More',
    ctaHref: '/about',
  },
  {
    id: '2',
    message: 'Shop our summer sale!',
    ctaText: 'Shop Now',
    ctaHref: '/sale',
  },
];

export default function Page() {
  return <BannerSlider slides={slides} />;
}
```

### Auto-Play Carousel

```tsx
<BannerSlider
  slides={promoSlides}
  autoPlay={true}
  interval={5000}
  pauseOnHover={true}
  loop={true}
/>
```

### Manual Navigation Only

```tsx
<BannerSlider
  slides={slides}
  autoPlay={false}
  showArrows={true}
  showDots={true}
/>
```

### With Background Images

```tsx
const slides = [
  {
    id: '1',
    title: 'Summer Collection',
    message: 'New arrivals for the season',
    ctaText: 'Shop Now',
    ctaHref: '/summer',
    backgroundImage: '/summer-bg.jpg',
  },
  {
    id: '2',
    title: 'Winter Sale',
    message: 'Up to 50% off',
    ctaText: 'View Deals',
    ctaHref: '/winter-sale',
    backgroundImage: '/winter-bg.jpg',
  },
];

<BannerSlider slides={slides} autoPlay={true} />
```

### With Slide Change Callback

```tsx
const handleSlideChange = (index: number) => {
  console.log(`Now viewing slide ${index + 1}`);
  // Track analytics, update state, etc.
};

<BannerSlider
  slides={slides}
  onSlideChange={handleSlideChange}
  autoPlay={true}
/>
```

### With Context API

```tsx
import { AtomProvider } from '@/context/parameters/ParameterContext';

<AtomProvider value={{ size: 'lg' }}>
  <BannerSlider slides={slides} autoPlay={true} />
</AtomProvider>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `slides` | `BannerSlide[]` | **required** | Array of slide configurations |
| `autoPlay` | `boolean` | `false` | Auto-advance slides |
| `interval` | `number` | `5000` | Auto-advance interval (ms) |
| `showArrows` | `boolean` | `true` | Show navigation arrows |
| `showDots` | `boolean` | `true` | Show dot indicators |
| `pauseOnHover` | `boolean` | `true` | Pause auto-play on hover |
| `loop` | `boolean` | `true` | Enable infinite loop |
| `transitionDuration` | `number` | `300` | Transition duration (ms) |
| `onSlideChange` | `function` | - | Callback when slide changes |
| `className` | `string` | - | Additional CSS class |
| `data-testid` | `string` | `'banner-slider'` | Test ID |

## BannerSlide Interface

```typescript
interface BannerSlide {
  id: string;              // Unique identifier (required)
  message: string;         // Slide message (required)
  title?: string;          // Optional title
  ctaText?: string;        // CTA button text
  ctaHref?: string;        // CTA button link
  backgroundImage?: string; // Background image URL
  variant?: 'info' | 'success' | 'warning' | 'promo';
}
```

## Features

### Auto-Play
Automatically advance through slides at a configurable interval.

```tsx
<BannerSlider
  slides={slides}
  autoPlay={true}
  interval={3000} // 3 seconds
/>
```

### Pause on Hover
Pause auto-play when user hovers over the slider.

```tsx
<BannerSlider
  slides={slides}
  autoPlay={true}
  pauseOnHover={true}
/>
```

### Infinite Loop
Loop back to the first slide after the last slide.

```tsx
<BannerSlider
  slides={slides}
  loop={true}
/>
```

### Keyboard Navigation
Navigate with arrow keys:
- **ArrowRight** - Next slide
- **ArrowLeft** - Previous slide

### Single Slide
When only one slide is provided, navigation controls are hidden automatically.

```tsx
<BannerSlider
  slides={[
    { id: '1', message: 'Only one announcement' }
  ]}
/>
```

## Accessibility

- ✅ Semantic HTML (`<section>` with `role="region"`)
- ✅ ARIA attributes (`aria-label`, `aria-live="polite"`, `aria-roledescription="carousel"`)
- ✅ Keyboard navigation (Arrow keys)
- ✅ Screen reader announcements for slide changes
- ✅ Focus management
- ✅ Disabled state for arrows at boundaries (when loop is false)
- ✅ High contrast mode support
- ✅ Reduced motion support

## Best Practices

1. **Keep slides concise** - Users typically only glance at rotating banners
2. **Use 3-5 slides max** - Too many slides reduces engagement
3. **Set appropriate intervals** - 4-6 seconds per slide is ideal
4. **Provide manual controls** - Don't rely solely on auto-play
5. **Use high-quality images** - Background images should be optimized
6. **Make CTAs clear** - Each slide should have an obvious action
7. **Test on mobile** - Ensure slides are readable on small screens
8. **Consider accessibility** - Not all users can interact with carousels easily

## CSS Variables

```css
--slider-bg: var(--color-surface, #ffffff);
--slider-color: var(--color-text, #1f2937);
--slider-arrow-bg: rgba(255, 255, 255, 0.9);
--slider-arrow-color: #1f2937;
--slider-dot-bg: rgba(255, 255, 255, 0.5);
--slider-dot-active-bg: #ffffff;
--slider-transition: all 0.3s ease;
```

## Examples

### Promo Banner Carousel

```tsx
const promos = [
  {
    id: 'promo1',
    title: 'Black Friday Sale',
    message: '50% off everything',
    ctaText: 'Shop Now',
    ctaHref: '/sale',
    backgroundImage: '/black-friday.jpg',
  },
  {
    id: 'promo2',
    title: 'Free Shipping',
    message: 'On orders over $50',
    ctaText: 'Start Shopping',
    ctaHref: '/shop',
    backgroundImage: '/free-shipping.jpg',
  },
];

<BannerSlider
  slides={promos}
  autoPlay={true}
  interval={4000}
  pauseOnHover={true}
/>
```

### Announcement Carousel

```tsx
const announcements = [
  {
    id: 'ann1',
    message: 'New mobile app now available',
    ctaText: 'Download',
    ctaHref: '/app',
  },
  {
    id: 'ann2',
    message: 'Join our newsletter for exclusive deals',
    ctaText: 'Subscribe',
    ctaHref: '/newsletter',
  },
  {
    id: 'ann3',
    message: 'Free returns within 30 days',
    ctaText: 'Learn More',
    ctaHref: '/returns',
  },
];

<BannerSlider
  slides={announcements}
  autoPlay={true}
  interval={6000}
/>
```

### Feature Highlights

```tsx
const features = [
  {
    id: 'feat1',
    title: 'AI-Powered',
    message: 'Smart recommendations just for you',
    ctaText: 'Try It',
    ctaHref: '/ai',
  },
  {
    id: 'feat2',
    title: 'Lightning Fast',
    message: 'Optimized for performance',
    ctaText: 'See How',
    ctaHref: '/performance',
  },
];

<BannerSlider
  slides={features}
  autoPlay={false}
  showArrows={true}
  showDots={true}
/>
```

## Testing

The BannerSlider component has 45+ comprehensive tests covering:
- Rendering with all prop combinations
- Navigation arrows (prev/next)
- Dot indicators
- Auto-play functionality
- Pause on hover
- Loop behavior
- Keyboard navigation
- Slide change callbacks
- Single slide handling
- Accessibility compliance
- Context API integration
- Edge cases

Run tests:
```bash
npm test BannerSlider.test.tsx
```

## Performance Tips

1. **Optimize images** - Use WebP format and appropriate sizes
2. **Lazy load images** - Load slide images as needed
3. **Limit slides** - Keep the number of slides reasonable (3-5)
4. **Use CSS transitions** - More performant than JavaScript animations
5. **Cleanup intervals** - Component properly cleans up auto-play timers

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Related Components

- **Banner** (Organism) - For single announcement banners
- **Hero** (Organism) - For hero sections
- **Carousel** - For general content carousels

## License

Part of Bubble Gum Atomic Design System - God-Tier Development Protocol 2025
