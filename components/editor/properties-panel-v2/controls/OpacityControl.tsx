'use client';

/**
 * OpacityControl - Modern Opacity Slider (V7.1)
 *
 * Features:
 * - Smooth slider (0-100%)
 * - Percentage display
 * - Live preview
 * - User-friendly UX 2025
 */

import React from 'react';

interface OpacityControlProps {
  label: string;
  /** Opacity value (0-100%) */
  value?: number;
  /** Callback for opacity change */
  onChange: (value: number) => void;
  description?: string;
}

export function OpacityControl({
  label,
  value = 100,
  onChange,
  description,
}: OpacityControlProps) {
  return (
    <div className="mb-4">
      {/* Label */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {description && (
            <span className="block text-xs text-gray-500 font-normal mt-0.5">
              {description}
            </span>
          )}
        </label>
      </div>

      {/* Opacity Slider with Value */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {/* Slider */}
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />

          {/* Percentage Display */}
          <div className="flex items-center gap-1 min-w-[60px]">
            <input
              type="number"
              min="0"
              max="100"
              value={value}
              onChange={(e) => {
                const newValue = Math.max(0, Math.min(100, Number(e.target.value)));
                onChange(newValue);
              }}
              className="w-14 px-2 py-1 text-sm text-center border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
        </div>

        {/* Live Preview */}
        <div className="mt-3 p-4 bg-gray-50 rounded border border-gray-200 flex justify-center items-center">
          <div
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded"
            style={{ opacity: value / 100 }}
          >
            Preview ({value}%)
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-gray-500 text-center">
          {value === 100 ? 'Fully opaque (default)' : value === 0 ? 'Fully transparent' : `${value}% visible`}
        </p>
      </div>
    </div>
  );
}
