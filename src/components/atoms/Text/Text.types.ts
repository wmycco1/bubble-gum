/**
 * Text Types
 * God-Tier Development Protocol 2025
 *
 * Type-safe props for Text component
 */

import type { ReactNode } from 'react';

/**
 * Text size variants
 */
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

/**
 * Text weight variants
 */
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

/**
 * Text alignment
 */
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

/**
 * Text color variants
 */
export type TextColor =
  | 'default'
  | 'muted'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error';

/**
 * Text component props
 */
export interface TextProps {
  /** Text content */
  children: ReactNode;

  /** HTML element to render as */
  as?: 'p' | 'span' | 'div' | 'label' | 'strong' | 'em';

  /** Size variant */
  size?: TextSize;

  /** Font weight */
  weight?: TextWeight;

  /** Text alignment */
  align?: TextAlign;

  /** Color variant */
  color?: TextColor;

  /** Italic style */
  italic?: boolean;

  /** Underline style */
  underline?: boolean;

  /** Line through (strikethrough) */
  lineThrough?: boolean;

  /** Truncate with ellipsis */
  truncate?: boolean;

  /** Maximum lines before truncating */
  maxLines?: number;

  /** Custom class name */
  className?: string;

  /** ID attribute */
  id?: string;

  /** Accessibility label */
  'aria-label'?: string;

  /** Test ID */
  'data-testid'?: string;
}
