/**
 * FacebookLike Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Facebook Like button embed
 *
 * @composition Facebook SDK integration
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import type { FacebookLikeProps } from './FacebookLike.types';
import styles from './FacebookLike.module.css';

export const FacebookLike: React.FC<FacebookLikeProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as FacebookLikeProps;

  // Destructure with defaults
  const {
    data,
    className = '',
    'data-testid': testId = 'facebook-like',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles['facebook-like'],
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
      <h2>FacebookLike Component</h2>
      <p>Facebook Like button embed</p>
      {/* TODO: Implement component logic */}
    </div>
  );
};

// Display name for React DevTools
FacebookLike.displayName = 'FacebookLike';

// Default export for convenience
export default FacebookLike;
