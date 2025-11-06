'use client';

// ═══════════════════════════════════════════════════════════════
// ADVANCED PROPERTIES CONTROL - Transitions, Filters, Hover States
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - PHASE 4: Advanced Properties
// Features:
// - Transition controls (duration, timing, delay, properties)
// - Filter effects (blur, brightness, contrast, grayscale, hue-rotate, invert, saturate, sepia)
// - Hover state styling
// - Overflow control
// - Cursor type selector
// - Real-time preview
// ═══════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { Wand2, MousePointer, Eye, Settings } from 'lucide-react';

interface AdvancedPropertiesControlProps {
  componentId: string;
}

const TRANSITION_TIMINGS = [
  { value: 'linear', label: 'Linear' },
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
];

const OVERFLOW_OPTIONS = [
  { value: 'visible', label: 'Visible' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'scroll', label: 'Scroll' },
  { value: 'auto', label: 'Auto' },
];

const CURSOR_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'pointer', label: 'Pointer' },
  { value: 'text', label: 'Text' },
  { value: 'move', label: 'Move' },
  { value: 'not-allowed', label: 'Not Allowed' },
  { value: 'grab', label: 'Grab' },
  { value: 'grabbing', label: 'Grabbing' },
  { value: 'zoom-in', label: 'Zoom In' },
  { value: 'zoom-out', label: 'Zoom Out' },
];

export function AdvancedPropertiesControl({ componentId }: AdvancedPropertiesControlProps) {
  const components = useCanvasStore((state) => state.components);
  const updateComponentProps = useCanvasStore((state) => state.updateComponentProps);

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

  // Transition State
  const [transitionDuration, setTransitionDuration] = useState<number>(
    (component?.props.transitionDuration as number) || 300
  );
  const [transitionTiming, setTransitionTiming] = useState<string>(
    (component?.props.transitionTiming as string) || 'ease'
  );
  const [transitionDelay, setTransitionDelay] = useState<number>(
    (component?.props.transitionDelay as number) || 0
  );

  // Filter State
  const [filterBlur, setFilterBlur] = useState<number>(
    (component?.props.filterBlur as number) || 0
  );
  const [filterBrightness, setFilterBrightness] = useState<number>(
    (component?.props.filterBrightness as number) || 100
  );
  const [filterContrast, setFilterContrast] = useState<number>(
    (component?.props.filterContrast as number) || 100
  );
  const [filterGrayscale, setFilterGrayscale] = useState<number>(
    (component?.props.filterGrayscale as number) || 0
  );
  const [filterHueRotate, setFilterHueRotate] = useState<number>(
    (component?.props.filterHueRotate as number) || 0
  );
  const [filterInvert, setFilterInvert] = useState<number>(
    (component?.props.filterInvert as number) || 0
  );
  const [filterSaturate, setFilterSaturate] = useState<number>(
    (component?.props.filterSaturate as number) || 100
  );
  const [filterSepia, setFilterSepia] = useState<number>(
    (component?.props.filterSepia as number) || 0
  );

  // Hover State
  const [hoverBackgroundColor, setHoverBackgroundColor] = useState<string>(
    (component?.props.hoverBackgroundColor as string) || ''
  );
  const [hoverTextColor, setHoverTextColor] = useState<string>(
    (component?.props.hoverTextColor as string) || ''
  );
  const [hoverScale, setHoverScale] = useState<number>(
    (component?.props.hoverScale as number) || 1
  );

  // Other State
  const [overflow, setOverflow] = useState<string>(
    (component?.props.overflow as string) || 'visible'
  );
  const [cursor, setCursor] = useState<string>(
    (component?.props.cursor as string) || 'default'
  );

  // Sync with component changes
  useEffect(() => {
    if (!component) return;
    if (component.props.transitionDuration !== undefined) {
      setTransitionDuration(component.props.transitionDuration as number);
    }
    if (component.props.transitionTiming !== undefined) {
      setTransitionTiming(component.props.transitionTiming as string);
    }
    if (component.props.transitionDelay !== undefined) {
      setTransitionDelay(component.props.transitionDelay as number);
    }
    if (component.props.filterBlur !== undefined) {
      setFilterBlur(component.props.filterBlur as number);
    }
    if (component.props.filterBrightness !== undefined) {
      setFilterBrightness(component.props.filterBrightness as number);
    }
    if (component.props.filterContrast !== undefined) {
      setFilterContrast(component.props.filterContrast as number);
    }
    if (component.props.filterGrayscale !== undefined) {
      setFilterGrayscale(component.props.filterGrayscale as number);
    }
    if (component.props.filterHueRotate !== undefined) {
      setFilterHueRotate(component.props.filterHueRotate as number);
    }
    if (component.props.filterInvert !== undefined) {
      setFilterInvert(component.props.filterInvert as number);
    }
    if (component.props.filterSaturate !== undefined) {
      setFilterSaturate(component.props.filterSaturate as number);
    }
    if (component.props.filterSepia !== undefined) {
      setFilterSepia(component.props.filterSepia as number);
    }
    if (component.props.hoverBackgroundColor !== undefined) {
      setHoverBackgroundColor(component.props.hoverBackgroundColor as string);
    }
    if (component.props.hoverTextColor !== undefined) {
      setHoverTextColor(component.props.hoverTextColor as string);
    }
    if (component.props.hoverScale !== undefined) {
      setHoverScale(component.props.hoverScale as number);
    }
    if (component.props.overflow !== undefined) {
      setOverflow(component.props.overflow as string);
    }
    if (component.props.cursor !== undefined) {
      setCursor(component.props.cursor as string);
    }
  }, [component]);

  // Handlers
  const handleTransitionUpdate = (updates: {
    duration?: number;
    timing?: string;
    delay?: number;
  }) => {
    if (updates.duration !== undefined) {
      setTransitionDuration(updates.duration);
      updateComponentProps(componentId, { transitionDuration: updates.duration });
    }
    if (updates.timing !== undefined) {
      setTransitionTiming(updates.timing);
      updateComponentProps(componentId, { transitionTiming: updates.timing });
    }
    if (updates.delay !== undefined) {
      setTransitionDelay(updates.delay);
      updateComponentProps(componentId, { transitionDelay: updates.delay });
    }
  };

  const handleFilterUpdate = (filterName: string, value: number) => {
    const updates: Record<string, number> = {};
    updates[filterName] = value;

    switch (filterName) {
      case 'filterBlur':
        setFilterBlur(value);
        break;
      case 'filterBrightness':
        setFilterBrightness(value);
        break;
      case 'filterContrast':
        setFilterContrast(value);
        break;
      case 'filterGrayscale':
        setFilterGrayscale(value);
        break;
      case 'filterHueRotate':
        setFilterHueRotate(value);
        break;
      case 'filterInvert':
        setFilterInvert(value);
        break;
      case 'filterSaturate':
        setFilterSaturate(value);
        break;
      case 'filterSepia':
        setFilterSepia(value);
        break;
    }

    updateComponentProps(componentId, updates);
  };

  const handleHoverUpdate = (updates: {
    backgroundColor?: string;
    textColor?: string;
    scale?: number;
  }) => {
    if (updates.backgroundColor !== undefined) {
      setHoverBackgroundColor(updates.backgroundColor);
      updateComponentProps(componentId, { hoverBackgroundColor: updates.backgroundColor });
    }
    if (updates.textColor !== undefined) {
      setHoverTextColor(updates.textColor);
      updateComponentProps(componentId, { hoverTextColor: updates.textColor });
    }
    if (updates.scale !== undefined) {
      setHoverScale(updates.scale);
      updateComponentProps(componentId, { hoverScale: updates.scale });
    }
  };

  const handleReset = () => {
    const defaults = {
      transitionDuration: 300,
      transitionTiming: 'ease',
      transitionDelay: 0,
      filterBlur: 0,
      filterBrightness: 100,
      filterContrast: 100,
      filterGrayscale: 0,
      filterHueRotate: 0,
      filterInvert: 0,
      filterSaturate: 100,
      filterSepia: 0,
      hoverBackgroundColor: '',
      hoverTextColor: '',
      hoverScale: 1,
      overflow: 'visible',
      cursor: 'default',
    };

    setTransitionDuration(defaults.transitionDuration);
    setTransitionTiming(defaults.transitionTiming);
    setTransitionDelay(defaults.transitionDelay);
    setFilterBlur(defaults.filterBlur);
    setFilterBrightness(defaults.filterBrightness);
    setFilterContrast(defaults.filterContrast);
    setFilterGrayscale(defaults.filterGrayscale);
    setFilterHueRotate(defaults.filterHueRotate);
    setFilterInvert(defaults.filterInvert);
    setFilterSaturate(defaults.filterSaturate);
    setFilterSepia(defaults.filterSepia);
    setHoverBackgroundColor(defaults.hoverBackgroundColor);
    setHoverTextColor(defaults.hoverTextColor);
    setHoverScale(defaults.hoverScale);
    setOverflow(defaults.overflow);
    setCursor(defaults.cursor);

    updateComponentProps(componentId, defaults);
  };

  // Build filter CSS string
  const filterString = `blur(${filterBlur}px) brightness(${filterBrightness}%) contrast(${filterContrast}%) grayscale(${filterGrayscale}%) hue-rotate(${filterHueRotate}deg) invert(${filterInvert}%) saturate(${filterSaturate}%) sepia(${filterSepia}%)`;
  const hasActiveFilters =
    filterBlur > 0 ||
    filterBrightness !== 100 ||
    filterContrast !== 100 ||
    filterGrayscale > 0 ||
    filterHueRotate !== 0 ||
    filterInvert > 0 ||
    filterSaturate !== 100 ||
    filterSepia > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Advanced Properties</span>
        </div>
        <button
          onClick={handleReset}
          className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* TRANSITIONS SECTION */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wide">
          <Wand2 className="w-3.5 h-3.5" />
          Transitions
        </div>

        {/* Duration */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-700">Duration</label>
            <span className="text-xs text-slate-600">{transitionDuration}ms</span>
          </div>
          <input
            type="range"
            min="0"
            max="2000"
            step="50"
            value={transitionDuration}
            onChange={(e) => handleTransitionUpdate({ duration: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>0ms</span>
            <span>2000ms</span>
          </div>
        </div>

        {/* Timing Function */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-2 block">Timing Function</label>
          <div className="grid grid-cols-3 gap-2">
            {TRANSITION_TIMINGS.map((timing) => (
              <button
                key={timing.value}
                onClick={() => handleTransitionUpdate({ timing: timing.value })}
                className={`px-2 py-1.5 text-xs rounded-md border transition-all ${
                  transitionTiming === timing.value
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {timing.label}
              </button>
            ))}
          </div>
        </div>

        {/* Delay */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-700">Delay</label>
            <span className="text-xs text-slate-600">{transitionDelay}ms</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={transitionDelay}
            onChange={(e) => handleTransitionUpdate({ delay: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>0ms</span>
            <span>1000ms</span>
          </div>
        </div>
      </div>

      {/* FILTERS SECTION */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wide">
            <Eye className="w-3.5 h-3.5" />
            Filters
          </div>
          {hasActiveFilters && (
            <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Active</span>
          )}
        </div>

        {/* Blur */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-700">Blur</label>
            <span className="text-xs text-slate-600">{filterBlur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={filterBlur}
            onChange={(e) => handleFilterUpdate('filterBlur', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Brightness */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-700">Brightness</label>
            <span className="text-xs text-slate-600">{filterBrightness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            step="5"
            value={filterBrightness}
            onChange={(e) => handleFilterUpdate('filterBrightness', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Contrast */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-700">Contrast</label>
            <span className="text-xs text-slate-600">{filterContrast}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            step="5"
            value={filterContrast}
            onChange={(e) => handleFilterUpdate('filterContrast', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Grayscale */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-700">Grayscale</label>
            <span className="text-xs text-slate-600">{filterGrayscale}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filterGrayscale}
            onChange={(e) => handleFilterUpdate('filterGrayscale', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Hue Rotate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-700">Hue Rotate</label>
            <span className="text-xs text-slate-600">{filterHueRotate}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="10"
            value={filterHueRotate}
            onChange={(e) => handleFilterUpdate('filterHueRotate', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Invert */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-700">Invert</label>
            <span className="text-xs text-slate-600">{filterInvert}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filterInvert}
            onChange={(e) => handleFilterUpdate('filterInvert', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Saturate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-700">Saturate</label>
            <span className="text-xs text-slate-600">{filterSaturate}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            step="5"
            value={filterSaturate}
            onChange={(e) => handleFilterUpdate('filterSaturate', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Sepia */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-700">Sepia</label>
            <span className="text-xs text-slate-600">{filterSepia}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filterSepia}
            onChange={(e) => handleFilterUpdate('filterSepia', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Filter Preview */}
        {hasActiveFilters && (
          <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
            <p className="text-[10px] text-slate-600 mb-2">Filter Preview:</p>
            <div
              className="w-full h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded"
              style={{ filter: filterString }}
            />
          </div>
        )}
      </div>

      {/* HOVER STATE SECTION */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wide">
          <MousePointer className="w-3.5 h-3.5" />
          Hover State
        </div>

        {/* Hover Background Color */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-2 block">
            Background Color (Hover)
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={hoverBackgroundColor || '#ffffff'}
              onChange={(e) => handleHoverUpdate({ backgroundColor: e.target.value })}
              className="w-12 h-9 rounded border border-slate-200 cursor-pointer"
            />
            <input
              type="text"
              value={hoverBackgroundColor}
              onChange={(e) => handleHoverUpdate({ backgroundColor: e.target.value })}
              placeholder="#RRGGBB or transparent"
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>

        {/* Hover Text Color */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-2 block">
            Text Color (Hover)
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={hoverTextColor || '#000000'}
              onChange={(e) => handleHoverUpdate({ textColor: e.target.value })}
              className="w-12 h-9 rounded border border-slate-200 cursor-pointer"
            />
            <input
              type="text"
              value={hoverTextColor}
              onChange={(e) => handleHoverUpdate({ textColor: e.target.value })}
              placeholder="#RRGGBB or transparent"
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>

        {/* Hover Scale */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-700">Scale (Hover)</label>
            <span className="text-xs text-slate-600">{hoverScale.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.05"
            value={hoverScale}
            onChange={(e) => handleHoverUpdate({ scale: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>0.5x</span>
            <span>2.0x</span>
          </div>
        </div>
      </div>

      {/* OTHER PROPERTIES */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
          Other Properties
        </div>

        {/* Overflow */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-2 block">Overflow</label>
          <div className="grid grid-cols-2 gap-2">
            {OVERFLOW_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setOverflow(option.value);
                  updateComponentProps(componentId, { overflow: option.value });
                }}
                className={`px-3 py-2 text-xs rounded-md border transition-all ${
                  overflow === option.value
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cursor */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-2 block">Cursor Type</label>
          <select
            value={cursor}
            onChange={(e) => {
              setCursor(e.target.value);
              updateComponentProps(componentId, { cursor: e.target.value });
            }}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {CURSOR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Info */}
      <div className="text-[10px] text-slate-500 flex items-start gap-1 bg-blue-50 p-2 rounded">
        <Settings className="w-3 h-3 mt-0.5 flex-shrink-0" />
        <span>
          Advanced properties enhance interactivity and visual effects. Transitions apply to all property changes. Hover states require user interaction to preview.
        </span>
      </div>
    </div>
  );
}
