'use client';

// ═══════════════════════════════════════════════════════════════
// TRANSFORM CONTROL - Rotate, Scale, Skew, Translate
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M3: Advanced Property Controls
// Features:
// - Rotate (0-360deg with visual dial)
// - Scale X/Y (0.1-3.0 with independent/linked)
// - Skew X/Y (-45 to 45deg)
// - Translate X/Y (px, rem, %)
// - Visual preview
// - Reset button per transform
// - Real-time updates
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { RotateCw, Link, Unlink, X } from 'lucide-react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { extractTransformFromCSS } from '@/lib/utils/css-property-parser';

interface TransformControlProps {
  componentId: string;
}

interface TransformValues {
  rotate: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  translateX: string;
  translateY: string;
}

export function TransformControl({ componentId }: TransformControlProps) {
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

  // Parse CSS transform string to values
  const parseTransform = (transformValue: string | undefined): TransformValues => {
    const defaults: TransformValues = {
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      skewY: 0,
      translateX: '0px',
      translateY: '0px',
    };

    if (!transformValue || transformValue === 'none') return defaults;

    try {
      // Parse rotate
      const rotateMatch = transformValue.match(/rotate\((-?\d+\.?\d*)deg\)/);
      if (rotateMatch && rotateMatch[1]) defaults.rotate = parseFloat(rotateMatch[1]);

      // Parse scale
      const scaleMatch = transformValue.match(/scale\((-?\d+\.?\d*),?\s*(-?\d+\.?\d*)?\)/);
      if (scaleMatch && scaleMatch[1]) {
        defaults.scaleX = parseFloat(scaleMatch[1]);
        defaults.scaleY = scaleMatch[2] ? parseFloat(scaleMatch[2]) : defaults.scaleX;
      }

      // Parse scaleX/scaleY separately
      const scaleXMatch = transformValue.match(/scaleX\((-?\d+\.?\d*)\)/);
      const scaleYMatch = transformValue.match(/scaleY\((-?\d+\.?\d*)\)/);
      if (scaleXMatch && scaleXMatch[1]) defaults.scaleX = parseFloat(scaleXMatch[1]);
      if (scaleYMatch && scaleYMatch[1]) defaults.scaleY = parseFloat(scaleYMatch[1]);

      // Parse skew
      const skewXMatch = transformValue.match(/skewX\((-?\d+\.?\d*)deg\)/);
      const skewYMatch = transformValue.match(/skewY\((-?\d+\.?\d*)deg\)/);
      if (skewXMatch && skewXMatch[1]) defaults.skewX = parseFloat(skewXMatch[1]);
      if (skewYMatch && skewYMatch[1]) defaults.skewY = parseFloat(skewYMatch[1]);

      // Parse translate
      const translateMatch = transformValue.match(/translate\(([^,]+),?\s*([^)]+)?\)/);
      if (translateMatch && translateMatch[1]) {
        defaults.translateX = translateMatch[1].trim();
        defaults.translateY = translateMatch[2] ? translateMatch[2].trim() : '0px';
      }

      // Parse translateX/translateY separately
      const translateXMatch = transformValue.match(/translateX\(([^)]+)\)/);
      const translateYMatch = transformValue.match(/translateY\(([^)]+)\)/);
      if (translateXMatch && translateXMatch[1]) defaults.translateX = translateXMatch[1].trim();
      if (translateYMatch && translateYMatch[1]) defaults.translateY = translateYMatch[1].trim();

      return defaults;
    } catch (error) {
      console.error('Failed to parse transform:', error);
      return defaults;
    }
  };

  // Get current transform value (with bidirectional sync from Custom CSS)
  const getCurrentTransform = (): string | undefined => {
    if (!component) return undefined;

    // 🔥 BIDIRECTIONAL SYNC: First try to extract from Custom CSS
    const customCSS = (component.props.customCSS as string) || '';
    if (customCSS) {
      const extractedTransform = extractTransformFromCSS(customCSS);
      if (extractedTransform && Object.keys(extractedTransform).length > 0) {
        console.log('🔄 TransformControl: Syncing from Custom CSS', extractedTransform);
        // Convert parsed transform to CSS string
        const parts: string[] = [];
        if (extractedTransform.rotate !== undefined) parts.push(`rotate(${extractedTransform.rotate}deg)`);
        if (extractedTransform.translateX !== undefined) parts.push(`translateX(${extractedTransform.translateX}px)`);
        if (extractedTransform.translateY !== undefined) parts.push(`translateY(${extractedTransform.translateY}px)`);
        if (extractedTransform.scaleX !== undefined && extractedTransform.scaleY !== undefined) {
          if (extractedTransform.scaleX === extractedTransform.scaleY) {
            parts.push(`scale(${extractedTransform.scaleX})`);
          } else {
            parts.push(`scaleX(${extractedTransform.scaleX}) scaleY(${extractedTransform.scaleY})`);
          }
        }
        if (extractedTransform.skewX !== undefined) parts.push(`skewX(${extractedTransform.skewX}deg)`);
        if (extractedTransform.skewY !== undefined) parts.push(`skewY(${extractedTransform.skewY}deg)`);

        return parts.length > 0 ? parts.join(' ') : undefined;
      }
    }

    // Fallback: Parse from style properties (existing logic)
    const style = component.style;

    // Check responsive overrides
    if (deviceMode === 'mobile' && style.mobile?.transform) {
      return String(style.mobile.transform);
    }
    if (deviceMode === 'tablet' && style.tablet?.transform) {
      return String(style.tablet.transform);
    }

    return style.transform ? String(style.transform) : undefined;
  };

  const currentTransform = getCurrentTransform();
  const [values, setValues] = useState<TransformValues>(() => parseTransform(currentTransform));
  const [scaleLinked, setScaleLinked] = useState(true);

  // Sync with external changes (including Custom CSS)
  useEffect(() => {
    setValues(parseTransform(getCurrentTransform()));
  }, [component, deviceMode, component?.props.customCSS]);

  // Convert values to CSS transform string
  const valuesToCSS = (v: TransformValues): string => {
    const parts: string[] = [];

    if (v.rotate !== 0) parts.push(`rotate(${v.rotate}deg)`);
    if (v.scaleX !== 1 || v.scaleY !== 1) {
      if (v.scaleX === v.scaleY) {
        parts.push(`scale(${v.scaleX})`);
      } else {
        parts.push(`scaleX(${v.scaleX}) scaleY(${v.scaleY})`);
      }
    }
    if (v.skewX !== 0) parts.push(`skewX(${v.skewX}deg)`);
    if (v.skewY !== 0) parts.push(`skewY(${v.skewY}deg)`);
    if (v.translateX !== '0px' || v.translateY !== '0px') {
      parts.push(`translate(${v.translateX}, ${v.translateY})`);
    }

    return parts.length > 0 ? parts.join(' ') : 'none';
  };

  // Update transform
  const updateTransform = (newValues: TransformValues) => {
    setValues(newValues);
    const cssValue = valuesToCSS(newValues);
    updateResponsiveStyle(componentId, deviceMode, {
      transform: cssValue === 'none' ? undefined : cssValue,
    });
  };

  // Update single value
  const updateValue = (key: keyof TransformValues, value: number | string) => {
    const newValues = { ...values, [key]: value };

    // Handle linked scale
    if (scaleLinked && (key === 'scaleX' || key === 'scaleY')) {
      newValues.scaleX = value as number;
      newValues.scaleY = value as number;
    }

    updateTransform(newValues);
  };

  // Reset specific transform
  const resetTransform = (type: 'rotate' | 'scale' | 'skew' | 'translate') => {
    const newValues = { ...values };

    switch (type) {
      case 'rotate':
        newValues.rotate = 0;
        break;
      case 'scale':
        newValues.scaleX = 1;
        newValues.scaleY = 1;
        break;
      case 'skew':
        newValues.skewX = 0;
        newValues.skewY = 0;
        break;
      case 'translate':
        newValues.translateX = '0px';
        newValues.translateY = '0px';
        break;
    }

    updateTransform(newValues);
  };

  return (
    <div className="space-y-4">
      {/* Rotate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
            <RotateCw className="w-3 h-3" />
            Rotate
          </label>
          {values.rotate !== 0 && (
            <button
              onClick={() => resetTransform('rotate')}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
              title="Reset rotate"
            >
              <X className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={values.rotate}
            onChange={(e) => updateValue('rotate', parseInt(e.target.value))}
            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:bg-blue-600
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="relative">
            <input
              type="number"
              min="0"
              max="360"
              value={values.rotate}
              onChange={(e) => updateValue('rotate', parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-1 pr-6 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
              °
            </span>
          </div>
        </div>
      </div>

      {/* Scale */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-700">Scale</label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setScaleLinked(!scaleLinked)}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
              title={scaleLinked ? 'Unlink scale X/Y' : 'Link scale X/Y'}
            >
              {scaleLinked ? (
                <Link className="w-3 h-3 text-blue-600" />
              ) : (
                <Unlink className="w-3 h-3 text-slate-400" />
              )}
            </button>
            {(values.scaleX !== 1 || values.scaleY !== 1) && (
              <button
                onClick={() => resetTransform('scale')}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
                title="Reset scale"
              >
                <X className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 mb-0.5 block">Scale X</label>
            <input
              type="number"
              min="0.1"
              max="3"
              step="0.1"
              value={values.scaleX}
              onChange={(e) => updateValue('scaleX', parseFloat(e.target.value) || 1)}
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 mb-0.5 block">Scale Y</label>
            <input
              type="number"
              min="0.1"
              max="3"
              step="0.1"
              value={values.scaleY}
              onChange={(e) => updateValue('scaleY', parseFloat(e.target.value) || 1)}
              disabled={scaleLinked}
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Skew */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-700">Skew</label>
          {(values.skewX !== 0 || values.skewY !== 0) && (
            <button
              onClick={() => resetTransform('skew')}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
              title="Reset skew"
            >
              <X className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 mb-0.5 block">Skew X</label>
            <div className="relative">
              <input
                type="number"
                min="-45"
                max="45"
                value={values.skewX}
                onChange={(e) => updateValue('skewX', parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 pr-6 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
                °
              </span>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 mb-0.5 block">Skew Y</label>
            <div className="relative">
              <input
                type="number"
                min="-45"
                max="45"
                value={values.skewY}
                onChange={(e) => updateValue('skewY', parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 pr-6 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
                °
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Translate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-700">Translate</label>
          {(values.translateX !== '0px' || values.translateY !== '0px') && (
            <button
              onClick={() => resetTransform('translate')}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
              title="Reset translate"
            >
              <X className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 mb-0.5 block">Translate X</label>
            <input
              type="text"
              value={values.translateX}
              onChange={(e) => updateValue('translateX', e.target.value)}
              placeholder="0px"
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 mb-0.5 block">Translate Y</label>
            <input
              type="text"
              value={values.translateY}
              onChange={(e) => updateValue('translateY', e.target.value)}
              placeholder="0px"
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
        <div className="text-[10px] text-slate-500 mb-2">Preview:</div>
        <div className="w-full h-32 bg-white rounded flex items-center justify-center overflow-hidden">
          <div
            className="w-16 h-16 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-semibold transition-transform duration-200"
            style={{ transform: valuesToCSS(values) }}
          >
            Transform
          </div>
        </div>
      </div>

      {/* CSS Output */}
      <div className="text-[10px] text-slate-500 font-mono bg-slate-100 rounded p-2 break-all">
        {valuesToCSS(values)}
      </div>
    </div>
  );
}
