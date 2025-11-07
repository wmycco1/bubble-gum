/**
 * Text Component (Atom)
 * God-Tier Development Protocol 2025
 *
 * A versatile text component with size, weight, alignment, and color variants.
 *
 * @example
 * ```tsx
 * <Text size="lg" weight="bold">Important text</Text>
 * ```
 */

'use client';

import React from 'react';
import type { TextProps } from './Text.types';

export const Text: React.FC<TextProps> = ({
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
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };

  // Weight classes
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  // Alignment classes
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  // Color classes
  const colorClasses = {
    default: 'text-gray-900',
    muted: 'text-gray-500',
    primary: 'text-blue-600',
    secondary: 'text-gray-700',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  };

  // Build class names
  const classes = [
    // Size, weight, alignment
    sizeClasses[size],
    weightClasses[weight],
    alignClasses[align],
    colorClasses[color],

    // Styles
    italic && 'italic',
    underline && 'underline',
    lineThrough && 'line-through',

    // Truncation
    truncate && 'truncate',
    maxLines && `line-clamp-${maxLines}`,

    // Custom classes
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} data-testid={testId} {...props}>
      {children}
    </Component>
  );
};

Text.displayName = 'Text';
