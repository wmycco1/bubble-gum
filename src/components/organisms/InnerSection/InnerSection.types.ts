/**
 * InnerSection Component Types
 * God-Tier Development Protocol 2025
 */

import type { CSSProperties, ReactNode } from 'react';
import type { AtomParameters } from '@/context/parameters/ParameterContext';

/**
 * InnerSection Component Props
 *
 * A nested layout container for inner sections within main sections.
 * Provides max-width control, backgrounds, padding/margin, and advanced styling.
 *
 * @interface InnerSectionProps
 * @extends {AtomParameters}
 */
export interface InnerSectionProps extends AtomParameters {
  /**
   * Child elements to render inside section
   */
  children?: ReactNode;

  /**
   * Maximum width of the section
   * @default '1200px'
   */
  maxWidth?: string;

  /**
   * Padding inside the section
   * @default '2rem'
   */
  padding?: string;

  /**
   * Background color
   * @default 'transparent'
   */
  backgroundColor?: string;

  /**
   * Background image URL
   */
  backgroundImage?: string;

  /**
   * Background size
   * @default 'cover'
   */
  backgroundSize?: 'cover' | 'contain' | 'auto';

  /**
   * Background position
   * @default 'center'
   */
  backgroundPosition?: string;

  /**
   * Background repeat
   * @default 'no-repeat'
   */
  backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y';

  /**
   * Minimum height
   */
  minHeight?: string;

  /**
   * HTML id attribute
   */
  id?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Test ID for testing
   * @default 'inner-section'
   */
  'data-testid'?: string;

  /**
   * ARIA label
   */
  'aria-label'?: string;

  /**
   * ARIA labelledby
   */
  'aria-labelledby'?: string;
}
