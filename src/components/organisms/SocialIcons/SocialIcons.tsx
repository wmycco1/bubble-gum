/**
 * SocialIcons Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Social media icon links grid
 *
 * @composition Link + Icon atoms
 */

'use client';

import React from 'react';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import type { SocialIconsProps } from './SocialIcons.types';
import styles from './SocialIcons.module.css';

export const SocialIcons: React.FC<SocialIconsProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as SocialIconsProps;

  // Destructure with defaults
  const {
    data,
    className = '',
    'data-testid': testId = 'social-icons',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles['social-icons'],
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
      <h2>SocialIcons Component</h2>
      <p>Social media icon links grid</p>
      {/* TODO: Implement component logic */}
    </div>
  );
};

// Display name for React DevTools
SocialIcons.displayName = 'SocialIcons';

// Default export for convenience
export default SocialIcons;
