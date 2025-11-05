'use client';

// ═══════════════════════════════════════════════════════════════
// GRADIENT EDITOR - Professional Gradient Builder
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M1: Universal Styling System
// Features:
// - Gradient type: Linear / Radial
// - Angle slider (0-360° for linear)
// - Color stops editor (add/remove/reorder)
// - Position slider for each stop (0-100%)
// - Color picker per stop
// - Live preview
// - CSS output display
// - Preset gradients
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';
import { ColorPicker } from './ColorPicker';

interface ColorStop {
  id: string;
  color: string;
  position: number; // 0-100
}

interface GradientEditorProps {
  value?: string;
  onChange: (gradient: string) => void;
  label?: string;
}

// Preset gradients (popular combinations)
const PRESET_GRADIENTS = [
  { name: 'Sunset', value: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Forest', value: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)' },
  { name: 'Aurora', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { name: 'Fire', value: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)' },
  { name: 'Purple', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
];

/**
 * Parse gradient CSS string to extract type, angle, and color stops
 */
function parseGradient(gradient: string): {
  type: 'linear' | 'radial';
  angle: number;
  stops: ColorStop[];
} {
  // Default gradient
  const defaultGradient = {
    type: 'linear' as const,
    angle: 90,
    stops: [
      { id: '1', color: '#667eea', position: 0 },
      { id: '2', color: '#764ba2', position: 100 },
    ],
  };

  if (!gradient || gradient === 'none') return defaultGradient;

  // Linear gradient
  const linearMatch = gradient.match(/linear-gradient\((\d+)deg,\s*(.+)\)/);
  if (linearMatch) {
    const angle = parseInt(linearMatch[1] || '90');
    const stopsString = linearMatch[2] || '';
    const stops = parseColorStops(stopsString);
    return { type: 'linear', angle, stops };
  }

  // Radial gradient
  const radialMatch = gradient.match(/radial-gradient\((.+)\)/);
  if (radialMatch) {
    const stopsString = radialMatch[1] || '';
    const stops = parseColorStops(stopsString);
    return { type: 'radial', angle: 0, stops };
  }

  return defaultGradient;
}

/**
 * Parse color stops from gradient string
 * Example: "#667eea 0%, #764ba2 100%"
 */
function parseColorStops(stopsString: string): ColorStop[] {
  const stops: ColorStop[] = [];
  const stopMatches = stopsString.matchAll(/(#[0-9a-f]{6}|rgba?\([^)]+\))\s+(\d+)%/gi);

  let id = 1;
  for (const match of stopMatches) {
    const color = match[1] || '#000000';
    const position = parseInt(match[2] || '0');
    stops.push({ id: String(id++), color, position });
  }

  // Ensure at least 2 stops
  if (stops.length === 0) {
    stops.push(
      { id: '1', color: '#667eea', position: 0 },
      { id: '2', color: '#764ba2', position: 100 }
    );
  } else if (stops.length === 1) {
    stops.push({ id: '2', color: '#764ba2', position: 100 });
  }

  return stops;
}

/**
 * Build gradient CSS string from type, angle, and stops
 */
function buildGradient(type: 'linear' | 'radial', angle: number, stops: ColorStop[]): string {
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const stopsString = sortedStops.map(stop => `${stop.color} ${stop.position}%`).join(', ');

  if (type === 'linear') {
    return `linear-gradient(${angle}deg, ${stopsString})`;
  } else {
    return `radial-gradient(circle, ${stopsString})`;
  }
}

export function GradientEditor({ value, onChange, label }: GradientEditorProps) {
  const parsed = parseGradient(value || '');
  const [type, setType] = useState<'linear' | 'radial'>(parsed.type);
  const [angle, setAngle] = useState(parsed.angle);
  const [stops, setStops] = useState<ColorStop[]>(parsed.stops);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(stops[0]?.id || null);

  const updateGradient = (newType: 'linear' | 'radial', newAngle: number, newStops: ColorStop[]) => {
    const gradient = buildGradient(newType, newAngle, newStops);
    onChange(gradient);
  };

  const handleTypeChange = (newType: 'linear' | 'radial') => {
    setType(newType);
    updateGradient(newType, angle, stops);
  };

  const handleAngleChange = (newAngle: number) => {
    setAngle(newAngle);
    updateGradient(type, newAngle, stops);
  };

  const handleStopColorChange = (stopId: string, newColor: string) => {
    const newStops = stops.map(stop =>
      stop.id === stopId ? { ...stop, color: newColor } : stop
    );
    setStops(newStops);
    updateGradient(type, angle, newStops);
  };

  const handleStopPositionChange = (stopId: string, newPosition: number) => {
    const newStops = stops.map(stop =>
      stop.id === stopId ? { ...stop, position: newPosition } : stop
    );
    setStops(newStops);
    updateGradient(type, angle, newStops);
  };

  const handleAddStop = () => {
    // Add stop at 50% position with interpolated color
    const newId = String(Date.now());
    const newStop: ColorStop = {
      id: newId,
      color: '#999999',
      position: 50,
    };
    const newStops = [...stops, newStop].sort((a, b) => a.position - b.position);
    setStops(newStops);
    setSelectedStopId(newId);
    updateGradient(type, angle, newStops);
  };

  const handleRemoveStop = (stopId: string) => {
    if (stops.length <= 2) return; // Minimum 2 stops
    const newStops = stops.filter(stop => stop.id !== stopId);
    setStops(newStops);
    if (selectedStopId === stopId) {
      setSelectedStopId(newStops[0]?.id || null);
    }
    updateGradient(type, angle, newStops);
  };

  const handlePresetClick = (presetValue: string) => {
    const parsed = parseGradient(presetValue);
    setType(parsed.type);
    setAngle(parsed.angle);
    setStops(parsed.stops);
    setSelectedStopId(parsed.stops[0]?.id || null);
    onChange(presetValue);
  };

  const handleCopyCSS = () => {
    const gradient = buildGradient(type, angle, stops);
    navigator.clipboard.writeText(gradient);
  };

  const selectedStop = stops.find(stop => stop.id === selectedStopId);
  const currentGradient = buildGradient(type, angle, stops);

  return (
    <div className="space-y-4">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      {/* Gradient Type Toggle */}
      <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
        <button
          onClick={() => handleTypeChange('linear')}
          className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            type === 'linear'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Linear
        </button>
        <button
          onClick={() => handleTypeChange('radial')}
          className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            type === 'radial'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Radial
        </button>
      </div>

      {/* Angle Slider (Linear only) */}
      {type === 'linear' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-700">
              Angle
            </label>
            <span className="text-xs text-slate-600 font-mono">
              {angle}°
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => handleAngleChange(parseInt(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200"
          />
        </div>
      )}

      {/* Gradient Preview */}
      <div
        className="h-24 rounded-lg border-2 border-slate-300 relative overflow-hidden"
        style={{ background: currentGradient }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-white drop-shadow-lg bg-black/30 px-2 py-1 rounded">
            Preview
          </span>
        </div>
      </div>

      {/* Color Stops */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-700">
            Color Stops ({stops.length})
          </label>
          <button
            onClick={handleAddStop}
            className="p-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Add color stop"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stops list */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {stops.sort((a, b) => a.position - b.position).map((stop, index) => (
            <div
              key={stop.id}
              className={`flex items-center gap-2 p-2 rounded border-2 transition-colors cursor-pointer ${
                selectedStopId === stop.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              onClick={() => setSelectedStopId(stop.id)}
            >
              {/* Color swatch */}
              <div
                className="w-8 h-8 rounded border-2 border-slate-300 flex-shrink-0"
                style={{ backgroundColor: stop.color }}
              />

              {/* Position input */}
              <div className="flex-1">
                <div className="text-xs text-slate-600 mb-1">
                  Stop {index + 1}
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stop.position}
                  onChange={(e) => handleStopPositionChange(stop.id, parseInt(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-200"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="text-xs text-slate-600 font-mono mt-1">
                  {stop.position}%
                </div>
              </div>

              {/* Remove button */}
              {stops.length > 2 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveStop(stop.id);
                  }}
                  className="p-1.5 rounded border border-slate-300 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                  title="Remove stop"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Stop Color Picker */}
      {selectedStop && (
        <div className="border-t border-slate-200 pt-4">
          <ColorPicker
            value={selectedStop.color}
            onChange={(color) => handleStopColorChange(selectedStop.id, color)}
            showOpacity={true}
            showPresets={true}
            label={`Stop ${stops.findIndex(s => s.id === selectedStop.id) + 1} Color`}
          />
        </div>
      )}

      {/* CSS Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-700">
            CSS Output
          </label>
          <button
            onClick={handleCopyCSS}
            className="p-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Copy CSS"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="rounded-md bg-slate-900 p-3">
          <code className="text-xs text-green-400 font-mono break-all">
            {currentGradient}
          </code>
        </div>
      </div>

      {/* Preset Gradients */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-700">
          Presets
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PRESET_GRADIENTS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetClick(preset.value)}
              className="h-16 rounded-md border-2 border-slate-300 hover:border-slate-400 transition-all hover:scale-105 overflow-hidden relative"
              style={{ background: preset.value }}
              title={preset.name}
            >
              <div className="absolute inset-0 flex items-end justify-center pb-1">
                <span className="text-xs font-medium text-white drop-shadow-lg bg-black/40 px-2 rounded">
                  {preset.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
