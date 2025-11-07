/**
 * CMSPage Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for CMSPage organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * CMSPage Props
 *
 * @description Full CMS page renderer
 * @composition Multiple CMSBlock organisms
 *
 * @example
 * ```tsx
 * <CMSPage
 *   // Add your props here
 * />
 * ```
 */
export interface CMSPageProps extends OrganismParameters {
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
   * @default 'c-m-s-page'
   */
  'data-testid'?: string;
}

/**
 * CMSPage component that supports Context API parameter inheritance
 */
export type CMSPageComponent = React.FC<CMSPageProps>;
