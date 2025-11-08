/**
 * Hero Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Hero section for landing pages and key pages.
 * Composed of Heading, Text, Button, and Image atoms.
 *
 * @example Basic hero
 * ```tsx
 * <Hero
 *   title="Welcome to Our Platform"
 *   subtitle="Build amazing products"
 *   ctaText="Get Started"
 *   ctaHref="/signup"
 * />
 * ```
 *
 * @example Full-featured hero
 * ```tsx
 * <Hero
 *   title="Transform Your Business"
 *   subtitle="AI-powered solutions"
 *   ctaText="Start Free Trial"
 *   ctaHref="/trial"
 *   secondaryCtaText="Learn More"
 *   secondaryCtaHref="/about"
 *   backgroundImage="/hero.jpg"
 *   backgroundOverlay={true}
 *   fullHeight={true}
 * />
 * ```
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters, AtomProvider } from '@/context/parameters/ParameterContext';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Image } from '@/components/atoms/Image';
import type { HeroProps } from './Hero.types';
import styles from './Hero.module.css';

export const Hero: React.FC<HeroProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as HeroProps;

  // Destructure with defaults
  const {
    title,
    subtitle,
    ctaText,
    ctaHref,
    ctaVariant = 'primary',
    ctaOnClick,
    secondaryCtaText,
    secondaryCtaHref,
    secondaryCtaVariant = 'secondary',
    secondaryCtaOnClick,
    backgroundImage,
    backgroundGradient,
    backgroundOverlay = false,
    overlayOpacity = 0.5,
    align = 'center',
    fullHeight = false,
    minHeight = '500px',
    sideImage,
    sideImageAlt = 'Hero image',
    sideImagePosition = 'right',
    className = '',
    'data-testid': testId = 'hero',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles.hero,
    styles[`hero--align-${align}`],
    fullHeight && styles['hero--full-height'],
    sideImage && styles['hero--split'],
    sideImage && styles[`hero--image-${sideImagePosition}`],
    backgroundImage && styles['hero--with-bg-image'],
    backgroundGradient && styles['hero--with-gradient'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Compute inline styles
  const inlineStyles: React.CSSProperties = {};

  if (!fullHeight && minHeight) {
    inlineStyles.minHeight = minHeight;
  }

  // Add background image or gradient
  if (backgroundImage) {
    inlineStyles.backgroundImage = `url(${backgroundImage})`;
  } else if (backgroundGradient) {
    inlineStyles.backgroundImage = backgroundGradient;
  }

  // Merge custom styles (but preserve backgroundImage if set by props)
  const finalStyles: React.CSSProperties = {
    ...style,
    ...inlineStyles,
  };

  // Handle CTA clicks
  const handlePrimaryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ctaOnClick) {
      e.preventDefault();
      ctaOnClick(e);
    }
  };

  const handleSecondaryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (secondaryCtaOnClick) {
      e.preventDefault();
      secondaryCtaOnClick(e);
    }
  };

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <section
      role="region"
      aria-label={title}
      className={classes}
      style={finalStyles}
      data-testid={testId}
      {...validDOMProps}
    >
      {/* Background overlay */}
      {backgroundOverlay && (backgroundImage || backgroundGradient) && (
        <div
          className={styles['hero-overlay']}
          style={{ opacity: overlayOpacity }}
          aria-hidden="true"
        />
      )}

      {/* Content container */}
      <div className={styles['hero-container']}>
        {/* Text content */}
        <div className={styles['hero-content']}>
          <AtomProvider value={{ align }}>
            {/* Title */}
            <Heading
              level="h1"
              className={styles['hero-title']}
              data-testid={`${testId}-title`}
            >
              {title}
            </Heading>

            {/* Subtitle */}
            {subtitle && (
              <Text
                className={styles['hero-subtitle']}
                data-testid={`${testId}-subtitle`}
              >
                {subtitle}
              </Text>
            )}

            {/* CTA Buttons */}
            {(ctaText || secondaryCtaText) && (
              <div
                className={styles['hero-actions']}
                data-testid={`${testId}-actions`}
              >
                {ctaText && (
                  <Button
                    text={ctaText}
                    variant={ctaVariant}
                    size="lg"
                    onClick={ctaOnClick ? handlePrimaryClick : undefined}
                    {...(ctaHref && !ctaOnClick ? { as: 'a', href: ctaHref } : {})}
                    className={styles['hero-cta-primary']}
                    data-testid={`${testId}-cta-primary`}
                  />
                )}

                {secondaryCtaText && (
                  <Button
                    text={secondaryCtaText}
                    variant={secondaryCtaVariant}
                    size="lg"
                    onClick={secondaryCtaOnClick ? handleSecondaryClick : undefined}
                    {...(secondaryCtaHref && !secondaryCtaOnClick ? { as: 'a', href: secondaryCtaHref } : {})}
                    className={styles['hero-cta-secondary']}
                    data-testid={`${testId}-cta-secondary`}
                  />
                )}
              </div>
            )}
          </AtomProvider>
        </div>

        {/* Side image */}
        {sideImage && (
          <div className={styles['hero-image']} data-testid={`${testId}-image`}>
            <Image
              src={sideImage}
              alt={sideImageAlt}
              aspectRatio="16/9"
              fit="cover"
              rounded
              loading="eager"
            />
          </div>
        )}
      </div>
    </section>
  );
};

// Display name for React DevTools
Hero.displayName = 'Hero';

// Default export for convenience
export default Hero;
