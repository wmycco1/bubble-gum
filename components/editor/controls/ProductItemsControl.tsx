'use client';

// ═══════════════════════════════════════════════════════════════
// PRODUCT ITEMS CONTROL - CRUD for Product Lists
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - E-commerce Component Controls
// Features:
// - Add/Remove/Edit product items
// - Drag & drop to reorder
// - Name, price, image editing
// - Real-time updates
// ═══════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { ItemsEditor } from './ItemsEditor';
import { logger } from '@/lib/utils/logger';

interface ProductItemsControlProps {
  componentId: string;
}

interface ProductItem {
  id: string;
  name: string;
  price: number;
  image: string;
  [key: string]: unknown;
}

export function ProductItemsControl({ componentId }: ProductItemsControlProps) {
  const components = useCanvasStore((state) => state.components);
  const updateComponentProps = useCanvasStore((state) => state.updateComponentProps);

  // Find current component
  const findComponent = (comps: typeof components, id: string): typeof components[0] | null => {
    for (const comp of comps) {
      if (comp.id === id) return comp;
      if (comp.children) {
        const found = findComponent(comp.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const component = findComponent(components, componentId);

  // Default mock products
  const defaultItems: ProductItem[] = [
    {
      id: 'product-1',
      name: 'Premium Wireless Headphones',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
    },
    {
      id: 'product-2',
      name: 'Smart Watch Series 5',
      price: 449.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
    },
    {
      id: 'product-3',
      name: 'Designer Sunglasses',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'
    },
    {
      id: 'product-4',
      name: 'Leather Backpack',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
    }
  ];

  const [items, setItems] = useState<ProductItem[]>(() => {
    if (!component) return defaultItems;
    const currentItems = component.props.products as ProductItem[] | undefined;
    return currentItems && currentItems.length > 0 ? currentItems : defaultItems;
  });

  // Sync with component changes
  useEffect(() => {
    if (!component) return;
    const currentItems = component.props.products as ProductItem[] | undefined;
    if (currentItems && currentItems.length > 0) {
      setItems(currentItems);
    }
  }, [component]);

  // Handle items change
  const handleItemsChange = (newItems: ProductItem[]) => {
    logger.debug('🔄 ProductItemsControl: Updating products', {
      componentId,
      newItems,
      itemsCount: newItems.length
    });
    setItems(newItems);
    updateComponentProps(componentId, { products: newItems });
    logger.debug('✅ ProductItemsControl: updateComponentProps called');
  };

  // Render item editor
  const renderItemEditor = (
    item: ProductItem,
    onChange: (updates: Partial<ProductItem>) => void
  ) => {
    return (
      <div className="space-y-3">
        {/* Product Name */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Product Name</label>
          <input
            type="text"
            value={item.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Enter product name..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Price ($)</label>
          <input
            type="number"
            value={item.price}
            onChange={(e) => onChange({ price: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Image URL</label>
          <input
            type="url"
            value={item.image}
            onChange={(e) => onChange({ image: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image Preview */}
        {item.image && (
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1 block">Preview</label>
            <div className="relative w-full h-32 bg-slate-100 rounded-md overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <ItemsEditor
      items={items}
      onItemsChange={handleItemsChange}
      itemTemplate={{
        name: 'New Product',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
      }}
      renderItemEditor={renderItemEditor}
      itemLabel="Product"
    />
  );
}
