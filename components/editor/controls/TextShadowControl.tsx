'use client';

// ═══════════════════════════════════════════════════════════════
// TEXT SHADOW CONTROL - Multi-Shadow Editor for Text
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M3: Advanced Property Controls
// Features:
// - Multiple text shadows support
// - Individual controls: offset X/Y, blur, color
// - Visual preview with text
// - Add/remove shadows
// - Enable/disable toggle per shadow
// - Real-time preview
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { ColorPicker } from './ColorPicker';
import { extractTextShadowFromCSS } from '@/lib/utils/css-property-parser';

interface TextShadowControlProps {
  componentId: string;
}

interface TextShadow {
  id: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
  enabled: boolean;
}

export function TextShadowControl({ componentId }: TextShadowControlProps) {
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

  // Parse existing text-shadow into TextShadow array
  const parseTextShadow = (textShadowValue: string | undefined): TextShadow[] => {
    if (!textShadowValue || textShadowValue === 'none') return [];

    try {
      // Split by comma (multiple shadows)
      const shadowStrings = textShadowValue.split(/,(?![^()]*\))/);

      return shadowStrings.map((shadowStr, index) => {
        const trimmed = shadowStr.trim();
        const parts = trimmed.split(/\s+/);

        // Extract values (text-shadow format: offsetX offsetY blur color)
        const offsetX = parseInt(parts[0] || '0') || 0;
        const offsetY = parseInt(parts[1] || '0') || 0;
        const blur = parseInt(parts[2] || '0') || 0;
        const color = parts[3] || 'rgba(0, 0, 0, 0.5)';

        return {
          id: `text-shadow-${index}`,
          offsetX,
          offsetY,
          blur,
          color,
          enabled: true,
        };
      });
    } catch (error) {
      console.error('Failed to parse text-shadow:', error);
      return [];
    }
  };

  // Get current text-shadow value (with bidirectional sync from Custom CSS)
  const getCurrentTextShadow = (): string | undefined => {
    if (!component) return undefined;

    // 🔥 BIDIRECTIONAL SYNC: First try to extract from Custom CSS
    const customCSS = (component.props.customCSS as string) || '';
    if (customCSS) {
      const extractedShadow = extractTextShadowFromCSS(customCSS);
      if (extractedShadow) {
        console.log('🔄 TextShadowControl: Syncing from Custom CSS', extractedShadow);
        // Convert parsed shadow to CSS string
        return `${extractedShadow.x}px ${extractedShadow.y}px ${extractedShadow.blur}px ${extractedShadow.color}`;
      }
    }

    // Fallback: Parse from style properties (existing logic)
    const style = component.style;

    // Check responsive overrides
    if (deviceMode === 'mobile' && style.mobile?.textShadow) {
      return String(style.mobile.textShadow);
    }
    if (deviceMode === 'tablet' && style.tablet?.textShadow) {
      return String(style.tablet.textShadow);
    }

    return style.textShadow ? String(style.textShadow) : undefined;
  };

  const currentTextShadow = getCurrentTextShadow();
  const [shadows, setShadows] = useState<TextShadow[]>(() => parseTextShadow(currentTextShadow));

  // Sync with external changes (including Custom CSS)
  useEffect(() => {
    setShadows(parseTextShadow(getCurrentTextShadow()));
  }, [component, deviceMode, component?.props.customCSS]);

  // Convert TextShadow array to CSS text-shadow string
  const shadowsToCSS = (shadowList: TextShadow[]): string => {
    const enabledShadows = shadowList.filter((s) => s.enabled);

    if (enabledShadows.length === 0) return 'none';

    return enabledShadows
      .map((s) => {
        return `${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.color}`;
      })
      .join(', ');
  };

  // Update component style with new shadows
  const updateShadows = (newShadows: TextShadow[]) => {
    setShadows(newShadows);
    const cssValue = shadowsToCSS(newShadows);
    updateResponsiveStyle(componentId, deviceMode, {
      textShadow: cssValue === 'none' ? undefined : cssValue
    });
  };

  // Add new shadow
  const handleAddShadow = () => {
    const newShadow: TextShadow = {
      id: `text-shadow-${Date.now()}`,
      offsetX: 2,
      offsetY: 2,
      blur: 4,
      color: 'rgba(0, 0, 0, 0.5)',
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
  const handleUpdateShadow = (shadowId: string, property: keyof TextShadow, value: number | string | boolean) => {
    updateShadows(
      shadows.map((s) => (s.id === shadowId ? { ...s, [property]: value } : s))
    );
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">Text Shadow</label>
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
          No text shadows. Click "Add" to create one.
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

                {/* Blur */}
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview */}
      {shadows.length > 0 && (
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <div className="text-[10px] text-slate-500 mb-2">Preview:</div>
          <div className="w-full h-16 bg-white rounded flex items-center justify-center">
            <span
              className="text-2xl font-bold text-slate-900"
              style={{ textShadow: shadowsToCSS(shadows) }}
            >
              Text Shadow
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
