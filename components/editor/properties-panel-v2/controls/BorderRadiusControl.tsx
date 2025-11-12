'use client';

/**
 * BorderRadiusControl - Modern UI for Border Radius (V9.0 - Revolutionary Corner Layout)
 *
 * Features:
 * - All-corners input (Simple mode)
 * - Revolutionary corner-based controls (Advanced mode)
 * - Hold-to-repeat increment/decrement buttons (BOTH modes)
 * - Independent unit selectors for each corner (px, rem, em, %)
 * - Diagonal arrows inside preview box pointing to center
 * - Corner controls positioned around preview box
 * - Individual corner controls with live preview
 * - User-friendly UX 2025
 *
 * V9.0 Improvements (Nov 12, 2025) - REVOLUTIONARY REDESIGN:
 * - ✅ Moved all corner controls TO THE CORNERS of preview box (absolute positioning)
 * - ✅ Changed button style: - and + (was: ▲▼ arrows)
 * - ✅ Vertical layout for each corner: [- +] → input → unit dropdown
 * - ✅ Diagonal arrows INSIDE preview box (pointing to center)
 * - ✅ Preview box increased by 20% (64px → 80px)
 * - ✅ All controls now positioned around central preview
 * - ✅ More intuitive and visually appealing design
 *
 * V8.0 (Nov 12, 2025):
 * - Fixed layout order: icon + label → input → buttons → unit
 * - Fixed preview to use correct units (was always 'px')
 * - Added corner icons (arrows) for better UX
 * - Enhanced visual preview with corner indicators
 *
 * V7.8 (Nov 11, 2025):
 * - Refactored Advanced mode with component architecture
 * - Full hold-to-repeat functionality in all corners
 * - Hidden browser spinners in all number inputs
 * - Consistent UX across Simple and Advanced modes
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
  onCornerChange?: (corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight', value: number | undefined) => void;
  description?: string;
  /** Unit selectors for each corner (Advanced mode) */
  topLeftUnit?: 'px' | 'rem' | 'em' | '%';
  topRightUnit?: 'px' | 'rem' | 'em' | '%';
  bottomLeftUnit?: 'px' | 'rem' | 'em' | '%';
  bottomRightUnit?: 'px' | 'rem' | 'em' | '%';
  /** Callback for unit change */
  onUnitChange?: (corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight', unit: 'px' | 'rem' | 'em' | '%') => void;
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
  const [unit, setUnit] = useState<'px' | 'rem' | 'em' | '%'>('px');

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
        />
      )}

      {/* Advanced Mode - Corner Controls Around Preview */}
      {isExpanded && (
        <div className="space-y-2">
          {/* Visual Model with Corner Controls */}
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm">
            <div className="relative" style={{ minHeight: '200px' }}>
              {/* Center Preview Box - Increased by 20% (64px -> ~77px -> use 80px = w-20) */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div
                  className="w-20 h-20 bg-white flex items-center justify-center shadow-lg transition-all border-2 border-gray-300 relative"
                  style={{
                    borderTopLeftRadius: `${topLeft ?? value ?? 0}${topLeftUnit}`,
                    borderTopRightRadius: `${topRight ?? value ?? 0}${topRightUnit}`,
                    borderBottomLeftRadius: `${bottomLeft ?? value ?? 0}${bottomLeftUnit}`,
                    borderBottomRightRadius: `${bottomRight ?? value ?? 0}${bottomRightUnit}`,
                  }}
                >
                  <span className="text-2xl font-bold text-gray-400">R</span>

                  {/* Diagonal arrows inside preview - pointing to center */}
                  <div className="absolute top-1 left-1 text-blue-500" title="Top-Left">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 19L5 5m0 0v10m0-10h10" />
                    </svg>
                  </div>
                  <div className="absolute top-1 right-1 text-blue-500" title="Top-Right">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 19L19 5m0 0H9m10 0v10" />
                    </svg>
                  </div>
                  <div className="absolute bottom-1 left-1 text-blue-500" title="Bottom-Left">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 5L5 19m0 0h10m-10 0V9" />
                    </svg>
                  </div>
                  <div className="absolute bottom-1 right-1 text-blue-500" title="Bottom-Right">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5l14 14m0 0V9m0 10H9" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Top-Left Corner Control */}
              <div className="absolute top-0 left-0">
                <CornerControl
                  corner="TopLeft"
                  value={topLeft ?? value}
                  unit={topLeftUnit}
                  onValueChange={onCornerChange}
                  onUnitChange={onUnitChange}
                />
              </div>

              {/* Top-Right Corner Control */}
              <div className="absolute top-0 right-0">
                <CornerControl
                  corner="TopRight"
                  value={topRight ?? value}
                  unit={topRightUnit}
                  onValueChange={onCornerChange}
                  onUnitChange={onUnitChange}
                />
              </div>

              {/* Bottom-Left Corner Control */}
              <div className="absolute bottom-0 left-0">
                <CornerControl
                  corner="BottomLeft"
                  value={bottomLeft ?? value}
                  unit={bottomLeftUnit}
                  onValueChange={onCornerChange}
                  onUnitChange={onUnitChange}
                />
              </div>

              {/* Bottom-Right Corner Control */}
              <div className="absolute bottom-0 right-0">
                <CornerControl
                  corner="BottomRight"
                  value={bottomRight ?? value}
                  unit={bottomRightUnit}
                  onValueChange={onCornerChange}
                  onUnitChange={onUnitChange}
                />
              </div>
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
  unit: 'px' | 'rem' | 'em' | '%';
  setUnit: (unit: 'px' | 'rem' | 'em' | '%') => void;
  handleShorthandChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (name: string, value: number | undefined) => void;
}

function SimpleMode({ value, unit, setUnit, handleShorthandChange, onChange }: SimpleModeProps) {
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
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ MozAppearance: 'textfield' }}
        />
      </div>
      <select
        value={unit}
        onChange={(e) => setUnit(e.target.value as 'px' | 'rem' | 'em' | '%')}
        className="px-2 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
      >
        <option value="px">px</option>
        <option value="rem">rem</option>
        <option value="em">em</option>
        <option value="%">%</option>
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
 * CornerControl Component - Vertical layout with - and + buttons
 * Layout: [- +] buttons → input → unit dropdown (vertical)
 */
interface CornerControlProps {
  corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight';
  value?: number;
  unit: 'px' | 'rem' | 'em' | '%';
  onValueChange?: (corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight', value: number | undefined) => void;
  onUnitChange?: (corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight', unit: 'px' | 'rem' | 'em' | '%') => void;
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
      onValueChange(corner, newValue);
      valueRef.current = newValue;
    }
  }, [corner, onValueChange]);

  const handleDecrement = React.useCallback(() => {
    const currentValue = valueRef.current;
    const newValue = Math.max(0, currentValue - 1);
    if (onValueChange) {
      onValueChange(corner, newValue);
      valueRef.current = newValue;
    }
  }, [corner, onValueChange]);

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
      onValueChange(corner, newValue);
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
        className="w-14 px-1 py-1 text-xs text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        style={{ MozAppearance: 'textfield' }}
      />

      {/* Unit selector dropdown */}
      <select
        value={unit}
        onChange={(e) => onUnitChange?.(corner, e.target.value as 'px' | 'rem' | 'em' | '%')}
        className="w-14 px-1 py-0.5 text-xs border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option value="px">px</option>
        <option value="rem">rem</option>
        <option value="em">em</option>
        <option value="%">%</option>
      </select>
    </div>
  );
}
