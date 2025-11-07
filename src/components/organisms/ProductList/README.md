# ProductList Component

**Type:** Organism
**Status:** ✅ Production Ready
**Last Updated:** November 7, 2025

## Overview

A versatile product listing component for e-commerce applications featuring grid/list layouts, filtering, sorting, and pagination capabilities.

## Features

- ✅ Multiple layout options (grid-2, grid-3, grid-4, list)
- ✅ Optional filters and sorting controls
- ✅ Pagination support
- ✅ View toggle (grid/list)
- ✅ Loading and empty states
- ✅ Product cards with prices, ratings, badges
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Full accessibility (WCAG AA)
- ✅ Context API integration

## Usage

### Basic Grid

```tsx
import { ProductList } from '@/components/organisms/ProductList';

<ProductList
  products={products}
  layout="grid-3"
/>
```

### With Controls

```tsx
<ProductList
  products={products}
  layout="grid-4"
  showFilters={true}
  showSort={true}
  showViewToggle={true}
  onFilterChange={(filters) => console.log(filters)}
  onSortChange={(sortBy) => console.log(sortBy)}
/>
```

### With Pagination

```tsx
<ProductList
  products={products}
  pagination={true}
  itemsPerPage={12}
  currentPage={1}
  onPageChange={(page) => setPage(page)}
/>
```

### With Click Handlers

```tsx
<ProductList
  products={products}
  onProductClick={(id) => navigate(`/product/${id}`)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `products` | `Product[]` | **required** | Array of products to display |
| `layout` | `'grid-2' \| 'grid-3' \| 'grid-4' \| 'list'` | `'grid-3'` | Layout variant |
| `columns` | `number` | - | Custom column count (overrides layout) |
| `showFilters` | `boolean` | `false` | Show filter controls |
| `showSort` | `boolean` | `false` | Show sort dropdown |
| `showViewToggle` | `boolean` | `false` | Show grid/list toggle |
| `pagination` | `boolean` | `false` | Enable pagination |
| `itemsPerPage` | `number` | `12` | Items per page |
| `currentPage` | `number` | `1` | Current page number |
| `onProductClick` | `(id: string) => void` | - | Product click handler |
| `onPageChange` | `(page: number) => void` | - | Page change handler |
| `onFilterChange` | `(filters: any) => void` | - | Filter change handler |
| `onSortChange` | `(sortBy: string) => void` | - | Sort change handler |
| `loading` | `boolean` | `false` | Loading state |
| `emptyMessage` | `string` | `'No products found'` | Empty state message |
| `className` | `string` | - | Custom CSS class |
| `data-testid` | `string` | `'product-list'` | Test ID |

## Product Type

```typescript
interface Product {
  id: string;
  title: string;
  description?: string;
  image: string;
  price: number;
  salePrice?: number;
  href: string;
  badges?: Array<{
    id: string;
    label: string;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  }>;
  stockStatus?: 'in-stock' | 'out-of-stock' | 'backorder';
  rating?: number;
}
```

## Component Composition

- **Card** (Organism) - Individual product cards
- **Button** (Atom) - Control buttons
- **Icon** (Atom) - Icons for controls

## Accessibility

- ✅ Keyboard navigation
- ✅ ARIA labels on interactive elements
- ✅ Screen reader support
- ✅ Focus management
- ✅ Reduced motion support

## Performance

- ✅ Lazy loading of product images
- ✅ Pagination for large product lists
- ✅ Optimized re-renders with React keys
- ✅ CSS Modules for scoped styles

## Browser Support

- ✅ Chrome (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Edge (last 2 versions)

## Testing

- ✅ 30+ unit tests
- ✅ Component rendering tests
- ✅ Interaction tests
- ✅ Accessibility tests
- ✅ State management tests

## Related Components

- **Card** - Product card display
- **ProductSlider** - Product carousel
- **AddToCart** - Add to cart button
