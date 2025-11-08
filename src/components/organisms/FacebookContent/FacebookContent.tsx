/**
 * FacebookContent Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Facebook post embed
 *
 * @composition iframe embed
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import type { FacebookContentProps } from './FacebookContent.types';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import styles from './FacebookContent.module.css';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';

export const FacebookContent: React.FC<FacebookContentProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as FacebookContentProps;

  // Destructure with defaults
  const {
    data,
    className = '',
    'data-testid': testId = 'facebook-content',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles['facebook-content'],
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
      <h2>FacebookContent Component</h2>
      <p>Facebook post embed</p>
      {/* TODO: Implement component logic */}
    </div>
  );
};

// Display name for React DevTools
FacebookContent.displayName = 'FacebookContent';

// Default export for convenience
export default FacebookContent;
