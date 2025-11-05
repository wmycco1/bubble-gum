'use client';

// ═══════════════════════════════════════════════════════════════
// Z-INDEX CONTROL - Simple Number Input
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M3: Advanced Property Controls
// Features:
// - Number input for z-index (-999 to 999)
// - Quick preset buttons (common values)
// - Reset button
// - Real-time updates
// - Supports responsive modes (desktop/tablet/mobile)
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { Layers, X } from 'lucide-react';
import { useCanvasStore } from '@/lib/editor/canvas-store';

interface ZIndexControlProps {
  componentId: string;
}

export function ZIndexControl({ componentId }: ZIndexControlProps) {
  const deviceMode = useCanvasStore((state) => state.deviceMode);
  const updateResponsiveStyle = useCanvasStore((state) => state.updateResponsiveStyle);
  const components = useCanvasStore((state) => state.components);

  // Find current component to get its styles
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

  // Get current z-index value
  const getCurrentZIndex = (): number => {
    if (!component) return 0;

    const style = component.style;

    // Check responsive overrides
    if (deviceMode === 'mobile' && style.mobile?.zIndex !== undefined) {
      return Number(style.mobile.zIndex);
    }
    if (deviceMode === 'tablet' && style.tablet?.zIndex !== undefined) {
      return Number(style.tablet.zIndex);
    }

    // Default z-index
    if (style.zIndex !== undefined) {
      return Number(style.zIndex);
    }

    return 0; // Auto (0) by default
  };

  const [zIndex, setZIndex] = useState<number>(getCurrentZIndex());

  // Sync with external changes
  useEffect(() => {
    setZIndex(getCurrentZIndex());
  }, [component, deviceMode]);

  // Handle z-index change
  const handleZIndexChange = (newZIndex: number) => {
    // Clamp between -999 and 999
    const clampedZIndex = Math.max(-999, Math.min(999, newZIndex));
    setZIndex(clampedZIndex);

    // Update component style
    updateResponsiveStyle(componentId, deviceMode, {
      zIndex: clampedZIndex === 0 ? undefined : String(clampedZIndex),
    });
  };

  // Reset z-index
  const handleReset = () => {
    handleZIndexChange(0);
  };

  // Quick presets
  const presets = [-1, 0, 1, 10, 50, 100];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
          <Layers className="w-3 h-3" />
          Z-Index
        </label>
        {zIndex !== 0 && (
          <button
            onClick={handleReset}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
            title="Reset to auto (0)"
          >
            <X className="w-3 h-3 text-slate-400" />
          </button>
        )}
      </div>

      {/* Number Input */}
      <div>
        <input
          type="number"
          min="-999"
          max="999"
          value={zIndex}
          onChange={(e) => handleZIndexChange(parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-900"
          placeholder="0"
        />
        <p className="text-[10px] text-slate-400 mt-1">
          Higher values appear in front. Range: -999 to 999
        </p>
      </div>

      {/* Quick Presets */}
      <div>
        <span className="text-[10px] text-slate-500 mb-1 block">Quick Presets:</span>
        <div className="flex flex-wrap gap-1">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => handleZIndexChange(preset)}
              className={`px-2 py-1 text-[10px] rounded transition-colors ${
                zIndex === preset
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Helper */}
      <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
        <div className="text-[10px] text-slate-500 mb-2">Stacking Context:</div>
        <div className="relative w-full h-24 bg-white rounded overflow-hidden">
          {/* Background layer */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-slate-200 rounded flex items-center justify-center text-xs text-slate-400">
              z: 0
            </div>
          </div>
          {/* Current z-index layer */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex }}
          >
            <div className="w-16 h-16 bg-blue-600 rounded flex items-center justify-center text-xs text-white font-semibold shadow-lg">
              z: {zIndex}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
