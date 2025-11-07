/**
 * RecentlyCompared Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for RecentlyCompared organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * RecentlyCompared Props
 *
 * @description Recently compared products list
 * @composition Card organisms in grid
 *
 * @example
 * ```tsx
 * <RecentlyCompared
 *   // Add your props here
 * />
 * ```
 */
export interface RecentlyComparedProps extends OrganismParameters {
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
   * @default 'recently-compared'
   */
  'data-testid'?: string;
}

/**
 * RecentlyCompared component that supports Context API parameter inheritance
 */
export type RecentlyComparedComponent = React.FC<RecentlyComparedProps>;
