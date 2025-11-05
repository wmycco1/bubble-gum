'use client';

// ═══════════════════════════════════════════════════════════════
// BORDER RADIUS CONTROL - Visual 4-Corner Editor
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M1: Universal Styling System
// Features:
// - Visual 4-corner editor (similar to SpacingControls)
// - Individual inputs for each corner
// - Link/unlink toggle (all corners same value)
// - Preview box showing border radius effect
// - Supports px, rem, em, % units
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { Link, Unlink } from 'lucide-react';
import { useCanvasStore } from '@/lib/editor/canvas-store';

interface BorderRadiusControlProps {
  componentId: string;
}

type CornerType = 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight';

export function BorderRadiusControl({ componentId }: BorderRadiusControlProps) {
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

  // Link/unlink state
  const [isLinked, setIsLinked] = useState(true);

  // Extract border radius values from component style
  const getCornerValue = (corner: CornerType): string => {
    if (!component) return '';

    const style = component.style;
    const property = `border${corner}Radius`;

    // Type-safe property access
    type RadiusProperty = 'borderTopLeftRadius' | 'borderTopRightRadius' | 'borderBottomLeftRadius' | 'borderBottomRightRadius';

    // Check responsive overrides based on device mode
    if (deviceMode === 'mobile' && style.mobile) {
      const mobileValue = style.mobile[property as RadiusProperty];
      if (mobileValue) return String(mobileValue);
    }
    if (deviceMode === 'tablet' && style.tablet) {
      const tabletValue = style.tablet[property as RadiusProperty];
      if (tabletValue) return String(tabletValue);
    }

    // Check individual corner first
    const cornerValue = style[property as RadiusProperty];
    if (cornerValue) return String(cornerValue);

    // Fallback to shorthand borderRadius (if all corners are same)
    const borderRadius = style.borderRadius;
    return borderRadius ? String(borderRadius) : '';
  };

  const handleCornerChange = (corner: CornerType, value: string) => {
    // Validate input (allow empty, numbers, or values with units)
    if (value && !/^(\d+\.?\d*)(px|rem|em|%)?$/.test(value) && value !== '') {
      return; // Invalid format, don't update
    }

    // Add 'px' if only number provided
    const finalValue = value && /^\d+\.?\d*$/.test(value) ? `${value}px` : value;

    const property = `border${corner}Radius`;

    if (isLinked) {
      // Update all corners + shorthand
      updateResponsiveStyle(componentId, deviceMode, {
        borderRadius: finalValue || undefined,
        borderTopLeftRadius: finalValue || undefined,
        borderTopRightRadius: finalValue || undefined,
        borderBottomLeftRadius: finalValue || undefined,
        borderBottomRightRadius: finalValue || undefined,
      });
    } else {
      // Update only this corner
      updateResponsiveStyle(componentId, deviceMode, {
        [property]: finalValue || undefined,
        borderRadius: undefined, // Clear shorthand when corners differ
      });
    }
  };

  const toggleLink = () => {
    if (!isLinked) {
      // Link: Make all corners same as top-left
      const topLeftValue = getCornerValue('TopLeft');
      handleCornerChange('TopLeft', topLeftValue);
    }
    setIsLinked(!isLinked);
  };

  const corners = [
    { type: 'TopLeft' as CornerType, label: 'TL', position: 'top-0 left-0' },
    { type: 'TopRight' as CornerType, label: 'TR', position: 'top-0 right-0' },
    { type: 'BottomLeft' as CornerType, label: 'BL', position: 'bottom-0 left-0' },
    { type: 'BottomRight' as CornerType, label: 'BR', position: 'bottom-0 right-0' },
  ];

  return (
    <div className="border-t border-slate-200 bg-white">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Border Radius
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              {deviceMode === 'desktop' ? 'Desktop' : deviceMode === 'tablet' ? 'Tablet' : 'Mobile'}
            </span>
            <button
              onClick={toggleLink}
              className={`p-1.5 rounded border transition-colors ${
                isLinked
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
              }`}
              title={isLinked ? 'Linked (all corners same)' : 'Unlinked (independent corners)'}
            >
              {isLinked ? <Link className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Visual Border Radius Editor */}
        <div className="relative">
          {/* Preview box with border radius */}
          <div
            className="relative rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 p-8 border-2 border-slate-300"
            style={{
              borderTopLeftRadius: getCornerValue('TopLeft') || '0',
              borderTopRightRadius: getCornerValue('TopRight') || '0',
              borderBottomLeftRadius: getCornerValue('BottomLeft') || '0',
              borderBottomRightRadius: getCornerValue('BottomRight') || '0',
            }}
          >
            {/* Corner inputs */}
            {corners.map(({ type, label, position }) => (
              <div
                key={type}
                className={`absolute ${position} -translate-x-0 -translate-y-0`}
                style={{
                  transform: type === 'TopLeft' ? 'translate(-50%, -50%)' :
                             type === 'TopRight' ? 'translate(50%, -50%)' :
                             type === 'BottomLeft' ? 'translate(-50%, 50%)' :
                             'translate(50%, 50%)',
                }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium text-slate-600 mb-1">{label}</span>
                  <input
                    type="text"
                    value={getCornerValue(type)}
                    onChange={(e) => handleCornerChange(type, e.target.value)}
                    placeholder="0"
                    disabled={isLinked && type !== 'TopLeft'}
                    className="w-16 rounded border border-slate-300 bg-white px-2 py-1 text-center text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>
            ))}

            {/* Center label */}
            <div className="flex h-24 items-center justify-center rounded-md border-2 border-dashed border-slate-300 bg-white">
              <span className="text-xs font-medium text-slate-400">
                Border Radius
              </span>
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <div className="rounded-md bg-blue-50 p-2">
          <p className="text-xs text-blue-900">
            💡 Values: <code className="font-mono">8px</code>, <code className="font-mono">1rem</code>, <code className="font-mono">50%</code>
            {isLinked && ' (linked: all corners same)'}
          </p>
        </div>
      </div>
    </div>
  );
}
