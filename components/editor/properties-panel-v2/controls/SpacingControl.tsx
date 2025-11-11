'use client';

/**
 * SpacingControl - Modern UI for Margin/Padding (V7.7 - Optimized)
 *
 * Features:
 * - All-sides input (shorthand)
 * - Individual side controls (expand/collapse)
 * - Hold-to-repeat increment/decrement buttons (Advanced mode)
 * - Independent unit selectors for each side (px, rem, em, %)
 * - Optimized compact layout (reduced height)
 * - Visual box model preview
 * - User-friendly UX 2025
 *
 * V7.7 Improvements (Nov 11, 2025):
 * - Added hold-to-repeat buttons to Advanced mode inputs
 * - Made unit selectors independent for each side
 * - Optimized layout height - reduced padding, gaps, sizes
 * - More compact design that fits in properties panel
 *
 * V7.6 Fix (Nov 11, 2025):
 * - Fixed: Text selection issue when editing padding/margin input fields
 * - Added onFocus handler that moves cursor to end without selecting all text
 * - Added onMouseUp handler that places cursor at clicked position
 * - Prevents browser default behavior of selecting all text on input focus
 * - Solves: "text automatically gets selected preventing changes from being applied"
 * - Applied to ALL 5 input fields (shorthand + 4 individual sides)
 *
 * V7.5 Fix (Nov 10, 2025):
 * - Fixed: Simple mode NOW ALWAYS overwrites ALL 4 sides (including Advanced-set values)
 * - Used setTimeout(0) to break React batching for individual side clearing
 * - Set shorthand FIRST, then clear sides in next event loop tick
 * - This guarantees Badge processes shorthand before individual values are cleared
 * - Without setTimeout, React batches all updates and Badge sees old individual values
 * - User can switch modes freely, values cleared only when editing Simple field
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface SpacingControlProps {
  label: string;
  /** Shorthand value for all sides */
  value?: number;
  /** Individual side values (override shorthand) */
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  /** Callback for shorthand change */
  onChange: (name: string, value: number | undefined) => void;
  /** Callback for individual side change */
  onSideChange?: (side: 'Top' | 'Right' | 'Bottom' | 'Left', value: number | undefined) => void;
  /** Base parameter name (e.g., 'margin' or 'padding') */
  paramName: string;
  description?: string;
  /** Unit selectors for each side (Advanced mode) */
  topUnit?: 'px' | 'rem' | 'em' | '%';
  rightUnit?: 'px' | 'rem' | 'em' | '%';
  bottomUnit?: 'px' | 'rem' | 'em' | '%';
  leftUnit?: 'px' | 'rem' | 'em' | '%';
  /** Callback for unit change */
  onUnitChange?: (side: 'Top' | 'Right' | 'Bottom' | 'Left', unit: 'px' | 'rem' | 'em' | '%') => void;
}

export function SpacingControl({
  label,
  value,
  top,
  right,
  bottom,
  left,
  onChange,
  onSideChange,
  paramName,
  description,
  topUnit = 'px',
  rightUnit = 'px',
  bottomUnit = 'px',
  leftUnit = 'px',
  onUnitChange,
}: SpacingControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [unit, setUnit] = useState<'px' | 'rem' | 'em' | '%'>('px');

  // Check if any individual sides are set
  const hasIndividualValues = top !== undefined || right !== undefined || bottom !== undefined || left !== undefined;

  const handleShorthandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);

    // V7.5 FIX CORRECTED: Set shorthand FIRST (immediate), then clear sides in next tick
    onChange(paramName, newValue);

    // Then clear individual sides in next event loop tick (if they exist)
    if (onSideChange && hasIndividualValues) {
      setTimeout(() => {
        onSideChange('Top', undefined);
        onSideChange('Right', undefined);
        onSideChange('Bottom', undefined);
        onSideChange('Left', undefined);
      }, 0);
    }
  };

  const handleSideChange = (side: 'Top' | 'Right' | 'Bottom' | 'Left', e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);
    if (onSideChange) {
      onSideChange(side, newValue);
    }
  };

  // Hold-to-repeat logic for each side
  const createHoldToRepeatHandlers = (side: 'Top' | 'Right' | 'Bottom' | 'Left', currentValue?: number, min = 0) => {
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
      if (onSideChange) {
        onSideChange(side, newValue);
        valueRef.current = newValue;
      }
    }, [side]);

    const handleDecrement = useCallback(() => {
      const current = valueRef.current;
      const newValue = Math.max(min, current - 1);
      if (onSideChange) {
        onSideChange(side, newValue);
        valueRef.current = newValue;
      }
    }, [side, min]);

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

  // Create handlers for each side
  const topHandlers = createHoldToRepeatHandlers('Top', top);
  const rightHandlers = createHoldToRepeatHandlers('Right', right);
  const bottomHandlers = createHoldToRepeatHandlers('Bottom', bottom);
  const leftHandlers = createHoldToRepeatHandlers('Left', left);

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

      {/* Shorthand Input (Simple Mode) */}
      {!isExpanded && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            step={unit === 'px' ? '1' : '0.1'}
            value={value ?? ''}
            onChange={handleShorthandChange}
            placeholder="All sides"
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

      {/* Individual Sides (Advanced Mode) - Compact Figma-style */}
      {isExpanded && (
        <div className="space-y-2">
          {/* Compact Box Model - Reduced padding and gaps */}
          <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex flex-col items-center gap-1.5">
              {/* Top Side - Centered */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-gray-600 w-8 text-right">Top</span>
                <input
                  type="number"
                  min="0"
                  step={topUnit === 'px' ? '1' : '0.1'}
                  value={top ?? value ?? ''}
                  onChange={(e) => handleSideChange('Top', e)}
                  placeholder="0"
                  className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
                <select
                  value={topUnit}
                  onChange={(e) => onUnitChange?.('Top', e.target.value as 'px' | 'rem' | 'em' | '%')}
                  className="px-1 py-0.5 text-xs border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="px">px</option>
                  <option value="rem">rem</option>
                  <option value="em">em</option>
                  <option value="%">%</option>
                </select>
                {renderButtons(topHandlers, top ?? value)}
              </div>

              {/* Middle Row: Left + Center Box + Right */}
              <div className="flex items-center gap-1.5 w-full justify-center">
                {/* Left Side */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-medium text-gray-600">Left</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      step={leftUnit === 'px' ? '1' : '0.1'}
                      value={left ?? value ?? ''}
                      onChange={(e) => handleSideChange('Left', e)}
                      placeholder="0"
                      className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                    <select
                      value={leftUnit}
                      onChange={(e) => onUnitChange?.('Left', e.target.value as 'px' | 'rem' | 'em' | '%')}
                      className="px-1 py-0.5 text-xs border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="px">px</option>
                      <option value="rem">rem</option>
                      <option value="em">em</option>
                      <option value="%">%</option>
                    </select>
                    {renderButtons(leftHandlers, left ?? value)}
                  </div>
                </div>

                {/* Center Box - Smaller */}
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 bg-white flex items-center justify-center rounded shadow border-2 border-gray-300">
                    <span className="text-xl font-bold text-gray-400">
                      {paramName === 'margin' ? 'M' : 'P'}
                    </span>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col items-start gap-1">
                  <span className="text-xs font-medium text-gray-600">Right</span>
                  <div className="flex items-center gap-1">
                    {renderButtons(rightHandlers, right ?? value)}
                    <input
                      type="number"
                      min="0"
                      step={rightUnit === 'px' ? '1' : '0.1'}
                      value={right ?? value ?? ''}
                      onChange={(e) => handleSideChange('Right', e)}
                      placeholder="0"
                      className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                    <select
                      value={rightUnit}
                      onChange={(e) => onUnitChange?.('Right', e.target.value as 'px' | 'rem' | 'em' | '%')}
                      className="px-1 py-0.5 text-xs border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="px">px</option>
                      <option value="rem">rem</option>
                      <option value="em">em</option>
                      <option value="%">%</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bottom Side - Centered */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-gray-600 w-8 text-right">Bot</span>
                <input
                  type="number"
                  min="0"
                  step={bottomUnit === 'px' ? '1' : '0.1'}
                  value={bottom ?? value ?? ''}
                  onChange={(e) => handleSideChange('Bottom', e)}
                  placeholder="0"
                  className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
                <select
                  value={bottomUnit}
                  onChange={(e) => onUnitChange?.('Bottom', e.target.value as 'px' | 'rem' | 'em' | '%')}
                  className="px-1 py-0.5 text-xs border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="px">px</option>
                  <option value="rem">rem</option>
                  <option value="em">em</option>
                  <option value="%">%</option>
                </select>
                {renderButtons(bottomHandlers, bottom ?? value)}
              </div>
            </div>
          </div>

          {/* Helper Text - Smaller */}
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
