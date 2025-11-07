/**
 * GoogleMaps Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for GoogleMaps organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * GoogleMaps Props
 *
 * @description Google Maps embed component
 * @composition iframe embed
 *
 * @example
 * ```tsx
 * <GoogleMaps
 *   // Add your props here
 * />
 * ```
 */
export interface GoogleMapsProps extends OrganismParameters {
  /**
   * Component data (customize based on needs)
   */
  data?: Record<string, any>;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'google-maps'
   */
  'data-testid'?: string;
}

/**
 * GoogleMaps component that supports Context API parameter inheritance
 */
export type GoogleMapsComponent = React.FC<GoogleMapsProps>;
