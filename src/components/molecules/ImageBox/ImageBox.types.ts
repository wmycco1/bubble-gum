/**
 * ImageBox Types
 * God-Tier Development Protocol 2025
 *
 * Type-safe props for ImageBox Molecule component
 */

import type { ReactNode } from 'react';
import type { ImageSize, ImageFit, ImageAspectRatio } from '@/components/atoms/Image/Image.types';
import type { TextSize, TextColor, TextAlign } from '@/components/atoms/Text/Text.types';

/**
 * ImageBox size variants
 */
export type ImageBoxSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * ImageBox component props
 *
 * Molecule component that composes Image and Text atoms
 * to create image cards with optional captions.
 *
 * @example Basic usage
 * ```tsx
 * <ImageBox
 *   src="/photo.jpg"
 *   alt="Beautiful landscape"
 *   caption="A stunning mountain view at sunset"
 * />
 * ```
 *
 * @example With custom styling
 * ```tsx
 * <ImageBox
 *   src="/product.jpg"
 *   alt="Product image"
 *   caption="Premium leather bag"
 *   size="lg"
 *   aspectRatio="square"
 *   rounded
 * />
 * ```
 *
 * @example Without caption
 * ```tsx
 * <ImageBox
 *   src="/banner.jpg"
 *   alt="Banner"
 *   aspectRatio="16/9"
 *   fit="cover"
 * />
 * ```
 */
export interface ImageBoxProps {
  /**
   * Image source URL
   * @required
   */
  src: string;

  /**
   * Alternative text for accessibility
   * @required
   */
  alt: string;

  /**
   * Optional caption text
   */
  caption?: string;

  /**
   * Size variant
   * @default 'md'
   */
  size?: ImageBoxSize;

  /**
   * Image size
   * @default 'full'
   */
  imageSize?: ImageSize;

  /**
   * Image fit mode
   * @default 'cover'
   */
  fit?: ImageFit;

  /**
   * Aspect ratio constraint
   */
  aspectRatio?: ImageAspectRatio;

  /**
   * Apply rounded corners to image
   * @default false
   */
  rounded?: boolean;

  /**
   * Caption text size
   * @default 'sm'
   */
  captionSize?: TextSize;

  /**
   * Caption text color
   * @default 'muted'
   */
  captionColor?: TextColor;

  /**
   * Caption alignment
   * @default 'left'
   */
  captionAlign?: TextAlign;

  /**
   * Image loading strategy
   * @default 'lazy'
   */
  loading?: 'lazy' | 'eager';

  /**
   * Custom class name
   */
  className?: string;

  /**
   * ID attribute
   */
  id?: string;

  /**
   * Accessibility label
   */
  'aria-label'?: string;

  /**
   * Accessibility description
   */
  'aria-describedby'?: string;

  /**
   * Test ID for testing
   * @default 'imagebox'
   */
  'data-testid'?: string;

  /**
   * Custom children (replaces caption if provided)
   * Allows for more complex caption content
   */
  children?: ReactNode;

  /**
   * Click handler (makes the entire box clickable)
   */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;

  /**
   * Hover effect
   * @default false
   */
  hoverable?: boolean;

  /**
   * Show border around the image box
   * @default false
   */
  showBorder?: boolean;

  /**
   * Show shadow
   * @default false
   */
  showShadow?: boolean;
}

/**
 * ImageBox component type
 */
export type ImageBoxComponent = React.FC<ImageBoxProps>;
