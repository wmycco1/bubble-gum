/**
 * CTA Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for CTA (Call-To-Action) organism component
 */

import type { OrganismParameters } from '@/types/parameters';
import type { ButtonVariant } from '@/types/parameters';

/**
 * CTA layout options
 */
export type CTALayout = 'centered' | 'split';

/**
 * CTA variant
 */
export type CTAVariant = 'default' | 'outlined' | 'filled';

/**
 * Side image position
 */
export type CTASideImagePosition = 'left' | 'right';

/**
 * CTA Props
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
 * @example CTA with background image
 * ```tsx
 * <CTA
 *   title="Transform Your Business"
 *   description="AI-powered solutions for modern companies"
 *   primaryCtaText="Start Free Trial"
 *   primaryCtaHref="/trial"
 *   secondaryCtaText="Learn More"
 *   secondaryCtaHref="/about"
 *   backgroundImage="/hero-bg.jpg"
 *   backgroundOverlay={true}
 *   overlayOpacity={0.7}
 *   fullWidth={true}
 * />
 * ```
 *
 * @example CTA with side image (split layout)
 * ```tsx
 * <CTA
 *   title="Join Our Community"
 *   description="Connect with like-minded professionals"
 *   primaryCtaText="Get Started"
 *   primaryCtaHref="/join"
 *   sideImage="/community.jpg"
 *   sideImagePosition="right"
 *   layout="split"
 *   variant="outlined"
 * />
 * ```
 */
export interface CTAProps extends OrganismParameters {
  /**
   * Main title (required)
   */
  title: string;

  /**
   * Description text
   */
  description?: string;

  /**
   * Primary CTA button text (required)
   */
  primaryCtaText: string;

  /**
   * Primary CTA button link
   */
  primaryCtaHref?: string;

  /**
   * Primary CTA button variant
   * @default 'primary'
   */
  primaryCtaVariant?: ButtonVariant;

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
   * Background image URL
   */
  backgroundImage?: string;

  /**
   * Background overlay (darkens background for text readability)
   * @default false
   */
  backgroundOverlay?: boolean;

  /**
   * Overlay opacity (0-1)
   * @default 0.5
   */
  overlayOpacity?: number;

  /**
   * Side image URL (for split layout)
   */
  sideImage?: string;

  /**
   * Side image alt text
   * @default 'CTA image'
   */
  sideImageAlt?: string;

  /**
   * Side image position
   * @default 'right'
   */
  sideImagePosition?: CTASideImagePosition;

  /**
   * Layout type
   * @default 'centered'
   */
  layout?: CTALayout;

  /**
   * CTA variant
   * @default 'default'
   */
  variant?: CTAVariant;

  /**
   * Full width (spans entire container)
   * @default true
   */
  fullWidth?: boolean;

  /**
   * Primary CTA click handler
   */
  onPrimaryClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Secondary CTA click handler
   */
  onSecondaryClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'cta'
   */
  'data-testid'?: string;
}

/**
 * CTA component that supports Context API parameter inheritance
 */
export type CTAComponent = React.FC<CTAProps>;
