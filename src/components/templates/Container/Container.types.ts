/**
 * Container Component Types (Template)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Container template component
 */

import type { ContainerParameters } from '@/types/parameters';

/**
 * Max-width presets for Container
 */
export type ContainerMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

/**
 * Padding presets for Container
 */
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Container Props
 *
 * A max-width wrapper component for page content with responsive behavior
 *
 * @example Basic container
 * ```tsx
 * <Container maxWidth="lg">
 *   <Hero />
 *   <Features />
 * </Container>
 * ```
 *
 * @example Full-width container
 * ```tsx
 * <Container maxWidth="full" padding="none">
 *   <HeroSection />
 * </Container>
 * ```
 *
 * @example Centered container with custom padding
 * ```tsx
 * <Container
 *   maxWidth="xl"
 *   padding="lg"
 *   centerContent={true}
 * >
 *   <Content />
 * </Container>
 * ```
 */
export interface ContainerProps extends Partial<ContainerParameters> {
  /**
   * Maximum width of container
   * @default 'lg'
   */
  maxWidth?: ContainerMaxWidth;

  /**
   * Horizontal padding
   * @default 'md'
   */
  padding?: ContainerPadding;

  /**
   * Center content horizontally
   * @default true
   */
  centerContent?: boolean;

  /**
   * Container children (required)
   */
  children: React.ReactNode;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'container'
   */
  'data-testid'?: string;

  /**
   * Polymorphic element type
   * @default 'div'
   */
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'nav';
}

/**
 * Container component that supports Context API parameter inheritance
 */
export type ContainerComponent = React.FC<ContainerProps>;
