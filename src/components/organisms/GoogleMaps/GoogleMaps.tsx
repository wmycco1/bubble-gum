/**
 * GoogleMaps Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Google Maps embed component
 *
 * @composition iframe embed
 */

'use client';

import React from 'react';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import type { GoogleMapsProps } from './GoogleMaps.types';
import styles from './GoogleMaps.module.css';

export const GoogleMaps: React.FC<GoogleMapsProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as GoogleMapsProps;

  // Destructure with defaults
  const {
    data,
    className = '',
    'data-testid': testId = 'google-maps',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles['google-maps'],
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
      <h2>GoogleMaps Component</h2>
      <p>Google Maps embed component</p>
      {/* TODO: Implement component logic */}
    </div>
  );
};

// Display name for React DevTools
GoogleMaps.displayName = 'GoogleMaps';

// Default export for convenience
export default GoogleMaps;
