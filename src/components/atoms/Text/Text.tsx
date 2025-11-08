/**
 * Text Component (Atom)
 * God-Tier Development Protocol 2025
 *
 * A versatile text component with size, weight, alignment, and color variants.
 * Uses AtomParameters for styling and behavior through Context API.
 *
 * @example Basic
 * ```tsx
 * <Text size="lg" weight="bold">Important text</Text>
 * ```
 *
 * @example With Context API
 * ```tsx
 * <AtomProvider value={{ size: 'lg', color: 'primary' }}>
 *   <Text>Inherits size and color from context</Text>
 * </AtomProvider>
 * ```
 *
 * @example With Truncation
 * ```tsx
 * <Text truncate>This text will be truncated with ellipsis</Text>
 * <Text maxLines={3}>This text will be clamped to 3 lines</Text>
 * ```
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import type { TextProps } from './Text.types';
import styles from './Text.module.css';

export const Text: React.FC<TextProps> = (props) => {
  // Get inherited parameters from Atom context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as TextProps;

  // Destructure with defaults
  const {
    children,
    as: Component = 'p',
    size = 'md',
    weight = 'normal',
    align = 'left',
    color = 'default',
    italic = false,
    underline = false,
    lineThrough = false,
    truncate = false,
    maxLines,
    className = '',
    'data-testid': testId = 'text',
    'aria-label': ariaLabel,
    id,
    ...rest
  } = params;

  // Compute CSS classes (using CSS modules)
  const baseClasses = styles.text;
  const sizeClasses = styles[`text--${size}`];
  const weightClasses = styles[`text--${weight}`];
  const alignClasses = styles[`text--${align}`];
  const colorClasses = styles[`text--${color}`];

  const decorationClasses = [
    italic && styles['text--italic'],
    underline && styles['text--underline'],
    lineThrough && styles['text--line-through'],
  ]
    .filter(Boolean)
    .join(' ');

  const truncationClasses = [
    truncate && styles['text--truncate'],
    maxLines && styles[`text--clamp-${maxLines}`],
  ]
    .filter(Boolean)
    .join(' ');

  const classes = [
    baseClasses,
    sizeClasses,
    weightClasses,
    alignClasses,
    colorClasses,
    decorationClasses,
    truncationClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <Component
      id={id}
      className={classes}
      data-testid={testId}
      aria-label={ariaLabel}
      {...validDOMProps}
    >
      {children}
    </Component>
  );
};

// Display name for React DevTools
Text.displayName = 'Text';

// Default export for convenience
export default Text;
