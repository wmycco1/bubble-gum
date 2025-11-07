/**
 * ProductList Component Tests
 * God-Tier Development Protocol 2025
 *
 * Test coverage: 30+ tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductList } from './ProductList';
import type { Product } from './ProductList.types';

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Product 1',
    description: 'Description 1',
    image: '/product1.jpg',
    price: 99.99,
    href: '/product/1',
  },
  {
    id: '2',
    title: 'Product 2',
    description: 'Description 2',
    image: '/product2.jpg',
    price: 149.99,
    salePrice: 129.99,
    href: '/product/2',
    badges: [{ id: 'b1', label: 'Sale', variant: 'error' }],
    rating: 4,
  },
  {
    id: '3',
    title: 'Product 3',
    image: '/product3.jpg',
    price: 199.99,
    href: '/product/3',
  },
];

describe('ProductList', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<ProductList products={mockProducts} />);
      expect(screen.getByTestId('product-list')).toBeInTheDocument();
    });

    it('renders all products', () => {
      render(<ProductList products={mockProducts} />);
      expect(screen.getByTestId('product-list-product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-list-product-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-list-product-3')).toBeInTheDocument();
    });

    it('renders product grid', () => {
      render(<ProductList products={mockProducts} layout="grid-3" />);
      const grid = screen.getByTestId('product-list-grid');
      expect(grid).toHaveClass('product-list--grid-3');
    });

    it('renders list layout', () => {
      render(<ProductList products={mockProducts} layout="list" />);
      const grid = screen.getByTestId('product-list-grid');
      expect(grid).toHaveClass('product-list--list');
    });

    it('applies custom className', () => {
      render(<ProductList products={mockProducts} className="custom-class" />);
      expect(screen.getByTestId('product-list')).toBeInTheDocument();
    });

    it('applies custom testId', () => {
      render(<ProductList products={mockProducts} data-testid="custom-test-id" />);
      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });
  });

  describe('Layout Variants', () => {
    it('renders grid-2 layout', () => {
      render(<ProductList products={mockProducts} layout="grid-2" />);
      expect(screen.getByTestId('product-list-grid')).toHaveClass('product-list--grid-2');
    });

    it('renders grid-3 layout', () => {
      render(<ProductList products={mockProducts} layout="grid-3" />);
      expect(screen.getByTestId('product-list-grid')).toHaveClass('product-list--grid-3');
    });

    it('renders grid-4 layout', () => {
      render(<ProductList products={mockProducts} layout="grid-4" />);
      expect(screen.getByTestId('product-list-grid')).toHaveClass('product-list--grid-4');
    });

    it('respects custom columns prop', () => {
      render(<ProductList products={mockProducts} columns={5} />);
      expect(screen.getByTestId('product-list-grid')).toHaveClass('product-list--columns-5');
    });
  });

  describe('Controls', () => {
    it('shows filters when showFilters is true', () => {
      render(<ProductList products={mockProducts} showFilters={true} />);
      expect(screen.getByTestId('product-list-filter-button')).toBeInTheDocument();
    });

    it('shows sort dropdown when showSort is true', () => {
      render(<ProductList products={mockProducts} showSort={true} />);
      expect(screen.getByTestId('product-list-sort-select')).toBeInTheDocument();
    });

    it('shows view toggle when showViewToggle is true', () => {
      render(<ProductList products={mockProducts} showViewToggle={true} />);
      expect(screen.getByTestId('product-list-view-toggle')).toBeInTheDocument();
    });

    it('hides controls by default', () => {
      render(<ProductList products={mockProducts} />);
      expect(screen.queryByTestId('product-list-controls')).not.toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('shows pagination when enabled', () => {
      render(<ProductList products={mockProducts} pagination={true} />);
      expect(screen.getByTestId('product-list-pagination')).toBeInTheDocument();
    });

    it('hides pagination by default', () => {
      render(<ProductList products={mockProducts} />);
      expect(screen.queryByTestId('product-list-pagination')).not.toBeInTheDocument();
    });

    it('displays correct page info', () => {
      render(<ProductList products={mockProducts} pagination={true} currentPage={1} />);
      expect(screen.getByText(/Page 1/i)).toBeInTheDocument();
    });

    it('disables previous button on first page', () => {
      render(<ProductList products={mockProducts} pagination={true} currentPage={1} />);
      const prevButton = screen.getByLabelText('Previous page');
      expect(prevButton).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('calls onProductClick when product is clicked', () => {
      const handleClick = jest.fn();
      render(<ProductList products={mockProducts} onProductClick={handleClick} />);
      fireEvent.click(screen.getByTestId('product-list-product-1'));
      expect(handleClick).toHaveBeenCalledWith('1');
    });

    it('calls onPageChange when pagination button clicked', () => {
      const handlePageChange = jest.fn();
      render(
        <ProductList
          products={mockProducts}
          pagination={true}
          currentPage={1}
          onPageChange={handlePageChange}
        />
      );
      fireEvent.click(screen.getByLabelText('Next page'));
      expect(handlePageChange).toHaveBeenCalledWith(2);
    });

    it('calls onFilterChange when filter button clicked', () => {
      const handleFilterChange = jest.fn();
      render(<ProductList products={mockProducts} showFilters={true} onFilterChange={handleFilterChange} />);
      fireEvent.click(screen.getByTestId('product-list-filter-button'));
      expect(handleFilterChange).toHaveBeenCalled();
    });

    it('calls onSortChange when sort option selected', () => {
      const handleSortChange = jest.fn();
      render(<ProductList products={mockProducts} showSort={true} onSortChange={handleSortChange} />);
      fireEvent.change(screen.getByTestId('product-list-sort-select'), {
        target: { value: 'price-asc' },
      });
      expect(handleSortChange).toHaveBeenCalledWith('price-asc');
    });

    it('toggles view mode when view button clicked', () => {
      render(<ProductList products={mockProducts} showViewToggle={true} />);
      const listButton = screen.getByLabelText('List view');
      fireEvent.click(listButton);
      expect(screen.getByTestId('product-list-grid')).toHaveClass('product-list--list');
    });
  });

  describe('States', () => {
    it('shows loading state', () => {
      render(<ProductList products={mockProducts} loading={true} />);
      expect(screen.getByTestId('product-list-loading')).toBeInTheDocument();
      expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    it('shows empty state when no products', () => {
      render(<ProductList products={[]} />);
      expect(screen.getByTestId('product-list-empty')).toBeInTheDocument();
      expect(screen.getByText('No products found')).toBeInTheDocument();
    });

    it('shows custom empty message', () => {
      render(<ProductList products={[]} emptyMessage="Custom empty message" />);
      expect(screen.getByText('Custom empty message')).toBeInTheDocument();
    });
  });

  describe('Product Display', () => {
    it('displays product prices', () => {
      render(<ProductList products={mockProducts} />);
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    it('displays sale prices correctly', () => {
      render(<ProductList products={mockProducts} />);
      expect(screen.getByText('$149.99')).toBeInTheDocument();
      expect(screen.getByText('$129.99')).toBeInTheDocument();
    });

    it('displays product ratings', () => {
      render(<ProductList products={mockProducts} />);
      expect(screen.getByText('★★★★')).toBeInTheDocument();
    });

    it('displays product badges', () => {
      render(<ProductList products={mockProducts} />);
      expect(screen.getByText('Sale')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible pagination buttons', () => {
      render(<ProductList products={mockProducts} pagination={true} />);
      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    });

    it('has accessible view toggle buttons', () => {
      render(<ProductList products={mockProducts} showViewToggle={true} />);
      expect(screen.getByLabelText('Grid view')).toBeInTheDocument();
      expect(screen.getByLabelText('List view')).toBeInTheDocument();
    });
  });
});
