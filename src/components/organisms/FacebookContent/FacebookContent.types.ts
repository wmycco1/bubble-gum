/**
 * FacebookContent Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for FacebookContent organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * FacebookContent Props
 *
 * @description Facebook post embed
 * @composition iframe embed
 *
 * @example
 * ```tsx
 * <FacebookContent
 *   // Add your props here
 * />
 * ```
 */
export interface FacebookContentProps extends OrganismParameters {
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
   * @default 'facebook-content'
   */
  'data-testid'?: string;
}

/**
 * FacebookContent component that supports Context API parameter inheritance
 */
export type FacebookContentComponent = React.FC<FacebookContentProps>;
