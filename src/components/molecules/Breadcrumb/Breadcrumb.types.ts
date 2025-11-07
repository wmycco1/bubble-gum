/**
 * Breadcrumb Component Types (Molecule)
 * God-Tier Development Protocol 2025
 */

import type { AtomParameters } from '@/types/parameters';

/**
 * Breadcrumb separator types
 */
export type BreadcrumbSeparator = 'slash' | 'chevron' | 'arrow';

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Display label
   */
  label: string;

  /**
   * Link URL (optional - omit for current page)
   */
  href?: string;
}

/**
 * Breadcrumb Props
 *
 * @example Basic usage
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { id: '1', label: 'Home', href: '/' },
 *     { id: '2', label: 'Products', href: '/products' },
 *     { id: '3', label: 'Category' }
 *   ]}
 * />
 * ```
 *
 * @example With custom separator
 * ```tsx
 * <Breadcrumb
 *   items={items}
 *   separator="arrow"
 * />
 * ```
 *
 * @example With Context API
 * ```tsx
 * <AtomProvider value={{ size: 'sm' }}>
 *   <Breadcrumb items={items} />
 * </AtomProvider>
 * ```
 */
export interface BreadcrumbProps extends Partial<AtomParameters> {
  /**
   * Breadcrumb items (required)
   */
  items: BreadcrumbItem[];

  /**
   * Separator style
   * @default 'chevron'
   */
  separator?: BreadcrumbSeparator;

  /**
   * Show home icon for first item
   * @default false
   */
  showHome?: boolean;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'breadcrumb'
   */
  'data-testid'?: string;
}

/**
 * Breadcrumb component that supports Context API parameter inheritance
 */
export type BreadcrumbComponent = React.FC<BreadcrumbProps>;
