/**
 * Link Component Types
 * God-Tier Development Protocol 2025
 */


/**
 * Link sizes matching the size scale
 */
export type LinkSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Link variants
 */
export type LinkVariant = 'default' | 'primary' | 'secondary' | 'muted' | 'underline';

/**
 * Link Props
 *
 * @example Basic usage
 * ```tsx
 * <Link href="/about">About Us</Link>
 * ```
 *
 * @example With Context API
 * ```tsx
 * <AtomProvider value={{ size: 'lg', variant: 'primary' }}>
 *   <Link href="/home">Home</Link>
 * </AtomProvider>
 * ```
 *
 * @example External link
 * ```tsx
 * <Link href="https://example.com" external>
 *   External Site
 * </Link>
 * ```
 */
export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'size'> {
  /**
   * Link destination (required)
   */
  href: string;

  /**
   * Link size
   * @default 'md'
   */
  size?: LinkSize;

  /**
   * Link variant/style
   * @default 'default'
   */
  variant?: LinkVariant;

  /**
   * Open in new tab
   * @default false
   */
  external?: boolean;

  /**
   * Show external icon
   * @default false (true if external is true)
   */
  showIcon?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Link content (required)
   */
  children: React.ReactNode;

  /**
   * Test ID for testing
   * @default 'link'
   */
  'data-testid'?: string;
}

/**
 * Link component that supports Context API parameter inheritance
 */
export type LinkComponent = React.FC<LinkProps>;
