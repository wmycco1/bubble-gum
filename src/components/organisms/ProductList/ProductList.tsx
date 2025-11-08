/**
 * ProductList Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * A versatile product listing component for e-commerce with grid/list layouts,
 * filtering, sorting, and pagination. Composed of Card organisms.
 *
 * @example Basic grid
 * ```tsx
 * <ProductList
 *   products={products}
 *   layout="grid-3"
 * />
 * ```
 *
 * @example With controls
 * ```tsx
 * <ProductList
 *   products={products}
 *   showFilters={true}
 *   showSort={true}
 *   pagination={true}
 * />
 * ```
 */

'use client';

import React, { useState } from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { Card } from '../Card';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import type { ProductListProps } from './ProductList.types';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import styles from './ProductList.module.css';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';

export const ProductList: React.FC<ProductListProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as ProductListProps;

  // Destructure with defaults
  const {
    products,
    layout = 'grid-3',
    columns,
    showFilters = false,
    showSort = false,
    showViewToggle = false,
    pagination = false,
    itemsPerPage = 12,
    currentPage = 1,
    onProductClick,
    onPageChange,
    onFilterChange,
    onSortChange,
    loading = false,
    emptyMessage = 'No products found',
    className = '',
    'data-testid': testId = 'product-list',
    style,
    ...rest
  } = params;

  // Local state
  const [view, setView] = useState<'grid' | 'list'>(layout === 'list' ? 'list' : 'grid');

  // Compute CSS classes
  const classes = [
    styles['product-list'],
    styles[`product-list--${view}`],
    columns ? styles[`product-list--columns-${columns}`] : styles[`product-list--${layout}`],
    loading && styles['product-list--loading'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Handle product click
  const handleProductClick = (productId: string) => {
    onProductClick?.(productId);
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = pagination ? products.slice(startIndex, endIndex) : products;
  const totalPages = pagination ? Math.ceil(products.length / itemsPerPage) : 1;

  // Loading state
  if (loading) {
    return (
      <div className={styles['product-list-loading']} data-testid={`${testId}-loading`}>
        <div className={styles['loading-spinner']} />
        <p>Loading products...</p>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className={styles['product-list-empty']} data-testid={`${testId}-empty`}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <div
      className={styles['product-list-wrapper']}
      style={style as React.CSSProperties}
      data-testid={testId}
      {...validDOMProps}
    >
      {/* Controls */}
      {(showFilters || showSort || showViewToggle) && (
        <div className={styles['product-list-controls']} data-testid={`${testId}-controls`}>
          {showFilters && (
            <button
              className={styles['control-button']}
              onClick={() => onFilterChange?.({})}
              data-testid={`${testId}-filter-button`}
            >
              Filters
            </button>
          )}

          {showSort && (
            <select
              className={styles['control-select']}
              onChange={(e) => onSortChange?.(e.target.value)}
              data-testid={`${testId}-sort-select`}
            >
              <option value="default">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name</option>
              <option value="newest">Newest</option>
            </select>
          )}

          {showViewToggle && (
            <div className={styles['view-toggle']} data-testid={`${testId}-view-toggle`}>
              <button
                className={view === 'grid' ? styles['active'] : ''}
                onClick={() => setView('grid')}
                aria-label="Grid view"
              >
                Grid
              </button>
              <button
                className={view === 'list' ? styles['active'] : ''}
                onClick={() => setView('list')}
                aria-label="List view"
              >
                List
              </button>
            </div>
          )}
        </div>
      )}

      {/* Product Grid/List */}
      <div className={classes} data-testid={`${testId}-grid`}>
        {displayedProducts.map((product) => (
          <Card
            key={product.id}
            image={product.image}
            imageAlt={product.title}
            title={product.title}
            description={product.description}
            badges={product.badges}
            href={product.href}
            ctaText="View Details"
            onCardClick={() => handleProductClick(product.id)}
            footer={
              <div className={styles['product-footer']}>
                <div className={styles['product-price']}>
                  {product.salePrice ? (
                    <>
                      <span className={styles['price-original']}>${product.price}</span>
                      <span className={styles['price-sale']}>${product.salePrice}</span>
                    </>
                  ) : (
                    <span>${product.price}</span>
                  )}
                </div>
                {product.rating && (
                  <div className={styles['product-rating']}>
                    {'★'.repeat(Math.round(product.rating))}
                  </div>
                )}
              </div>
            }
            data-testid={`${testId}-product-${product.id}`}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className={styles['product-list-pagination']} data-testid={`${testId}-pagination`}>
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className={styles['pagination-info']}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Display name for React DevTools
ProductList.displayName = 'ProductList';

// Default export for convenience
export default ProductList;
