/**
 * Section Component (Template)
 * God-Tier Development Protocol 2025
 *
 * A content section component with padding, background color/image,
 * and overlay support. Used to structure page content into logical blocks.
 *
 * @example Basic section
 * ```tsx
 * <Section background="light" padding="lg">
 *   <Features />
 * </Section>
 * ```
 *
 * @example Section with background image
 * ```tsx
 * <Section
 *   backgroundImage="/hero.jpg"
 *   overlay={true}
 *   padding="xl"
 * >
 *   <Hero />
 * </Section>
 * ```
 */

'use client';

import React from 'react';
import {
  useTemplateContext,
  mergeParameters,
  TemplateProvider,
} from '@/context/parameters/ParameterContext';
import type { SectionProps, SectionBackground, SectionPadding } from './Section.types';
import styles from './Section.module.css';

/**
 * Background class mappings
 */
const BACKGROUND_MAP: Record<SectionBackground, string> = {
  none: styles['section--bg-none'],
  light: styles['section--bg-light'],
  dark: styles['section--bg-dark'],
  primary: styles['section--bg-primary'],
  gradient: styles['section--bg-gradient'],
};

/**
 * Padding class mappings
 */
const PADDING_MAP: Record<SectionPadding, string> = {
  none: styles['section--padding-none'],
  sm: styles['section--padding-sm'],
  md: styles['section--padding-md'],
  lg: styles['section--padding-lg'],
  xl: styles['section--padding-xl'],
};

export const Section: React.FC<SectionProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useTemplateContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as SectionProps;

  // Destructure with defaults
  const {
    background = 'none',
    backgroundImage,
    padding = 'md',
    fullWidth = false,
    overlay = false,
    overlayOpacity = 0.5,
    overlayColor = 'rgba(0, 0, 0, 0.5)',
    children,
    className = '',
    'data-testid': testId = 'section',
    as: Element = 'section',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles.section,
    BACKGROUND_MAP[background],
    PADDING_MAP[padding],
    fullWidth && styles['section--full-width'],
    backgroundImage && styles['section--has-image'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Compute inline styles
  const inlineStyles: React.CSSProperties = {
    ...style,
    ...(backgroundImage && {
      backgroundImage: `url(${backgroundImage})`,
    }),
  };

  // Compute overlay styles
  const overlayStyles: React.CSSProperties = {
    backgroundColor: overlayColor,
    opacity: overlayOpacity,
  };

  return (
    <TemplateProvider value={params}>
      <Element
        className={classes}
        style={inlineStyles}
        data-testid={testId}
        {...rest}
      >
        {/* Overlay for background images */}
        {backgroundImage && overlay && (
          <div
            className={styles['section-overlay']}
            style={overlayStyles}
            data-testid={`${testId}-overlay`}
          />
        )}

        {/* Content wrapper */}
        <div className={styles['section-content']} data-testid={`${testId}-content`}>
          {children}
        </div>
      </Element>
    </TemplateProvider>
  );
};

// Display name for React DevTools
Section.displayName = 'Section';

// Default export for convenience
export default Section;
