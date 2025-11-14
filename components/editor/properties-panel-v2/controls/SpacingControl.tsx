'use client';

/**
 * Unit conversion utility
 * Converts spacing values between different CSS units
 */
function convertUnit(
  value: number,
  fromUnit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw',
  toUnit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw'
): number {
  if (fromUnit === toUnit) return value;

  // Base font size for rem/em conversion (standard = 16px)
  const baseFontSize = 16;

  // Viewport dimensions (approximate for conversion reference)
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

  // First convert to px (base unit)
  let valueInPx = value;
  switch (fromUnit) {
    case 'rem':
      valueInPx = value * baseFontSize;
      break;
    case 'em':
      valueInPx = value * baseFontSize; // Simplified: assuming parent font-size = root
      break;
    case '%':
      // % is relative to parent - we'll use a reference of 100% = 400px (typical container)
      valueInPx = (value / 100) * 400;
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

  // Then convert from px to target unit
  let result = valueInPx;
  switch (toUnit) {
    case 'rem':
      result = valueInPx / baseFontSize;
      break;
    case 'em':
      result = valueInPx / baseFontSize;
      break;
    case '%':
      result = (valueInPx / 400) * 100;
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

  // Round to 2 decimal places for cleaner values
  return Math.round(result * 100) / 100;
}

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
  topUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  rightUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  bottomUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  leftUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  /** Callback for unit change */
  onUnitChange?: (side: 'Top' | 'Right' | 'Bottom' | 'Left', unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw') => void;
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
  const [unit, setUnit] = useState<'px' | 'rem' | 'em' | '%' | 'vh' | 'vw'>('px');

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

      {/* Shorthand Input (Simple Mode) - WITH HOLD-TO-REPEAT */}
      {!isExpanded && (
        <SpacingSimpleMode
          value={value}
          unit={unit}
          setUnit={setUnit}
          handleShorthandChange={handleShorthandChange}
          onChange={onChange}
          paramName={paramName}
          onUnitChange={onUnitChange}
        />
      )}

      {/* Individual Sides (Advanced Mode) - Revolutionary Visual Design */}
      {isExpanded && (
        <div className="space-y-2">
          {/* Spacing Box Model with Visual Indicators */}
          <div className="relative p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm" style={{ minHeight: '340px' }}>
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
                {/* Preview Box - Shows Margin + Padding visually */}
                <div
                  className="relative bg-white flex items-center justify-center shadow-xl transition-all duration-300 border-2 border-gray-400"
                  style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '220px',
                    maxHeight: '160px',
                    minWidth: '60px',
                    minHeight: '50px',
                    aspectRatio: '1 / 1',
                    overflow: 'visible',
                  }}
                >
                  {/* Margin Visual Indicators (Blue - Outside) */}
                  {paramName === 'margin' && (
                    <>
                      {/* Top Margin - Blue */}
                      <div
                        className="absolute -top-0 left-0 right-0 bg-blue-400/[0.21] transition-all duration-300 pointer-events-none border-t-2 border-blue-500"
                        style={{
                          height: `${Math.min((top ?? value ?? 0) * 2, 40)}px`,
                          transform: 'translateY(-100%)',
                        }}
                      />
                      {/* Right Margin - Blue */}
                      <div
                        className="absolute top-0 -right-0 bottom-0 bg-blue-400/[0.21] transition-all duration-300 pointer-events-none border-r-2 border-blue-500"
                        style={{
                          width: `${Math.min((right ?? value ?? 0) * 2, 40)}px`,
                          transform: 'translateX(100%)',
                        }}
                      />
                      {/* Bottom Margin - Blue */}
                      <div
                        className="absolute -bottom-0 left-0 right-0 bg-blue-400/[0.21] transition-all duration-300 pointer-events-none border-b-2 border-blue-500"
                        style={{
                          height: `${Math.min((bottom ?? value ?? 0) * 2, 40)}px`,
                          transform: 'translateY(100%)',
                        }}
                      />
                      {/* Left Margin - Blue */}
                      <div
                        className="absolute top-0 -left-0 bottom-0 bg-blue-400/[0.21] transition-all duration-300 pointer-events-none border-l-2 border-blue-500"
                        style={{
                          width: `${Math.min((left ?? value ?? 0) * 2, 40)}px`,
                          transform: 'translateX(-100%)',
                        }}
                      />
                    </>
                  )}

                  {/* Padding Visual Indicators (Green - Inside) */}
                  {paramName === 'padding' && (
                    <>
                      {/* Top Padding - Green */}
                      <div
                        className="absolute top-0 left-0 right-0 bg-green-400/[0.18] transition-all duration-300 pointer-events-none border-b border-green-500"
                        style={{
                          height: `${Math.min((top ?? value ?? 0) * 2, 40)}px`,
                        }}
                      />
                      {/* Right Padding - Green */}
                      <div
                        className="absolute top-0 right-0 bottom-0 bg-green-400/[0.18] transition-all duration-300 pointer-events-none border-l border-green-500"
                        style={{
                          width: `${Math.min((right ?? value ?? 0) * 2, 40)}px`,
                        }}
                      />
                      {/* Bottom Padding - Green */}
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-green-400/[0.18] transition-all duration-300 pointer-events-none border-t border-green-500"
                        style={{
                          height: `${Math.min((bottom ?? value ?? 0) * 2, 40)}px`,
                        }}
                      />
                      {/* Left Padding - Green */}
                      <div
                        className="absolute top-0 left-0 bottom-0 bg-green-400/[0.18] transition-all duration-300 pointer-events-none border-r border-green-500"
                        style={{
                          width: `${Math.min((left ?? value ?? 0) * 2, 40)}px`,
                        }}
                      />
                    </>
                  )}

                  {/* Content area label */}
                  <span className="text-2xl font-bold text-gray-400 z-10 relative">
                    {paramName === 'margin' ? 'M' : 'P'}
                  </span>

                  {/* Arrows pointing to sides - Margin (outside) vs Padding (inside) */}

                  {/* Top Arrow */}
                  <div
                    className={`absolute left-1/2 transform -translate-x-1/2 pointer-events-none z-20 rounded-full bg-white shadow-sm text-gray-900 ${
                      paramName === 'padding'
                        ? 'top-2'
                        : '-top-4'
                    }`}
                    title="Top"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {/* Margin: arrow points UP (outward) | Padding: arrow points DOWN (inward) */}
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paramName === 'padding' ? 'M12 5v14m-7-7l7 7l7-7' : 'M12 19V5m-7 7l7-7l7 7'} />
                    </svg>
                  </div>

                  {/* Right Arrow */}
                  <div
                    className={`absolute top-1/2 transform -translate-y-1/2 pointer-events-none z-20 rounded-full bg-white shadow-sm text-gray-900 ${
                      paramName === 'padding'
                        ? 'right-2'
                        : '-right-4'
                    }`}
                    title="Right"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {/* Margin: arrow points RIGHT (outward) | Padding: arrow points LEFT (inward) */}
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paramName === 'padding' ? 'M19 12H5m7-7l-7 7l7 7' : 'M5 12h14m-7-7l7 7l-7 7'} />
                    </svg>
                  </div>

                  {/* Bottom Arrow */}
                  <div
                    className={`absolute left-1/2 transform -translate-x-1/2 pointer-events-none z-20 rounded-full bg-white shadow-sm text-gray-900 ${
                      paramName === 'padding'
                        ? 'bottom-2'
                        : '-bottom-4'
                    }`}
                    title="Bottom"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {/* Margin: arrow points DOWN (outward) | Padding: arrow points UP (inward) */}
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paramName === 'padding' ? 'M12 19V5m-7 7l7-7l7 7' : 'M12 5v14m-7-7l7 7l7-7'} />
                    </svg>
                  </div>

                  {/* Left Arrow */}
                  <div
                    className={`absolute top-1/2 transform -translate-y-1/2 pointer-events-none z-20 rounded-full bg-white shadow-sm text-gray-900 ${
                      paramName === 'padding'
                        ? 'left-2'
                        : '-left-4'
                    }`}
                    title="Left"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {/* Margin: arrow points LEFT (outward) | Padding: arrow points RIGHT (inward) */}
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paramName === 'padding' ? 'M5 12h14m-7-7l7 7l-7 7' : 'M19 12H5m7-7l-7 7l7 7'} />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Control */}
            <div className="absolute" style={{ top: '2%', left: '50%', transform: 'translateX(-50%)' }}>
              <SideControl
                side="Top"
                value={top ?? value}
                unit={topUnit}
                handlers={topHandlers}
                onValueChange={onSideChange}
                onUnitChange={onUnitChange}
                handleSideChange={handleSideChange}
              />
            </div>

            {/* Right Control */}
            <div className="absolute" style={{ top: '50%', right: '2%', transform: 'translateY(-50%)' }}>
              <SideControl
                side="Right"
                value={right ?? value}
                unit={rightUnit}
                handlers={rightHandlers}
                onValueChange={onSideChange}
                onUnitChange={onUnitChange}
                handleSideChange={handleSideChange}
              />
            </div>

            {/* Bottom Control */}
            <div className="absolute" style={{ bottom: '2%', left: '50%', transform: 'translateX(-50%)' }}>
              <SideControl
                side="Bottom"
                value={bottom ?? value}
                unit={bottomUnit}
                handlers={bottomHandlers}
                onValueChange={onSideChange}
                onUnitChange={onUnitChange}
                handleSideChange={handleSideChange}
              />
            </div>

            {/* Left Control */}
            <div className="absolute" style={{ top: '50%', left: '2%', transform: 'translateY(-50%)' }}>
              <SideControl
                side="Left"
                value={left ?? value}
                unit={leftUnit}
                handlers={leftHandlers}
                onValueChange={onSideChange}
                onUnitChange={onUnitChange}
                handleSideChange={handleSideChange}
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

/**
 * SideControl Component - Compact control for each side
 */
interface SideControlProps {
  side: 'Top' | 'Right' | 'Bottom' | 'Left';
  value?: number;
  unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  handlers: ReturnType<typeof createHoldToRepeatHandlers>;
  onValueChange?: (side: 'Top' | 'Right' | 'Bottom' | 'Left', value: number | undefined) => void;
  onUnitChange?: (side: 'Top' | 'Right' | 'Bottom' | 'Left', unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw') => void;
  handleSideChange: (side: 'Top' | 'Right' | 'Bottom' | 'Left', e: React.ChangeEvent<HTMLInputElement>) => void;
}

function SideControl({
  side,
  value,
  unit,
  handlers,
  onValueChange,
  onUnitChange,
  handleSideChange,
}: SideControlProps) {
  // Vertical layout: [- +] → input → unit
  return (
    <div className="flex flex-col items-center gap-1">
      {/* - and + buttons (horizontal) */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onMouseDown={handlers.startDecrement}
          onMouseUp={handlers.stopChange}
          onMouseLeave={handlers.stopChange}
          onTouchStart={handlers.startDecrement}
          onTouchEnd={handlers.stopChange}
          disabled={(value ?? 0) <= 0}
          className={`
            px-1.5 py-0.5 text-sm font-bold border rounded transition-all
            ${handlers.isDecrementPressed && (value ?? 0) > 0
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
          onMouseDown={handlers.startIncrement}
          onMouseUp={handlers.stopChange}
          onMouseLeave={handlers.stopChange}
          onTouchStart={handlers.startIncrement}
          onTouchEnd={handlers.stopChange}
          className={`
            px-1.5 py-0.5 text-sm font-bold border rounded transition-all
            ${handlers.isIncrementPressed
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
        onChange={(e) => handleSideChange(side, e)}
        placeholder="0"
        className="w-14 px-1 py-1 text-xs text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        style={{ MozAppearance: 'textfield' }}
      />

      {/* Unit selector dropdown */}
      <select
        value={unit}
        onChange={(e) => {
          const newUnit = e.target.value as 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';

          // Convert value to new unit if value exists
          if (value !== undefined && value !== null) {
            const convertedValue = convertUnit(value, unit, newUnit);
            onValueChange?.(side, convertedValue);
          }

          // Update unit
          onUnitChange?.(side, newUnit);
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

/**
 * SpacingSimpleMode Component - Hold-to-repeat buttons (like NumberControl)
 */
interface SpacingSimpleModeProps {
  value?: number;
  unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  setUnit: (unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw') => void;
  handleShorthandChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (name: string, value: number | undefined) => void;
  paramName: string;
  onUnitChange?: (side: 'Top' | 'Right' | 'Bottom' | 'Left', unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw') => void;
}

function SpacingSimpleMode({ value, unit, setUnit, handleShorthandChange, onChange, paramName, onUnitChange }: SpacingSimpleModeProps) {
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
    onChange(paramName, newValue);
    valueRef.current = newValue;
  }, [onChange, paramName]);

  const handleDecrement = React.useCallback(() => {
    const currentValue = valueRef.current || 0;
    const newValue = Math.max(0, currentValue - 1);
    onChange(paramName, newValue);
    valueRef.current = newValue;
  }, [onChange, paramName]);

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
          placeholder="All sides"
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
            onChange(paramName, convertedValue);
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
