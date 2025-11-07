/**
 * Testimonial Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Testimonial organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * Single testimonial item
 */
export interface TestimonialItem {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Customer quote/review
   */
  quote: string;

  /**
   * Author name
   */
  author: string;

  /**
   * Author role/title
   */
  role?: string;

  /**
   * Company name
   */
  company?: string;

  /**
   * Avatar image URL
   */
  avatar?: string;

  /**
   * Star rating (1-5)
   */
  rating?: number;

  /**
   * Company logo URL
   */
  companyLogo?: string;
}

/**
 * Testimonial layout options
 */
export type TestimonialLayout = 'single' | 'grid' | 'carousel';

/**
 * Testimonial variant options
 */
export type TestimonialVariant = 'default' | 'card' | 'minimal';

/**
 * Testimonial Props
 *
 * @example Basic testimonial
 * ```tsx
 * <Testimonial
 *   testimonials={[
 *     {
 *       id: '1',
 *       quote: 'Amazing product!',
 *       author: 'John Doe',
 *       role: 'CEO',
 *       company: 'Acme Inc',
 *       rating: 5
 *     }
 *   ]}
 * />
 * ```
 *
 * @example Grid layout
 * ```tsx
 * <Testimonial
 *   testimonials={testimonials}
 *   layout="grid"
 *   columns={3}
 *   showRating
 * />
 * ```
 *
 * @example Carousel
 * ```tsx
 * <Testimonial
 *   testimonials={testimonials}
 *   layout="carousel"
 *   variant="card"
 *   showQuoteIcon
 * />
 * ```
 */
export interface TestimonialProps extends OrganismParameters {
  /**
   * Array of testimonials (required)
   */
  testimonials: TestimonialItem[];

  /**
   * Layout variant
   * @default 'grid'
   */
  layout?: TestimonialLayout;

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: TestimonialVariant;

  /**
   * Show star rating
   * @default true
   */
  showRating?: boolean;

  /**
   * Show quote icon
   * @default true
   */
  showQuoteIcon?: boolean;

  /**
   * Number of columns (for grid layout)
   * @default 3
   */
  columns?: number;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'testimonial'
   */
  'data-testid'?: string;
}

/**
 * Testimonial component that supports Context API parameter inheritance
 */
export type TestimonialComponent = React.FC<TestimonialProps>;
