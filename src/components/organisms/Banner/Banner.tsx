/**
 * Banner Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Announcement banner for important messages, promotions, and CTAs.
 * Composed of Heading, Text, Button, Badge, and Image atoms.
 *
 * @example Basic banner
 * ```tsx
 * <Banner
 *   message="Welcome to our new site!"
 *   ctaText="Learn More"
 *   ctaHref="/about"
 * />
 * ```
 *
 * @example Full-featured promo banner
 * ```tsx
 * <Banner
 *   title="Black Friday Sale"
 *   message="Get 50% off all products"
 *   ctaText="Shop Now"
 *   ctaHref="/shop"
 *   variant="promo"
 *   badge="NEW"
 *   backgroundImage="/promo.jpg"
 *   position="top"
 *   sticky={true}
 *   dismissible={true}
 * />
 * ```
 */

'use client';

import React, { useState } from 'react';
import { useAtomContext, mergeParameters, AtomProvider } from '@/context/parameters/ParameterContext';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { X } from 'lucide-react';
import type { BannerProps } from './Banner.types';
import styles from './Banner.module.css';

export const Banner: React.FC<BannerProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as BannerProps;

  // Destructure with defaults
  const {
    title,
    message,
    ctaText,
    ctaHref,
    ctaVariant = 'primary',
    ctaOnClick,
    variant = 'info',
    position = 'relative',
    sticky = false,
    dismissible = false,
    onDismiss,
    badge,
    backgroundImage,
    showCloseButton = dismissible,
    className = '',
    'data-testid': testId = 'banner',
    style,
    ...rest
  } = params;

  // Dismissed state
  const [isDismissed, setIsDismissed] = useState(false);

  // Handle dismiss
  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  // Handle CTA click
  const handleCtaClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ctaOnClick) {
      e.preventDefault();
      ctaOnClick(e);
    }
  };

  // Don't render if dismissed
  if (isDismissed) {
    return null;
  }

  // Compute CSS classes
  const classes = [
    styles.banner,
    styles[`banner--${variant}`],
    styles[`banner--${position}`],
    sticky && styles['banner--sticky'],
    backgroundImage && styles['banner--with-bg-image'],
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

  return (
    <section
      className={classes}
      style={inlineStyles}
      data-testid={testId}
      role="region"
      aria-label={title || 'Announcement banner'}
      aria-live="polite"
      {...rest}
    >
      <div className={styles['banner-container']}>
        {/* Badge */}
        {badge && (
          <span className={styles['banner-badge']} data-testid={`${testId}-badge`}>
            {badge}
          </span>
        )}

        {/* Content */}
        <div className={styles['banner-content']}>
          <AtomProvider value={{ align: 'center' }}>
            {/* Title */}
            {title && (
              <Heading
                level="h2"
                className={styles['banner-title']}
                data-testid={`${testId}-title`}
              >
                {title}
              </Heading>
            )}

            {/* Message */}
            <Text
              className={styles['banner-message']}
              data-testid={`${testId}-message`}
            >
              {message}
            </Text>
          </AtomProvider>
        </div>

        {/* CTA Button */}
        {ctaText && (
          <div className={styles['banner-actions']} data-testid={`${testId}-actions`}>
            <Button
              text={ctaText}
              variant={ctaVariant}
              size="md"
              onClick={ctaOnClick ? handleCtaClick : undefined}
              {...(ctaHref && !ctaOnClick ? { as: 'a', href: ctaHref } : {})}
              className={styles['banner-cta']}
              data-testid={`${testId}-cta`}
            />
          </div>
        )}

        {/* Close button */}
        {showCloseButton && (
          <button
            className={styles['banner-close']}
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            data-testid={`${testId}-close`}
          >
            <X size={20} aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
};

// Display name for React DevTools
Banner.displayName = 'Banner';

// Default export for convenience
export default Banner;
