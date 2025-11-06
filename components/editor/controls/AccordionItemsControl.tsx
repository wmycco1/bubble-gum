'use client';

// ═══════════════════════════════════════════════════════════════
// ACCORDION ITEMS CONTROL - CRUD for Accordion Items
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - PHASE 2: CRUD Controls for Interactive Components
// Features:
// - Add/Remove/Edit accordion items
// - Drag & drop to reorder
// - Title and content editing
// - Real-time updates
// ═══════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { ItemsEditor } from './ItemsEditor';

interface AccordionItemsControlProps {
  componentId: string;
}

interface AccordionItem {
  id: string;
  title: string;
  content: string;
  [key: string]: unknown;
}

export function AccordionItemsControl({ componentId }: AccordionItemsControlProps) {
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

  // Default items
  const defaultItems: AccordionItem[] = [
    { id: 'item-1', title: 'Accordion Item 1', content: 'Content for item 1' },
    { id: 'item-2', title: 'Accordion Item 2', content: 'Content for item 2' },
    { id: 'item-3', title: 'Accordion Item 3', content: 'Content for item 3' },
  ];

  const [items, setItems] = useState<AccordionItem[]>(() => {
    if (!component) return defaultItems;
    const currentItems = component.props.items as AccordionItem[] | undefined;
    return currentItems && currentItems.length > 0 ? currentItems : defaultItems;
  });

  // Sync with component changes
  useEffect(() => {
    if (!component) return;
    const currentItems = component.props.items as AccordionItem[] | undefined;
    if (currentItems && currentItems.length > 0) {
      setItems(currentItems);
    }
  }, [component]);

  // Handle items change
  const handleItemsChange = (newItems: AccordionItem[]) => {
    console.log('🔄 AccordionItemsControl: Updating items', {
      componentId,
      newItems,
      itemsCount: newItems.length
    });
    setItems(newItems);
    updateComponentProps(componentId, { items: newItems });
    console.log('✅ AccordionItemsControl: updateComponentProps called');
  };

  // Render item editor
  const renderItemEditor = (
    item: AccordionItem,
    onChange: (updates: Partial<AccordionItem>) => void
  ) => {
    return (
      <div className="space-y-3">
        {/* Title */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Title</label>
          <input
            type="text"
            value={item.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Enter title..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Content</label>
          <textarea
            value={item.content}
            onChange={(e) => onChange({ content: e.target.value })}
            placeholder="Enter content..."
            rows={4}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>
      </div>
    );
  };

  return (
    <ItemsEditor
      items={items}
      onItemsChange={handleItemsChange}
      itemTemplate={{ title: 'New Item', content: 'Content goes here...' }}
      renderItemEditor={renderItemEditor}
      itemLabel="Accordion Item"
    />
  );
}
