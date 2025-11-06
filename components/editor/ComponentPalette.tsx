'use client';

// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - COMPONENT PALETTE (WITH CATEGORIZATION)
// ═══════════════════════════════════════════════════════════════
// Version: 4.0.0 - M3: Component categories with collapsible groups
// Changes:
// - Organized components into categories (Layout, Content, Forms, Navigation, Feedback, Overlay)
// - Collapsible category sections with localStorage persistence
// - Search/filter functionality
// - Recently used components section
// - Drag and drop support maintained
// ═══════════════════════════════════════════════════════════════

import { useState, useMemo, useEffect } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import type { ComponentType } from '@/lib/editor/types';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import { logger } from '@/lib/utils/logger';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component Data with Categories
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface ComponentItem {
  type: ComponentType;
  label: string;
  icon: string;
  description: string;
  category: 'layout' | 'content' | 'forms' | 'navigation' | 'feedback' | 'overlay' | 'interactive';
}

const componentTypes: ComponentItem[] = [
  // Layout (4)
  { type: 'Container', label: 'Container', icon: '📦', description: 'Content wrapper', category: 'layout' },
  { type: 'Section', label: 'Hero Section', icon: '🎭', description: 'Full-width hero banner', category: 'layout' },
  { type: 'Grid', label: 'Grid', icon: '🔲', description: 'Responsive grid layout', category: 'layout' },
  { type: 'Card', label: 'Card', icon: '🃏', description: 'Content card', category: 'layout' },

  // Content (5)
  { type: 'Text', label: 'Text', icon: '📝', description: 'Paragraph or heading text', category: 'content' },
  { type: 'Heading', label: 'Heading', icon: '📄', description: 'h1-h6 headings', category: 'content' },
  { type: 'Image', label: 'Image', icon: '🖼️', description: 'Image with alt text', category: 'content' },
  { type: 'Link', label: 'Link', icon: '🔗', description: 'Hyperlink', category: 'content' },
  { type: 'Icon', label: 'Icon', icon: '⭐', description: 'Lucide icons', category: 'content' },

  // Forms (5)
  { type: 'Form', label: 'Form', icon: '📋', description: 'Contact or signup form', category: 'forms' },
  { type: 'Input', label: 'Input', icon: '✏️', description: 'Text input field', category: 'forms' },
  { type: 'Textarea', label: 'Textarea', icon: '📝', description: 'Multiline text input', category: 'forms' },
  { type: 'Checkbox', label: 'Checkbox', icon: '☑️', description: 'Checkbox with label', category: 'forms' },
  { type: 'Submit', label: 'Submit Button', icon: '📤', description: 'Form submit button', category: 'forms' },

  // Navigation (4)
  { type: 'Tabs', label: 'Tabs', icon: '📑', description: 'Tabbed navigation', category: 'navigation' },
  { type: 'Accordion', label: 'Accordion', icon: '🎵', description: 'Collapsible panels', category: 'navigation' },
  { type: 'Breadcrumb', label: 'Breadcrumb', icon: '🗺️', description: 'Navigation trail', category: 'navigation' },
  { type: 'Carousel', label: 'Carousel', icon: '🎠', description: 'Image carousel', category: 'navigation' },

  // Feedback (5)
  { type: 'Alert', label: 'Alert', icon: '🚨', description: 'Alert message', category: 'feedback' },
  { type: 'Progress', label: 'Progress Bar', icon: '📊', description: 'Progress indicator', category: 'feedback' },
  { type: 'Counter', label: 'Counter', icon: '🔢', description: 'Numeric counter', category: 'feedback' },
  { type: 'Badge', label: 'Badge', icon: '🏷️', description: 'Status badge', category: 'feedback' },
  { type: 'Divider', label: 'Divider', icon: '➖', description: 'Content separator', category: 'feedback' },

  // Overlay (2)
  { type: 'Modal', label: 'Modal', icon: '🪟', description: 'Dialog window', category: 'overlay' },
  { type: 'Tooltip', label: 'Tooltip', icon: '💬', description: 'Contextual help', category: 'overlay' },

  // Interactive (1)
  { type: 'Button', label: 'Button', icon: '🔘', description: 'Call-to-action button', category: 'interactive' },
];

const categories = [
  { id: 'layout', label: 'Layout', icon: '📐', description: 'Structural components' },
  { id: 'content', label: 'Content', icon: '📄', description: 'Text and media' },
  { id: 'forms', label: 'Forms', icon: '📋', description: 'Input components' },
  { id: 'navigation', label: 'Navigation', icon: '🧭', description: 'Navigation elements' },
  { id: 'feedback', label: 'Feedback', icon: '💬', description: 'User feedback' },
  { id: 'overlay', label: 'Overlay', icon: '🪟', description: 'Modals and popovers' },
  { id: 'interactive', label: 'Interactive', icon: '🎯', description: 'Action components' },
] as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Draggable Component Item
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function DraggableComponentItem({
  type,
  label,
  icon,
  description,
  onAdd,
}: {
  type: ComponentType;
  label: string;
  icon: string;
  description: string;
  onAdd: (type: ComponentType) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: {
      type,
      dragType: 'palette',
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = () => {
    onAdd(type);
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className="group flex w-full items-start gap-2 rounded-md border border-slate-200 bg-white p-2 text-left transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm cursor-grab active:cursor-grabbing"
      title={`${description} - Click to add or drag to canvas`}
    >
      <span className="text-lg flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-slate-900 group-hover:text-slate-700">
          {label}
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{description}</div>
      </div>
    </button>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Collapsible Category Section
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function CategorySection({
  label,
  icon,
  components,
  isOpen,
  onToggle,
  onAddComponent,
}: {
  label: string;
  icon: string;
  components: ComponentItem[];
  isOpen: boolean;
  onToggle: () => void;
  onAddComponent: (type: ComponentType) => void;
}) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      {/* Category Header */}
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-3 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <div>
            <div className="text-xs font-semibold text-slate-900">{label}</div>
            <div className="text-[10px] text-slate-500">{components.length} components</div>
          </div>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {/* Category Content */}
      {isOpen && (
        <div className="p-2 border-t border-slate-100 bg-slate-50/50 space-y-1">
          {components.map((comp) => (
            <DraggableComponentItem
              key={comp.type}
              type={comp.type}
              label={comp.label}
              icon={comp.icon}
              description={comp.description}
              onAdd={onAddComponent}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Component Palette
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const STORAGE_KEY = 'bubble-gum-palette-state';

export function ComponentPalette() {
  const addComponent = useCanvasStore((state) => state.addComponent);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Category collapse state (localStorage persisted)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return new Set(parsed.collapsedCategories || []);
      }
    } catch (error) {
      console.error('Failed to load palette state:', error);
    }
    return new Set();
  });

  // Recently used components (localStorage persisted)
  const [recentlyUsed, setRecentlyUsed] = useState<ComponentType[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.recentlyUsed || [];
      }
    } catch (error) {
      console.error('Failed to load palette state:', error);
    }
    return [];
  });

  // Save state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          collapsedCategories: Array.from(collapsedCategories),
          recentlyUsed,
        })
      );
    } catch (error) {
      console.error('Failed to save palette state:', error);
    }
  }, [collapsedCategories, recentlyUsed]);

  // Toggle category
  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Handle component add (track recently used)
  const handleAddComponent = (type: ComponentType) => {
    addComponent(type);

    // Update recently used (max 5 items)
    setRecentlyUsed((prev) => {
      const filtered = prev.filter((t) => t !== type);
      return [type, ...filtered].slice(0, 5);
    });

    logger.debug('➕ Added component:', { value: type });
  };

  // Filter components by search query
  const filteredComponents = useMemo(() => {
    if (!searchQuery) return componentTypes;

    const query = searchQuery.toLowerCase();
    return componentTypes.filter(
      (comp) =>
        comp.label.toLowerCase().includes(query) ||
        comp.description.toLowerCase().includes(query) ||
        comp.type.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group components by category
  const componentsByCategory = useMemo(() => {
    return categories.map((cat) => ({
      ...cat,
      components: filteredComponents.filter((comp) => comp.category === cat.id),
    }));
  }, [filteredComponents]);

  // Get recently used component items
  const recentComponents = useMemo(() => {
    return recentlyUsed
      .map((type) => componentTypes.find((c) => c.type === type))
      .filter((c): c is ComponentItem => c !== undefined);
  }, [recentlyUsed]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 bg-white">
        <h2 className="text-sm font-semibold text-slate-900 mb-2">Components</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search components..."
            className="w-full pl-8 pr-7 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Recently Used */}
        {!searchQuery && recentComponents.length > 0 && (
          <div className="border border-blue-200 rounded-lg overflow-hidden bg-blue-50/30">
            <div className="p-2 border-b border-blue-100 bg-blue-50">
              <div className="text-xs font-semibold text-blue-900">⏱️ Recently Used</div>
            </div>
            <div className="p-2 space-y-1">
              {recentComponents.map((comp) => (
                <DraggableComponentItem
                  key={comp.type}
                  type={comp.type}
                  label={comp.label}
                  icon={comp.icon}
                  description={comp.description}
                  onAdd={handleAddComponent}
                />
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {componentsByCategory.map((cat) => {
          if (cat.components.length === 0) return null;

          return (
            <CategorySection
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              components={cat.components}
              isOpen={!collapsedCategories.has(cat.id)}
              onToggle={() => toggleCategory(cat.id)}
              onAddComponent={handleAddComponent}
            />
          );
        })}

        {/* No results */}
        {filteredComponents.length === 0 && (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">🔍</div>
            <div className="text-sm text-slate-600">No components found</div>
            <div className="text-xs text-slate-500 mt-1">Try a different search term</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <div className="text-[10px] text-slate-500 text-center">
          {componentTypes.length} components • {categories.length} categories
        </div>
      </div>
    </div>
  );
}
