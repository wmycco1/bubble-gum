/**
 * Heading Component (Atom)
 * God-Tier Development Protocol 2025
 *
 * Semantic heading component with proper hierarchy and styling.
 * Uses AtomParameters for styling and behavior through Context API.
 *
 * @example Basic
 * ```tsx
 * <Heading level="h1">Main Title</Heading>
 * <Heading level="h2" align="center">Subtitle</Heading>
 * ```
 *
 * @example With Context API
 * ```tsx
 * <AtomProvider value={{ align: 'center', color: 'primary' }}>
 *   <Heading level="h1">Centered Primary Heading</Heading>
 * </AtomProvider>
 * ```
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import type { HeadingProps } from './Heading.types';
import styles from './Heading.module.css';

export const Heading: React.FC<HeadingProps> = (props) => {
  // Get inherited parameters from Atom context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as HeadingProps;

  // Destructure with defaults
  const {
    level = 'h2',
    align = 'left',
    color = 'default',
    children,
    className = '',
    'data-testid': testId = 'heading',
    'aria-label': ariaLabel,
    id,
    ...rest
  } = params;

  // Auto-fix: Convert numeric level to h-tag (handles old components from localStorage)
  // '1' -> 'h1', '2' -> 'h2', etc.
  let normalizedLevel = level;
  if (typeof level === 'string' && /^[1-6]$/.test(level)) {
    normalizedLevel = `h${level}` as any;
  } else if (typeof level === 'number' && level >= 1 && level <= 6) {
    normalizedLevel = `h${level}` as any;
  }

  // Validate that Component is a valid heading tag
  const validLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const Component = validLevels.includes(normalizedLevel as string) ? normalizedLevel : 'h2';

  // Compute CSS classes (using CSS modules)
  const baseClasses = styles.heading;
  const levelClasses = styles[`heading--${normalizedLevel}`];
  const alignClasses = styles[`heading--${align}`];
  const colorClasses = styles[`heading--${color}`];

  const classes = [
    baseClasses,
    levelClasses,
    alignClasses,
    colorClasses,
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
Heading.displayName = 'Heading';

// Default export for convenience
export default Heading;
