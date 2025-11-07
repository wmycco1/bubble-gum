/**
 * MultistepFormBuilder Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for MultistepFormBuilder organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * MultistepFormBuilder Props
 *
 * @description Multi-step wizard form
 * @composition Multiple Form organisms
 *
 * @example
 * ```tsx
 * <MultistepFormBuilder
 *   // Add your props here
 * />
 * ```
 */
export interface MultistepFormBuilderProps extends OrganismParameters {
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
   * @default 'multistep-form-builder'
   */
  'data-testid'?: string;
}

/**
 * MultistepFormBuilder component that supports Context API parameter inheritance
 */
export type MultistepFormBuilderComponent = React.FC<MultistepFormBuilderProps>;
