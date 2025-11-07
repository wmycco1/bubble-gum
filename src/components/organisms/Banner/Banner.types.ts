/**
 * Banner Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Banner organism component
 */

import type { OrganismParameters } from '@/types/parameters';
import type { ButtonVariant } from '@/types/parameters';

/**
 * Banner position options
 */
export type BannerPosition = 'top' | 'bottom' | 'relative';

/**
 * Banner variant options
 */
export type BannerVariant = 'info' | 'success' | 'warning' | 'promo';

/**
 * Banner Props
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
 * @example Promo banner with badge
 * ```tsx
 * <Banner
 *   title="Black Friday Sale"
 *   message="Get 50% off all products this week only"
 *   ctaText="Shop Now"
 *   ctaHref="/shop"
 *   variant="promo"
 *   badge="NEW"
 *   backgroundImage="/promo-bg.jpg"
 *   position="top"
 *   sticky={true}
 * />
 * ```
 *
 * @example Dismissible announcement
 * ```tsx
 * <Banner
 *   message="We've just launched our mobile app!"
 *   ctaText="Download"
 *   ctaHref="/download"
 *   variant="success"
 *   dismissible={true}
 *   onDismiss={() => console.log('Banner dismissed')}
 * />
 * ```
 */
export interface BannerProps extends OrganismParameters {
  /**
   * Banner title (optional)
   * Main heading for the banner
   */
  title?: string;

  /**
   * Banner message (required)
   * Primary message text
   */
  message: string;

  /**
   * CTA button text
   */
  ctaText?: string;

  /**
   * CTA button link
   */
  ctaHref?: string;

  /**
   * CTA button variant
   * @default 'primary'
   */
  ctaVariant?: ButtonVariant;

  /**
   * CTA click handler (alternative to href)
   */
  ctaOnClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Banner variant/style
   * @default 'info'
   */
  variant?: BannerVariant;

  /**
   * Banner position
   * @default 'relative'
   */
  position?: BannerPosition;

  /**
   * Sticky positioning (fixed on scroll)
   * @default false
   */
  sticky?: boolean;

  /**
   * Show dismiss/close button
   * @default false
   */
  dismissible?: boolean;

  /**
   * Callback when dismissed
   */
  onDismiss?: () => void;

  /**
   * Badge text (e.g., "NEW", "SALE")
   */
  badge?: string;

  /**
   * Background image URL
   */
  backgroundImage?: string;

  /**
   * Show close button (same as dismissible)
   * @default false
   */
  showCloseButton?: boolean;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'banner'
   */
  'data-testid'?: string;
}

/**
 * Banner component that supports Context API parameter inheritance
 */
export type BannerComponent = React.FC<BannerProps>;
