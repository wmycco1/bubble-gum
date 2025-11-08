/**
 * CMSBlock Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * CMS content block renderer
 *
 * @composition Heading + Text + Image atoms
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import type { CMSBlockProps } from './CMSBlock.types';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import styles from './CMSBlock.module.css';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';

export const CMSBlock: React.FC<CMSBlockProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as CMSBlockProps;

  // Destructure with defaults
  const {
    data,
    className = '',
    'data-testid': testId = 'c-m-s-block',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles['c-m-s-block'],
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
      <h2>CMSBlock Component</h2>
      <p>CMS content block renderer</p>
      {/* TODO: Implement component logic */}
    </div>
  );
};

// Display name for React DevTools
CMSBlock.displayName = 'CMSBlock';

// Default export for convenience
export default CMSBlock;
