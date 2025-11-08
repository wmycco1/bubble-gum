/**
 * AddToCart Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Add to cart button with quantity selector
 *
 * @composition Button + Counter molecules
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import type { AddToCartProps } from './AddToCart.types';
import styles from './AddToCart.module.css';

export const AddToCart: React.FC<AddToCartProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as AddToCartProps;

  // Destructure with defaults
  const {
    data,
    className = '',
    'data-testid': testId = 'add-to-cart',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles['add-to-cart'],
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
      <h2>AddToCart Component</h2>
      <p>Add to cart button with quantity selector</p>
      {/* TODO: Implement component logic */}
    </div>
  );
};

// Display name for React DevTools
AddToCart.displayName = 'AddToCart';

// Default export for convenience
export default AddToCart;
