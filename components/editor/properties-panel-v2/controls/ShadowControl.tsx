'use client';

/**
 * convertUnit - Convert values between different CSS units
 * Two-step conversion: source unit → px → target unit
 * Smart rounding: px = integers, others = max 2 decimals, capped at 1000
 */
function convertUnit(
  value: number,
  fromUnit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw',
  toUnit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw'
): number {
  if (fromUnit === toUnit) return value;

  const baseFontSize = 16; // 1rem = 16px
  const referenceWidth = 400; // Reference container width for % calculations
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

  // Step 1: Convert from source unit to px
  let valueInPx = value;
  switch (fromUnit) {
    case 'rem':
      valueInPx = value * baseFontSize;
      break;
    case 'em':
      valueInPx = value * baseFontSize;
      break;
    case '%':
      valueInPx = (value / 100) * referenceWidth;
      break;
    case 'vh':
      valueInPx = (value / 100) * viewportHeight;
      break;
    case 'vw':
      valueInPx = (value / 100) * viewportWidth;
      break;
    case 'px':
    default:
      valueInPx = value;
  }

  // Step 2: Convert from px to target unit
  let result = valueInPx;
  switch (toUnit) {
    case 'rem':
      result = valueInPx / baseFontSize;
      break;
    case 'em':
      result = valueInPx / baseFontSize;
      break;
    case '%':
      result = (valueInPx / referenceWidth) * 100;
      break;
    case 'vh':
      result = (valueInPx / viewportHeight) * 100;
      break;
    case 'vw':
      result = (valueInPx / viewportWidth) * 100;
      break;
    case 'px':
    default:
      result = valueInPx;
  }

  // Smart rounding and capping
  // Cap at 1000 max
  result = Math.min(result, 1000);

  // Round based on unit: px = integers, others = max 2 decimals
  if (toUnit === 'px') {
    return Math.round(result);
  } else {
    return Math.round(result * 100) / 100;
  }
}

/**
 * formatDisplayValue - Format value for display (user-friendly)
 * Removes unnecessary trailing zeros
 */
function formatDisplayValue(value: number): string {
  // Remove trailing zeros after decimal point
  return value.toString().replace(/\.?0+$/, '');
}

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

import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * ShadowInput - Input with external increment/decrement buttons (horizontal layout)
 * Layout: [−] [input] [unit selector] [+]
 */
interface ShadowInputProps {
  value: number;
  unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  onChange: (value: number) => void;
  onUnitChange: (unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw') => void;
  min?: number;
  label: string;
}

function ShadowInput({ value, unit, onChange, onUnitChange, min, label }: ShadowInputProps) {
  const [isIncrementPressed, setIsIncrementPressed] = useState(false);
  const [isDecrementPressed, setIsDecrementPressed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speedRef = useRef(100);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const step = unit === 'px' ? 1 : 0.1;

  const handleIncrement = useCallback(() => {
    const currentValue = valueRef.current || 0;
    const newValue = Math.min(currentValue + step, 1000); // Cap at 1000
    onChange(newValue);
    valueRef.current = newValue;
  }, [onChange, step]);

  const handleDecrement = useCallback(() => {
    const currentValue = valueRef.current || 0;
    const newValue = currentValue - step;
    if (min === undefined || newValue >= min) {
      onChange(newValue);
      valueRef.current = newValue;
    }
  }, [onChange, step, min]);

  const startIncrement = () => {
    setIsIncrementPressed(true);
    handleIncrement();
    speedRef.current = 100;
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        handleIncrement();
        if (speedRef.current > 20) {
          speedRef.current = Math.max(20, speedRef.current - 10);
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = setInterval(handleIncrement, speedRef.current);
        }
      }, speedRef.current);
    }, 200);
  };

  const startDecrement = () => {
    setIsDecrementPressed(true);
    handleDecrement();
    speedRef.current = 100;
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        handleDecrement();
        if (speedRef.current > 20) {
          speedRef.current = Math.max(20, speedRef.current - 10);
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = setInterval(handleDecrement, speedRef.current);
        }
      }, speedRef.current);
    }, 200);
  };

  const stopChange = () => {
    setIsIncrementPressed(false);
    setIsDecrementPressed(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    speedRef.current = 100;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div>
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      <div className="flex items-center gap-1">
        {/* Decrement button (left) */}
        <button
          type="button"
          onMouseDown={startDecrement}
          onMouseUp={stopChange}
          onMouseLeave={stopChange}
          onTouchStart={startDecrement}
          onTouchEnd={stopChange}
          disabled={min !== undefined && value <= min}
          className={`
            px-2 py-1.5 border-2 rounded-md transition-all shadow-sm text-sm font-bold
            ${isDecrementPressed && !(min !== undefined && value <= min)
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
            }
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300
          `}
          title="Decrement (hold to repeat)"
        >
          −
        </button>

        {/* Input field */}
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            // Cap at 1000 and respect min
            const cappedValue = Math.min(Math.max(newValue, min ?? -Infinity), 1000);
            onChange(cappedValue);
          }}
          min={min}
          max={1000}
          step={step}
          title={`Exact value: ${value}${unit}`}
          className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ MozAppearance: 'textfield' }}
        />

        {/* Increment button */}
        <button
          type="button"
          onMouseDown={startIncrement}
          onMouseUp={stopChange}
          onMouseLeave={stopChange}
          onTouchStart={startIncrement}
          onTouchEnd={stopChange}
          className={`
            px-2 py-1.5 border-2 rounded-md transition-all shadow-sm text-sm font-bold
            ${isIncrementPressed
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
            }
          `}
          title="Increment (hold to repeat)"
        >
          +
        </button>

        {/* Unit selector (after + button) */}
        <select
          value={unit}
          onChange={(e) => {
            const newUnit = e.target.value as 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
            const convertedValue = convertUnit(value, unit, newUnit);
            onChange(convertedValue);
            onUnitChange(newUnit);
          }}
          className="px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm hover:border-gray-400 transition-colors"
        >
          <option value="px">px</option>
          <option value="rem">rem</option>
          <option value="em">em</option>
          <option value="%">%</option>
          <option value="vh">vh</option>
          <option value="vw">vw</option>
        </select>
      </div>
    </div>
  );
}

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
  /** Units for each shadow parameter */
  offsetXUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  offsetYUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  blurUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  spreadUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  /** Callback for preset change */
  onPresetChange: (preset: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'custom') => void;
  /** Callback for custom parameter change */
  onCustomChange?: (param: 'offsetX' | 'offsetY' | 'blur' | 'spread' | 'color', value: number | string) => void;
  /** Callback for unit change */
  onUnitChange?: (param: 'offsetX' | 'offsetY' | 'blur' | 'spread', unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw') => void;
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
  offsetXUnit = 'px',
  offsetYUnit = 'px',
  blurUnit = 'px',
  spreadUnit = 'px',
  onPresetChange,
  onCustomChange,
  onUnitChange,
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

      {/* Custom Mode - Compact Integrated Design */}
      {showCustom && (
        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
          {/* Live Preview at Top */}
          <div className="flex justify-center items-center mb-4 py-3">
            <div
              className="w-24 h-16 bg-white rounded-md flex items-center justify-center text-xs font-medium text-gray-600 transition-all shadow-md"
              style={{
                boxShadow: `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`,
                opacity: opacity / 100,
              }}
            >
              Shadow
            </div>
          </div>

          {/* Controls - Compact spacing */}
          <div className="space-y-1.5">
            {/* Offset X */}
            <ShadowInput
              label="X"
              value={offsetX}
              unit={offsetXUnit}
              onChange={(value) => onCustomChange?.('offsetX', value)}
              onUnitChange={(unit) => onUnitChange?.('offsetX', unit)}
            />

            {/* Offset Y */}
            <ShadowInput
              label="Y"
              value={offsetY}
              unit={offsetYUnit}
              onChange={(value) => onCustomChange?.('offsetY', value)}
              onUnitChange={(unit) => onUnitChange?.('offsetY', unit)}
            />

            {/* Blur */}
            <ShadowInput
              label="B"
              value={blur}
              unit={blurUnit}
              onChange={(value) => onCustomChange?.('blur', value)}
              onUnitChange={(unit) => onUnitChange?.('blur', unit)}
              min={0}
            />

            {/* Spread */}
            <ShadowInput
              label="S"
              value={spread}
              unit={spreadUnit}
              onChange={(value) => onCustomChange?.('spread', value)}
              onUnitChange={(unit) => onUnitChange?.('spread', unit)}
            />

            {/* Color & Opacity in one row */}
            <div className="flex items-center gap-2 pt-1">
              {/* Color */}
              <div className="flex items-center gap-1 flex-1">
                <label className="text-xs text-gray-600 whitespace-nowrap">Color:</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => onCustomChange?.('color', e.target.value)}
                  className="w-10 h-8 border border-gray-300 rounded cursor-pointer hover:border-blue-400 transition-colors"
                  title={color}
                />
              </div>

              {/* Opacity */}
              <div className="flex items-center gap-1 flex-1">
                <label className="text-xs text-gray-600 whitespace-nowrap">Opacity:</label>
                <span className="text-xs text-gray-700 font-medium min-w-[32px]">{opacity}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacity}
                  onChange={(e) => onOpacityChange?.(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Opacity Slider (Preset Mode Only - Custom has it integrated) */}
      {preset !== 'none' && !showCustom && (
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
