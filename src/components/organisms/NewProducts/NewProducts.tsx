/**
 * NewProducts Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * New products showcase
 *
 * @composition Card organisms with badges
 */

'use client';

import React from 'react';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import type { NewProductsProps } from './NewProducts.types';
import styles from './NewProducts.module.css';

export const NewProducts: React.FC<NewProductsProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as NewProductsProps;

  // Destructure with defaults
  const {
    data,
    className = '',
    'data-testid': testId = 'new-products',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles['new-products'],
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
      <h2>NewProducts Component</h2>
      <p>New products showcase</p>
      {/* TODO: Implement component logic */}
    </div>
  );
};

// Display name for React DevTools
NewProducts.displayName = 'NewProducts';

// Default export for convenience
export default NewProducts;
