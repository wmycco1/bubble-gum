/**
 * ProductSlider Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for ProductSlider organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * ProductSlider Props
 *
 * @description Product carousel with navigation controls
 * @composition Card + Slider/Carousel molecules
 *
 * @example
 * ```tsx
 * <ProductSlider
 *   // Add your props here
 * />
 * ```
 */
export interface ProductSliderProps extends OrganismParameters {
  /**
   * Component data (customize based on needs)
   */
  data?: Record<string, any>;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'product-slider'
   */
  'data-testid'?: string;
}

/**
 * ProductSlider component that supports Context API parameter inheritance
 */
export type ProductSliderComponent = React.FC<ProductSliderProps>;
