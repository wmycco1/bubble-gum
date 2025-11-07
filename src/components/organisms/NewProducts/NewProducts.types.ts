/**
 * NewProducts Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for NewProducts organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * NewProducts Props
 *
 * @description New products showcase
 * @composition Card organisms with badges
 *
 * @example
 * ```tsx
 * <NewProducts
 *   // Add your props here
 * />
 * ```
 */
export interface NewProductsProps extends OrganismParameters {
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
   * @default 'new-products'
   */
  'data-testid'?: string;
}

/**
 * NewProducts component that supports Context API parameter inheritance
 */
export type NewProductsComponent = React.FC<NewProductsProps>;
