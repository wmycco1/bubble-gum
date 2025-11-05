'use client';

// ═══════════════════════════════════════════════════════════════
// SPACING CONTROLS - Margin & Padding Editor
// ═══════════════════════════════════════════════════════════════
// Enterprise-grade spacing control component for layout editing
// Features: Visual 4-side input (top, right, bottom, left)
// Supports: px, rem, em units with validation
// Responsive: Works with breakpoint system (desktop/tablet/mobile)
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';

interface SpacingControlsProps {
  componentId: string;
}

type SpacingType = 'margin' | 'padding';
type SpacingSide = 'Top' | 'Right' | 'Bottom' | 'Left';

export function SpacingControls({ componentId }: SpacingControlsProps) {
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
  const [activeSpacing, setActiveSpacing] = useState<SpacingType>('margin');

  // Extract spacing values from component style
  const getSpacingValue = (type: SpacingType, side: SpacingSide): string => {
    if (!component) return '';

    const style = component.style;
    const property = `${type}${side}`;

    // Type-safe property access
    type SpacingProperty = 'marginTop' | 'marginRight' | 'marginBottom' | 'marginLeft' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft';

    // Check responsive overrides based on device mode
    if (deviceMode === 'mobile' && style.mobile) {
      const mobileValue = style.mobile[property as SpacingProperty];
      if (mobileValue) return String(mobileValue);
    }
    if (deviceMode === 'tablet' && style.tablet) {
      const tabletValue = style.tablet[property as SpacingProperty];
      if (tabletValue) return String(tabletValue);
    }

    // Fallback to base style
    const baseValue = style[property as SpacingProperty];
    return baseValue ? String(baseValue) : '';
  };

  const handleSpacingChange = (type: SpacingType, side: SpacingSide, value: string) => {
    const property = `${type}${side}`;

    // Validate input (allow empty, numbers, or values with units)
    if (value && !/^(\d+\.?\d*)(px|rem|em|%)?$/.test(value) && value !== '') {
      return; // Invalid format, don't update
    }

    // Add 'px' if only number provided
    const finalValue = value && /^\d+\.?\d*$/.test(value) ? `${value}px` : value;

    updateResponsiveStyle(componentId, deviceMode, {
      [property]: finalValue || undefined,
    });
  };

  return (
    <div className="border-t border-slate-200 bg-white">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Spacing
          </h3>
          <span className="text-xs text-slate-500">
            {deviceMode === 'desktop' ? 'Desktop' : deviceMode === 'tablet' ? 'Tablet' : 'Mobile'}
          </span>
        </div>

        {/* Margin / Padding Toggle */}
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => setActiveSpacing('margin')}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeSpacing === 'margin'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Margin
          </button>
          <button
            onClick={() => setActiveSpacing('padding')}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeSpacing === 'padding'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Padding
          </button>
        </div>

        {/* Visual Spacing Editor */}
        <div className="relative">
          {/* Visual representation */}
          <div className="relative rounded-lg border-2 border-slate-300 bg-slate-50 p-6">
            {/* Top */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
              <input
                type="text"
                value={getSpacingValue(activeSpacing, 'Top')}
                onChange={(e) => handleSpacingChange(activeSpacing, 'Top', e.target.value)}
                placeholder="0"
                className="w-16 rounded border border-slate-300 bg-white px-2 py-1 text-center text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Right */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
              <input
                type="text"
                value={getSpacingValue(activeSpacing, 'Right')}
                onChange={(e) => handleSpacingChange(activeSpacing, 'Right', e.target.value)}
                placeholder="0"
                className="w-16 rounded border border-slate-300 bg-white px-2 py-1 text-center text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <input
                type="text"
                value={getSpacingValue(activeSpacing, 'Bottom')}
                onChange={(e) => handleSpacingChange(activeSpacing, 'Bottom', e.target.value)}
                placeholder="0"
                className="w-16 rounded border border-slate-300 bg-white px-2 py-1 text-center text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Left */}
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <input
                type="text"
                value={getSpacingValue(activeSpacing, 'Left')}
                onChange={(e) => handleSpacingChange(activeSpacing, 'Left', e.target.value)}
                placeholder="0"
                className="w-16 rounded border border-slate-300 bg-white px-2 py-1 text-center text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Center label */}
            <div className="flex h-20 items-center justify-center rounded border-2 border-dashed border-slate-300 bg-white">
              <span className="text-xs font-medium text-slate-400">
                {activeSpacing === 'margin' ? 'Margin' : 'Padding'}
              </span>
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <div className="rounded-md bg-blue-50 p-2">
          <p className="text-xs text-blue-900">
            💡 Values: <code className="font-mono">16px</code>, <code className="font-mono">1rem</code>, <code className="font-mono">2em</code>, <code className="font-mono">50%</code>
          </p>
        </div>
      </div>
    </div>
  );
}
