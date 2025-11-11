'use client';

/**
 * LetterSpacingControl - Letter Spacing with live preview (V8.1)
 *
 * Features:
 * - Number input with increment/decrement
 * - Live text preview showing spacing
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
  const handleIncrement = () => {
    const newValue = (value || 0) + 0.5;
    if (newValue <= max) {
      onChange(name, newValue);
    }
  };

  const handleDecrement = () => {
    const newValue = (value || 0) - 0.5;
    if (newValue >= min) {
      onChange(name, newValue);
    }
  };

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
        <div className="relative flex-1">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(name, Number(e.target.value))}
            min={min}
            max={max}
            step="0.5"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <div className="text-xs text-gray-400 mt-1">{min}-{max}px</div>
        </div>
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={handleIncrement}
            disabled={value >= max}
            className="p-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            title="Increment"
          >
            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            disabled={value <= min}
            className="p-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            title="Decrement"
          >
            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
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
