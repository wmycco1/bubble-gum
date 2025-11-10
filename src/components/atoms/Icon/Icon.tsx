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

  // Icon path data mapping
  const iconPaths: Record<string, string> = {
    // Close/Exit icons
    'x': 'M18 6L6 18M6 6l12 12',
    'close': 'M18 6L6 18M6 6l12 12',
    'times': 'M18 6L6 18M6 6l12 12',

    // Common icons
    'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    'heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
    'check': 'M20 6L9 17l-5-5',
    'chevron-down': 'M6 9l6 6 6-6',
    'chevron-up': 'M18 15l-6-6-6 6',
    'chevron-left': 'M15 18l-6-6 6-6',
    'chevron-right': 'M9 18l6-6-6-6',
    'menu': 'M3 12h18M3 6h18M3 18h18',
    'search': 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    'plus': 'M12 5v14m-7-7h14',
    'minus': 'M5 12h14',
    'edit': 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
    'trash': 'M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
    'settings': 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z',
    'info': 'M12 16v-4m0-4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z',
    'alert': 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    'eye': 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z',
    'eye-off': 'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24 M1 1l22 22',
    'user': 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z',
    'home': 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  };

  const pathData = iconPaths[name] || iconPaths['star']; // fallback to star
  const isStroke = ['x', 'close', 'times', 'check', 'chevron-down', 'chevron-up', 'chevron-left', 'chevron-right', 'menu', 'search', 'plus', 'minus', 'edit', 'trash', 'settings', 'info', 'alert', 'eye', 'eye-off', 'user', 'home'].includes(name);

  return (
    <svg
      className={classes}
      data-testid={testId}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaHidden ? 'presentation' : 'img'}
      fill={isStroke ? 'none' : 'currentColor'}
      stroke={isStroke ? 'currentColor' : 'none'}
      strokeWidth={isStroke ? 2 : 0}
      strokeLinecap={isStroke ? 'round' : undefined}
      strokeLinejoin={isStroke ? 'round' : undefined}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...validDOMProps}
    >
      <title>{name}</title>
      <path d={pathData} />
    </svg>
  );
};

// Display name for React DevTools
Icon.displayName = 'Icon';

// Default export for convenience
export default Icon;
