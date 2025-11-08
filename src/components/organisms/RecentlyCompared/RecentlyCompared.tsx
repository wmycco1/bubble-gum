/**
 * RecentlyCompared Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Recently compared products list
 *
 * @composition Card organisms in grid
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import type { RecentlyComparedProps } from './RecentlyCompared.types';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import styles from './RecentlyCompared.module.css';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';

export const RecentlyCompared: React.FC<RecentlyComparedProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as RecentlyComparedProps;

  // Destructure with defaults
  const {
    data,
    className = '',
    'data-testid': testId = 'recently-compared',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles['recently-compared'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <div
      className={classes}
      style={style as React.CSSProperties}
      data-testid={testId}
      {...validDOMProps}
    >
      <h2>RecentlyCompared Component</h2>
      <p>Recently compared products list</p>
      {/* TODO: Implement component logic */}
    </div>
  );
};

// Display name for React DevTools
RecentlyCompared.displayName = 'RecentlyCompared';

// Default export for convenience
export default RecentlyCompared;
