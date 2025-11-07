/**
 * ProductList Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for ProductList organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * Product item for display
 */
export interface Product {
  /**
   * Unique product ID
   */
  id: string;

  /**
   * Product name/title
   */
  title: string;

  /**
   * Product description
   */
  description?: string;

  /**
   * Product image URL
   */
  image: string;

  /**
   * Product price
   */
  price: number;

  /**
   * Sale/discounted price
   */
  salePrice?: number;

  /**
   * Product URL/link
   */
  href: string;

  /**
   * Product badges (New, Sale, etc.)
   */
  badges?: Array<{
    id: string;
    label: string;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  }>;

  /**
   * Stock status
   */
  stockStatus?: 'in-stock' | 'out-of-stock' | 'backorder';

  /**
   * Product rating (1-5)
   */
  rating?: number;
}

/**
 * ProductList layout options
 */
export type ProductListLayout = 'grid-2' | 'grid-3' | 'grid-4' | 'list';

/**
 * ProductList Props
 *
 * @example Basic product grid
 * ```tsx
 * <ProductList
 *   products={products}
 *   layout="grid-3"
 * />
 * ```
 *
 * @example With filters and sorting
 * ```tsx
 * <ProductList
 *   products={products}
 *   layout="grid-4"
 *   showFilters={true}
 *   showSort={true}
 *   onProductClick={(id) => navigate(`/product/${id}`)}
 * />
 * ```
 */
export interface ProductListProps extends OrganismParameters {
  /**
   * Array of products to display (required)
   */
  products: Product[];

  /**
   * Layout variant
   * @default 'grid-3'
   */
  layout?: ProductListLayout;

  /**
   * Number of columns (overrides layout)
   */
  columns?: number;

  /**
   * Show filter controls
   * @default false
   */
  showFilters?: boolean;

  /**
   * Show sort dropdown
   * @default false
   */
  showSort?: boolean;

  /**
   * Show view toggle (grid/list)
   * @default false
   */
  showViewToggle?: boolean;

  /**
   * Enable pagination
   * @default false
   */
  pagination?: boolean;

  /**
   * Items per page
   * @default 12
   */
  itemsPerPage?: number;

  /**
   * Current page
   * @default 1
   */
  currentPage?: number;

  /**
   * Product click handler
   */
  onProductClick?: (productId: string) => void;

  /**
   * Page change handler
   */
  onPageChange?: (page: number) => void;

  /**
   * Filter change handler
   */
  onFilterChange?: (filters: Record<string, any>) => void;

  /**
   * Sort change handler
   */
  onSortChange?: (sortBy: string) => void;

  /**
   * Loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Empty state message
   * @default 'No products found'
   */
  emptyMessage?: string;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'product-list'
   */
  'data-testid'?: string;
}

/**
 * ProductList component that supports Context API parameter inheritance
 */
export type ProductListComponent = React.FC<ProductListProps>;
