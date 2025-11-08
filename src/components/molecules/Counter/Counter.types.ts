/**
 * Counter Component Types
 * God-Tier Development Protocol 2025
 */

import type { CSSProperties } from 'react';
import type { AtomParameters } from '@/context/parameters/ParameterContext';

/**
 * Counter value format types
 */
export type CounterFormat = 'number' | 'currency' | 'percentage';

/**
 * Counter size variants
 */
export type CounterSize = 'sm' | 'md' | 'lg';

/**
 * Counter Component Props
 *
 * A numeric counter with increment/decrement controls.
 * Supports min/max boundaries, step values, and number formatting.
 *
 * @interface CounterProps
 * @extends {AtomParameters}
 */
export interface CounterProps extends AtomParameters {
  /**
   * Label text displayed above counter
   * @default undefined
   */
  label?: string;

  /**
   * Current counter value
   * @default 0
   */
  value?: number;

  /**
   * Minimum allowed value
   * @default 0
   */
  min?: number;

  /**
   * Maximum allowed value
   * @default 100
   */
  max?: number;

  /**
   * Step value for increment/decrement
   * @default 1
   */
  step?: number;

  /**
   * Number format type
   * @default 'number'
   */
  format?: CounterFormat;

  /**
   * Prefix text (displayed before value)
   * @default ''
   */
  prefix?: string;

  /**
   * Suffix text (displayed after value)
   * @default ''
   */
  suffix?: string;

  /**
   * Size variant
   * @default 'md'
   */
  size?: CounterSize;

  /**
   * Callback when value changes
   */
  onChange?: (value: number) => void;

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
   * @default 'counter'
   */
  'data-testid'?: string;

  /**
   * ARIA label
   */
  'aria-label'?: string;

  /**
   * ARIA described by
   */
  'aria-describedby'?: string;
}
