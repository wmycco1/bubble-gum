/**
 * ProductSlider Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Product carousel with navigation controls
 *
 * @composition Card + Slider/Carousel molecules
 */

'use client';

import React from 'react';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import type { ProductSliderProps } from './ProductSlider.types';
import styles from './ProductSlider.module.css';

export const ProductSlider: React.FC<ProductSliderProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as ProductSliderProps;

  // Destructure with defaults
  const {
    data,
    className = '',
    'data-testid': testId = 'product-slider',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles['product-slider'],
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
      <h2>ProductSlider Component</h2>
      <p>Product carousel with navigation controls</p>
      {/* TODO: Implement component logic */}
    </div>
  );
};

// Display name for React DevTools
ProductSlider.displayName = 'ProductSlider';

// Default export for convenience
export default ProductSlider;
