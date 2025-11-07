/**
 * StarRating Component Types (Molecule)
 * God-Tier Development Protocol 2025
 */

import type { AtomParameters } from '@/types/parameters';

/**
 * Star size variants
 */
export type StarSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * StarRating Props
 *
 * @example Basic usage
 * ```tsx
 * <StarRating rating={3.5} />
 * ```
 *
 * @example Interactive with callback
 * ```tsx
 * <StarRating
 *   rating={4}
 *   onChange={(rating) => console.log('New rating:', rating)}
 * />
 * ```
 *
 * @example Readonly with custom max rating
 * ```tsx
 * <StarRating rating={8} maxRating={10} readonly />
 * ```
 *
 * @example With value display
 * ```tsx
 * <StarRating rating={4.5} showValue size="lg" />
 * ```
 *
 * @example With Context API
 * ```tsx
 * <AtomProvider value={{ size: 'lg' }}>
 *   <StarRating rating={3} />
 * </AtomProvider>
 * ```
 */
export interface StarRatingProps extends Partial<AtomParameters> {
  /**
   * Current rating value (0 to maxRating)
   * Supports half-stars (e.g., 3.5)
   * @default 0
   */
  rating?: number;

  /**
   * Maximum rating value
   * @default 5
   */
  maxRating?: number;

  /**
   * Whether the rating is readonly (not interactive)
   * @default false
   */
  readonly?: boolean;

  /**
   * Size of the stars
   * @default 'md'
   */
  size?: StarSize;

  /**
   * Show numeric rating value next to stars
   * @default false
   */
  showValue?: boolean;

  /**
   * Callback when rating changes (interactive mode)
   * Receives the new rating value (1-maxRating)
   */
  onChange?: (rating: number) => void;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Accessible label for screen readers
   * @default 'Star rating'
   */
  'aria-label'?: string;

  /**
   * Test ID for testing
   * @default 'star-rating'
   */
  'data-testid'?: string;

  /**
   * ID attribute
   */
  id?: string;
}

/**
 * StarRating component that supports Context API parameter inheritance
 */
export type StarRatingComponent = React.FC<StarRatingProps>;
