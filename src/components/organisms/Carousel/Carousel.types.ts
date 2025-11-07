/**
 * Carousel Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Carousel organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * Carousel transition type
 */
export type CarouselTransition = 'slide' | 'fade';

/**
 * Individual carousel slide configuration
 */
export interface CarouselSlide {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Slide content (any React node)
   */
  content: React.ReactNode;

  /**
   * Optional thumbnail image URL
   */
  thumbnail?: string;

  /**
   * Optional alt text for accessibility
   */
  alt?: string;
}

/**
 * Carousel Props
 *
 * @example Basic carousel
 * ```tsx
 * <Carousel
 *   slides={[
 *     { id: '1', content: <img src="image1.jpg" alt="Image 1" /> },
 *     { id: '2', content: <img src="image2.jpg" alt="Image 2" /> }
 *   ]}
 * />
 * ```
 *
 * @example Full-featured carousel
 * ```tsx
 * <Carousel
 *   slides={imageSlides}
 *   autoPlay={true}
 *   interval={5000}
 *   showArrows={true}
 *   showDots={true}
 *   showThumbnails={true}
 *   pauseOnHover={true}
 *   loop={true}
 *   transition="slide"
 *   transitionDuration={300}
 *   onSlideChange={(index) => console.log('Slide:', index)}
 * />
 * ```
 */
export interface CarouselProps extends OrganismParameters {
  /**
   * Array of carousel slides (required)
   */
  slides: CarouselSlide[];

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
   * Show thumbnail navigation
   * @default false
   */
  showThumbnails?: boolean;

  /**
   * Pause auto-play on hover
   * @default true
   */
  pauseOnHover?: boolean;

  /**
   * Enable infinite loop
   * @default true
   */
  loop?: boolean;

  /**
   * Transition animation type
   * @default 'slide'
   */
  transition?: CarouselTransition;

  /**
   * Transition duration in milliseconds
   * @default 300
   */
  transitionDuration?: number;

  /**
   * Callback when slide changes
   * @param index - Index of the new slide
   */
  onSlideChange?: (index: number) => void;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'carousel'
   */
  'data-testid'?: string;
}

/**
 * Carousel component that supports Context API parameter inheritance
 */
export type CarouselComponent = React.FC<CarouselProps>;
