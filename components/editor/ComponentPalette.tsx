'use client';

// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - COMPONENT PALETTE (MIGRATED TO CANVAS-STORE)
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Now uses canvas-store directly
// Changes:
// - Removed onAddComponent prop (uses store action directly)
// - Using NEW component types (PascalCase)
// - Integrated with canvas-store for seamless adding
// ═══════════════════════════════════════════════════════════════

import { useCanvasStore } from '@/lib/editor/canvas-store';
import type { ComponentType } from '@/lib/editor/types';

const componentTypes: Array<{ type: ComponentType; label: string; icon: string; description: string }> = [
  // OLD system components (5)
  { type: 'Text', label: 'Text', icon: '📝', description: 'Paragraph or heading text' },
  { type: 'Image', label: 'Image', icon: '🖼️', description: 'Image with alt text' },
  { type: 'Button', label: 'Button', icon: '🔘', description: 'Call-to-action button' },
  { type: 'Form', label: 'Form', icon: '📋', description: 'Contact or signup form' },
  { type: 'Section', label: 'Hero Section', icon: '🎭', description: 'Full-width hero banner' },

  // NEW system components (4 more = 9 total)
  { type: 'Container', label: 'Container', icon: '📦', description: 'Content wrapper' },
  { type: 'Grid', label: 'Grid', icon: '🔲', description: 'Responsive grid layout' },
  { type: 'Card', label: 'Card', icon: '🃏', description: 'Content card' },
  { type: 'Input', label: 'Input', icon: '✏️', description: 'Text input field' },
];

export function ComponentPalette() {
  const addComponent = useCanvasStore((state) => state.addComponent);

  /**
   * Handle adding component to canvas
   * Uses canvas-store action directly (no props needed!)
   */
  const handleAdd = (type: ComponentType) => {
    addComponent(type);
    console.log('➕ Added component:', type);
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-sm font-semibold text-slate-900">Components</h2>
      <div className="space-y-2">
        {componentTypes.map(({ type, label, icon, description }) => (
          <button
            key={type}
            onClick={() => handleAdd(type)}
            className="group flex w-full items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
            title={description}
          >
            <span className="text-2xl flex-shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-900 group-hover:text-slate-700">
                {label}
              </div>
              <div className="text-xs text-slate-600 mt-0.5 line-clamp-1">{description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Component count indicator */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-600 text-center">
          {componentTypes.length} components available
        </p>
      </div>

      {/* AI Tools Section */}
      <div className="mt-8">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">AI Tools</h2>
        <button
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 opacity-50 cursor-not-allowed"
          disabled
          title="Coming in Phase 1.9"
        >
          ✨ Generate with AI
        </button>
        <p className="mt-2 text-xs text-slate-600">Coming soon</p>
      </div>
    </div>
  );
}
