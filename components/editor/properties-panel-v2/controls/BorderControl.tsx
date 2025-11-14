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
 * BorderControl - Modern UI for Border (V8.0 - External Buttons)
 *
 * Features:
 * - Visual border style selector (Simple mode)
 * - Figma-like box model preview (Advanced mode)
 * - Individual side controls with colors
 * - External hold-to-repeat buttons (NumberControl pattern)
 * - User-friendly UX 2025
 */

import React, { useState } from 'react';

interface BorderControlProps {
  label: string;
  /** Shorthand value for all sides */
  value?: number;
  /** Individual side values (override shorthand) */
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  /** Border style */
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  /** Border color (shorthand for all sides) */
  borderColor?: string;
  /** Individual side colors (override shorthand) */
  topColor?: string;
  rightColor?: string;
  bottomColor?: string;
  leftColor?: string;
  /** Unit selectors for each side (Advanced mode) */
  topUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  rightUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  bottomUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  leftUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  /** Callback for shorthand change */
  onChange: (name: string, value: number | undefined) => void;
  /** Callback for individual side change */
  onSideChange?: (side: 'Top' | 'Right' | 'Bottom' | 'Left', value: number | undefined) => void;
  /** Callback for unit change */
  onUnitChange?: (side: 'Top' | 'Right' | 'Bottom' | 'Left', unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw') => void;
  /** Callback for style change */
  onStyleChange?: (style: string) => void;
  /** Callback for color change (shorthand) */
  onColorChange?: (color: string) => void;
  /** Callback for individual side color change (can be undefined to clear) */
  onSideColorChange?: (side: 'Top' | 'Right' | 'Bottom' | 'Left', color: string | undefined) => void;
  description?: string;
}

// Border style options with visual previews
const BORDER_STYLES = [
  { value: 'none', label: 'None', preview: 'none' },
  { value: 'solid', label: 'Solid', preview: 'solid' },
  { value: 'dashed', label: 'Dashed', preview: 'dashed' },
  { value: 'dotted', label: 'Dotted', preview: 'dotted' },
  { value: 'double', label: 'Double', preview: 'double' },
];

/**
 * BorderWidthInput - Width input with external hold-to-repeat buttons (Simple mode)
 */
interface BorderWidthInputProps {
  value?: number;
  unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUnitChange?: (unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw') => void;
  step: number;
  onValueChange: (value: number | undefined) => void;
}

function BorderWidthInput({ value, unit, onChange, onUnitChange, step, onValueChange }: BorderWidthInputProps) {
  const [isIncrementPressed, setIsIncrementPressed] = React.useState(false);
  const [isDecrementPressed, setIsDecrementPressed] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const speedRef = React.useRef(100);
  const valueRef = React.useRef(value);

  // Update ref when value changes
  React.useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleIncrement = React.useCallback(() => {
    const currentValue = valueRef.current || 0;
    const newValue = currentValue + step;
    // Create synthetic event for onChange
    const syntheticEvent = {
      target: { value: String(newValue) },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    valueRef.current = newValue;
  }, [onChange, step]);

  const handleDecrement = React.useCallback(() => {
    const currentValue = valueRef.current || 0;
    const newValue = Math.max(0, currentValue - step);
    const syntheticEvent = {
      target: { value: String(newValue) },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    valueRef.current = newValue;
  }, [onChange, step]);

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

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="flex items-center gap-1">
      <div className="relative flex-1">
        <input
          type="number"
          min="0"
          step={step}
          value={value ?? ''}
          onChange={onChange}
          placeholder="0"
          title={value !== undefined && value !== null ? `Exact value: ${value}${unit}` : '0'}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ MozAppearance: 'textfield' }}
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          onMouseDown={startIncrement}
          onMouseUp={stopChange}
          onMouseLeave={stopChange}
          onTouchStart={startIncrement}
          onTouchEnd={stopChange}
          className={`
            p-1 border-2 rounded-md transition-all shadow-sm
            ${isIncrementPressed
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
            }
          `}
          title="Increment (hold to repeat)"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          onMouseDown={startDecrement}
          onMouseUp={stopChange}
          onMouseLeave={stopChange}
          onTouchStart={startDecrement}
          onTouchEnd={stopChange}
          disabled={(value || 0) <= 0}
          className={`
            p-1 border-2 rounded-md transition-all shadow-sm
            ${isDecrementPressed && (value || 0) > 0
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
            }
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300
          `}
          title="Decrement (hold to repeat)"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * BorderSideControl - Vertical control for each side (Advanced mode) - Like SpacingControl
 */
interface BorderSideControlProps {
  side: 'Top' | 'Right' | 'Bottom' | 'Left';
  value?: number;
  fallbackValue?: number;
  unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  color: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUnitChange: (unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw') => void;
  onColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step: number;
}

function BorderSideControl({
  side,
  value,
  fallbackValue,
  unit,
  color,
  onChange,
  onUnitChange,
  onColorChange,
  step,
}: BorderSideControlProps) {
  const [isIncrementPressed, setIsIncrementPressed] = React.useState(false);
  const [isDecrementPressed, setIsDecrementPressed] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const speedRef = React.useRef(100);
  const displayValue = value ?? fallbackValue ?? '';
  const valueRef = React.useRef(typeof displayValue === 'number' ? displayValue : 0);

  React.useEffect(() => {
    valueRef.current = typeof displayValue === 'number' ? displayValue : 0;
  }, [displayValue]);

  const handleIncrement = React.useCallback(() => {
    const currentValue = valueRef.current || 0;
    const newValue = currentValue + step;
    const syntheticEvent = {
      target: { value: String(newValue) },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    valueRef.current = newValue;
  }, [onChange, step]);

  const handleDecrement = React.useCallback(() => {
    const currentValue = valueRef.current || 0;
    const newValue = Math.max(0, currentValue - step);
    const syntheticEvent = {
      target: { value: String(newValue) },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    valueRef.current = newValue;
  }, [onChange, step]);

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

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Vertical layout: [- +] → input → unit → color
  return (
    <div className="flex flex-col items-center gap-1">
      {/* - and + buttons (horizontal) */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onMouseDown={startDecrement}
          onMouseUp={stopChange}
          onMouseLeave={stopChange}
          onTouchStart={startDecrement}
          onTouchEnd={stopChange}
          disabled={valueRef.current <= 0}
          className={`
            px-1.5 py-0.5 text-sm font-bold border rounded transition-all
            ${isDecrementPressed && valueRef.current > 0
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
            }
            disabled:opacity-40 disabled:cursor-not-allowed
          `}
          title="Decrement (hold to repeat)"
        >
          −
        </button>
        <button
          type="button"
          onMouseDown={startIncrement}
          onMouseUp={stopChange}
          onMouseLeave={stopChange}
          onTouchStart={startIncrement}
          onTouchEnd={stopChange}
          className={`
            px-1.5 py-0.5 text-sm font-bold border rounded transition-all
            ${isIncrementPressed
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
            }
          `}
          title="Increment (hold to repeat)"
        >
          +
        </button>
      </div>

      {/* Input field */}
      <input
        type="number"
        min="0"
        step={step}
        value={displayValue}
        onChange={onChange}
        placeholder="0"
        title={displayValue !== '' && displayValue !== null && displayValue !== undefined ? `Exact value: ${displayValue}${unit}` : '0'}
        className="w-14 px-1 py-1 text-xs text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        style={{ MozAppearance: 'textfield' }}
      />

      {/* Unit selector dropdown */}
      <select
        value={unit}
        onChange={(e) => {
          const newUnit = e.target.value as 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';

          // Convert value if it exists
          if (displayValue && typeof displayValue === 'number') {
            const convertedValue = convertUnit(displayValue, unit, newUnit);
            const syntheticEvent = {
              target: { value: String(convertedValue) },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
          }

          onUnitChange(newUnit);
        }}
        className="w-14 px-1 py-0.5 text-xs border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option value="px">px</option>
        <option value="rem">rem</option>
        <option value="em">em</option>
        <option value="%">%</option>
        <option value="vh">vh</option>
        <option value="vw">vw</option>
      </select>

      {/* Color picker */}
      <input
        type="color"
        value={color}
        onChange={onColorChange}
        className="w-14 h-7 border-2 border-gray-300 rounded cursor-pointer shadow-sm hover:border-blue-400 transition-colors"
        title={`${side} color`}
      />
    </div>
  );
}

export function BorderControl({
  label,
  value,
  top,
  right,
  bottom,
  left,
  borderStyle = 'none',
  borderColor = '#000000',
  topColor,
  rightColor,
  bottomColor,
  leftColor,
  topUnit = 'px',
  rightUnit = 'px',
  bottomUnit = 'px',
  leftUnit = 'px',
  onChange,
  onSideChange,
  onUnitChange,
  onStyleChange,
  onColorChange,
  onSideColorChange,
  description,
}: BorderControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [unit, setUnit] = useState<'px' | 'rem' | 'em' | '%' | 'vh' | 'vw'>('px');

  // Check if any individual sides are set
  const hasIndividualValues = top !== undefined || right !== undefined || bottom !== undefined || left !== undefined;

  const handleShorthandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);

    // Clear individual sides if they exist (to apply shorthand)
    if (onSideChange && hasIndividualValues) {
      setTimeout(() => {
        onSideChange('Top', undefined);
        onSideChange('Right', undefined);
        onSideChange('Bottom', undefined);
        onSideChange('Left', undefined);
        onChange('borderWidth', newValue);
      }, 0);
    } else {
      onChange('borderWidth', newValue);
    }
  };

  const handleSideChange = (side: 'Top' | 'Right' | 'Bottom' | 'Left', e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);
    if (onSideChange) {
      onSideChange(side, newValue);
    }
  };

  const handleStyleClick = (style: string) => {
    if (onStyleChange) {
      onStyleChange(style);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    const hasIndividualColors = topColor !== undefined || rightColor !== undefined || bottomColor !== undefined || leftColor !== undefined;

    if (onSideColorChange && hasIndividualColors && onColorChange) {
      setTimeout(() => {
        onSideColorChange('Top', undefined);
        onSideColorChange('Right', undefined);
        onSideColorChange('Bottom', undefined);
        onSideColorChange('Left', undefined);
        onColorChange(newColor);
      }, 0);
    } else if (onColorChange) {
      onColorChange(newColor);
    }
  };

  const handleSideColorChange = (side: 'Top' | 'Right' | 'Bottom' | 'Left', e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSideColorChange) {
      onSideColorChange(side, e.target.value);
    }
  };

  const handleUnitChange = (side: 'Top' | 'Right' | 'Bottom' | 'Left', newUnit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw') => {
    if (onUnitChange) {
      onUnitChange(side, newUnit);
    }
  };

  return (
    <div className="mb-4">
      {/* Label & Expand Button */}
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
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          {isExpanded ? 'Simple' : 'Advanced'}
        </button>
      </div>

      {/* Simple Mode */}
      {!isExpanded && (
        <div className="space-y-3">
          {/* Visual Border Style Selector */}
          <div>
            <label className="block text-xs text-gray-600 mb-2">Style</label>
            <div className="grid grid-cols-5 gap-1">
              {BORDER_STYLES.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => handleStyleClick(style.value)}
                  className={`
                    flex flex-col items-center justify-center p-2 rounded-md transition-all
                    ${borderStyle === style.value
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'ring-1 ring-gray-200 hover:ring-gray-300 bg-white'
                    }
                  `}
                  title={style.label}
                >
                  {/* Visual Preview */}
                  <div className="w-full h-8 flex items-center justify-center mb-1">
                    {style.value === 'none' ? (
                      <div className="w-full h-0.5 bg-gray-200 relative">
                        <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">×</span>
                      </div>
                    ) : (
                      <div
                        className="w-full h-0"
                        style={{
                          borderTop: `3px ${style.preview} ${borderStyle === style.value ? '#3b82f6' : '#374151'}`,
                        }}
                      />
                    )}
                  </div>
                  {/* Label */}
                  <span className={`text-xs ${borderStyle === style.value ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                    {style.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Width & Color */}
          <div className="grid grid-cols-2 gap-2">
            {/* Width */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Width</label>
              <div className="flex items-center gap-1">
                <BorderWidthInput
                  value={value}
                  unit={unit}
                  onChange={handleShorthandChange}
                  onValueChange={(newValue) => onChange('border', newValue)}
                  step={unit === 'px' ? 1 : 0.1}
                />
                <select
                  value={unit}
                  onChange={(e) => {
                    const newUnit = e.target.value as 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';

                    // Convert value to new unit if value exists
                    if (value !== undefined && value !== null) {
                      const convertedValue = convertUnit(value, unit, newUnit);
                      onChange('border', convertedValue);
                    }

                    // Update unit for all 4 sides (so canvas displays the new unit)
                    if (onUnitChange) {
                      onUnitChange('Top', newUnit);
                      onUnitChange('Right', newUnit);
                      onUnitChange('Bottom', newUnit);
                      onUnitChange('Left', newUnit);
                    }

                    // Update local state
                    setUnit(newUnit);
                  }}
                  className="px-2 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
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

            {/* Color */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Color</label>
              <input
                type="color"
                value={borderColor}
                onChange={handleColorChange}
                className="w-full h-9 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Advanced Mode - Revolutionary Visual Design */}
      {isExpanded && (
        <div className="space-y-2">
          {/* Visual Border Style Selector */}
          <div>
            <label className="block text-xs text-gray-600 mb-2">Style</label>
            <div className="grid grid-cols-5 gap-1">
              {BORDER_STYLES.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => handleStyleClick(style.value)}
                  className={`
                    flex flex-col items-center justify-center p-2 rounded-md transition-all
                    ${borderStyle === style.value
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'ring-1 ring-gray-200 hover:ring-gray-300 bg-white'
                    }
                  `}
                  title={style.label}
                >
                  <div className="w-full h-8 flex items-center justify-center mb-1">
                    {style.value === 'none' ? (
                      <div className="w-full h-0.5 bg-gray-200 relative">
                        <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">×</span>
                      </div>
                    ) : (
                      <div
                        className="w-full h-0"
                        style={{
                          borderTop: `3px ${style.preview} ${borderStyle === style.value ? '#3b82f6' : '#374151'}`,
                        }}
                      />
                    )}
                  </div>
                  <span className={`text-xs ${borderStyle === style.value ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                    {style.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Border Box Model with Visual Indicators */}
          <div className="relative p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm" style={{ minHeight: '380px' }}>
            {/* Center Preview Box - Adaptive */}
            <div
              className="absolute"
              style={{
                top: '50px',
                left: '50px',
                right: '50px',
                bottom: '50px',
                margin: '5%',
                overflow: 'visible',
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center" style={{ overflow: 'visible' }}>
                {/* Preview Box with Dynamic Borders */}
                <div
                  className="relative bg-white flex items-center justify-center shadow-xl transition-all duration-300"
                  style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '200px',
                    maxHeight: '140px',
                    minWidth: '80px',
                    minHeight: '60px',
                    aspectRatio: '1 / 1',
                    overflow: 'visible',
                    borderTopWidth: `${top ?? value ?? 0}px`,
                    borderRightWidth: `${right ?? value ?? 0}px`,
                    borderBottomWidth: `${bottom ?? value ?? 0}px`,
                    borderLeftWidth: `${left ?? value ?? 0}px`,
                    borderStyle: borderStyle,
                    borderTopColor: topColor ?? borderColor,
                    borderRightColor: rightColor ?? borderColor,
                    borderBottomColor: bottomColor ?? borderColor,
                    borderLeftColor: leftColor ?? borderColor,
                  }}
                >
                  {/* Content area label */}
                  <span className="text-2xl font-bold text-gray-400 z-10 relative">B</span>

                  {/* Arrows pointing INWARD to sides */}

                  {/* Top Arrow - Points DOWN */}
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 top-2 pointer-events-none z-20 rounded-full bg-white shadow-sm text-gray-900"
                    title="Top"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7l7 7l7-7" />
                    </svg>
                  </div>

                  {/* Right Arrow - Points LEFT */}
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 right-2 pointer-events-none z-20 rounded-full bg-white shadow-sm text-gray-900"
                    title="Right"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7l7 7" />
                    </svg>
                  </div>

                  {/* Bottom Arrow - Points UP */}
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 bottom-2 pointer-events-none z-20 rounded-full bg-white shadow-sm text-gray-900"
                    title="Bottom"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m-7 7l7-7l7 7" />
                    </svg>
                  </div>

                  {/* Left Arrow - Points RIGHT */}
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 left-2 pointer-events-none z-20 rounded-full bg-white shadow-sm text-gray-900"
                    title="Left"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7l-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Control */}
            <div className="absolute" style={{ top: '2%', left: '50%', transform: 'translateX(-50%)' }}>
              <BorderSideControl
                side="Top"
                value={top}
                fallbackValue={value}
                unit={topUnit}
                color={topColor ?? borderColor}
                onChange={(e) => handleSideChange('Top', e)}
                onUnitChange={(newUnit) => handleUnitChange('Top', newUnit)}
                onColorChange={(e) => handleSideColorChange('Top', e)}
                step={topUnit === 'px' ? 1 : 0.1}
              />
            </div>

            {/* Right Control */}
            <div className="absolute" style={{ top: '50%', right: '2%', transform: 'translateY(-50%)' }}>
              <BorderSideControl
                side="Right"
                value={right}
                fallbackValue={value}
                unit={rightUnit}
                color={rightColor ?? borderColor}
                onChange={(e) => handleSideChange('Right', e)}
                onUnitChange={(newUnit) => handleUnitChange('Right', newUnit)}
                onColorChange={(e) => handleSideColorChange('Right', e)}
                step={rightUnit === 'px' ? 1 : 0.1}
              />
            </div>

            {/* Bottom Control */}
            <div className="absolute" style={{ bottom: '2%', left: '50%', transform: 'translateX(-50%)' }}>
              <BorderSideControl
                side="Bottom"
                value={bottom}
                fallbackValue={value}
                unit={bottomUnit}
                color={bottomColor ?? borderColor}
                onChange={(e) => handleSideChange('Bottom', e)}
                onUnitChange={(newUnit) => handleUnitChange('Bottom', newUnit)}
                onColorChange={(e) => handleSideColorChange('Bottom', e)}
                step={bottomUnit === 'px' ? 1 : 0.1}
              />
            </div>

            {/* Left Control */}
            <div className="absolute" style={{ top: '50%', left: '2%', transform: 'translateY(-50%)' }}>
              <BorderSideControl
                side="Left"
                value={left}
                fallbackValue={value}
                unit={leftUnit}
                color={leftColor ?? borderColor}
                onChange={(e) => handleSideChange('Left', e)}
                onUnitChange={(newUnit) => handleUnitChange('Left', newUnit)}
                onColorChange={(e) => handleSideColorChange('Left', e)}
                step={leftUnit === 'px' ? 1 : 0.1}
              />
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-gray-500 text-center">
            {hasIndividualValues
              ? 'Individual values override "All sides"'
              : 'Leave empty to use "All sides" value'}
          </p>
        </div>
      )}
    </div>
  );
}
