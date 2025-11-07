/**
 * Icon Component Types
 * God-Tier Development Protocol 2025
 */

import type { AtomParameters } from '@/types/parameters';

/**
 * Icon sizes matching the size scale
 */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Icon color variants
 */
export type IconColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'muted';

/**
 * Icon Props
 *
 * @example Basic usage
 * ```tsx
 * <Icon name="heart" size="md" />
 * ```
 *
 * @example With Context API
 * ```tsx
 * <AtomProvider value={{ size: 'lg', color: 'primary' }}>
 *   <Icon name="star" />
 * </AtomProvider>
 * ```
 */
export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'size' | 'color'> {
  /**
   * Icon name/identifier
   * Can be icon library name (lucide, heroicons, etc.) or custom
   */
  name: string;

  /**
   * Icon size
   * @default 'md'
   */
  size?: IconSize;

  /**
   * Icon color variant
   * @default 'default'
   */
  color?: IconColor;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Accessible label for screen readers
   * Required if icon is not decorative
   */
  'aria-label'?: string;

  /**
   * Mark icon as decorative (hidden from screen readers)
   * @default false
   */
  'aria-hidden'?: boolean;

  /**
   * Test ID for testing
   * @default 'icon'
   */
  'data-testid'?: string;
}

/**
 * Icon component that supports Context API parameter inheritance
 */
export type IconComponent = React.FC<IconProps>;
