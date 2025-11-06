'use client';

// ═══════════════════════════════════════════════════════════════
// TABS ITEMS CONTROL - CRUD for Tabs Items
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - PHASE 2: CRUD Controls for Interactive Components
// Features:
// - Add/Remove/Edit tab items
// - Drag & drop to reorder
// - Label, content, and icon editing
// - Real-time updates
// ═══════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { ItemsEditor } from './ItemsEditor';

interface TabsItemsControlProps {
  componentId: string;
}

interface TabItem {
  id: string;
  label: string;
  content: string;
  icon?: string;
  [key: string]: unknown;
}

export function TabsItemsControl({ componentId }: TabsItemsControlProps) {
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

  // Default tabs
  const defaultTabs: TabItem[] = [
    { id: 'tab-1', label: 'Tab 1', content: 'Content for tab 1', icon: '📄' },
    { id: 'tab-2', label: 'Tab 2', content: 'Content for tab 2', icon: '📝' },
    { id: 'tab-3', label: 'Tab 3', content: 'Content for tab 3', icon: '📋' },
  ];

  const [tabs, setTabs] = useState<TabItem[]>(() => {
    if (!component) return defaultTabs;
    const currentTabs = component.props.tabs as TabItem[] | undefined;
    return currentTabs && currentTabs.length > 0 ? currentTabs : defaultTabs;
  });

  // Sync with component changes
  useEffect(() => {
    if (!component) return;
    const currentTabs = component.props.tabs as TabItem[] | undefined;
    if (currentTabs && currentTabs.length > 0) {
      setTabs(currentTabs);
    }
  }, [component]);

  // Handle tabs change
  const handleTabsChange = (newTabs: TabItem[]) => {
    setTabs(newTabs);
    updateComponentProps(componentId, { tabs: newTabs });
  };

  // Render tab editor
  const renderTabEditor = (
    tab: TabItem,
    onChange: (updates: Partial<TabItem>) => void
  ) => {
    return (
      <div className="space-y-3">
        {/* Label */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Tab Label</label>
          <input
            type="text"
            value={tab.label}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="Enter tab label..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Icon (optional) */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">
            Icon (optional)
          </label>
          <input
            type="text"
            value={tab.icon || ''}
            onChange={(e) => onChange({ icon: e.target.value || undefined })}
            placeholder="Emoji or text (e.g., 📄)"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Use emoji or leave empty
          </p>
        </div>

        {/* Content */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Content</label>
          <textarea
            value={tab.content}
            onChange={(e) => onChange({ content: e.target.value })}
            placeholder="Enter tab content..."
            rows={4}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>
      </div>
    );
  };

  return (
    <ItemsEditor
      items={tabs}
      onItemsChange={handleTabsChange}
      itemTemplate={{ label: 'New Tab', content: 'Tab content goes here...', icon: '📄' }}
      renderItemEditor={renderTabEditor}
      itemLabel="Tab"
    />
  );
}
