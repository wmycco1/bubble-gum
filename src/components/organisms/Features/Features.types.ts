/**
 * Features Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Features organism component
 */

import type { OrganismParameters } from '@/types/parameters';
import type { IconColor, IconSize } from '@/components/atoms/Icon/Icon.types';

/**
 * Single feature item
 */
export interface Feature {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Icon (emoji or icon name)
   */
  icon: string;

  /**
   * Feature title
   */
  title: string;

  /**
   * Feature description
   */
  description: string;
}

/**
 * Features layout options
 */
export type FeaturesLayout = 'grid-2' | 'grid-3' | 'grid-4' | 'list';

/**
 * Features Props
 *
 * @example Basic features grid
 * ```tsx
 * <Features
 *   features={[
 *     { id: '1', icon: '🚀', title: 'Fast', description: 'Lightning speed' },
 *     { id: '2', icon: '🔒', title: 'Secure', description: 'Enterprise security' }
 *   ]}
 * />
 * ```
 *
 * @example With section header
 * ```tsx
 * <Features
 *   sectionTitle="Why Choose Us"
 *   sectionDescription="Discover our key features"
 *   features={features}
 *   layout="grid-3"
 * />
 * ```
 *
 * @example Grid with 4 columns
 * ```tsx
 * <Features
 *   features={features}
 *   layout="grid-4"
 *   iconColor="primary"
 *   iconSize="lg"
 * />
 * ```
 */
export interface FeaturesProps extends OrganismParameters {
  /**
   * Section title (optional)
   */
  sectionTitle?: string;

  /**
   * Section description (optional)
   */
  sectionDescription?: string;

  /**
   * Array of features (required)
   */
  features: Feature[];

  /**
   * Layout variant
   * @default 'grid-3'
   */
  layout?: FeaturesLayout;

  /**
   * Icon size
   * @default 'md'
   */
  iconSize?: IconSize;

  /**
   * Icon color
   * @default 'primary'
   */
  iconColor?: IconColor;

  /**
   * Number of columns (responsive)
   * @default 3
   */
  columns?: number;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'features'
   */
  'data-testid'?: string;
}

/**
 * Features component that supports Context API parameter inheritance
 */
export type FeaturesComponent = React.FC<FeaturesProps>;
