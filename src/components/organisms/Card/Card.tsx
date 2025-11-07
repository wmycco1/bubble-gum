/**
 * Card Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * A versatile card component for displaying content with image, title, description,
 * badges, and call-to-action buttons. Composed of Image, Heading, Text, Badge, and Button atoms.
 *
 * @example Basic card
 * ```tsx
 * <Card
 *   title="Product Name"
 *   description="Product description"
 *   ctaText="Buy Now"
 *   ctaHref="/product"
 * />
 * ```
 *
 * @example Full-featured card
 * ```tsx
 * <Card
 *   image="/product.jpg"
 *   imageAlt="Product"
 *   imagePosition="left"
 *   title="Premium Product"
 *   description="Amazing features"
 *   badges={[{ id: '1', label: 'New', variant: 'primary' }]}
 *   ctaText="Add to Cart"
 *   ctaHref="/cart"
 *   variant="elevated"
 * />
 * ```
 */

'use client';

import React from 'react';
import { useAtomContext, mergeParameters, AtomProvider } from '@/context/parameters/ParameterContext';
import { Image } from '@/components/atoms/Image';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import type { CardProps } from './Card.types';
import styles from './Card.module.css';

export const Card: React.FC<CardProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as CardProps;

  // Destructure with defaults
  const {
    image,
    imageAlt,
    imagePosition = 'top',
    title,
    description,
    badges,
    ctaText,
    ctaHref,
    ctaVariant = 'primary',
    secondaryCtaText,
    secondaryCtaHref,
    secondaryCtaVariant = 'secondary',
    variant = 'default',
    href,
    footer,
    onCardClick,
    onCtaClick,
    onSecondaryCtaClick,
    className = '',
    'data-testid': testId = 'card',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles.card,
    styles[`card--${variant}`],
    image && styles[`card--image-${imagePosition}`],
    href && styles['card--clickable'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Handle card click
  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    if (href || onCardClick) {
      onCardClick?.(e);
    }
  };

  // Handle CTA clicks
  const handlePrimaryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card click
    if (onCtaClick) {
      e.preventDefault();
      onCtaClick(e);
    }
  };

  const handleSecondaryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card click
    if (onSecondaryCtaClick) {
      e.preventDefault();
      onSecondaryCtaClick(e);
    }
  };

  // Card content component
  const CardContent = (
    <article
      className={classes}
      style={style as React.CSSProperties}
      onClick={href || onCardClick ? handleCardClick : undefined}
      data-testid={testId}
      {...rest}
    >
      {/* Image */}
      {image && (
        <div className={styles['card-image']} data-testid={`${testId}-image`}>
          <Image
            src={image}
            alt={imageAlt || title}
            aspectRatio={imagePosition === 'top' ? '16/9' : '1/1'}
            fit="cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className={styles['card-content']}>
        {/* Badges */}
        {badges && badges.length > 0 && (
          <div className={styles['card-badges']} data-testid={`${testId}-badges`}>
            {badges.map((badge) => (
              <Badge
                key={badge.id}
                variant={badge.variant || 'default'}
                size="sm"
                data-testid={`${testId}-badge-${badge.id}`}
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <AtomProvider value={{ align: 'left' }}>
          <Heading
            level="h3"
            className={styles['card-title']}
            data-testid={`${testId}-title`}
          >
            {title}
          </Heading>

          {/* Description */}
          {description && (
            <Text
              className={styles['card-description']}
              data-testid={`${testId}-description`}
            >
              {description}
            </Text>
          )}
        </AtomProvider>

        {/* CTA Buttons */}
        {(ctaText || secondaryCtaText) && (
          <div className={styles['card-actions']} data-testid={`${testId}-actions`}>
            {ctaText && (
              <Button
                text={ctaText}
                variant={ctaVariant}
                size="md"
                onClick={onCtaClick ? handlePrimaryClick : undefined}
                {...(ctaHref && !onCtaClick ? { as: 'a' as any, href: ctaHref } : {})}
                className={styles['card-cta-primary']}
                data-testid={`${testId}-cta-primary`}
              />
            )}

            {secondaryCtaText && (
              <Button
                text={secondaryCtaText}
                variant={secondaryCtaVariant}
                size="md"
                onClick={onSecondaryCtaClick ? handleSecondaryClick : undefined}
                {...(secondaryCtaHref && !onSecondaryCtaClick
                  ? { as: 'a' as any, href: secondaryCtaHref }
                  : {})}
                className={styles['card-cta-secondary']}
                data-testid={`${testId}-cta-secondary`}
              />
            )}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div className={styles['card-footer']} data-testid={`${testId}-footer`}>
            {footer}
          </div>
        )}
      </div>
    </article>
  );

  // Wrap in link if href provided (for semantic HTML)
  if (href) {
    return (
      <a
        href={href}
        className={styles['card-link']}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick(e as any);
          }
        }}
      >
        {CardContent}
      </a>
    );
  }

  return CardContent;
};

// Display name for React DevTools
Card.displayName = 'Card';

// Default export for convenience
export default Card;
