/**
 * Heading Types
 * God-Tier Development Protocol 2025
 */

import type { ReactNode } from 'react';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingAlign = 'left' | 'center' | 'right';

export interface HeadingProps {
  level?: HeadingLevel;
  align?: HeadingAlign;
  children: ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}
