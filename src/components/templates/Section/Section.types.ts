/**
 * Section Component Types (Template)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Section template component
 */

import type { SectionParameters } from '@/types/parameters';

/**
 * Background variants for Section
 */
export type SectionBackground = 'none' | 'light' | 'dark' | 'primary' | 'gradient';

/**
 * Padding presets for Section
 */
export type SectionPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Section Props
 *
 * A content section component with padding, background color/image, and overlay support
 *
 * @example Basic section
 * ```tsx
 * <Section background="light" padding="lg">
 *   <Heading>Features</Heading>
 *   <FeatureList />
 * </Section>
 * ```
 *
 * @example Section with background image
 * ```tsx
 * <Section
 *   backgroundImage="/hero-bg.jpg"
 *   overlay={true}
 *   overlayOpacity={0.7}
 *   padding="xl"
 * >
 *   <Hero />
 * </Section>
 * ```
 *
 * @example Gradient section
 * ```tsx
 * <Section background="gradient" padding="lg">
 *   <CallToAction />
 * </Section>
 * ```
 */
export interface SectionProps extends Partial<SectionParameters> {
  /**
   * Background variant
   * @default 'none'
   */
  background?: SectionBackground;

  /**
   * Background image URL
   */
  backgroundImage?: string;

  /**
   * Vertical padding
   * @default 'md'
   */
  padding?: SectionPadding;

  /**
   * Full-width section (ignores container max-width)
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Enable overlay for background images
   * @default false
   */
  overlay?: boolean;

  /**
   * Overlay opacity (0-1)
   * @default 0.5
   */
  overlayOpacity?: number;

  /**
   * Overlay color
   * @default 'rgba(0, 0, 0, 0.5)'
   */
  overlayColor?: string;

  /**
   * Section children (required)
   */
  children: React.ReactNode;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'section'
   */
  'data-testid'?: string;

  /**
   * Polymorphic element type
   * @default 'section'
   */
  as?: 'section' | 'div' | 'article';
}

/**
 * Section component that supports Context API parameter inheritance
 */
export type SectionComponent = React.FC<SectionProps>;
