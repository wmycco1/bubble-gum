/**
 * CMSBlock Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for CMSBlock organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * CMSBlock Props
 *
 * @description CMS content block renderer
 * @composition Heading + Text + Image atoms
 *
 * @example
 * ```tsx
 * <CMSBlock
 *   // Add your props here
 * />
 * ```
 */
export interface CMSBlockProps extends OrganismParameters {
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
   * @default 'c-m-s-block'
   */
  'data-testid'?: string;
}

/**
 * CMSBlock component that supports Context API parameter inheritance
 */
export type CMSBlockComponent = React.FC<CMSBlockProps>;
