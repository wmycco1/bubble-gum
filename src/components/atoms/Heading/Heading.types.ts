/**
 * Heading Types
 * God-Tier Development Protocol 2025
 */

import type { ReactNode } from 'react';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingAlign = 'left' | 'center' | 'right';
export type HeadingColor = 'default' | 'muted' | 'primary';

export interface HeadingProps {
  /** Heading level (semantic HTML) */
  level?: HeadingLevel;

  /** Text alignment */
  align?: HeadingAlign;

  /** Color variant */
  color?: HeadingColor;

  /** Heading content */
  children: ReactNode;

  /** Custom class name */
  className?: string;

  /** ID attribute */
  id?: string;

  /** Accessibility label */
  'aria-label'?: string;

  /** Test ID */
  'data-testid'?: string;
}
