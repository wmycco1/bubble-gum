'use client';

// ═══════════════════════════════════════════════════════════════
// COLOR PICKER - Professional Color Selection Component
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M1: Universal Styling System
// Features:
// - Native color picker with custom UI
// - Opacity slider (0-100%)
// - Hex, RGB, RGBA input/output
// - Preset colors (common palette)
// - Recent colors (localStorage)
// - Clear button
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  showOpacity?: boolean;
  showPresets?: boolean;
  label?: string;
}

// Preset color palette (Material Design inspired)
const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#F44336', '#E91E63', '#9C27B0', '#673AB7',
  '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
  '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
];

/**
 * Convert hex to RGBA
 */
function hexToRgba(hex: string, opacity: number = 1): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result || !result[1] || !result[2] || !result[3]) return `rgba(0, 0, 0, ${opacity})`;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Extract hex and opacity from rgba/hex string
 */
function parseColor(color?: string): { hex: string; opacity: number } {
  if (!color) return { hex: '#000000', opacity: 1 };

  // RGBA format
  const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch) {
    const r = (parseInt(rgbaMatch[1] || '0')).toString(16).padStart(2, '0');
    const g = (parseInt(rgbaMatch[2] || '0')).toString(16).padStart(2, '0');
    const b = (parseInt(rgbaMatch[3] || '0')).toString(16).padStart(2, '0');
    const opacity = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;
    return { hex: `#${r}${g}${b}`, opacity };
  }

  // Hex format (with or without #)
  const hexMatch = color.match(/^#?([a-f\d]{6})$/i);
  if (hexMatch) {
    return { hex: `#${hexMatch[1] || '000000'}`, opacity: 1 };
  }

  return { hex: '#000000', opacity: 1 };
}

/**
 * Load recent colors from localStorage
 */
function getRecentColors(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('colorPicker:recentColors');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save color to recent colors
 */
function saveToRecentColors(color: string) {
  if (typeof window === 'undefined') return;
  try {
    const recent = getRecentColors();
    const newRecent = [color, ...recent.filter(c => c !== color)].slice(0, 8);
    localStorage.setItem('colorPicker:recentColors', JSON.stringify(newRecent));
  } catch {
    // Ignore localStorage errors
  }
}

export function ColorPicker({
  value = '#000000',
  onChange,
  showOpacity = true,
  showPresets = true,
  label,
}: ColorPickerProps) {
  const [recentColors, setRecentColors] = useState<string[]>([]);

  // Parse current color
  const { hex, opacity: currentOpacity } = parseColor(value);
  const [selectedHex, setSelectedHex] = useState(hex);
  const [opacity, setOpacity] = useState(Math.round(currentOpacity * 100));

  // Load recent colors on mount
  useEffect(() => {
    setRecentColors(getRecentColors());
  }, []);

  // Sync with external value changes
  useEffect(() => {
    const parsed = parseColor(value);
    setSelectedHex(parsed.hex);
    setOpacity(Math.round(parsed.opacity * 100));
  }, [value]);

  const handleHexChange = (newHex: string) => {
    setSelectedHex(newHex);
    const newColor = showOpacity && opacity < 100
      ? hexToRgba(newHex, opacity / 100)
      : newHex;
    onChange(newColor);
    saveToRecentColors(newColor);
    setRecentColors(getRecentColors());
  };

  const handleOpacityChange = (newOpacity: number) => {
    setOpacity(newOpacity);
    const newColor = newOpacity < 100
      ? hexToRgba(selectedHex, newOpacity / 100)
      : selectedHex;
    onChange(newColor);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      {/* Main Color Picker */}
      <div className="flex items-center gap-2">
        {/* Color swatch + native picker */}
        <div className="relative">
          <input
            type="color"
            value={selectedHex}
            onChange={(e) => handleHexChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Pick a color"
          />
          <div
            className="w-12 h-12 rounded-sm border-2 border-slate-300 cursor-pointer transition-all hover:border-slate-400 hover:scale-105"
            style={{
              backgroundColor: showOpacity && opacity < 100
                ? hexToRgba(selectedHex, opacity / 100)
                : selectedHex,
            }}
            title="Click to pick color"
          />
        </div>

        {/* Hex input */}
        <input
          type="text"
          value={selectedHex}
          onChange={(e) => {
            const hex = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
              setSelectedHex(hex);
              if (hex.length === 7) {
                handleHexChange(hex);
              }
            }
          }}
          placeholder="#000000"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
        />

        {/* Clear button */}
        {value && (
          <button
            onClick={handleClear}
            className="p-2 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Clear color"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Opacity Slider */}
      {showOpacity && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-700">
              Opacity
            </label>
            <span className="text-xs text-slate-600 font-mono">
              {opacity}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => handleOpacityChange(parseInt(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-transparent to-current"
            style={{ color: selectedHex }}
          />
        </div>
      )}

      {/* Preset Colors */}
      {showPresets && (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700">
            Presets
          </label>
          <div className="grid grid-cols-9 gap-1.5">
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => handleHexChange(presetColor)}
                className={`w-8 h-8 rounded-sm border-2 transition-all hover:scale-110 ${
                  selectedHex.toLowerCase() === presetColor.toLowerCase()
                    ? 'border-slate-900 ring-2 ring-slate-900 ring-offset-2'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
                style={{ backgroundColor: presetColor }}
                title={presetColor}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Colors */}
      {recentColors.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700">
            Recently Used
          </label>
          <div className="flex flex-wrap gap-1.5">
            {recentColors.map((recentColor, index) => {
              const { hex: recentHex, opacity: recentOpacity } = parseColor(recentColor);
              return (
                <button
                  key={`${recentColor}-${index}`}
                  onClick={() => onChange(recentColor)}
                  className="w-8 h-8 rounded-sm border-2 border-slate-300 transition-all hover:scale-110 hover:border-slate-400"
                  style={{ backgroundColor: recentColor }}
                  title={`${recentHex} ${recentOpacity < 1 ? `(${Math.round(recentOpacity * 100)}%)` : ''}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
