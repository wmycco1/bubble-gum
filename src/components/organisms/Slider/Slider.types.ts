/**
 * Slider Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Slider organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * Single slider item
 */
export interface SliderItem {
  /**
   * Unique identifier for the item
   */
  id: string;

  /**
   * Content to display in the slide
   */
  content: React.ReactNode;
}

/**
 * Breakpoint configuration for responsive slides per view
 */
export interface SliderBreakpoints {
  /**
   * Slides per view on small screens (640px+)
   * @default 1
   */
  sm?: number;

  /**
   * Slides per view on medium screens (768px+)
   * @default 2
   */
  md?: number;

  /**
   * Slides per view on large screens (1024px+)
   * @default 3
   */
  lg?: number;
}

/**
 * Slider Props
 *
 * @example Basic slider
 * ```tsx
 * <Slider
 *   items={[
 *     { id: '1', content: <Card title="Slide 1" /> },
 *     { id: '2', content: <Card title="Slide 2" /> },
 *     { id: '3', content: <Card title="Slide 3" /> }
 *   ]}
 * />
 * ```
 *
 * @example Advanced slider with auto-play
 * ```tsx
 * <Slider
 *   items={slides}
 *   slidesPerView={3}
 *   spaceBetween={20}
 *   showArrows={true}
 *   showDots={true}
 *   autoPlay={true}
 *   interval={5000}
 *   loop={true}
 *   centerMode={true}
 *   breakpoints={{ sm: 1, md: 2, lg: 3 }}
 * />
 * ```
 *
 * @example With slide change handler
 * ```tsx
 * <Slider
 *   items={slides}
 *   onSlideChange={(index) => console.log('Current slide:', index)}
 * />
 * ```
 */
export interface SliderProps extends OrganismParameters {
  /**
   * Array of slider items (required)
   */
  items: SliderItem[];

  /**
   * Number of slides to show at once
   * @default 1
   */
  slidesPerView?: number;

  /**
   * Gap between slides in pixels
   * @default 16
   */
  spaceBetween?: number;

  /**
   * Show navigation arrows
   * @default true
   */
  showArrows?: boolean;

  /**
   * Show dot indicators
   * @default true
   */
  showDots?: boolean;

  /**
   * Enable auto-play
   * @default false
   */
  autoPlay?: boolean;

  /**
   * Auto-play interval in milliseconds
   * @default 3000
   */
  interval?: number;

  /**
   * Enable loop mode
   * @default false
   */
  loop?: boolean;

  /**
   * Enable center mode (partial visible slides on edges)
   * @default false
   */
  centerMode?: boolean;

  /**
   * Responsive breakpoints for slides per view
   */
  breakpoints?: SliderBreakpoints;

  /**
   * Slide change callback
   */
  onSlideChange?: (index: number) => void;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'slider'
   */
  'data-testid'?: string;
}

/**
 * Slider component that supports Context API parameter inheritance
 */
export type SliderComponent = React.FC<SliderProps>;
