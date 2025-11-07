/**
 * RecentlyViewed Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Recently viewed products list
 *
 * @composition Card organisms in horizontal layout
 */

'use client';

import React from 'react';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import type { RecentlyViewedProps } from './RecentlyViewed.types';
import styles from './RecentlyViewed.module.css';

export const RecentlyViewed: React.FC<RecentlyViewedProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as RecentlyViewedProps;

  // Destructure with defaults
  const {
    data,
    className = '',
    'data-testid': testId = 'recently-viewed',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles['recently-viewed'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={style as React.CSSProperties}
      data-testid={testId}
      {...rest}
    >
      <h2>RecentlyViewed Component</h2>
      <p>Recently viewed products list</p>
      {/* TODO: Implement component logic */}
    </div>
  );
};

// Display name for React DevTools
RecentlyViewed.displayName = 'RecentlyViewed';

// Default export for convenience
export default RecentlyViewed;
