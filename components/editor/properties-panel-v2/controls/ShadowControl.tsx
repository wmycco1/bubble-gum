'use client';

/**
 * ShadowControl - Modern Shadow UI (V7.1)
 *
 * Features:
 * - Preset selector (none, sm, md, lg, xl)
 * - Custom shadow mode
 * - Live preview
 * - Opacity control (0-100%)
 * - User-friendly UX 2025
 */

import { useState } from 'react';

interface ShadowControlProps {
  label: string;
  /** Shadow preset */
  preset?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  /** Custom shadow parameters (for preset='custom') */
  offsetX?: number;
  offsetY?: number;
  blur?: number;
  spread?: number;
  color?: string;
  /** Shadow opacity (0-100%) */
  opacity?: number;
  /** Callback for preset change */
  onPresetChange: (preset: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'custom') => void;
  /** Callback for custom parameter change */
  onCustomChange?: (param: 'offsetX' | 'offsetY' | 'blur' | 'spread' | 'color', value: number | string) => void;
  /** Callback for opacity change */
  onOpacityChange?: (opacity: number) => void;
  description?: string;
}

export function ShadowControl({
  label,
  preset = 'none',
  offsetX = 0,
  offsetY = 4,
  blur = 6,
  spread = 0,
  color = '#000000',
  opacity = 100,
  onPresetChange,
  onCustomChange,
  onOpacityChange,
  description,
}: ShadowControlProps) {
  const [showCustom, setShowCustom] = useState(preset === 'custom');

  const presets: Array<{ value: 'none' | 'sm' | 'md' | 'lg' | 'xl'; label: string; description: string }> = [
    { value: 'none', label: 'None', description: 'No shadow' },
    { value: 'sm', label: 'Small', description: 'Subtle shadow' },
    { value: 'md', label: 'Medium', description: 'Default shadow' },
    { value: 'lg', label: 'Large', description: 'Pronounced shadow' },
    { value: 'xl', label: 'Extra Large', description: 'Strong shadow' },
  ];

  const handlePresetSelect = (value: 'none' | 'sm' | 'md' | 'lg' | 'xl') => {
    setShowCustom(false);
    onPresetChange(value);
  };

  const handleCustomToggle = () => {
    if (!showCustom) {
      setShowCustom(true);
      onPresetChange('custom');
    } else {
      setShowCustom(false);
      onPresetChange('md'); // Default preset
    }
  };

  return (
    <div className="mb-4">
      {/* Label */}
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {description && (
            <span className="block text-xs text-gray-500 font-normal mt-0.5">
              {description}
            </span>
          )}
        </label>
        <button
          type="button"
          onClick={handleCustomToggle}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          {showCustom ? 'Presets' : 'Custom'}
        </button>
      </div>

      {/* Preset Mode */}
      {!showCustom && (
        <div className="space-y-2">
          {/* Preset Selector */}
          <div className="grid grid-cols-5 gap-1">
            {presets.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => handlePresetSelect(p.value)}
                className={`
                  px-2 py-2 text-xs font-medium rounded border transition-all
                  ${
                    preset === p.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }
                `}
                title={p.description}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Live Preview */}
          {preset !== 'none' && (
            <div className="mt-3 p-4 bg-gray-50 rounded border border-gray-200 flex justify-center items-center">
              <div
                className="w-20 h-12 bg-white rounded flex items-center justify-center text-xs text-gray-600"
                style={{
                  boxShadow:
                    preset === 'sm'
                      ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                      : preset === 'md'
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        : preset === 'lg'
                          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                          : preset === 'xl'
                            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                            : 'none',
                  opacity: opacity / 100,
                }}
              >
                Preview
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Mode */}
      {showCustom && (
        <div className="space-y-3">
          {/* Custom Parameters Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Offset X */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Offset X</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={offsetX}
                  onChange={(e) => onCustomChange?.('offsetX', Number(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>

            {/* Offset Y */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Offset Y</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={offsetY}
                  onChange={(e) => onCustomChange?.('offsetY', Number(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>

            {/* Blur */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Blur</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  value={blur}
                  onChange={(e) => onCustomChange?.('blur', Number(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>

            {/* Spread */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Spread</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={spread}
                  onChange={(e) => onCustomChange?.('spread', Number(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>
          </div>

          {/* Shadow Color */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Shadow Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => onCustomChange?.('color', e.target.value)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => onCustomChange?.('color', e.target.value)}
                placeholder="#000000"
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Live Preview (Custom) */}
          <div className="mt-3 p-4 bg-gray-50 rounded border border-gray-200 flex justify-center items-center">
            <div
              className="w-20 h-12 bg-white rounded flex items-center justify-center text-xs text-gray-600"
              style={{
                boxShadow: `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`,
                opacity: opacity / 100,
              }}
            >
              Preview
            </div>
          </div>
        </div>
      )}

      {/* Opacity Slider (Both Modes) */}
      {preset !== 'none' && (
        <div className="mt-3">
          <label className="block text-xs text-gray-600 mb-1">
            Shadow Opacity: {opacity}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => onOpacityChange?.(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      )}
    </div>
  );
}
