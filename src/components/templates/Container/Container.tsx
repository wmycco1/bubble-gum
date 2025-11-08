/**
 * Container Component (Template)
 * God-Tier Development Protocol 2025
 *
 * A max-width wrapper component for page content. Provides consistent
 * horizontal spacing and centering with responsive breakpoints.
 *
 * @example Basic usage
 * ```tsx
 * <Container maxWidth="lg">
 *   <Hero />
 *   <Features />
 * </Container>
 * ```
 *
 * @example Full-width
 * ```tsx
 * <Container maxWidth="full" padding="none">
 *   <HeroSection />
 * </Container>
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
import type { ContainerProps, ContainerMaxWidth, ContainerPadding } from './Container.types';
import styles from './Container.module.css';

/**
 * Max-width value mappings
 */
const MAX_WIDTH_MAP: Record<ContainerMaxWidth, string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
};

/**
 * Padding class mappings
 */
const PADDING_MAP: Record<ContainerPadding, string> = {
  none: styles['container--padding-none'],
  sm: styles['container--padding-sm'],
  md: styles['container--padding-md'],
  lg: styles['container--padding-lg'],
  xl: styles['container--padding-xl'],
};

export const Container: React.FC<ContainerProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useTemplateContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as ContainerProps;

  // Destructure with defaults
  const {
    maxWidth = 'lg',
    padding = 'md',
    centerContent = true,
    children,
    className = '',
    'data-testid': testId = 'container',
    as: Element = 'div',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles.container,
    PADDING_MAP[padding],
    centerContent && styles['container--centered'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Compute inline styles
  const inlineStyles: React.CSSProperties = {
    maxWidth: MAX_WIDTH_MAP[maxWidth],
    ...style, // style prop overrides default maxWidth
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
Container.displayName = 'Container';

// Default export for convenience
export default Container;
