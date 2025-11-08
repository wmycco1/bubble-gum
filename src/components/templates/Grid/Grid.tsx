/**
 * Grid Component (Template)
 * God-Tier Development Protocol 2025
 *
 * A multi-column grid layout component with responsive column control,
 * custom column widths, and gap management.
 *
 * @example Basic grid
 * ```tsx
 * <Grid columns={3} gap="md">
 *   <Card />
 *   <Card />
 *   <Card />
 * </Grid>
 * ```
 *
 * @example Responsive grid
 * ```tsx
 * <Grid responsive={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
 *   <Card />
 *   <Card />
 *   <Card />
 * </Grid>
 * ```
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import {
  useTemplateContext,
  mergeParameters,
  TemplateProvider,
} from '@/context/parameters/ParameterContext';
import type { GridProps, GridGap } from './Grid.types';
import styles from './Grid.module.css';

/**
 * Gap value mappings (rem units)
 */
const GAP_MAP: Record<GridGap, string> = {
  none: '0',
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
};

export const Grid: React.FC<GridProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useTemplateContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as GridProps;

  // Destructure with defaults
  const {
    columns = 3,
    columnWidths,
    gap = 'md',
    responsive,
    children,
    className = '',
    'data-testid': testId = 'grid',
    as: Element = 'div',
    style,
    ...rest
  } = params;

  // Validate columns (1-12)
  const validColumns = Math.max(1, Math.min(12, columns));

  // Compute CSS classes
  const classes = [
    styles.grid,
    // Responsive classes (if responsive config provided)
    responsive?.mobile && styles[`grid--cols-${responsive.mobile}-mobile`],
    responsive?.tablet && styles[`grid--cols-${responsive.tablet}-tablet`],
    responsive?.desktop && styles[`grid--cols-${responsive.desktop}-desktop`],
    responsive?.wide && styles[`grid--cols-${responsive.wide}-wide`],
    // Default column class (if no responsive config)
    !responsive && styles[`grid--cols-${validColumns}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Compute inline styles
  const inlineStyles: React.CSSProperties = {
    gap: GAP_MAP[gap],
    // Custom column widths
    ...(columnWidths && {
      gridTemplateColumns: columnWidths.join(' '),
    }),
    // style prop overrides defaults
    ...style,
  };

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <TemplateProvider value={params}>
      <Element
        className={classes}
        style={inlineStyles}
        data-testid={testId}
        {...validDOMProps}
      >
        {children}
      </Element>
    </TemplateProvider>
  );
};

// Display name for React DevTools
Grid.displayName = 'Grid';

// Default export for convenience
export default Grid;
