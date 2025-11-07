/**
 * Card Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Card organism component
 */

import type { OrganismParameters } from '@/types/parameters';
import type { ButtonVariant } from '@/types/parameters';

/**
 * Card image position
 */
export type CardImagePosition = 'top' | 'left' | 'right';

/**
 * Card variant
 */
export type CardVariant = 'default' | 'bordered' | 'elevated' | 'ghost';

/**
 * Badge configuration for Card
 */
export interface CardBadge {
  id: string;
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

/**
 * Card Props
 *
 * @example Basic card
 * ```tsx
 * <Card
 *   title="Product Name"
 *   description="Product description here"
 *   ctaText="Buy Now"
 *   ctaHref="/product"
 * />
 * ```
 *
 * @example Card with image and badges
 * ```tsx
 * <Card
 *   image="/product.jpg"
 *   imageAlt="Product photo"
 *   imagePosition="top"
 *   title="Premium Product"
 *   description="High-quality product with amazing features"
 *   badges={[
 *     { id: '1', label: 'New', variant: 'primary' },
 *     { id: '2', label: 'Sale', variant: 'error' }
 *   ]}
 *   ctaText="Add to Cart"
 *   ctaHref="/cart"
 *   ctaVariant="primary"
 *   variant="elevated"
 * />
 * ```
 *
 * @example Clickable card
 * ```tsx
 * <Card
 *   title="Blog Post"
 *   description="Read about our latest news"
 *   href="/blog/post-1"
 *   variant="bordered"
 * />
 * ```
 */
export interface CardProps extends OrganismParameters {
  /**
   * Card image URL
   */
  image?: string;

  /**
   * Image alt text
   */
  imageAlt?: string;

  /**
   * Image position relative to content
   * @default 'top'
   */
  imagePosition?: CardImagePosition;

  /**
   * Card title (required)
   */
  title: string;

  /**
   * Card description text
   */
  description?: string;

  /**
   * Badges/tags to display
   */
  badges?: CardBadge[];

  /**
   * Primary CTA button text
   */
  ctaText?: string;

  /**
   * Primary CTA button link
   */
  ctaHref?: string;

  /**
   * Primary CTA button variant
   * @default 'primary'
   */
  ctaVariant?: ButtonVariant;

  /**
   * Secondary CTA button text
   */
  secondaryCtaText?: string;

  /**
   * Secondary CTA button link
   */
  secondaryCtaHref?: string;

  /**
   * Secondary CTA button variant
   * @default 'secondary'
   */
  secondaryCtaVariant?: ButtonVariant;

  /**
   * Card variant
   * @default 'default'
   */
  variant?: CardVariant;

  /**
   * Link URL (makes entire card clickable)
   */
  href?: string;

  /**
   * Footer content (custom React nodes)
   */
  footer?: React.ReactNode;

  /**
   * Card click handler (when entire card is clickable)
   */
  onCardClick?: (event: React.MouseEvent<HTMLElement>) => void;

  /**
   * Primary CTA click handler
   */
  onCtaClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Secondary CTA click handler
   */
  onSecondaryCtaClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'card'
   */
  'data-testid'?: string;
}

/**
 * Card component that supports Context API parameter inheritance
 */
export type CardComponent = React.FC<CardProps>;
