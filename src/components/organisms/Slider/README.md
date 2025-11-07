# Slider Component (Organism)

God-Tier Development Protocol 2025 - Professional Documentation

## Overview

A content slider/carousel organism component with navigation arrows, dot indicators, auto-play, and multiple display modes. Composed of Button and Icon atoms.

**Component Type:** Organism
**Composition:** Button (Atom) + Icon (Atom)
**Context API:** ✅ Full Support
**Accessibility:** ✅ WCAG 2.1 AA
**Test Coverage:** ✅ 80%+

## Features

- ✅ Multiple slides per view (1, 2, 3, 4+)
- ✅ Navigation arrows with keyboard support
- ✅ Dot/pagination indicators
- ✅ Auto-play with pause on hover
- ✅ Loop mode
- ✅ Center mode with partial visible slides
- ✅ Configurable space between slides
- ✅ Responsive breakpoints
- ✅ Full accessibility (ARIA, keyboard navigation)
- ✅ Dark mode support
- ✅ Reduced motion support
- ✅ Print styles

## Installation

```bash
npm install react
# Component uses internal atoms (Button, Icon)
```

## Basic Usage

```tsx
import { Slider } from '@/components/organisms/Slider';

function MyComponent() {
  const slides = [
    { id: '1', content: <Card title="Slide 1" /> },
    { id: '2', content: <Card title="Slide 2" /> },
    { id: '3', content: <Card title="Slide 3" /> }
  ];

  return <Slider items={slides} />;
}
```

## Advanced Usage

### Multiple Slides Per View

```tsx
<Slider
  items={slides}
  slidesPerView={3}
  spaceBetween={20}
/>
```

### Auto-Play with Loop

```tsx
<Slider
  items={slides}
  autoPlay={true}
  interval={5000}
  loop={true}
/>
```

### Center Mode

```tsx
<Slider
  items={slides}
  centerMode={true}
  slidesPerView={3}
/>
```

### With Navigation Controls

```tsx
<Slider
  items={slides}
  showArrows={true}
  showDots={true}
/>
```

### Slide Change Handler

```tsx
<Slider
  items={slides}
  onSlideChange={(index) => {
    console.log('Current slide:', index);
  }}
/>
```

### Responsive Breakpoints

```tsx
<Slider
  items={slides}
  slidesPerView={1}
  breakpoints={{
    sm: 1,  // 640px+
    md: 2,  // 768px+
    lg: 3   // 1024px+
  }}
/>
```

### Hide Controls

```tsx
<Slider
  items={slides}
  showArrows={false}
  showDots={false}
/>
```

## Context API

Slider supports Context API for parameter inheritance:

```tsx
import { AtomProvider } from '@/context/parameters/ParameterContext';

<AtomProvider value={{ slidesPerView: 2, spaceBetween: 20 }}>
  <Slider items={slides} />
</AtomProvider>
```

## Props API

### SliderProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `SliderItem[]` | **required** | Array of slider items |
| `slidesPerView` | `number` | `1` | Number of slides visible at once |
| `spaceBetween` | `number` | `16` | Gap between slides (px) |
| `showArrows` | `boolean` | `true` | Show navigation arrows |
| `showDots` | `boolean` | `true` | Show dot indicators |
| `autoPlay` | `boolean` | `false` | Enable auto-play |
| `interval` | `number` | `3000` | Auto-play interval (ms) |
| `loop` | `boolean` | `false` | Enable loop mode |
| `centerMode` | `boolean` | `false` | Center active slide |
| `breakpoints` | `SliderBreakpoints` | - | Responsive breakpoints |
| `onSlideChange` | `(index: number) => void` | - | Slide change callback |
| `className` | `string` | `''` | Custom CSS class |
| `data-testid` | `string` | `'slider'` | Test ID |

### SliderItem

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `content` | `ReactNode` | Slide content |

### SliderBreakpoints

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `sm` | `number` | `1` | Slides per view at 640px+ |
| `md` | `number` | `2` | Slides per view at 768px+ |
| `lg` | `number` | `3` | Slides per view at 1024px+ |

## Accessibility

### ARIA Attributes

- `role="region"` on slider container
- `aria-label="Content slider"` on slider
- `aria-roledescription="carousel"` on slider
- `role="group"` on each slide
- `aria-roledescription="slide"` on each slide
- `aria-label="Slide X of Y"` on each slide
- `role="tablist"` on dot indicators
- `role="tab"` on each dot
- `aria-selected` on active dot
- Screen reader announcements for current slide

### Keyboard Navigation

- `ArrowLeft` - Previous slide
- `ArrowRight` - Next slide
- `Tab` - Navigate to arrows/dots
- `Enter/Space` - Activate focused control

### Focus Management

- Visible focus indicators on all interactive elements
- Proper tab order through navigation controls
- Focus is trapped within slider during keyboard navigation

## Behavior

### Navigation Logic

- **Without Loop:** Navigation disabled at boundaries
- **With Loop:** Infinite navigation in both directions
- **Keyboard:** Arrow keys navigate slides
- **Dots:** Click to jump to specific slide

### Auto-Play Logic

- Starts automatically when `autoPlay={true}`
- Pauses on mouse hover
- Resumes on mouse leave
- Respects `interval` prop for timing
- Stops at last slide without loop
- Continuous with loop enabled

### Responsive Behavior

- Adapts to container width
- Supports custom breakpoints
- Touch-friendly on mobile
- Smaller arrows on mobile screens

## Styling

### CSS Variables

```css
.slider {
  --slider-bg: var(--color-surface, #ffffff);
  --slider-arrow-bg: rgba(0, 0, 0, 0.5);
  --slider-arrow-hover: rgba(0, 0, 0, 0.8);
  --slider-dot-bg: rgba(0, 0, 0, 0.2);
  --slider-dot-active: var(--color-primary, #3b82f6);
  --slider-transition: transform 0.5s ease-in-out;
}
```

### Custom Styling

```tsx
<Slider
  items={slides}
  className="my-slider"
  style={{ maxWidth: '1200px', margin: '0 auto' }}
/>
```

```css
.my-slider {
  border-radius: 8px;
  overflow: hidden;
}
```

## Dark Mode

Automatically adapts to system preference:

```css
@media (prefers-color-scheme: dark) {
  .slider {
    --slider-bg: #1f2937;
    --slider-arrow-bg: rgba(255, 255, 255, 0.3);
    --slider-dot-active: #60a5fa;
  }
}
```

## Performance

- ✅ Lazy rendering of off-screen slides
- ✅ CSS transforms for smooth animations
- ✅ Automatic cleanup of timers
- ✅ Optimized re-renders with React hooks
- ✅ Will-change hint for GPU acceleration

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## TypeScript

Fully typed with TypeScript:

```typescript
import type { SliderProps, SliderItem } from '@/components/organisms/Slider';

const slides: SliderItem[] = [
  { id: '1', content: <div>Slide 1</div> }
];

const props: SliderProps = {
  items: slides,
  slidesPerView: 2,
  autoPlay: true
};
```

## Testing

### Test Coverage

- ✅ Basic rendering (5 tests)
- ✅ Slides per view (4 tests)
- ✅ Navigation arrows (9 tests)
- ✅ Dot indicators (7 tests)
- ✅ Loop mode (4 tests)
- ✅ Auto-play (8 tests)
- ✅ Center mode (2 tests)
- ✅ Keyboard navigation (3 tests)
- ✅ Space between (3 tests)
- ✅ Accessibility (8 tests)
- ✅ Edge cases (4 tests)

**Total:** 57 tests, 80%+ coverage

### Running Tests

```bash
npm test Slider.test.tsx
npm test -- --coverage Slider.test.tsx
```

## Examples

### Product Carousel

```tsx
<Slider
  items={products.map(p => ({
    id: p.id,
    content: <ProductCard product={p} />
  }))}
  slidesPerView={4}
  spaceBetween={20}
  breakpoints={{ sm: 1, md: 2, lg: 4 }}
/>
```

### Testimonials Slider

```tsx
<Slider
  items={testimonials.map(t => ({
    id: t.id,
    content: <TestimonialCard testimonial={t} />
  }))}
  slidesPerView={1}
  autoPlay={true}
  interval={6000}
  loop={true}
  centerMode={true}
/>
```

### Image Gallery

```tsx
<Slider
  items={images.map(img => ({
    id: img.id,
    content: <Image src={img.url} alt={img.alt} />
  }))}
  slidesPerView={1}
  showArrows={true}
  showDots={true}
  onSlideChange={(index) => setCurrentImage(index)}
/>
```

## Troubleshooting

### Auto-play not working

Ensure `autoPlay={true}` and `items.length > 1`:

```tsx
<Slider items={slides} autoPlay={true} interval={3000} />
```

### Slides not visible

Check container width and `slidesPerView`:

```tsx
<div style={{ width: '100%' }}>
  <Slider items={slides} />
</div>
```

### Navigation disabled

Check `loop` prop and current slide index:

```tsx
<Slider items={slides} loop={true} />
```

## Related Components

- [Card](../Card/README.md) - Often used as slide content
- [Button](../../atoms/Button/README.md) - Used for navigation
- [Icon](../../atoms/Icon/README.md) - Used for arrow icons

## License

MIT © Bubble Gum Project

## Changelog

### Version 1.0.0 (2025-01-07)

- ✅ Initial implementation
- ✅ Navigation arrows
- ✅ Dot indicators
- ✅ Auto-play support
- ✅ Loop mode
- ✅ Center mode
- ✅ Keyboard navigation
- ✅ Full accessibility
- ✅ Comprehensive tests (57 tests)
- ✅ Professional documentation
