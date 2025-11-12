'use client';

/**
 * TextShadowControl - Text Shadow with Live Preview (V8.1)
 *
 * Features:
 * - Preset selector (none, sm, md, lg, xl)
 * - Custom shadow mode
 * - Live text preview with actual text shadow
 * - Opacity control (0-100%)
 * - Modern 2025 UX
 */

import { useState } from 'react';

interface TextShadowControlProps {
  label: string;
  /** Text shadow preset */
  preset?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  /** Custom shadow parameters (for preset='custom') */
  offsetX?: number;
  offsetY?: number;
  blur?: number;
  color?: string;
  /** Shadow opacity (0-100%) */
  opacity?: number;
  /** Callback for preset change */
  onPresetChange: (preset: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'custom') => void;
  /** Callback for custom parameter change */
  onCustomChange?: (param: 'offsetX' | 'offsetY' | 'blur' | 'color', value: number | string) => void;
  /** Callback for opacity change */
  onOpacityChange?: (opacity: number) => void;
  description?: string;
}

export function TextShadowControl({
  label,
  preset = 'none',
  offsetX = 0,
  offsetY = 2,
  blur = 4,
  color = '#000000',
  opacity = 100,
  onPresetChange,
  onCustomChange,
  onOpacityChange,
  description,
}: TextShadowControlProps) {
  const [showCustom, setShowCustom] = useState(preset === 'custom');

  const presets: Array<{ value: 'none' | 'sm' | 'md' | 'lg' | 'xl'; label: string; description: string }> = [
    { value: 'none', label: 'None', description: 'No text shadow' },
    { value: 'sm', label: 'Small', description: 'Subtle text shadow' },
    { value: 'md', label: 'Medium', description: 'Default text shadow' },
    { value: 'lg', label: 'Large', description: 'Pronounced text shadow' },
    { value: 'xl', label: 'Extra', description: 'Strong text shadow' },
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

  // Calculate text shadow for preview with dynamic opacity
  const getPresetTextShadow = () => {
    const alpha = opacity / 100; // Convert 0-100 to 0-1
    switch (preset) {
      case 'none':
        return 'none';
      case 'sm':
        return `0 1px 2px rgba(0, 0, 0, ${0.4 * alpha})`;
      case 'md':
        return `0 2px 4px rgba(0, 0, 0, ${0.5 * alpha})`;
      case 'lg':
        return `0 3px 6px rgba(0, 0, 0, ${0.6 * alpha})`;
      case 'xl':
        return `0 4px 8px rgba(0, 0, 0, ${0.7 * alpha})`;
      default:
        return 'none';
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
              // Get the text shadow for this preset
              let shadowStyle = 'none';
              switch (p.value) {
                case 'sm':
                  shadowStyle = '0 1px 2px rgba(0, 0, 0, 0.4)';
                  break;
                case 'md':
                  shadowStyle = '0 2px 4px rgba(0, 0, 0, 0.5)';
                  break;
                case 'lg':
                  shadowStyle = '0 3px 6px rgba(0, 0, 0, 0.6)';
                  break;
                case 'xl':
                  shadowStyle = '0 4px 8px rgba(0, 0, 0, 0.7)';
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
                  {/* Visual Text Preview */}
                  <div
                    className="text-xl font-bold text-gray-800 mb-1"
                    style={{ textShadow: shadowStyle }}
                  >
                    Aa
                  </div>
                  {/* Label */}
                  <span className="text-xs text-gray-600">{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Live Preview - Text with Shadow */}
          {preset !== 'none' && (
            <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm flex justify-center items-center">
              <div
                className="text-3xl font-bold text-gray-800 transition-all"
                style={{
                  textShadow: getPresetTextShadow(),
                }}
              >
                Text Shadow
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Mode */}
      {showCustom && (
        <div className="space-y-3">
          {/* Custom Parameters Grid */}
          <div className="grid grid-cols-3 gap-2">
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
                <span className="text-xs text-gray-400 flex-shrink-0">px</span>
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
                <span className="text-xs text-gray-400 flex-shrink-0">px</span>
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
                <span className="text-xs text-gray-400 flex-shrink-0">px</span>
              </div>
            </div>
          </div>

          {/* Shadow Color */}
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

          {/* Live Preview (Custom) - Text with Shadow */}
          <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm flex justify-center items-center">
            <div
              className="text-3xl font-bold text-gray-800 transition-all"
              style={{
                textShadow: (() => {
                  // Convert hex color to rgba with opacity
                  const hex = color.replace('#', '');
                  const r = parseInt(hex.substring(0, 2), 16);
                  const g = parseInt(hex.substring(2, 4), 16);
                  const b = parseInt(hex.substring(4, 6), 16);
                  const alpha = opacity / 100;
                  return `${offsetX}px ${offsetY}px ${blur}px rgba(${r}, ${g}, ${b}, ${alpha})`;
                })(),
              }}
            >
              Text Shadow
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
