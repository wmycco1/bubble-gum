'use client';

/**
 * LetterSpacingControl - Letter Spacing with live preview (V8.2)
 *
 * Features:
 * - Horizontal - and + buttons layout (consistent design pattern)
 * - Number input with increment/decrement (hold to repeat with acceleration)
 * - Live text preview showing spacing
 * - Unit selector (px)
 * - Modern 2025 UX
 */

import React from 'react';

interface LetterSpacingControlProps {
  name: string;
  label: string;
  value?: number;
  onChange: (name: string, value: number) => void;
  description?: string;
  min?: number;
  max?: number;
}

export function LetterSpacingControl({
  name,
  label,
  value = 0,
  onChange,
  description,
  min = -5,
  max = 10,
}: LetterSpacingControlProps) {
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

  const handleIncrement = React.useCallback(() => {
    const currentValue = valueRef.current || 0;
    const newValue = currentValue + 0.5;
    if (newValue <= max) {
      onChange(name, newValue);
      valueRef.current = newValue; // Update ref immediately
    }
  }, [name, onChange, max]);

  const handleDecrement = React.useCallback(() => {
    const currentValue = valueRef.current || 0;
    const newValue = currentValue - 0.5;
    if (newValue >= min) {
      onChange(name, newValue);
      valueRef.current = newValue; // Update ref immediately
    }
  }, [name, onChange, min]);

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
    speedRef.current = 300; // Reset speed
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
      <div className="flex items-center gap-1">
        {/* Decrement Button */}
        <button
          type="button"
          onMouseDown={startDecrement}
          onMouseUp={stopChange}
          onMouseLeave={stopChange}
          onTouchStart={startDecrement}
          onTouchEnd={stopChange}
          disabled={value <= min}
          className={`
            px-2 py-1.5 text-sm font-bold border-2 rounded-sm transition-all
            ${isDecrementPressed && value > min
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
            }
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300
          `}
          title="Decrement (hold to repeat)"
        >
          −
        </button>

        {/* Input Field */}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(name, Number(e.target.value))}
          min={min}
          max={max}
          step="0.5"
          className="w-16 px-2 py-1.5 text-sm text-center border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ MozAppearance: 'textfield' }}
        />

        {/* Increment Button */}
        <button
          type="button"
          onMouseDown={startIncrement}
          onMouseUp={stopChange}
          onMouseLeave={stopChange}
          onTouchStart={startIncrement}
          onTouchEnd={stopChange}
          disabled={value >= max}
          className={`
            px-2 py-1.5 text-sm font-bold border-2 rounded-sm transition-all
            ${isIncrementPressed && value < max
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400'
            }
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300
          `}
          title="Increment (hold to repeat)"
        >
          +
        </button>

        {/* Unit Selector */}
        <div className="px-2 py-1.5 text-sm border-2 border-gray-300 rounded-sm bg-white text-gray-600">
          px
        </div>
      </div>
      {/* Live Preview */}
      <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Preview:</p>
        <p className="text-base font-medium" style={{ letterSpacing: `${value}px` }}>
          LETTER SPACING
        </p>
      </div>
    </div>
  );
}
