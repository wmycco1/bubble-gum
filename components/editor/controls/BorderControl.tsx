'use client';

// ═══════════════════════════════════════════════════════════════
// BORDER CONTROL - Individual Side Control
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M3: Advanced Property Controls
// Features:
// - Individual border controls per side (top, right, bottom, left)
// - Link/unlink sides toggle
// - Width (0-20px), Style (solid, dashed, dotted, double), Color
// - Visual preview
// - Reset button
// - Real-time updates
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { Link, Unlink, X } from 'lucide-react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { ColorPicker } from './ColorPicker';

interface BorderControlProps {
  componentId: string;
}

type BorderSide = 'top' | 'right' | 'bottom' | 'left';
type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'none';

interface BorderValues {
  topWidth: number;
  rightWidth: number;
  bottomWidth: number;
  leftWidth: number;
  topStyle: BorderStyle;
  rightStyle: BorderStyle;
  bottomStyle: BorderStyle;
  leftStyle: BorderStyle;
  topColor: string;
  rightColor: string;
  bottomColor: string;
  leftColor: string;
}

export function BorderControl({ componentId }: BorderControlProps) {
  const deviceMode = useCanvasStore((state) => state.deviceMode);
  const updateResponsiveStyle = useCanvasStore((state) => state.updateResponsiveStyle);
  const components = useCanvasStore((state) => state.components);

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

  // Parse CSS border properties to values
  const parseBorderValues = (): BorderValues => {
    if (!component) {
      return {
        topWidth: 0, rightWidth: 0, bottomWidth: 0, leftWidth: 0,
        topStyle: 'solid', rightStyle: 'solid', bottomStyle: 'solid', leftStyle: 'solid',
        topColor: '#000000', rightColor: '#000000', bottomColor: '#000000', leftColor: '#000000',
      };
    }

    const style = component.style;
    const responsiveStyle = deviceMode === 'mobile' ? style.mobile : deviceMode === 'tablet' ? style.tablet : {};

    const parseWidth = (value: string | undefined): number => {
      if (!value) return 0;
      return parseInt(value) || 0;
    };

    const parseStyle = (value: string | undefined): BorderStyle => {
      if (!value) return 'solid';
      return (value as BorderStyle) || 'solid';
    };

    const parseColor = (value: string | undefined): string => {
      return value || '#000000';
    };

    return {
      topWidth: parseWidth((responsiveStyle?.borderTopWidth || style.borderTopWidth || style.borderWidth) as string),
      rightWidth: parseWidth((responsiveStyle?.borderRightWidth || style.borderRightWidth || style.borderWidth) as string),
      bottomWidth: parseWidth((responsiveStyle?.borderBottomWidth || style.borderBottomWidth || style.borderWidth) as string),
      leftWidth: parseWidth((responsiveStyle?.borderLeftWidth || style.borderLeftWidth || style.borderWidth) as string),
      topStyle: parseStyle((responsiveStyle?.borderTopStyle || style.borderTopStyle || style.borderStyle) as string),
      rightStyle: parseStyle((responsiveStyle?.borderRightStyle || style.borderRightStyle || style.borderStyle) as string),
      bottomStyle: parseStyle((responsiveStyle?.borderBottomStyle || style.borderBottomStyle || style.borderStyle) as string),
      leftStyle: parseStyle((responsiveStyle?.borderLeftStyle || style.borderLeftStyle || style.borderStyle) as string),
      topColor: parseColor((responsiveStyle?.borderTopColor || style.borderTopColor || style.borderColor) as string),
      rightColor: parseColor((responsiveStyle?.borderRightColor || style.borderRightColor || style.borderColor) as string),
      bottomColor: parseColor((responsiveStyle?.borderBottomColor || style.borderBottomColor || style.borderColor) as string),
      leftColor: parseColor((responsiveStyle?.borderLeftColor || style.borderLeftColor || style.borderColor) as string),
    };
  };

  const [values, setValues] = useState<BorderValues>(parseBorderValues());
  const [linked, setLinked] = useState(true);

  // Sync with external changes
  useEffect(() => {
    setValues(parseBorderValues());
  }, [component, deviceMode]);

  // Update border
  const updateBorder = (newValues: BorderValues) => {
    setValues(newValues);

    // Check if all sides are equal
    const allWidthEqual = newValues.topWidth === newValues.rightWidth && newValues.rightWidth === newValues.bottomWidth && newValues.bottomWidth === newValues.leftWidth;
    const allStyleEqual = newValues.topStyle === newValues.rightStyle && newValues.rightStyle === newValues.bottomStyle && newValues.bottomStyle === newValues.leftStyle;
    const allColorEqual = newValues.topColor === newValues.rightColor && newValues.rightColor === newValues.bottomColor && newValues.bottomColor === newValues.leftColor;

    const styles: Record<string, string | undefined> = {};

    // Use shorthand if all equal
    if (allWidthEqual && allStyleEqual && allColorEqual) {
      if (newValues.topWidth === 0) {
        styles.border = undefined;
      } else {
        styles.border = `${newValues.topWidth}px ${newValues.topStyle} ${newValues.topColor}`;
      }
      // Clear individual properties
      styles.borderTopWidth = undefined;
      styles.borderRightWidth = undefined;
      styles.borderBottomWidth = undefined;
      styles.borderLeftWidth = undefined;
      styles.borderTopStyle = undefined;
      styles.borderRightStyle = undefined;
      styles.borderBottomStyle = undefined;
      styles.borderLeftStyle = undefined;
      styles.borderTopColor = undefined;
      styles.borderRightColor = undefined;
      styles.borderBottomColor = undefined;
      styles.borderLeftColor = undefined;
    } else {
      // Use individual properties
      styles.border = undefined;
      styles.borderTopWidth = newValues.topWidth > 0 ? `${newValues.topWidth}px` : undefined;
      styles.borderRightWidth = newValues.rightWidth > 0 ? `${newValues.rightWidth}px` : undefined;
      styles.borderBottomWidth = newValues.bottomWidth > 0 ? `${newValues.bottomWidth}px` : undefined;
      styles.borderLeftWidth = newValues.leftWidth > 0 ? `${newValues.leftWidth}px` : undefined;
      styles.borderTopStyle = newValues.topWidth > 0 ? newValues.topStyle : undefined;
      styles.borderRightStyle = newValues.rightWidth > 0 ? newValues.rightStyle : undefined;
      styles.borderBottomStyle = newValues.bottomWidth > 0 ? newValues.bottomStyle : undefined;
      styles.borderLeftStyle = newValues.leftWidth > 0 ? newValues.leftStyle : undefined;
      styles.borderTopColor = newValues.topWidth > 0 ? newValues.topColor : undefined;
      styles.borderRightColor = newValues.rightWidth > 0 ? newValues.rightColor : undefined;
      styles.borderBottomColor = newValues.bottomWidth > 0 ? newValues.bottomColor : undefined;
      styles.borderLeftColor = newValues.leftWidth > 0 ? newValues.leftColor : undefined;
    }

    updateResponsiveStyle(componentId, deviceMode, styles);
  };

  // Update single side
  const updateSide = (side: BorderSide, property: 'width' | 'style' | 'color', value: number | BorderStyle | string) => {
    const newValues = { ...values };

    if (linked) {
      // Update all sides
      if (property === 'width') {
        newValues.topWidth = value as number;
        newValues.rightWidth = value as number;
        newValues.bottomWidth = value as number;
        newValues.leftWidth = value as number;
      } else if (property === 'style') {
        newValues.topStyle = value as BorderStyle;
        newValues.rightStyle = value as BorderStyle;
        newValues.bottomStyle = value as BorderStyle;
        newValues.leftStyle = value as BorderStyle;
      } else {
        newValues.topColor = value as string;
        newValues.rightColor = value as string;
        newValues.bottomColor = value as string;
        newValues.leftColor = value as string;
      }
    } else {
      // Update only specific side
      if (property === 'width') {
        if (side === 'top') newValues.topWidth = value as number;
        else if (side === 'right') newValues.rightWidth = value as number;
        else if (side === 'bottom') newValues.bottomWidth = value as number;
        else if (side === 'left') newValues.leftWidth = value as number;
      } else if (property === 'style') {
        if (side === 'top') newValues.topStyle = value as BorderStyle;
        else if (side === 'right') newValues.rightStyle = value as BorderStyle;
        else if (side === 'bottom') newValues.bottomStyle = value as BorderStyle;
        else if (side === 'left') newValues.leftStyle = value as BorderStyle;
      } else {
        if (side === 'top') newValues.topColor = value as string;
        else if (side === 'right') newValues.rightColor = value as string;
        else if (side === 'bottom') newValues.bottomColor = value as string;
        else if (side === 'left') newValues.leftColor = value as string;
      }
    }

    updateBorder(newValues);
  };

  // Reset all borders
  const handleReset = () => {
    updateBorder({
      topWidth: 0, rightWidth: 0, bottomWidth: 0, leftWidth: 0,
      topStyle: 'solid', rightStyle: 'solid', bottomStyle: 'solid', leftStyle: 'solid',
      topColor: '#000000', rightColor: '#000000', bottomColor: '#000000', leftColor: '#000000',
    });
  };

  const hasBorder = values.topWidth > 0 || values.rightWidth > 0 || values.bottomWidth > 0 || values.leftWidth > 0;

  const borderStyles: BorderStyle[] = ['solid', 'dashed', 'dotted', 'double', 'none'];

  const renderSideControls = (side: BorderSide, label: string) => {
    const widthKey = `${side}Width` as keyof BorderValues;
    const styleKey = `${side}Style` as keyof BorderValues;
    const colorKey = `${side}Color` as keyof BorderValues;

    return (
      <div key={side} className="space-y-2 p-3 border border-slate-100 rounded-lg bg-slate-50">
        <div className="text-xs font-medium text-slate-600">{label}</div>

        {/* Width */}
        <div>
          <label className="text-[10px] text-slate-500 mb-0.5 block">Width (px)</label>
          <input
            type="number"
            min="0"
            max="20"
            value={values[widthKey] as number}
            onChange={(e) => updateSide(side, 'width', parseInt(e.target.value) || 0)}
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* Style */}
        <div>
          <label className="text-[10px] text-slate-500 mb-0.5 block">Style</label>
          <select
            value={values[styleKey] as string}
            onChange={(e) => updateSide(side, 'style', e.target.value as BorderStyle)}
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            {borderStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div>
          <label className="text-[10px] text-slate-500 mb-0.5 block">Color</label>
          <ColorPicker
            value={values[colorKey] as string}
            onChange={(newColor) => updateSide(side, 'color', newColor)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">Border</label>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLinked(!linked)}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
            title={linked ? 'Unlink sides' : 'Link sides'}
          >
            {linked ? (
              <Link className="w-3 h-3 text-blue-600" />
            ) : (
              <Unlink className="w-3 h-3 text-slate-400" />
            )}
          </button>
          {hasBorder && (
            <button
              onClick={handleReset}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
              title="Reset border"
            >
              <X className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* All Sides (when linked) */}
      {linked ? (
        <div className="space-y-2 p-3 border border-slate-200 rounded-lg bg-white">
          <div className="text-xs font-medium text-slate-600">All Sides</div>

          {/* Width */}
          <div>
            <label className="text-[10px] text-slate-500 mb-0.5 block">Width (px)</label>
            <input
              type="number"
              min="0"
              max="20"
              value={values.topWidth}
              onChange={(e) => updateSide('top', 'width', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Style */}
          <div>
            <label className="text-[10px] text-slate-500 mb-0.5 block">Style</label>
            <select
              value={values.topStyle}
              onChange={(e) => updateSide('top', 'style', e.target.value as BorderStyle)}
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {borderStyles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="text-[10px] text-slate-500 mb-0.5 block">Color</label>
            <ColorPicker
              value={values.topColor}
              onChange={(newColor) => updateSide('top', 'color', newColor)}
            />
          </div>
        </div>
      ) : (
        /* Individual Sides (when unlinked) */
        <div className="space-y-2">
          {renderSideControls('top', 'Top')}
          {renderSideControls('right', 'Right')}
          {renderSideControls('bottom', 'Bottom')}
          {renderSideControls('left', 'Left')}
        </div>
      )}

      {/* Preview */}
      {hasBorder && (
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <div className="text-[10px] text-slate-500 mb-2">Preview:</div>
          <div
            className="w-full h-20 bg-white rounded-lg"
            style={{
              borderTopWidth: `${values.topWidth}px`,
              borderRightWidth: `${values.rightWidth}px`,
              borderBottomWidth: `${values.bottomWidth}px`,
              borderLeftWidth: `${values.leftWidth}px`,
              borderTopStyle: values.topStyle,
              borderRightStyle: values.rightStyle,
              borderBottomStyle: values.bottomStyle,
              borderLeftStyle: values.leftStyle,
              borderTopColor: values.topColor,
              borderRightColor: values.rightColor,
              borderBottomColor: values.bottomColor,
              borderLeftColor: values.leftColor,
            }}
          />
        </div>
      )}
    </div>
  );
}
