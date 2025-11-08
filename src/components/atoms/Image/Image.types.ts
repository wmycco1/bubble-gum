/**
 * Image Component Types
 * God-Tier Development Protocol 2025
 */


/**
 * Image sizes for consistent scaling
 */
export type ImageSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Image fit modes (matching CSS object-fit)
 */
export type ImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

/**
 * Image aspect ratios
 */
export type ImageAspectRatio = 'square' | 'video' | '4/3' | '3/2' | '16/9' | '21/9';

/**
 * Image Props
 *
 * @example Basic usage
 * ```tsx
 * <Image src="/photo.jpg" alt="Description" />
 * ```
 *
 * @example With Context API
 * ```tsx
 * <AtomProvider value={{ size: 'lg' }}>
 *   <Image src="/photo.jpg" alt="Large photo" />
 * </AtomProvider>
 * ```
 *
 * @example With aspect ratio
 * ```tsx
 * <Image
 *   src="/photo.jpg"
 *   alt="Photo"
 *   aspectRatio="16/9"
 *   fit="cover"
 * />
 * ```
 */
export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'size'> {
  /**
   * Image source URL (required)
   */
  src: string;

  /**
   * Alternative text for accessibility (required)
   */
  alt: string;

  /**
   * Image size
   * @default 'full'
   */
  size?: ImageSize;

  /**
   * How image should be fitted in container
   * @default 'cover'
   */
  fit?: ImageFit;

  /**
   * Aspect ratio constraint
   */
  aspectRatio?: ImageAspectRatio;

  /**
   * Apply rounded corners
   * @default false
   */
  rounded?: boolean;

  /**
   * Loading strategy
   * @default 'lazy'
   */
  loading?: 'lazy' | 'eager';

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'image'
   */
  'data-testid'?: string;
}

/**
 * Image component that supports Context API parameter inheritance
 */
export type ImageComponent = React.FC<ImageProps>;
