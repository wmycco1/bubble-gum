/**
 * Icon Component (Atom)
 * God-Tier Development Protocol 2025
 *
 * SVG icon component with Context API support.
 * Uses AtomParameters for styling and behavior through Context API.
 *
 * @example Basic
 * ```tsx
 * <Icon name="heart" size="md" />
 * <Icon name="star" color="primary" aria-label="Favorite" />
 * ```
 *
 * @example With Context API
 * ```tsx
 * <AtomProvider value={{ size: 'lg', color: 'primary' }}>
 *   <Icon name="star" />
 *   <Icon name="heart" />
 * </AtomProvider>
 * ```
 *
 * @example Decorative Icon
 * ```tsx
 * <Icon name="decoration" aria-hidden={true} />
 * ```
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import type { IconProps } from './Icon.types';
import styles from './Icon.module.css';

export const Icon: React.FC<IconProps> = (props) => {
  // Get inherited parameters from Atom context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as IconProps;

  // Destructure with defaults
  const {
    name,
    size = 'md',
    color = 'default',
    className = '',
    'data-testid': testId = 'icon',
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden = false,
    ...rest
  } = params;

  // Compute CSS classes (using CSS modules)
  const classes = [
    styles.icon,
    styles[`icon--${size}`],
    styles[`icon--${color}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Simple placeholder SVG (in real implementation, integrate icon library)
  // This could be replaced with lucide-react, heroicons, or custom SVG loader
  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <svg
      className={classes}
      data-testid={testId}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaHidden ? 'presentation' : 'img'}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...validDOMProps}
    >
      {/* Placeholder: star icon */}
      {/* In production, load actual icon based on 'name' prop */}
      <title>{name}</title>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
};

// Display name for React DevTools
Icon.displayName = 'Icon';

// Default export for convenience
export default Icon;
