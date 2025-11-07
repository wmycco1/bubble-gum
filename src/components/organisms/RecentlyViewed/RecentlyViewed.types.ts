/**
 * RecentlyViewed Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for RecentlyViewed organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * RecentlyViewed Props
 *
 * @description Recently viewed products list
 * @composition Card organisms in horizontal layout
 *
 * @example
 * ```tsx
 * <RecentlyViewed
 *   // Add your props here
 * />
 * ```
 */
export interface RecentlyViewedProps extends OrganismParameters {
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
   * @default 'recently-viewed'
   */
  'data-testid'?: string;
}

/**
 * RecentlyViewed component that supports Context API parameter inheritance
 */
export type RecentlyViewedComponent = React.FC<RecentlyViewedProps>;
