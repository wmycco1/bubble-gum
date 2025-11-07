/**
 * AddToCart Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for AddToCart organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * AddToCart Props
 *
 * @description Add to cart button with quantity selector
 * @composition Button + Counter molecules
 *
 * @example
 * ```tsx
 * <AddToCart
 *   // Add your props here
 * />
 * ```
 */
export interface AddToCartProps extends OrganismParameters {
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
   * @default 'add-to-cart'
   */
  'data-testid'?: string;
}

/**
 * AddToCart component that supports Context API parameter inheritance
 */
export type AddToCartComponent = React.FC<AddToCartProps>;
