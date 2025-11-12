'use client';

/**
 * BorderRadiusControl - Modern UI for Border Radius (V8.0 - Optimized Layout & Units)
 *
 * Features:
 * - All-corners input (Simple mode)
 * - Figma-like visual preview (Advanced mode)
 * - Hold-to-repeat increment/decrement buttons (BOTH modes)
 * - Independent unit selectors for each corner (px, rem, em, %)
 * - Optimized compact layout (reduced height)
 * - Individual corner controls with live preview
 * - Corner icons for better visual identification
 * - User-friendly UX 2025
 *
 * V8.0 Improvements (Nov 12, 2025):
 * - ✅ Fixed layout order: icon + label → input → buttons → unit (was: input → unit → buttons)
 * - ✅ Fixed preview to use correct units (was always 'px', now uses selected unit)
 * - ✅ Added corner icons (arrows) for better UX
 * - ✅ Enhanced visual preview with corner indicators
 * - ✅ Removed rightAlign prop - unified layout for all corners
 * - ✅ All units (px, rem, em, %) now work correctly
 *
 * V7.8 (Nov 11, 2025):
 * - Refactored Advanced mode with AdvancedCornerInput component
 * - Full hold-to-repeat functionality in all corners (Advanced mode)
 * - Hidden browser spinners in all number inputs
 * - Consistent UX across Simple and Advanced modes
 * - Extracted reusable components for better maintainability
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

      {/* Advanced Mode - Compact Figma-style with Visual Preview */}
      {isExpanded && (
        <div className="space-y-2">
          {/* Compact Visual Model */}
          <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex flex-col items-center gap-1.5">
              {/* Top Row: TopLeft + TopRight */}
              <div className="flex items-center justify-between gap-2 w-full">
                {/* Top Left Corner */}
                <AdvancedCornerInput
                  label="TL"
                  corner="TopLeft"
                  value={topLeft ?? value}
                  unit={topLeftUnit}
                  onValueChange={onCornerChange}
                  onUnitChange={onUnitChange}
                />

                {/* Top Right Corner */}
                <AdvancedCornerInput
                  label="TR"
                  corner="TopRight"
                  value={topRight ?? value}
                  unit={topRightUnit}
                  onValueChange={onCornerChange}
                  onUnitChange={onUnitChange}
                />
              </div>

              {/* Center Box with Border Radius Preview - Smaller */}
              <div className="flex items-center justify-center py-1">
                <div
                  className="w-16 h-16 bg-white flex items-center justify-center text-xs font-medium text-gray-400 shadow transition-all border-2 border-gray-300 relative"
                  style={{
                    borderTopLeftRadius: `${topLeft ?? value ?? 0}${topLeftUnit}`,
                    borderTopRightRadius: `${topRight ?? value ?? 0}${topRightUnit}`,
                    borderBottomLeftRadius: `${bottomLeft ?? value ?? 0}${bottomLeftUnit}`,
                    borderBottomRightRadius: `${bottomRight ?? value ?? 0}${bottomRightUnit}`,
                  }}
                >
                  <span className="text-xl font-bold text-gray-400">R</span>
                  {/* Corner indicators */}
                  <div className="absolute top-0 left-0 w-2 h-2 bg-blue-400 rounded-full opacity-50" />
                  <div className="absolute top-0 right-0 w-2 h-2 bg-blue-400 rounded-full opacity-50" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 bg-blue-400 rounded-full opacity-50" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-400 rounded-full opacity-50" />
                </div>
              </div>

              {/* Bottom Row: BottomLeft + BottomRight */}
              <div className="flex items-center justify-between gap-2 w-full">
                {/* Bottom Left Corner */}
                <AdvancedCornerInput
                  label="BL"
                  corner="BottomLeft"
                  value={bottomLeft ?? value}
                  unit={bottomLeftUnit}
                  onValueChange={onCornerChange}
                  onUnitChange={onUnitChange}
                />

                {/* Bottom Right Corner */}
                <AdvancedCornerInput
                  label="BR"
                  corner="BottomRight"
                  value={bottomRight ?? value}
                  unit={bottomRightUnit}
                  onValueChange={onCornerChange}
                  onUnitChange={onUnitChange}
                />
              </div>
            </div>
          </div>

          {/* Helper Text - Smaller */}
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
 * AdvancedCornerInput Component - Hold-to-repeat buttons for individual corners
 */
interface AdvancedCornerInputProps {
  label: string;
  corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight';
  value?: number;
  unit: 'px' | 'rem' | 'em' | '%';
  onValueChange?: (corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight', value: number | undefined) => void;
  onUnitChange?: (corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight', unit: 'px' | 'rem' | 'em' | '%') => void;
}

// Corner icon components
const CornerIcon = ({ corner }: { corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight' }) => {
  const icons = {
    TopLeft: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l-4-4m0 0l4-4m-4 4h18" />
      </svg>
    ),
    TopRight: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 11l4-4m0 0l-4-4m4 4H3" />
      </svg>
    ),
    BottomLeft: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 13l-4 4m0 0l4 4m-4-4h18" />
      </svg>
    ),
    BottomRight: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 13l4 4m0 0l-4 4m4-4H3" />
      </svg>
    ),
  };
  return icons[corner];
};

function AdvancedCornerInput({
  label,
  corner,
  value,
  unit,
  onValueChange,
  onUnitChange,
}: AdvancedCornerInputProps) {
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

  // Unified layout: icon + label → input → buttons → unit
  return (
    <div className="flex items-center gap-1">
      {/* Icon + Label */}
      <div className="flex items-center gap-0.5 w-9">
        <div className="text-gray-500">
          <CornerIcon corner={corner} />
        </div>
        <span className="text-xs font-medium text-gray-600">{label}</span>
      </div>

      {/* Input */}
      <input
        type="number"
        min="0"
        step={unit === 'px' ? '1' : '0.1'}
        value={value ?? ''}
        onChange={handleInputChange}
        placeholder="0"
        className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        style={{ MozAppearance: 'textfield' }}
      />

      {/* Buttons */}
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          onMouseDown={startIncrement}
          onMouseUp={stopChange}
          onMouseLeave={stopChange}
          onTouchStart={startIncrement}
          onTouchEnd={stopChange}
          className={`
            p-0.5 border rounded transition-all
            ${isIncrementPressed
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
            }
          `}
          title="Increment (hold to repeat)"
        >
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          onMouseDown={startDecrement}
          onMouseUp={stopChange}
          onMouseLeave={stopChange}
          onTouchStart={startDecrement}
          onTouchEnd={stopChange}
          disabled={(value ?? 0) <= 0}
          className={`
            p-0.5 border rounded transition-all
            ${isDecrementPressed && (value ?? 0) > 0
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
            }
            disabled:opacity-40 disabled:cursor-not-allowed
          `}
          title="Decrement (hold to repeat)"
        >
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Unit selector */}
      <select
        value={unit}
        onChange={(e) => onUnitChange?.(corner, e.target.value as 'px' | 'rem' | 'em' | '%')}
        className="px-1 py-0.5 text-xs border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option value="px">px</option>
        <option value="rem">rem</option>
        <option value="em">em</option>
        <option value="%">%</option>
      </select>
    </div>
  );
}
