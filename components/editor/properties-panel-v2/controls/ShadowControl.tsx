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
    { value: 'xl', label: 'Extra', description: 'Strong shadow' },
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
        <div className="space-y-3">
          {/* Preset Selector - Visual Preview Buttons */}
          <div className="grid grid-cols-5 gap-2">
            {presets.map((p) => {
              // Get the box shadow for this preset
              let shadowStyle = 'none';
              switch (p.value) {
                case 'sm':
                  shadowStyle = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  break;
                case 'md':
                  shadowStyle = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                  break;
                case 'lg':
                  shadowStyle = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  break;
                case 'xl':
                  shadowStyle = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  break;
              }

              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => handlePresetSelect(p.value)}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-md border-2 transition-all
                    ${
                      preset === p.value
                        ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-500'
                        : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-sm'
                    }
                  `}
                  title={p.description}
                >
                  {/* Visual Box Preview with Shadow */}
                  <div
                    className="w-16 h-12 bg-white rounded-md mb-1 border border-gray-100"
                    style={{ boxShadow: shadowStyle }}
                  />
                  {/* Label */}
                  <span className="text-xs text-gray-600">{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Live Preview - Enhanced */}
          {preset !== 'none' && (
            <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm flex justify-center items-center">
              <div
                className="w-24 h-16 bg-white rounded-md flex items-center justify-center text-xs font-medium text-gray-600 transition-all"
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
                Shadow
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
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
                <span className="text-xs text-gray-400">px</span>
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
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
                <span className="text-xs text-gray-400">px</span>
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
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
                <span className="text-xs text-gray-400">px</span>
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
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
                <span className="text-xs text-gray-400">px</span>
              </div>
            </div>
          </div>

          {/* Shadow Color - Only Color Picker */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Shadow Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => onCustomChange?.('color', e.target.value)}
              className="w-full h-10 border-2 border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition-colors"
              title={color}
            />
          </div>

          {/* Live Preview (Custom) - Enhanced */}
          <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm flex justify-center items-center">
            <div
              className="w-24 h-16 bg-white rounded-md flex items-center justify-center text-xs font-medium text-gray-600 transition-all"
              style={{
                boxShadow: `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`,
                opacity: opacity / 100,
              }}
            >
              Shadow
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
