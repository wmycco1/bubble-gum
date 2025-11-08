/**
 * InnerSection Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * A nested layout container for inner sections within main sections.
 * Provides max-width, backgrounds, padding/margin, and advanced styling.
 *
 * @example Basic
 * ```tsx
 * <InnerSection>
 *   <Heading text="Section Title" />
 *   <Text text="Section content..." />
 * </InnerSection>
 * ```
 *
 * @example With max-width and padding
 * ```tsx
 * <InnerSection maxWidth="800px" padding="3rem">
 *   <Card title="Content Card" />
 * </InnerSection>
 * ```
 *
 * @example With background
 * ```tsx
 * <InnerSection
 *   backgroundColor="#f3f4f6"
 *   backgroundImage="/patterns/dots.svg"
 *   backgroundSize="contain"
 *   backgroundRepeat="repeat"
 * >
 *   <Features />
 * </InnerSection>
 * ```
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import type { InnerSectionProps } from './InnerSection.types';
import styles from './InnerSection.module.css';

export const InnerSection: React.FC<InnerSectionProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as InnerSectionProps;

  // Destructure with defaults
  const {
    children,
    maxWidth = '1200px',
    padding = '2rem',
    backgroundColor = 'transparent',
    backgroundImage,
    backgroundSize = 'cover',
    backgroundPosition = 'center',
    backgroundRepeat = 'no-repeat',
    minHeight,
    id,
    className = '',
    style: customStyle,
    'data-testid': testId = 'inner-section',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  } = params;

  // Build inline styles
  const inlineStyles: React.CSSProperties = {
    maxWidth,
    padding,
    backgroundColor,
    minHeight,
    ...customStyle,
  };

  // Add background image if provided
  if (backgroundImage) {
    inlineStyles.backgroundImage = `url(${backgroundImage})`;
    inlineStyles.backgroundSize = backgroundSize;
    inlineStyles.backgroundPosition = backgroundPosition;
    inlineStyles.backgroundRepeat = backgroundRepeat;
  }

  // Compute CSS classes
  const wrapperClasses = [
    styles['inner-section'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Filter out invalid DOM props
  const validDOMProps = getValidDOMProps(rest);

  return (
    <div
      id={id}
      className={wrapperClasses}
      style={inlineStyles}
      data-testid={testId}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      {...validDOMProps}
    >
      {children}
    </div>
  );
};

// Display name for React DevTools
InnerSection.displayName = 'InnerSection';

// Default export for convenience
export default InnerSection;
