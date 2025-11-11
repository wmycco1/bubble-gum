'use client';

/**
 * BorderRadiusControl - Modern UI for Border Radius (V7.5 - Optimized)
 *
 * Features:
 * - All-corners input (Simple mode)
 * - Figma-like visual preview (Advanced mode)
 * - Hold-to-repeat increment/decrement buttons (Advanced mode)
 * - Independent unit selectors for each corner (px, rem, em, %)
 * - Optimized compact layout (reduced height)
 * - Individual corner controls with live preview
 * - User-friendly UX 2025
 *
 * V7.5 Improvements (Nov 11, 2025):
 * - Added hold-to-repeat buttons to Advanced mode inputs
 * - Made unit selectors independent for each corner
 * - Optimized layout height - reduced padding, gaps, sizes
 * - More compact design that fits in properties panel
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

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

  const handleCornerChange = (corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight', e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);
    if (onCornerChange) {
      onCornerChange(corner, newValue);
    }
  };

  // Hold-to-repeat logic for each corner
  const createHoldToRepeatHandlers = (corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight', currentValue?: number, min = 0) => {
    const [isIncrementPressed, setIsIncrementPressed] = useState(false);
    const [isDecrementPressed, setIsDecrementPressed] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const speedRef = useRef(100);
    const valueRef = useRef(currentValue ?? value ?? 0);

    useEffect(() => {
      valueRef.current = currentValue ?? value ?? 0;
    }, [currentValue]);

    const handleIncrement = useCallback(() => {
      const current = valueRef.current;
      const newValue = current + 1;
      if (onCornerChange) {
        onCornerChange(corner, newValue);
        valueRef.current = newValue;
      }
    }, [corner]);

    const handleDecrement = useCallback(() => {
      const current = valueRef.current;
      const newValue = Math.max(min, current - 1);
      if (onCornerChange) {
        onCornerChange(corner, newValue);
        valueRef.current = newValue;
      }
    }, [corner, min]);

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

    return {
      isIncrementPressed,
      isDecrementPressed,
      startIncrement,
      startDecrement,
      stopChange,
    };
  };

  // Create handlers for each corner
  const topLeftHandlers = createHoldToRepeatHandlers('TopLeft', topLeft);
  const topRightHandlers = createHoldToRepeatHandlers('TopRight', topRight);
  const bottomLeftHandlers = createHoldToRepeatHandlers('BottomLeft', bottomLeft);
  const bottomRightHandlers = createHoldToRepeatHandlers('BottomRight', bottomRight);

  // Render increment/decrement buttons
  const renderButtons = (handlers: ReturnType<typeof createHoldToRepeatHandlers>, currentValue?: number, max?: number) => (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        onMouseDown={handlers.startIncrement}
        onMouseUp={handlers.stopChange}
        onMouseLeave={handlers.stopChange}
        onTouchStart={handlers.startIncrement}
        onTouchEnd={handlers.stopChange}
        disabled={max !== undefined && (currentValue ?? 0) >= max}
        className={`
          p-0.5 border rounded transition-all
          ${handlers.isIncrementPressed && !(max !== undefined && (currentValue ?? 0) >= max)
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
          }
          disabled:opacity-40 disabled:cursor-not-allowed
        `}
        title="Increment (hold to repeat)"
      >
        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <button
        type="button"
        onMouseDown={handlers.startDecrement}
        onMouseUp={handlers.stopChange}
        onMouseLeave={handlers.stopChange}
        onTouchStart={handlers.startDecrement}
        onTouchEnd={handlers.stopChange}
        disabled={(currentValue ?? 0) <= 0}
        className={`
          p-0.5 border rounded transition-all
          ${handlers.isDecrementPressed && (currentValue ?? 0) > 0
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
  );

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
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            step={unit === 'px' ? '1' : '0.1'}
            value={value ?? ''}
            onChange={handleShorthandChange}
            placeholder="All corners"
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
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
        </div>
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
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-600 w-8 text-right">TL</span>
                  <input
                    type="number"
                    min="0"
                    step={topLeftUnit === 'px' ? '1' : '0.1'}
                    value={topLeft ?? value ?? ''}
                    onChange={(e) => handleCornerChange('TopLeft', e)}
                    placeholder="0"
                    className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                  <select
                    value={topLeftUnit}
                    onChange={(e) => onUnitChange?.('TopLeft', e.target.value as 'px' | 'rem' | 'em' | '%')}
                    className="px-1 py-0.5 text-xs border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="px">px</option>
                    <option value="rem">rem</option>
                    <option value="em">em</option>
                    <option value="%">%</option>
                  </select>
                  {renderButtons(topLeftHandlers, topLeft ?? value)}
                </div>

                {/* Top Right Corner */}
                <div className="flex items-center gap-1">
                  {renderButtons(topRightHandlers, topRight ?? value)}
                  <input
                    type="number"
                    min="0"
                    step={topRightUnit === 'px' ? '1' : '0.1'}
                    value={topRight ?? value ?? ''}
                    onChange={(e) => handleCornerChange('TopRight', e)}
                    placeholder="0"
                    className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                  <select
                    value={topRightUnit}
                    onChange={(e) => onUnitChange?.('TopRight', e.target.value as 'px' | 'rem' | 'em' | '%')}
                    className="px-1 py-0.5 text-xs border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="px">px</option>
                    <option value="rem">rem</option>
                    <option value="em">em</option>
                    <option value="%">%</option>
                  </select>
                  <span className="text-xs font-medium text-gray-600 w-8">TR</span>
                </div>
              </div>

              {/* Center Box with Border Radius Preview - Smaller */}
              <div className="flex items-center justify-center py-1">
                <div
                  className="w-16 h-16 bg-white flex items-center justify-center text-xs font-medium text-gray-400 shadow transition-all border-2 border-gray-300"
                  style={{
                    borderTopLeftRadius: `${topLeft ?? value ?? 0}px`,
                    borderTopRightRadius: `${topRight ?? value ?? 0}px`,
                    borderBottomLeftRadius: `${bottomLeft ?? value ?? 0}px`,
                    borderBottomRightRadius: `${bottomRight ?? value ?? 0}px`,
                  }}
                >
                  R
                </div>
              </div>

              {/* Bottom Row: BottomLeft + BottomRight */}
              <div className="flex items-center justify-between gap-2 w-full">
                {/* Bottom Left Corner */}
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-600 w-8 text-right">BL</span>
                  <input
                    type="number"
                    min="0"
                    step={bottomLeftUnit === 'px' ? '1' : '0.1'}
                    value={bottomLeft ?? value ?? ''}
                    onChange={(e) => handleCornerChange('BottomLeft', e)}
                    placeholder="0"
                    className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                  <select
                    value={bottomLeftUnit}
                    onChange={(e) => onUnitChange?.('BottomLeft', e.target.value as 'px' | 'rem' | 'em' | '%')}
                    className="px-1 py-0.5 text-xs border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="px">px</option>
                    <option value="rem">rem</option>
                    <option value="em">em</option>
                    <option value="%">%</option>
                  </select>
                  {renderButtons(bottomLeftHandlers, bottomLeft ?? value)}
                </div>

                {/* Bottom Right Corner */}
                <div className="flex items-center gap-1">
                  {renderButtons(bottomRightHandlers, bottomRight ?? value)}
                  <input
                    type="number"
                    min="0"
                    step={bottomRightUnit === 'px' ? '1' : '0.1'}
                    value={bottomRight ?? value ?? ''}
                    onChange={(e) => handleCornerChange('BottomRight', e)}
                    placeholder="0"
                    className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                  <select
                    value={bottomRightUnit}
                    onChange={(e) => onUnitChange?.('BottomRight', e.target.value as 'px' | 'rem' | 'em' | '%')}
                    className="px-1 py-0.5 text-xs border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="px">px</option>
                    <option value="rem">rem</option>
                    <option value="em">em</option>
                    <option value="%">%</option>
                  </select>
                  <span className="text-xs font-medium text-gray-600 w-8">BR</span>
                </div>
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
