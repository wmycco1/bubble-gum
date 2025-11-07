/**
 * Hero Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Hero organism component
 */

import type { OrganismParameters } from '@/types/parameters';
import type { ButtonVariant } from '@/types/parameters';

/**
 * Hero alignment options
 */
export type HeroAlign = 'left' | 'center' | 'right';

/**
 * Hero Props
 *
 * @example Basic hero
 * ```tsx
 * <Hero
 *   title="Welcome to Our Platform"
 *   subtitle="Build amazing products with our tools"
 *   ctaText="Get Started"
 *   ctaHref="/signup"
 * />
 * ```
 *
 * @example Hero with background image
 * ```tsx
 * <Hero
 *   title="Transform Your Business"
 *   subtitle="AI-powered solutions for modern companies"
 *   ctaText="Start Free Trial"
 *   ctaHref="/trial"
 *   ctaVariant="primary"
 *   secondaryCtaText="Learn More"
 *   secondaryCtaHref="/about"
 *   backgroundImage="/hero-bg.jpg"
 *   backgroundOverlay={true}
 *   align="center"
 *   fullHeight={true}
 * />
 * ```
 *
 * @example Minimal hero
 * ```tsx
 * <Hero
 *   title="Simple. Powerful. Effective."
 *   align="left"
 * />
 * ```
 */
export interface HeroProps extends OrganismParameters {
  /**
   * Main title (required)
   * Primary heading for the hero section
   */
  title: string;

  /**
   * Subtitle text (optional)
   * Secondary description or tagline
   */
  subtitle?: string;

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
   * Primary CTA click handler (alternative to href)
   */
  ctaOnClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

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
   * Secondary CTA click handler
   */
  secondaryCtaOnClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Background image URL
   */
  backgroundImage?: string;

  /**
   * Background gradient (CSS gradient string)
   * @example 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
   */
  backgroundGradient?: string;

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
   * Content alignment
   * @default 'center'
   */
  align?: HeroAlign;

  /**
   * Full viewport height
   * @default false
   */
  fullHeight?: boolean;

  /**
   * Minimum height (when not full height)
   * @default '500px'
   */
  minHeight?: string;

  /**
   * Side image (for split layout)
   */
  sideImage?: string;

  /**
   * Side image alt text
   */
  sideImageAlt?: string;

  /**
   * Side image position
   * @default 'right'
   */
  sideImagePosition?: 'left' | 'right';

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'hero'
   */
  'data-testid'?: string;
}

/**
 * Hero component that supports Context API parameter inheritance
 */
export type HeroComponent = React.FC<HeroProps>;
