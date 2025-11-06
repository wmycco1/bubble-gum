'use client';

// ═══════════════════════════════════════════════════════════════
// OPACITY CONTROL - Simple Slider (0-100%)
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M3: Advanced Property Controls
// Features:
// - Slider (0-100%)
// - Number input
// - Visual preview
// - Real-time updates
// - Supports responsive modes (desktop/tablet/mobile)
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { extractOpacityFromCSS } from '@/lib/utils/css-property-parser';

interface OpacityControlProps {
  componentId: string;
}

export function OpacityControl({ componentId }: OpacityControlProps) {
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

  // Get current opacity value (with bidirectional sync from Custom CSS)
  const getCurrentOpacity = (): number => {
    if (!component) return 100;

    // 🔥 BIDIRECTIONAL SYNC: First try to extract from Custom CSS
    const customCSS = (component.props.customCSS as string) || '';
    if (customCSS) {
      const extractedOpacity = extractOpacityFromCSS(customCSS);
      if (extractedOpacity !== null) {
        console.log('🔄 OpacityControl: Syncing from Custom CSS', extractedOpacity);
        return Math.round(extractedOpacity * 100); // Convert 0-1 to 0-100
      }
    }

    // Fallback: Parse from style properties (existing logic)
    const style = component.style;

    // Check responsive overrides
    if (deviceMode === 'mobile' && style.mobile?.opacity !== undefined) {
      return Math.round(Number(style.mobile.opacity) * 100);
    }
    if (deviceMode === 'tablet' && style.tablet?.opacity !== undefined) {
      return Math.round(Number(style.tablet.opacity) * 100);
    }

    // Default opacity
    if (style.opacity !== undefined) {
      return Math.round(Number(style.opacity) * 100);
    }

    return 100; // Fully opaque by default
  };

  const [opacity, setOpacity] = useState<number>(getCurrentOpacity());

  // Sync with external changes (including Custom CSS)
  useEffect(() => {
    setOpacity(getCurrentOpacity());
  }, [component, deviceMode, component?.props.customCSS]);

  // Handle opacity change
  const handleOpacityChange = (newOpacity: number) => {
    // Clamp between 0-100
    const clampedOpacity = Math.max(0, Math.min(100, newOpacity));
    setOpacity(clampedOpacity);

    // Convert to 0-1 range for CSS
    const cssOpacity = clampedOpacity / 100;

    // Update component style
    updateResponsiveStyle(componentId, deviceMode, {
      opacity: cssOpacity === 1 ? undefined : String(cssOpacity),
    });
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="text-sm font-medium text-slate-700">Opacity</label>

      {/* Slider + Number Input */}
      <div className="flex items-center gap-3">
        {/* Slider */}
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={opacity}
          onChange={(e) => handleOpacityChange(parseInt(e.target.value))}
          className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:bg-blue-600
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:w-4
                     [&::-moz-range-thumb]:h-4
                     [&::-moz-range-thumb]:bg-blue-600
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:border-0
                     [&::-moz-range-thumb]:cursor-pointer"
        />

        {/* Number Input */}
        <div className="relative">
          <input
            type="number"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => handleOpacityChange(parseInt(e.target.value) || 0)}
            className="w-16 px-2 py-1 pr-6 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
            %
          </span>
        </div>
      </div>

      {/* Visual Preview */}
      <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
        <div className="text-[10px] text-slate-500 mb-2">Preview:</div>
        <div className="relative w-full h-16 bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 rounded overflow-hidden">
          {/* Checkerboard pattern (to show transparency) */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #e2e8f0 25%, transparent 25%),
                linear-gradient(-45deg, #e2e8f0 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #e2e8f0 75%),
                linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            }}
          />
          {/* Preview box with current opacity */}
          <div
            className="absolute inset-0 bg-blue-600 flex items-center justify-center text-white font-semibold text-sm"
            style={{ opacity: opacity / 100 }}
          >
            {opacity}%
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-500">Quick:</span>
        {[0, 25, 50, 75, 100].map((preset) => (
          <button
            key={preset}
            onClick={() => handleOpacityChange(preset)}
            className={`px-2 py-1 text-[10px] rounded transition-colors ${
              opacity === preset
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {preset}%
          </button>
        ))}
      </div>
    </div>
  );
}
