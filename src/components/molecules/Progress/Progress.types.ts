/**
 * Progress Types
 * God-Tier Development Protocol 2025
 *
 * Type-safe props for Progress Molecule component
 */

import type { ReactNode } from 'react';
import type { TextSize, TextColor } from '@/components/atoms/Text/Text.types';

/**
 * Progress variant colors
 */
export type ProgressVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

/**
 * Progress size variants
 */
export type ProgressSize = 'sm' | 'md' | 'lg';

/**
 * Progress component props
 *
 * Molecule component that composes Text and Divider atoms (styled as progress bar)
 * to create progress indicators with percentage, labels, and multiple visual variants.
 *
 * @example Basic usage
 * ```tsx
 * <Progress value={75} label="Upload Progress" />
 * ```
 *
 * @example With variant colors
 * ```tsx
 * <Progress value={90} label="Success" variant="success" />
 * <Progress value={30} label="Warning" variant="warning" />
 * <Progress value={10} label="Error" variant="error" />
 * ```
 *
 * @example Without label
 * ```tsx
 * <Progress value={50} />
 * ```
 *
 * @example Custom styling
 * ```tsx
 * <Progress
 *   value={60}
 *   label="Processing"
 *   size="lg"
 *   animated
 *   showPercentage
 * />
 * ```
 */
export interface ProgressProps {
  /**
   * Progress value (0-100)
   * @required
   * Values will be clamped to 0-100 range
   */
  value: number;

  /**
   * Optional label text
   */
  label?: string;

  /**
   * Show percentage value
   * @default true
   */
  showPercentage?: boolean;

  /**
   * Color variant
   * @default 'default'
   */
  variant?: ProgressVariant;

  /**
   * Size variant
   * @default 'md'
   */
  size?: ProgressSize;

  /**
   * Enable animation
   * @default true
   */
  animated?: boolean;

  /**
   * Show striped pattern
   * @default false
   */
  striped?: boolean;

  /**
   * Label text size
   * @default 'sm'
   */
  labelSize?: TextSize;

  /**
   * Label text color
   * @default 'default'
   */
  labelColor?: TextColor;

  /**
   * Percentage text size
   * @default 'sm'
   */
  percentageSize?: TextSize;

  /**
   * Percentage text color
   * @default 'muted'
   */
  percentageColor?: TextColor;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * ID attribute
   */
  id?: string;

  /**
   * Accessibility label
   */
  'aria-label'?: string;

  /**
   * Accessibility description
   */
  'aria-describedby'?: string;

  /**
   * Test ID for testing
   * @default 'progress'
   */
  'data-testid'?: string;

  /**
   * Custom children (replaces label if provided)
   */
  children?: ReactNode;

  /**
   * Show progress bar in indeterminate state
   * (animated loading without specific value)
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Custom progress bar color (overrides variant)
   */
  color?: string;

  /**
   * Custom background color
   */
  backgroundColor?: string;
}

/**
 * Progress component type
 */
export type ProgressComponent = React.FC<ProgressProps>;
