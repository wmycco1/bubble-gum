/**
 * FormBuilder Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for FormBuilder organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * FormBuilder Props
 *
 * @description Dynamic form builder with drag-drop fields
 * @composition Form organism + field components
 *
 * @example
 * ```tsx
 * <FormBuilder
 *   // Add your props here
 * />
 * ```
 */
export interface FormBuilderProps extends OrganismParameters {
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
   * @default 'form-builder'
   */
  'data-testid'?: string;
}

/**
 * FormBuilder component that supports Context API parameter inheritance
 */
export type FormBuilderComponent = React.FC<FormBuilderProps>;
