/**
 * CMSPage Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Full CMS page renderer
 *
 * @composition Multiple CMSBlock organisms
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import type { CMSPageProps } from './CMSPage.types';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import styles from './CMSPage.module.css';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';

export const CMSPage: React.FC<CMSPageProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as CMSPageProps;

  // Destructure with defaults
  const {
    data,
    className = '',
    'data-testid': testId = 'c-m-s-page',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles['c-m-s-page'],
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
      <h2>CMSPage Component</h2>
      <p>Full CMS page renderer</p>
      {/* TODO: Implement component logic */}
    </div>
  );
};

// Display name for React DevTools
CMSPage.displayName = 'CMSPage';

// Default export for convenience
export default CMSPage;
