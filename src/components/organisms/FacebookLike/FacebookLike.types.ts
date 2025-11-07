/**
 * FacebookLike Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for FacebookLike organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * FacebookLike Props
 *
 * @description Facebook Like button embed
 * @composition Facebook SDK integration
 *
 * @example
 * ```tsx
 * <FacebookLike
 *   // Add your props here
 * />
 * ```
 */
export interface FacebookLikeProps extends OrganismParameters {
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
   * @default 'facebook-like'
   */
  'data-testid'?: string;
}

/**
 * FacebookLike component that supports Context API parameter inheritance
 */
export type FacebookLikeComponent = React.FC<FacebookLikeProps>;
