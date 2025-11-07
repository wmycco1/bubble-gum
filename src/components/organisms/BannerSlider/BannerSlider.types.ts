/**
 * BannerSlider Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for BannerSlider organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * Individual banner slide configuration
 */
export interface BannerSlide {
  /**
   * Unique slide identifier
   */
  id: string;

  /**
   * Slide title (optional)
   */
  title?: string;

  /**
   * Slide message (required)
   */
  message: string;

  /**
   * CTA button text
   */
  ctaText?: string;

  /**
   * CTA button link
   */
  ctaHref?: string;

  /**
   * Background image URL
   */
  backgroundImage?: string;

  /**
   * Slide variant
   */
  variant?: 'info' | 'success' | 'warning' | 'promo';
}

/**
 * BannerSlider Props
 *
 * @example Basic slider
 * ```tsx
 * <BannerSlider
 *   slides={[
 *     { id: '1', message: 'Slide 1', ctaText: 'Learn More', ctaHref: '/1' },
 *     { id: '2', message: 'Slide 2', ctaText: 'Shop Now', ctaHref: '/2' }
 *   ]}
 * />
 * ```
 *
 * @example Auto-play carousel
 * ```tsx
 * <BannerSlider
 *   slides={promoSlides}
 *   autoPlay={true}
 *   interval={5000}
 *   showArrows={true}
 *   showDots={true}
 *   pauseOnHover={true}
 *   loop={true}
 * />
 * ```
 *
 * @example Manual navigation only
 * ```tsx
 * <BannerSlider
 *   slides={slides}
 *   autoPlay={false}
 *   showArrows={true}
 *   showDots={true}
 * />
 * ```
 */
export interface BannerSliderProps extends OrganismParameters {
  /**
   * Array of banner slides (required)
   */
  slides: BannerSlide[];

  /**
   * Auto-advance slides
   * @default false
   */
  autoPlay?: boolean;

  /**
   * Auto-advance interval in milliseconds
   * @default 5000
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
   * Transition duration in milliseconds
   * @default 300
   */
  transitionDuration?: number;

  /**
   * Callback when slide changes
   */
  onSlideChange?: (index: number) => void;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'banner-slider'
   */
  'data-testid'?: string;
}

/**
 * BannerSlider component that supports Context API parameter inheritance
 */
export type BannerSliderComponent = React.FC<BannerSliderProps>;
