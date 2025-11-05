'use client';

// ═══════════════════════════════════════════════════════════════
// BOX SHADOW CONTROL - Multi-Shadow Editor
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M3: Advanced Property Controls
// Features:
// - Multiple box shadows support
// - Individual controls: offset X/Y, blur, spread, color
// - Visual preview
// - Add/remove shadows
// - Inset shadow toggle
// - Real-time preview
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { ColorPicker } from './ColorPicker';

interface BoxShadowControlProps {
  componentId: string;
}

interface Shadow {
  id: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
  enabled: boolean;
}

export function BoxShadowControl({ componentId }: BoxShadowControlProps) {
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

  // Parse existing box-shadow into Shadow array
  const parseBoxShadow = (boxShadowValue: string | undefined): Shadow[] => {
    if (!boxShadowValue || boxShadowValue === 'none') return [];

    try {
      // Split by comma (multiple shadows)
      const shadowStrings = boxShadowValue.split(/,(?![^()]*\))/);

      return shadowStrings.map((shadowStr, index) => {
        const trimmed = shadowStr.trim();
        const isInset = trimmed.startsWith('inset');
        const parts = trimmed.replace('inset', '').trim().split(/\s+/);

        // Extract values
        const offsetX = parseInt(parts[0] || '0') || 0;
        const offsetY = parseInt(parts[1] || '0') || 0;
        const blur = parseInt(parts[2] || '0') || 0;
        const spread = parseInt(parts[3] || '0') || 0;
        const color = parts[4] || 'rgba(0, 0, 0, 0.1)';

        return {
          id: `shadow-${index}`,
          offsetX,
          offsetY,
          blur,
          spread,
          color,
          inset: isInset,
          enabled: true,
        };
      });
    } catch (error) {
      console.error('Failed to parse box-shadow:', error);
      return [];
    }
  };

  // Get current box-shadow value
  const getCurrentBoxShadow = (): string | undefined => {
    if (!component) return undefined;

    const style = component.style;

    // Check responsive overrides
    if (deviceMode === 'mobile' && style.mobile?.boxShadow) {
      return String(style.mobile.boxShadow);
    }
    if (deviceMode === 'tablet' && style.tablet?.boxShadow) {
      return String(style.tablet.boxShadow);
    }

    return style.boxShadow ? String(style.boxShadow) : undefined;
  };

  const currentBoxShadow = getCurrentBoxShadow();
  const [shadows, setShadows] = useState<Shadow[]>(() => parseBoxShadow(currentBoxShadow));

  // Convert Shadow array to CSS box-shadow string
  const shadowsToCSS = (shadowList: Shadow[]): string => {
    const enabledShadows = shadowList.filter((s) => s.enabled);

    if (enabledShadows.length === 0) return 'none';

    return enabledShadows
      .map((s) => {
        const insetPrefix = s.inset ? 'inset ' : '';
        return `${insetPrefix}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${s.color}`;
      })
      .join(', ');
  };

  // Update component style with new shadows
  const updateShadows = (newShadows: Shadow[]) => {
    setShadows(newShadows);
    const cssValue = shadowsToCSS(newShadows);
    updateResponsiveStyle(componentId, deviceMode, { boxShadow: cssValue === 'none' ? undefined : cssValue });
  };

  // Add new shadow
  const handleAddShadow = () => {
    const newShadow: Shadow = {
      id: `shadow-${Date.now()}`,
      offsetX: 0,
      offsetY: 4,
      blur: 6,
      spread: 0,
      color: 'rgba(0, 0, 0, 0.1)',
      inset: false,
      enabled: true,
    };
    updateShadows([...shadows, newShadow]);
  };

  // Remove shadow
  const handleRemoveShadow = (shadowId: string) => {
    updateShadows(shadows.filter((s) => s.id !== shadowId));
  };

  // Toggle shadow enabled
  const handleToggleShadow = (shadowId: string) => {
    updateShadows(
      shadows.map((s) => (s.id === shadowId ? { ...s, enabled: !s.enabled } : s))
    );
  };

  // Update shadow property
  const handleUpdateShadow = (shadowId: string, property: keyof Shadow, value: number | string | boolean) => {
    updateShadows(
      shadows.map((s) => (s.id === shadowId ? { ...s, [property]: value } : s))
    );
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">Box Shadow</label>
        <button
          onClick={handleAddShadow}
          className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
          title="Add shadow"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>

      {/* Shadows List */}
      {shadows.length === 0 ? (
        <div className="text-xs text-slate-400 text-center py-4 border border-dashed border-slate-200 rounded">
          No shadows. Click "Add" to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {shadows.map((shadow, index) => (
            <div
              key={shadow.id}
              className={`border rounded-lg p-3 transition-opacity ${
                shadow.enabled ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'
              }`}
            >
              {/* Shadow Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">Shadow {index + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleShadow(shadow.id)}
                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                    title={shadow.enabled ? 'Disable shadow' : 'Enable shadow'}
                  >
                    {shadow.enabled ? (
                      <Eye className="w-3 h-3 text-slate-600" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                  <button
                    onClick={() => handleRemoveShadow(shadow.id)}
                    className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                    title="Remove shadow"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Shadow Controls */}
              <div className="space-y-2">
                {/* Offset X & Y */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 mb-0.5 block">Offset X</label>
                    <input
                      type="number"
                      value={shadow.offsetX}
                      onChange={(e) => handleUpdateShadow(shadow.id, 'offsetX', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 mb-0.5 block">Offset Y</label>
                    <input
                      type="number"
                      value={shadow.offsetY}
                      onChange={(e) => handleUpdateShadow(shadow.id, 'offsetY', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Blur & Spread */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 mb-0.5 block">Blur</label>
                    <input
                      type="number"
                      value={shadow.blur}
                      onChange={(e) => handleUpdateShadow(shadow.id, 'blur', parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 mb-0.5 block">Spread</label>
                    <input
                      type="number"
                      value={shadow.spread}
                      onChange={(e) => handleUpdateShadow(shadow.id, 'spread', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="text-[10px] text-slate-500 mb-0.5 block">Color</label>
                  <div className="mt-1">
                    <ColorPicker
                      value={shadow.color}
                      onChange={(newColor) => handleUpdateShadow(shadow.id, 'color', newColor)}
                    />
                  </div>
                </div>

                {/* Inset Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shadow.inset}
                    onChange={(e) => handleUpdateShadow(shadow.id, 'inset', e.target.checked)}
                    className="w-3 h-3 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-600">Inset shadow</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview */}
      {shadows.length > 0 && (
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <div className="text-[10px] text-slate-500 mb-2">Preview:</div>
          <div
            className="w-full h-16 bg-white rounded"
            style={{ boxShadow: shadowsToCSS(shadows) }}
          />
        </div>
      )}
    </div>
  );
}
