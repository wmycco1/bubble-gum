'use client';
import React from 'react';

interface NumberControlProps {
  name: string;
  label: string;
  value?: number;
  onChange: (name: string, value: number) => void;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

export function NumberControl({
  name,
  label,
  value = 0,
  onChange,
  description,
  min,
  max,
  step = 1,
  required
}: NumberControlProps) {
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
        {required && <span className="text-red-500 ml-1">*</span>}
        {description && (
          <span className="block text-xs text-gray-500 font-normal mt-0.5">
            {description}
          </span>
        )}
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(name, Number(e.target.value))}
            min={min}
            max={max}
            step={step}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            style={{ MozAppearance: 'textfield' }}
          />
          {(min !== undefined || max !== undefined) && (
            <div className="text-xs text-gray-400 mt-1">
              {min !== undefined && max !== undefined ? `${min}-${max}` : min !== undefined ? `Min: ${min}` : `Max: ${max}`}
            </div>
          )}
        </div>
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
