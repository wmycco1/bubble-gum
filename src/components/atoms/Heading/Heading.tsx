/**
 * Heading Component (Atom)
 * God-Tier Development Protocol 2025
 */

'use client';

import React from 'react';
import type { HeadingProps } from './Heading.types';

export const Heading: React.FC<HeadingProps> = ({
  level = 'h2',
  align = 'left',
  children,
  className = '',
  'data-testid': testId = 'heading',
  ...props
}) => {
  const Component = level;

  const sizeClasses = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-semibold',
    h3: 'text-2xl font-semibold',
    h4: 'text-xl font-semibold',
    h5: 'text-lg font-medium',
    h6: 'text-base font-medium',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const classes = [
    sizeClasses[level],
    alignClasses[align],
    'text-gray-900',
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

Heading.displayName = 'Heading';
