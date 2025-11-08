/**
 * IconList Component Types
 * God-Tier Development Protocol 2025
 */

import type { CSSProperties, ReactNode } from 'react';
import type { AtomParameters } from '@/context/parameters/ParameterContext';

/**
 * IconList item interface
 */
export interface IconListItem {
  /**
   * Unique item ID
   */
  id: string;

  /**
   * Icon to display (emoji, unicode, or SVG string)
   * @default '✓'
   */
  icon?: string | ReactNode;

  /**
   * Item text content
   */
  text: string;

  /**
   * Optional link URL
   */
  href?: string;
}

/**
 * IconList spacing variants
 */
export type IconListSpacing = 'compact' | 'default' | 'relaxed';

/**
 * IconList icon position
 */
export type IconPosition = 'left' | 'right';

/**
 * IconList Component Props
 *
 * A list of items with icons (checkmarks, bullets, custom icons).
 * Commonly used for feature lists, benefits, specifications, etc.
 *
 * @interface IconListProps
 * @extends {AtomParameters}
 */
export interface IconListProps extends AtomParameters {
  /**
   * Array of list items
   * @default []
   */
  items?: IconListItem[];

  /**
   * Default icon for all items (if item doesn't have icon)
   * @default '✓'
   */
  defaultIcon?: string | ReactNode;

  /**
   * Icon position
   * @default 'left'
   */
  iconPosition?: IconPosition;

  /**
   * Spacing between items
   * @default 'default'
   */
  spacing?: IconListSpacing;

  /**
   * Icon color
   */
  iconColor?: string;

  /**
   * Text color
   */
  textColor?: string;

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
   * @default 'icon-list'
   */
  'data-testid'?: string;

  /**
   * ARIA label
   */
  'aria-label'?: string;
}
