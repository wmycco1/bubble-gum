'use client';

// ═══════════════════════════════════════════════════════════════
// BREADCRUMB ITEMS CONTROL - CRUD for Breadcrumb Component
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - Manage breadcrumb navigation items
// Features:
// - Add/Remove/Edit breadcrumb items
// - Drag & drop to reorder
// - Label and href editing
// - Visual breadcrumb trail preview
// - Real-time updates
// ═══════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { ItemsEditor } from './ItemsEditor';
import { logger } from '@/lib/utils/logger';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItemsControlProps {
  componentId: string;
}

interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  [key: string]: unknown;
}

export function BreadcrumbItemsControl({ componentId }: BreadcrumbItemsControlProps) {
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

  // Default breadcrumb items
  const defaultItems: BreadcrumbItem[] = [
    { id: 'breadcrumb-1', label: 'Home', href: '/' },
    { id: 'breadcrumb-2', label: 'Products', href: '/products' },
    { id: 'breadcrumb-3', label: 'Category', href: '/products/category' },
    { id: 'breadcrumb-4', label: 'Current Page' } // Last item usually no href
  ];

  const [items, setItems] = useState<BreadcrumbItem[]>(() => {
    if (!component) return defaultItems;
    const currentItems = component.props.items as BreadcrumbItem[] | undefined;
    return currentItems && currentItems.length > 0 ? currentItems : defaultItems;
  });

  // Sync with component changes
  useEffect(() => {
    if (!component) return;
    const currentItems = component.props.items as BreadcrumbItem[] | undefined;
    if (currentItems && currentItems.length > 0) {
      setItems(currentItems);
    }
  }, [component]);

  // Handle items change
  const handleItemsChange = (newItems: BreadcrumbItem[]) => {
    logger.debug('🔄 BreadcrumbItemsControl: Updating items', {
      componentId,
      newItems,
      itemsCount: newItems.length
    });
    setItems(newItems);
    updateComponentProps(componentId, { items: newItems });
    logger.debug('✅ BreadcrumbItemsControl: updateComponentProps called');
  };

  // Render item editor
  const renderItemEditor = (
    item: BreadcrumbItem,
    onChange: (updates: Partial<BreadcrumbItem>) => void
  ) => {
    return (
      <div className="space-y-4">
        {/* Label */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Label</label>
          <input
            type="text"
            value={item.label}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="Page name..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Link (optional) */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">
            Link (optional)
          </label>
          <input
            type="text"
            value={item.href || ''}
            onChange={(e) => onChange({ href: e.target.value })}
            placeholder="/page-url or leave empty for current page"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            💡 Tip: Leave empty for the last item (current page)
          </p>
        </div>

        {/* Preview */}
        <div className="bg-slate-50 p-3 rounded border border-slate-200">
          <p className="text-xs font-medium text-slate-700 mb-2">Preview:</p>
          <div className="flex items-center gap-2">
            {item.href ? (
              <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                {item.label}
              </span>
            ) : (
              <span className="text-sm text-slate-900 font-medium">
                {item.label}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Visual Breadcrumb Preview */}
      <div className="bg-blue-50 p-3 rounded border border-blue-200">
        <p className="text-xs font-medium text-blue-900 mb-2">🧭 Breadcrumb Trail:</p>
        <div className="flex items-center flex-wrap gap-2">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <span
                className={`text-xs ${
                  item.href ? 'text-blue-600' : 'text-slate-900 font-medium'
                }`}
              >
                {item.label}
              </span>
              {index < items.length - 1 && (
                <ChevronRight className="w-3 h-3 text-slate-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      <ItemsEditor
        items={items}
        onItemsChange={handleItemsChange}
        itemTemplate={{
          label: 'New Page',
          href: '/new-page'
        }}
        renderItemEditor={renderItemEditor}
        itemLabel="Breadcrumb Item"
      />

      <div className="bg-slate-50 p-3 rounded border border-slate-200">
        <p className="text-xs text-slate-600">
          <strong>Best Practices:</strong>
        </p>
        <ul className="text-xs text-slate-600 mt-1 space-y-1 list-disc list-inside">
          <li>Start with "Home" as the first item</li>
          <li>Keep labels short and descriptive (2-3 words max)</li>
          <li>Last item is usually the current page (no link)</li>
          <li>Use 3-5 items for optimal UX</li>
        </ul>
      </div>
    </div>
  );
}
