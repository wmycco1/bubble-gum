'use client';

// ═══════════════════════════════════════════════════════════════
// VISIBILITY CONTROL - Universal (God-Tier 2025)
// ═══════════════════════════════════════════════════════════════
// Controls visibility and display properties
// visibility: visible | hidden (keeps space, but hides element)
// display: block | flex | grid | inline-block | inline-flex | none
// ═══════════════════════════════════════════════════════════════

import { useCanvasStore } from '@/lib/editor/canvas-store';
import { PropertyGroup } from './PropertyGroup';

interface VisibilityControlProps {
  componentId: string;
  currentVisibility?: 'visible' | 'hidden';
  currentDisplay?: string;
}

export function VisibilityControl({
  componentId,
  currentVisibility = 'visible',
  currentDisplay = 'block',
}: VisibilityControlProps) {
  const updateComponentProps = useCanvasStore((state) => state.updateComponentProps);

  const handleVisibilityChange = (value: 'visible' | 'hidden') => {
    updateComponentProps(componentId, { visibility: value });
  };

  const handleDisplayChange = (value: string) => {
    updateComponentProps(componentId, { display: value });
  };

  return (
    <PropertyGroup id="visibility" title="Visibility & Display" defaultOpen={false}>
      <div className="space-y-4">
        {/* Visibility */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Visibility
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleVisibilityChange('visible')}
              className={`
                px-3 py-2 text-xs font-medium rounded border transition-all
                ${currentVisibility === 'visible'
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }
              `}
            >
              Visible
            </button>
            <button
              onClick={() => handleVisibilityChange('hidden')}
              className={`
                px-3 py-2 text-xs font-medium rounded border transition-all
                ${currentVisibility === 'hidden'
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }
              `}
            >
              Hidden
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Hidden keeps space but hides element
          </p>
        </div>

        {/* Display Mode */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Display Mode
          </label>
          <select
            value={currentDisplay}
            onChange={(e) => handleDisplayChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="block">Block</option>
            <option value="flex">Flex</option>
            <option value="grid">Grid</option>
            <option value="inline-block">Inline Block</option>
            <option value="inline-flex">Inline Flex</option>
            <option value="none">None (Hidden + No Space)</option>
          </select>

          {/* Display Mode Description */}
          <div className="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-600">
            {currentDisplay === 'block' && '• Block: Full width, stacks vertically'}
            {currentDisplay === 'flex' && '• Flex: Flexible box layout'}
            {currentDisplay === 'grid' && '• Grid: Grid layout system'}
            {currentDisplay === 'inline-block' && '• Inline Block: Inline with block properties'}
            {currentDisplay === 'inline-flex' && '• Inline Flex: Inline with flex properties'}
            {currentDisplay === 'none' && '• None: Completely removed from layout'}
          </div>
        </div>

        {/* Quick Toggle */}
        <div className="pt-2 border-t border-slate-200">
          <button
            onClick={() => handleDisplayChange(currentDisplay === 'none' ? 'block' : 'none')}
            className={`
              w-full px-3 py-2 text-sm font-medium rounded transition-all
              ${currentDisplay === 'none'
                ? 'bg-green-50 border border-green-500 text-green-700 hover:bg-green-100'
                : 'bg-red-50 border border-red-500 text-red-700 hover:bg-red-100'
              }
            `}
          >
            {currentDisplay === 'none' ? '👁️ Show Component' : '🙈 Hide Component'}
          </button>
        </div>
      </div>
    </PropertyGroup>
  );
}
