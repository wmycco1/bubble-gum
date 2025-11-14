'use client';

/**
 * convertUnit - Convert values between different CSS units
 * Two-step conversion: source unit → px → target unit
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

  // Round to 2 decimal places
  return Math.round(result * 100) / 100;
}

/**
 * FontSizeControl - Font Size with Unit Support (V8.1)
 *
 * Features:
 * - Multiple units: px, rem, em, %
 * - Number input with external increment/decrement buttons
 * - Hold-to-repeat with acceleration
 * - Vertically centered buttons relative to input field
 * - Modern 2025 UX
 */

import React from 'react';

interface FontSizeControlProps {
  name: string;
  label: string;
  value?: number;
  unit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  onChange: (name: string, value: number) => void;
  onUnitChange?: (name: string, unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw') => void;
  description?: string;
  min?: number;
  max?: number;
}

export function FontSizeControl({
  name,
  label,
  value = 16,
  unit = 'px',
  onChange,
  onUnitChange,
  description,
  min,
  max,
}: FontSizeControlProps) {
  const [isIncrementPressed, setIsIncrementPressed] = React.useState(false);
  const [isDecrementPressed, setIsDecrementPressed] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const speedRef = React.useRef(100); // Initial delay (faster)
  const valueRef = React.useRef(value); // Track current value

  // Update ref when value changes
  React.useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // Determine step based on unit
  const step = unit === 'px' ? 1 : 0.1;

  const handleIncrement = React.useCallback(() => {
    const currentValue = valueRef.current || 0;
    const newValue = currentValue + step;
    if (max === undefined || newValue <= max) {
      onChange(name, newValue);
      valueRef.current = newValue; // Update ref immediately
    }
  }, [name, onChange, step, max]);

  const handleDecrement = React.useCallback(() => {
    const currentValue = valueRef.current || 0;
    const newValue = currentValue - step;
    if (min === undefined || newValue >= min) {
      onChange(name, newValue);
      valueRef.current = newValue; // Update ref immediately
    }
  }, [name, onChange, step, min]);

  // Start incrementing with acceleration
  const startIncrement = () => {
    setIsIncrementPressed(true);
    handleIncrement(); // First click

    speedRef.current = 100; // Reset speed (faster)
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        handleIncrement();
        // Accelerate - reduce delay every iteration (more aggressive)
        if (speedRef.current > 20) {
          speedRef.current = Math.max(20, speedRef.current - 10);
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = setInterval(handleIncrement, speedRef.current);
        }
      }, speedRef.current);
    }, 200); // Shorter initial delay
  };

  // Start decrementing with acceleration
  const startDecrement = () => {
    setIsDecrementPressed(true);
    handleDecrement(); // First click

    speedRef.current = 100; // Reset speed (faster)
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        handleDecrement();
        // Accelerate - reduce delay every iteration (more aggressive)
        if (speedRef.current > 20) {
          speedRef.current = Math.max(20, speedRef.current - 10);
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = setInterval(handleDecrement, speedRef.current);
        }
      }, speedRef.current);
    }, 200); // Shorter initial delay
  };

  // Stop incrementing/decrementing
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
    speedRef.current = 100; // Reset speed
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {description && (
          <span className="block text-xs text-gray-500 font-normal mt-0.5">
            {description}
          </span>
        )}
      </label>
      <div className="flex items-center gap-2">
        {/* Input + Unit Selector */}
        <div className="relative flex-1 flex gap-1">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(name, Number(e.target.value))}
            min={min}
            max={max}
            step={step}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            style={{ MozAppearance: 'textfield' }}
          />
          {/* Unit Selector */}
          <select
            value={unit}
            onChange={(e) => {
              const newUnit = e.target.value as 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';

              // Convert value to new unit if value exists
              if (value !== undefined && value !== null) {
                const convertedValue = convertUnit(value, unit, newUnit);
                onChange(name, convertedValue);
              }

              // Update unit
              onUnitChange?.(name, newUnit);
            }}
            className="px-2 py-2 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm hover:border-gray-400 transition-colors"
          >
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
            <option value="%">%</option>
            <option value="vh">vh</option>
            <option value="vw">vw</option>
          </select>
        </div>

        {/* External Increment/Decrement Buttons - Vertically Centered */}
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onMouseDown={startIncrement}
            onMouseUp={stopChange}
            onMouseLeave={stopChange}
            onTouchStart={startIncrement}
            onTouchEnd={stopChange}
            disabled={max !== undefined && (value || 0) >= max}
            className={`
              p-1.5 border-2 rounded-md transition-all shadow-sm
              ${isIncrementPressed && !(max !== undefined && (value || 0) >= max)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
              }
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300
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
            disabled={min !== undefined && (value || 0) <= min}
            className={`
              p-1.5 border-2 rounded-md transition-all shadow-sm
              ${isDecrementPressed && !(min !== undefined && (value || 0) <= min)
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
    </div>
  );
}
