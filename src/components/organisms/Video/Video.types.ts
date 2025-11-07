/**
 * Video Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Video organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * Video Props
 *
 * @description Video player (YouTube/Vimeo/HTML5)
 * @composition Image (thumbnail) + Button (play)
 *
 * @example
 * ```tsx
 * <Video
 *   // Add your props here
 * />
 * ```
 */
export interface VideoProps extends OrganismParameters {
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
   * @default 'video'
   */
  'data-testid'?: string;
}

/**
 * Video component that supports Context API parameter inheritance
 */
export type VideoComponent = React.FC<VideoProps>;
