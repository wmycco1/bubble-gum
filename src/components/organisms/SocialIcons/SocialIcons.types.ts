/**
 * SocialIcons Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for SocialIcons organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * SocialIcons Props
 *
 * @description Social media icon links grid
 * @composition Link + Icon atoms
 *
 * @example
 * ```tsx
 * <SocialIcons
 *   // Add your props here
 * />
 * ```
 */
export interface SocialIconsProps extends OrganismParameters {
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
   * @default 'social-icons'
   */
  'data-testid'?: string;
}

/**
 * SocialIcons component that supports Context API parameter inheritance
 */
export type SocialIconsComponent = React.FC<SocialIconsProps>;
