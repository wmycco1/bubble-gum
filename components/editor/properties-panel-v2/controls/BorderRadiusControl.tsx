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
 * BorderRadiusControl - Modern UI for Border Radius (V9.1 - Visual Perfection)
 *
 * Features:
 * - All-corners input (Simple mode)
 * - Revolutionary corner-based controls (Advanced mode)
 * - Hold-to-repeat increment/decrement buttons (BOTH modes)
 * - Independent unit selectors for each corner (px, rem, em, %)
 * - Diagonal arrows inside preview box pointing TO center
 * - Visual gradient indicators in corners showing radius changes
 * - Corner controls positioned around preview box
 * - Individual corner controls with live preview
 * - User-friendly UX 2025
 *
 * V9.1 Fixes (Nov 12, 2025) - VISUAL PERFECTION:
 * - ✅ FIXED arrows direction: now point TO center (was FROM center)
 * - ✅ Added gradient indicators in each corner (blue overlay with radius)
 * - ✅ Preview box increased to 100px (was 80px, original 64px)
 * - ✅ Added smooth transitions (duration-300) for visual feedback
 * - ✅ Enhanced visual clarity with shadows and gradients
 * - ✅ Now changes are CLEARLY visible in preview
 *
 * V9.0 (Nov 12, 2025) - REVOLUTIONARY REDESIGN:
 * - Moved all corner controls TO THE CORNERS of preview box
 * - Changed button style: - and + (was: ▲▼ arrows)
 * - Vertical layout for each corner: [- +] → input → unit dropdown
 * - Diagonal arrows INSIDE preview box
 * - All controls positioned around central preview
 *
 * V8.0 (Nov 12, 2025):
 * - Fixed layout order: icon + label → input → buttons → unit
 * - Fixed preview to use correct units (was always 'px')
 *
 * V7.8 (Nov 11, 2025):
 * - Full hold-to-repeat functionality in all corners
 * - Hidden browser spinners in all number inputs
 */

import React, { useState } from 'react';

interface BorderRadiusControlProps {
  label: string;
  /** Shorthand value for all corners */
  value?: number;
  /** Individual corner values (override shorthand) */
  topLeft?: number;
  topRight?: number;
  bottomLeft?: number;
  bottomRight?: number;
  /** Callback for shorthand change */
  onChange: (name: string, value: number | undefined) => void;
  /** Callback for individual corner change */
  onCornerChange?: (corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight', value: number | undefined, unit?: string) => void;
  description?: string;
  /** Unit selectors for each corner (Advanced mode) */
  topLeftUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  topRightUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  bottomLeftUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  bottomRightUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  /** Callback for unit change */
  onUnitChange?: (corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight', unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw') => void;
}

export function BorderRadiusControl({
  label,
  value,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  onChange,
  onCornerChange,
  description,
  topLeftUnit = 'px',
  topRightUnit = 'px',
  bottomLeftUnit = 'px',
  bottomRightUnit = 'px',
  onUnitChange,
}: BorderRadiusControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [unit, setUnit] = useState<'px' | 'rem' | 'em' | '%' | 'vh' | 'vw'>('px');

  // Check if any individual corners are set
  const hasIndividualValues = topLeft !== undefined || topRight !== undefined || bottomLeft !== undefined || bottomRight !== undefined;

  const handleShorthandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);

    // Clear individual corners if they exist (to apply shorthand)
    if (onCornerChange && hasIndividualValues) {
      setTimeout(() => {
        onCornerChange('TopLeft', undefined);
        onCornerChange('TopRight', undefined);
        onCornerChange('BottomLeft', undefined);
        onCornerChange('BottomRight', undefined);
        onChange('borderRadius', newValue);
      }, 0);
    } else {
      onChange('borderRadius', newValue);
    }
  };

  return (
    <div className="mb-3">
      {/* Label & Expand Button */}
      <div className="flex items-center justify-between mb-1.5">
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
        <SimpleMode
          value={value}
          unit={unit}
          setUnit={setUnit}
          handleShorthandChange={handleShorthandChange}
          onChange={onChange}
          onUnitChange={onUnitChange}
        />
      )}

      {/* Advanced Mode - Controls in Corners Around Preview */}
      {isExpanded && (
        <div className="space-y-2">
          {/* Corner-based Layout with Preview in Center */}
          <div className="relative p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm" style={{ minHeight: '280px' }}>
            {/* Center Preview Box - Adaptive with 5% margin */}
            <div
              className="absolute"
              style={{
                top: '50px',
                left: '50px',
                right: '50px',
                bottom: '50px',
                margin: '5%', // 5% отступ со всех сторон
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Preview Box - Adaptive, maintains aspect ratio */}
                <div
                  className="bg-gradient-to-br from-white to-gray-50 flex items-center justify-center shadow-xl transition-all duration-300 border-2 border-gray-400 relative"
                  style={{
                    borderTopLeftRadius: `${topLeft ?? value ?? 0}${topLeftUnit}`,
                    borderTopRightRadius: `${topRight ?? value ?? 0}${topRightUnit}`,
                    borderBottomLeftRadius: `${bottomLeft ?? value ?? 0}${bottomLeftUnit}`,
                    borderBottomRightRadius: `${bottomRight ?? value ?? 0}${bottomRightUnit}`,
                    width: '100%',
                    height: '100%',
                    maxWidth: '200px',
                    maxHeight: '200px',
                    minWidth: '80px',
                    minHeight: '80px',
                    aspectRatio: '1 / 1',
                  }}
                >
                  {/* Corner gradient indicators */}
                  <div
                    className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-blue-400/40 to-transparent pointer-events-none transition-all duration-300"
                    style={{
                      borderTopLeftRadius: `${topLeft ?? value ?? 0}${topLeftUnit}`,
                    }}
                  />
                  <div
                    className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-blue-400/40 to-transparent pointer-events-none transition-all duration-300"
                    style={{
                      borderTopRightRadius: `${topRight ?? value ?? 0}${topRightUnit}`,
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-blue-400/40 to-transparent pointer-events-none transition-all duration-300"
                    style={{
                      borderBottomLeftRadius: `${bottomLeft ?? value ?? 0}${bottomLeftUnit}`,
                    }}
                  />
                  <div
                    className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-blue-400/40 to-transparent pointer-events-none transition-all duration-300"
                    style={{
                      borderBottomRightRadius: `${bottomRight ?? value ?? 0}${bottomRightUnit}`,
                    }}
                  />

                  <span className="text-3xl font-bold text-gray-400 z-10 relative">R</span>

                  {/* Arrows OUTSIDE preview box pointing INWARD (to center) */}
                  <div className="absolute -top-4 -left-4 text-blue-600 pointer-events-none z-20" title="Top-Left">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3L18 18M18 18v-6M18 18h-6" />
                    </svg>
                  </div>
                  <div className="absolute -top-4 -right-4 text-blue-600 pointer-events-none z-20" title="Top-Right">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 3L6 18M6 18v-6M6 18h6" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-4 -left-4 text-blue-600 pointer-events-none z-20" title="Bottom-Left">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21L18 6M18 6v6M18 6h-6" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-4 -right-4 text-blue-600 pointer-events-none z-20" title="Bottom-Right">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21L6 6M6 6v6M6 6h6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Top-Left Corner Control - Aligned with arrow */}
            <div className="absolute" style={{ top: '5px', left: '5px' }}>
              <CornerControl
                corner="TopLeft"
                value={topLeft ?? value}
                unit={topLeftUnit}
                onValueChange={onCornerChange}
                onUnitChange={onUnitChange}
              />
            </div>

            {/* Top-Right Corner Control - Aligned with arrow */}
            <div className="absolute" style={{ top: '5px', right: '5px' }}>
              <CornerControl
                corner="TopRight"
                value={topRight ?? value}
                unit={topRightUnit}
                onValueChange={onCornerChange}
                onUnitChange={onUnitChange}
              />
            </div>

            {/* Bottom-Left Corner Control - Aligned with arrow */}
            <div className="absolute" style={{ bottom: '5px', left: '5px' }}>
              <CornerControl
                corner="BottomLeft"
                value={bottomLeft ?? value}
                unit={bottomLeftUnit}
                onValueChange={onCornerChange}
                onUnitChange={onUnitChange}
              />
            </div>

            {/* Bottom-Right Corner Control - Aligned with arrow */}
            <div className="absolute" style={{ bottom: '5px', right: '5px' }}>
              <CornerControl
                corner="BottomRight"
                value={bottomRight ?? value}
                unit={bottomRightUnit}
                onValueChange={onCornerChange}
                onUnitChange={onUnitChange}
              />
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-gray-500 text-center">
            {hasIndividualValues
              ? 'Individual values override "All corners"'
              : 'Leave empty to use "All corners" value'}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * SimpleMode Component - Hold-to-repeat buttons (like NumberControl)
 */
interface SimpleModeProps {
  value?: number;
  unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  setUnit: (unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw') => void;
  handleShorthandChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (name: string, value: number | undefined) => void;
  onUnitChange?: (corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight', unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw') => void;
}

function SimpleMode({ value, unit, setUnit, handleShorthandChange, onChange, onUnitChange }: SimpleModeProps) {
  const [isIncrementPressed, setIsIncrementPressed] = React.useState(false);
  const [isDecrementPressed, setIsDecrementPressed] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const speedRef = React.useRef(100);
  const valueRef = React.useRef(value);

  React.useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleIncrement = React.useCallback(() => {
    const currentValue = valueRef.current || 0;
    const newValue = currentValue + 1;
    onChange('borderRadius', newValue);
    valueRef.current = newValue;
  }, [onChange]);

  const handleDecrement = React.useCallback(() => {
    const currentValue = valueRef.current || 0;
    const newValue = Math.max(0, currentValue - 1);
    onChange('borderRadius', newValue);
    valueRef.current = newValue;
  }, [onChange]);

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
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <input
          type="number"
          min="0"
          step={unit === 'px' ? '1' : '0.1'}
          value={value ?? ''}
          onChange={handleShorthandChange}
          placeholder="All corners"
          title={value !== undefined && value !== null ? `Exact value: ${value}${unit}` : 'All corners'}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ MozAppearance: 'textfield' }}
        />
      </div>
      <select
        value={unit}
        onChange={(e) => {
          const newUnit = e.target.value as 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';

          // Convert value to new unit if value exists
          if (value !== undefined && value !== null) {
            const convertedValue = convertUnit(value, unit, newUnit);
            onChange('borderRadius', convertedValue);
          }

          // Update unit for all 4 corners (so canvas displays the new unit)
          if (onUnitChange) {
            onUnitChange('TopLeft', newUnit);
            onUnitChange('TopRight', newUnit);
            onUnitChange('BottomLeft', newUnit);
            onUnitChange('BottomRight', newUnit);
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
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          onMouseDown={startIncrement}
          onMouseUp={stopChange}
          onMouseLeave={stopChange}
          onTouchStart={startIncrement}
          onTouchEnd={stopChange}
          className={`
            p-1.5 border-2 rounded-md transition-all shadow-sm
            ${isIncrementPressed
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
            }
          `}
          title="Increment (hold to repeat)"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            p-1.5 border-2 rounded-md transition-all shadow-sm
            ${isDecrementPressed && (value || 0) > 0
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
            }
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300
          `}
          title="Decrement (hold to repeat)"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * CompactCornerControl Component - Horizontal layout for best practices
 * Layout: label → input → [- +] buttons → unit dropdown (horizontal)
 * Used in V10.0 best practices layout (Figma/DevTools style)
 */
interface CompactCornerControlProps {
  label: string;
  corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight';
  value?: number;
  unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  onValueChange?: (corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight', value: number | undefined, unit?: string) => void;
  onUnitChange?: (corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight', unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw') => void;
}

function CompactCornerControl({
  label,
  corner,
  value,
  unit,
  onValueChange,
  onUnitChange,
}: CompactCornerControlProps) {
  const [isIncrementPressed, setIsIncrementPressed] = React.useState(false);
  const [isDecrementPressed, setIsDecrementPressed] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const speedRef = React.useRef(100);
  const valueRef = React.useRef(value ?? 0);

  React.useEffect(() => {
    valueRef.current = value ?? 0;
  }, [value]);

  const handleIncrement = React.useCallback(() => {
    const currentValue = valueRef.current;
    const newValue = currentValue + 1;
    if (onValueChange) {
      onValueChange(corner, newValue, unit);
      valueRef.current = newValue;
    }
  }, [corner, onValueChange, unit]);

  const handleDecrement = React.useCallback(() => {
    const currentValue = valueRef.current;
    const newValue = Math.max(0, currentValue - 1);
    if (onValueChange) {
      onValueChange(corner, newValue, unit);
      valueRef.current = newValue;
    }
  }, [corner, onValueChange, unit]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);
    if (onValueChange) {
      onValueChange(corner, newValue, unit);
    }
  };

  // Horizontal compact layout: label → input → [- +] → unit
  return (
    <div className="flex items-center gap-2">
      {/* Label */}
      <label className="text-xs font-medium text-gray-600 w-20 flex-shrink-0">
        {label}
      </label>

      {/* Input field */}
      <input
        type="number"
        min="0"
        step={unit === 'px' ? '1' : '0.1'}
        value={value ?? ''}
        onChange={handleInputChange}
        placeholder="0"
        title={value !== undefined && value !== null ? `Exact value: ${value}${unit}` : '0'}
        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        style={{ MozAppearance: 'textfield' }}
      />

      {/* - and + buttons (horizontal) */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onMouseDown={startDecrement}
          onMouseUp={stopChange}
          onMouseLeave={stopChange}
          onTouchStart={startDecrement}
          onTouchEnd={stopChange}
          disabled={(value ?? 0) <= 0}
          className={`
            px-1.5 py-0.5 text-sm font-bold border rounded transition-all
            ${isDecrementPressed && (value ?? 0) > 0
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

      {/* Unit selector dropdown */}
      <select
        value={unit}
        onChange={(e) => {
          const newUnit = e.target.value as 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';

          // Convert value to new unit if value exists
          if (value !== undefined && value !== null && onValueChange) {
            const convertedValue = convertUnit(value, unit, newUnit);
            onValueChange(corner, convertedValue, newUnit);
          }

          // Update unit
          onUnitChange?.(corner, newUnit);
        }}
        className="px-2 py-1 text-xs border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option value="px">px</option>
        <option value="rem">rem</option>
        <option value="em">em</option>
        <option value="%">%</option>
        <option value="vh">vh</option>
        <option value="vw">vw</option>
      </select>
    </div>
  );
}

/**
 * CornerControl Component - Vertical layout with - and + buttons
 * Layout: [- +] buttons → input → unit dropdown (vertical)
 */
interface CornerControlProps {
  corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight';
  value?: number;
  unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  onValueChange?: (corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight', value: number | undefined, unit?: string) => void;
  onUnitChange?: (corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight', unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw') => void;
}

function CornerControl({
  corner,
  value,
  unit,
  onValueChange,
  onUnitChange,
}: CornerControlProps) {
  const [isIncrementPressed, setIsIncrementPressed] = React.useState(false);
  const [isDecrementPressed, setIsDecrementPressed] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const speedRef = React.useRef(100);
  const valueRef = React.useRef(value ?? 0);

  React.useEffect(() => {
    valueRef.current = value ?? 0;
  }, [value]);

  const handleIncrement = React.useCallback(() => {
    const currentValue = valueRef.current;
    const newValue = currentValue + 1;
    if (onValueChange) {
      onValueChange(corner, newValue, unit);
      valueRef.current = newValue;
    }
  }, [corner, onValueChange, unit]);

  const handleDecrement = React.useCallback(() => {
    const currentValue = valueRef.current;
    const newValue = Math.max(0, currentValue - 1);
    if (onValueChange) {
      onValueChange(corner, newValue, unit);
      valueRef.current = newValue;
    }
  }, [corner, onValueChange, unit]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);
    if (onValueChange) {
      onValueChange(corner, newValue, unit);
    }
  };

  // Vertical layout: buttons (horizontal) → input → dropdown
  return (
    <div className="flex flex-col items-center gap-1">
      {/* - and + buttons (horizontal) */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onMouseDown={startDecrement}
          onMouseUp={stopChange}
          onMouseLeave={stopChange}
          onTouchStart={startDecrement}
          onTouchEnd={stopChange}
          disabled={(value ?? 0) <= 0}
          className={`
            px-2 py-0.5 text-sm font-bold border rounded transition-all
            ${isDecrementPressed && (value ?? 0) > 0
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
            px-2 py-0.5 text-sm font-bold border rounded transition-all
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
        step={unit === 'px' ? '1' : '0.1'}
        value={value ?? ''}
        onChange={handleInputChange}
        placeholder="0"
        title={value !== undefined && value !== null ? `Exact value: ${value}${unit}` : '0'}
        className="w-14 px-1 py-1 text-xs text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        style={{ MozAppearance: 'textfield' }}
      />

      {/* Unit selector dropdown */}
      <select
        value={unit}
        onChange={(e) => {
          const newUnit = e.target.value as 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';

          // Convert value to new unit if value exists
          if (value !== undefined && value !== null && onValueChange) {
            const convertedValue = convertUnit(value, unit, newUnit);
            onValueChange(corner, convertedValue, newUnit);
          }

          // Update unit
          onUnitChange?.(corner, newUnit);
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
    </div>
  );
}
