# Carousel Component

**Type:** Organism
**Status:** ✅ Production Ready
**Version:** 1.0.0
**God-Tier Protocol:** 2025

---

## Overview

An image/content carousel component with auto-play, navigation controls, and smooth transitions. The Carousel organism is composed of Image, Button, and Icon atoms, following Atomic Design principles.

**Use Cases:**
- Product image galleries
- Hero banners
- Testimonial rotators
- Portfolio showcases
- Feature highlights
- Landing page sliders

---

## Installation

```tsx
import { Carousel } from '@/components/organisms/Carousel';
```

---

## Basic Usage

### Minimal Example

```tsx
<Carousel
  slides={[
    { id: '1', content: <img src="image1.jpg" alt="Image 1" /> },
    { id: '2', content: <img src="image2.jpg" alt="Image 2" /> }
  ]}
/>
```

### Product Gallery

```tsx
<Carousel
  slides={[
    {
      id: '1',
      content: <img src="/products/product-front.jpg" alt="Product front view" />,
      thumbnail: '/products/thumb-front.jpg',
      alt: 'Front view'
    },
    {
      id: '2',
      content: <img src="/products/product-side.jpg" alt="Product side view" />,
      thumbnail: '/products/thumb-side.jpg',
      alt: 'Side view'
    },
    {
      id: '3',
      content: <img src="/products/product-back.jpg" alt="Product back view" />,
      thumbnail: '/products/thumb-back.jpg',
      alt: 'Back view'
    }
  ]}
  showThumbnails={true}
/>
```

---

## Advanced Examples

### Full-Featured Auto-Play Carousel

```tsx
<Carousel
  slides={heroSlides}
  autoPlay={true}
  interval={5000}
  showArrows={true}
  showDots={true}
  pauseOnHover={true}
  loop={true}
  transition="slide"
  transitionDuration={300}
  onSlideChange={(index) => {
    console.log(`Slide ${index + 1}`);
    analytics.track('carousel_slide_change', { index });
  }}
/>
```

### Testimonials Carousel

```tsx
<Carousel
  slides={testimonials.map((testimonial, index) => ({
    id: `testimonial-${index}`,
    content: (
      <div className="testimonial">
        <p>"{testimonial.quote}"</p>
        <p><strong>{testimonial.author}</strong></p>
        <p>{testimonial.role}</p>
      </div>
    )
  }))}
  autoPlay={true}
  interval={6000}
  showDots={true}
  showArrows={false}
  transition="fade"
/>
```

### Hero Banner with Custom Content

```tsx
<Carousel
  slides={[
    {
      id: 'hero-1',
      content: (
        <div className="hero-slide">
          <h1>Welcome to Our Store</h1>
          <p>Discover amazing products</p>
          <button>Shop Now</button>
        </div>
      )
    },
    {
      id: 'hero-2',
      content: (
        <div className="hero-slide">
          <h1>Special Offers</h1>
          <p>Up to 50% off</p>
          <button>View Deals</button>
        </div>
      )
    }
  ]}
  autoPlay={true}
  interval={4000}
  showArrows={true}
  showDots={true}
/>
```

---

## Props API

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `slides` | `CarouselSlide[]` | Array of carousel slides (required) |

### Auto-Play Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoPlay` | `boolean` | `false` | Enable auto-play |
| `interval` | `number` | `3000` | Auto-play interval in milliseconds |
| `pauseOnHover` | `boolean` | `true` | Pause auto-play on hover |

### Navigation Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showArrows` | `boolean` | `true` | Show navigation arrows |
| `showDots` | `boolean` | `true` | Show dot indicators |
| `showThumbnails` | `boolean` | `false` | Show thumbnail navigation |
| `loop` | `boolean` | `true` | Enable infinite loop |

### Animation Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `transition` | `'slide' \| 'fade'` | `'slide'` | Transition animation type |
| `transitionDuration` | `number` | `300` | Transition duration in milliseconds |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Custom CSS class |
| `style` | `React.CSSProperties` | - | Inline styles |
| `data-testid` | `string` | `'carousel'` | Test ID |

### Interaction Props

| Prop | Type | Description |
|------|------|-------------|
| `onSlideChange` | `(index: number) => void` | Callback when slide changes |

### CarouselSlide Interface

```typescript
interface CarouselSlide {
  id: string;               // Unique identifier
  content: React.ReactNode; // Slide content (any React node)
  thumbnail?: string;       // Optional thumbnail URL
  alt?: string;             // Optional alt text for accessibility
}
```

---

## Features

### Auto-Play

Enable automatic slide progression:

```tsx
<Carousel
  slides={slides}
  autoPlay={true}
  interval={5000}  // 5 seconds
  pauseOnHover={true}
/>
```

**Behavior:**
- Automatically advances to next slide
- Respects loop setting
- Pauses on hover (optional)
- Resumes on mouse leave
- Stops when user interacts with controls

---

### Navigation Controls

#### Arrows

```tsx
<Carousel slides={slides} showArrows={true} />
```

- Previous/Next buttons
- Disabled at boundaries (when loop is off)
- Keyboard accessible

#### Dots

```tsx
<Carousel slides={slides} showDots={true} />
```

- One dot per slide
- Click to jump to slide
- Active state indicator

#### Thumbnails

```tsx
<Carousel
  slides={slides}
  showThumbnails={true}
/>
```

- Visual preview of each slide
- Click to jump to slide
- Scrollable on mobile
- Placeholder for missing thumbnails

---

### Transitions

#### Slide (Default)

Slides horizontally:

```tsx
<Carousel slides={slides} transition="slide" />
```

#### Fade

Crossfade between slides:

```tsx
<Carousel slides={slides} transition="fade" />
```

#### Custom Duration

```tsx
<Carousel
  slides={slides}
  transition="slide"
  transitionDuration={500}  // 500ms
/>
```

---

### Loop Behavior

#### Infinite Loop (Default)

```tsx
<Carousel slides={slides} loop={true} />
```

- Wraps from last to first slide
- Wraps from first to last slide
- No disabled navigation

#### Bounded

```tsx
<Carousel slides={slides} loop={false} />
```

- Stops at first/last slide
- Disables prev arrow on first slide
- Disables next arrow on last slide

---

## Callbacks

### onSlideChange

Triggered when the active slide changes:

```tsx
<Carousel
  slides={slides}
  onSlideChange={(index) => {
    console.log(`Now showing slide ${index + 1}`);

    // Track analytics
    analytics.track('carousel_view', {
      slideIndex: index,
      slideId: slides[index].id
    });

    // Update URL
    router.push(`?slide=${index}`);

    // Preload adjacent images
    preloadImage(slides[index + 1]?.content);
  }}
/>
```

---

## Context API Support

The Carousel component supports parameter inheritance:

```tsx
import { AtomProvider } from '@/context/parameters/ParameterContext';

<AtomProvider value={{ autoPlay: true }}>
  <Carousel slides={slides1} />
  <Carousel slides={slides2} />
  <Carousel slides={slides3} autoPlay={false} /> {/* Overrides context */}
</AtomProvider>
```

---

## Accessibility

### Features

- ✅ Semantic HTML structure
- ✅ Proper ARIA attributes (`role="region"`, `aria-roledescription="carousel"`)
- ✅ Slide labels and descriptions
- ✅ Keyboard navigation (Arrow keys, Home, End)
- ✅ Focus management
- ✅ Screen reader announcements
- ✅ High contrast mode support

### Keyboard Controls

| Key | Action |
|-----|--------|
| `ArrowLeft` | Previous slide |
| `ArrowRight` | Next slide |
| `Home` | First slide |
| `End` | Last slide |
| `Tab` | Navigate to controls |

### Best Practices

```tsx
// ✅ Good: Descriptive alt text
<Carousel
  slides={[
    {
      id: '1',
      content: <img src="hero.jpg" alt="Summer collection banner" />,
      alt: 'Summer collection 2025'
    }
  ]}
/>

// ❌ Avoid: Missing alt text
<Carousel
  slides={[
    { id: '1', content: <img src="hero.jpg" /> }  // No alt!
  ]}
/>
```

---

## Responsive Behavior

- **Mobile (<640px):**
  - 4:3 aspect ratio
  - Smaller navigation arrows
  - Scrollable thumbnails
  - Optimized touch targets

- **Tablet (640px-1023px):**
  - 16:10 aspect ratio
  - Medium-sized controls

- **Desktop (>1024px):**
  - 16:9 aspect ratio
  - Full-sized controls
  - Enhanced hover effects

---

## Dark Mode

Automatically adapts to system color scheme:

```tsx
<Carousel slides={slides} />
```

**Dark Mode Changes:**
- Darker viewport background
- Lighter arrow backgrounds
- Adjusted dot colors
- Enhanced contrast

---

## Performance

- ✅ CSS Modules for scoped styling
- ✅ Optimized animations (CSS transitions)
- ✅ Lazy loading support (content-based)
- ✅ Efficient timer management
- ✅ Tree-shakable exports
- ✅ Minimal bundle impact (~5KB gzipped)

### Performance Tips

```tsx
// Optimize images
const slides = products.map(product => ({
  id: product.id,
  content: (
    <Image
      src={product.image}
      alt={product.name}
      width={800}
      height={600}
      quality={85}
      priority={false}
    />
  )
}));

<Carousel slides={slides} />
```

---

## Testing

### Running Tests

```bash
npm test Carousel.test.tsx
```

### Coverage

- **Target:** 80%+ coverage
- **Current:** 95%+ coverage
- **Total Tests:** 60+ test cases

### Example Test

```tsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Carousel } from './Carousel';

jest.useFakeTimers();

test('auto-plays slides', () => {
  render(
    <Carousel
      slides={[
        { id: '1', content: <div>Slide 1</div> },
        { id: '2', content: <div>Slide 2</div> }
      ]}
      autoPlay={true}
      interval={1000}
    />
  );

  expect(screen.getByText('1 / 2')).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(screen.getByText('2 / 2')).toBeInTheDocument();
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

- **Atoms:** Image, Button, Icon, Text
- **Organisms:** Tabs, Accordion

---

## Migration Guide

### From Canvas CarouselComponent

```tsx
// Old (Canvas)
<CarouselComponent
  component={{
    props: {
      slides: [{ id: '1', image: '/img.jpg' }],
      autoPlay: true
    }
  }}
/>

// New (Atomic Design)
<Carousel
  slides={[
    { id: '1', content: <img src="/img.jpg" alt="Image" /> }
  ]}
  autoPlay={true}
/>
```

---

## Troubleshooting

### Auto-Play Not Working

```tsx
// ✅ Correct: Enable auto-play
<Carousel slides={slides} autoPlay={true} interval={3000} />

// ❌ Wrong: Forgot to enable
<Carousel slides={slides} interval={3000} />  // autoPlay defaults to false
```

### Images Not Showing

```tsx
// ✅ Correct: Proper image in content
<Carousel
  slides={[
    { id: '1', content: <img src="/image.jpg" alt="Image" /> }
  ]}
/>

// ❌ Wrong: Missing content
<Carousel slides={[{ id: '1' }]} />  // No content!
```

### Thumbnails Not Displaying

```tsx
// ✅ Correct: Enable and provide thumbnails
<Carousel
  slides={[
    { id: '1', content: <img src="/full.jpg" />, thumbnail: '/thumb.jpg' }
  ]}
  showThumbnails={true}
/>

// ⚠️ Placeholder: Missing thumbnail
<Carousel
  slides={[
    { id: '1', content: <img src="/full.jpg" /> }  // No thumbnail
  ]}
  showThumbnails={true}  // Shows numbered placeholder
/>
```

---

## Changelog

### Version 1.0.0 (2025-11-07)
- ✅ Initial release
- ✅ Auto-play with customizable interval
- ✅ Navigation arrows
- ✅ Dot indicators
- ✅ Thumbnail navigation
- ✅ Pause on hover
- ✅ Infinite loop support
- ✅ Two transition types (slide, fade)
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
