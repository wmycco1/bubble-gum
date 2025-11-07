/**
 * CTA Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Call-To-Action section for converting visitors into customers.
 * Composed of Heading, Text, Button, and Image atoms.
 *
 * @example Basic CTA
 * ```tsx
 * <CTA
 *   title="Ready to Get Started?"
 *   description="Join thousands of satisfied customers"
 *   primaryCtaText="Sign Up Now"
 *   primaryCtaHref="/signup"
 * />
 * ```
 *
 * @example Full-featured CTA
 * ```tsx
 * <CTA
 *   title="Transform Your Business"
 *   description="AI-powered solutions"
 *   primaryCtaText="Start Free Trial"
 *   primaryCtaHref="/trial"
 *   secondaryCtaText="Learn More"
 *   secondaryCtaHref="/about"
 *   backgroundImage="/hero.jpg"
 *   backgroundOverlay={true}
 *   layout="split"
 *   sideImage="/product.jpg"
 * />
 * ```
 */

'use client';

import React from 'react';
import { useAtomContext, mergeParameters, AtomProvider } from '@/context/parameters/ParameterContext';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Image } from '@/components/atoms/Image';
import type { CTAProps } from './CTA.types';
import styles from './CTA.module.css';

export const CTA: React.FC<CTAProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as CTAProps;

  // Destructure with defaults
  const {
    title,
    description,
    primaryCtaText,
    primaryCtaHref,
    primaryCtaVariant = 'primary',
    secondaryCtaText,
    secondaryCtaHref,
    secondaryCtaVariant = 'secondary',
    backgroundImage,
    backgroundOverlay = false,
    overlayOpacity = 0.5,
    sideImage,
    sideImageAlt = 'CTA image',
    sideImagePosition = 'right',
    layout = 'centered',
    variant = 'default',
    fullWidth = true,
    onPrimaryClick,
    onSecondaryClick,
    className = '',
    'data-testid': testId = 'cta',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles.cta,
    styles[`cta--${variant}`],
    styles[`cta--${layout}`],
    sideImage && styles['cta--with-side-image'],
    sideImage && styles[`cta--image-${sideImagePosition}`],
    backgroundImage && styles['cta--with-bg-image'],
    fullWidth && styles['cta--full-width'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Compute inline styles
  const inlineStyles: React.CSSProperties = {
    ...style,
  };

  if (backgroundImage) {
    inlineStyles.backgroundImage = `url(${backgroundImage})`;
  }

  // Handle CTA clicks
  const handlePrimaryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onPrimaryClick) {
      e.preventDefault();
      onPrimaryClick(e);
    }
  };

  const handleSecondaryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onSecondaryClick) {
      e.preventDefault();
      onSecondaryClick(e);
    }
  };

  return (
    <section
      className={classes}
      style={inlineStyles}
      data-testid={testId}
      {...rest}
    >
      {/* Background overlay */}
      {backgroundOverlay && backgroundImage && (
        <div
          className={styles['cta-overlay']}
          style={{ opacity: overlayOpacity }}
          aria-hidden="true"
        />
      )}

      {/* Content container */}
      <div className={styles['cta-container']}>
        {/* Text content */}
        <div className={styles['cta-content']}>
          <AtomProvider value={{ align: layout === 'centered' ? 'center' : 'left' }}>
            {/* Title */}
            <Heading
              level="h2"
              className={styles['cta-title']}
              data-testid={`${testId}-title`}
            >
              {title}
            </Heading>

            {/* Description */}
            {description && (
              <Text
                className={styles['cta-description']}
                data-testid={`${testId}-description`}
              >
                {description}
              </Text>
            )}

            {/* CTA Buttons */}
            <div className={styles['cta-actions']} data-testid={`${testId}-actions`}>
              <Button
                text={primaryCtaText}
                variant={primaryCtaVariant}
                size="lg"
                onClick={onPrimaryClick ? handlePrimaryClick : undefined}
                {...(primaryCtaHref && !onPrimaryClick
                  ? { as: 'a' as any, href: primaryCtaHref }
                  : {})}
                className={styles['cta-primary']}
                data-testid={`${testId}-primary`}
              />

              {secondaryCtaText && (
                <Button
                  text={secondaryCtaText}
                  variant={secondaryCtaVariant}
                  size="lg"
                  onClick={onSecondaryClick ? handleSecondaryClick : undefined}
                  {...(secondaryCtaHref && !onSecondaryClick
                    ? { as: 'a' as any, href: secondaryCtaHref }
                    : {})}
                  className={styles['cta-secondary']}
                  data-testid={`${testId}-secondary`}
                />
              )}
            </div>
          </AtomProvider>
        </div>

        {/* Side image (for split layout) */}
        {sideImage && (
          <div className={styles['cta-image']} data-testid={`${testId}-image`}>
            <Image
              src={sideImage}
              alt={sideImageAlt}
              aspectRatio="16/9"
              fit="cover"
              rounded
              loading="lazy"
            />
          </div>
        )}
      </div>
    </section>
  );
};

// Display name for React DevTools
CTA.displayName = 'CTA';

// Default export for convenience
export default CTA;
