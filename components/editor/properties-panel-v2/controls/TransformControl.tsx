'use client';

/**
 * TransformControl - Rotation & Scale controls (V1.1)
 *
 * Features:
 * - Rotation (single value as number)
 * - Scale (uniform or individual X/Y as numbers)
 * - Simple/Advanced mode toggle
 * - Visual preview indicators
 * - Works with Properties Panel (no canvas handles)
 *
 * V1.1 Changes:
 * - Fixed: rotate is now number (not string with "deg")
 * - Removed: scale prop (use scaleX/scaleY directly)
 * - Simple mode: sets both scaleX and scaleY to same value
 */

import React, { useState } from 'react';

interface TransformControlProps {
  label: string;
  // Rotation (number, e.g., 45 means 45 degrees)
  rotate?: number;
  // Scale (numbers, e.g., 1.5 means 150%)
  scaleX?: number;
  scaleY?: number;
  // Callbacks
  onChange: (name: string, value: number | undefined) => void;
  description?: string;
}

export function TransformControl({
  label,
  rotate,
  scaleX,
  scaleY,
  onChange,
  description,
}: TransformControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Use provided values or defaults
  const rotateValue = rotate ?? 0;
  const scaleXValue = scaleX ?? 1;
  const scaleYValue = scaleY ?? 1;

  // For simple mode, show uniform scale (average of X and Y)
  const uniformScaleValue = scaleX !== undefined || scaleY !== undefined
    ? (scaleXValue + scaleYValue) / 2
    : 1;

  const handleRotateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange('rotate', value === '' ? undefined : parseFloat(value));
  };

  const handleUniformScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value === '' ? undefined : parseFloat(value);

    // Set both scaleX and scaleY to the same value
    onChange('scaleX', numValue);
    onChange('scaleY', numValue);
  };

  const handleScaleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange('scaleX', value === '' ? undefined : parseFloat(value));
  };

  const handleScaleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange('scaleY', value === '' ? undefined : parseFloat(value));
  };

  return (
    <div className="mb-4">
      {/* Label & Expand Button */}
      <div className="flex items-center justify-between mb-2">
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

      {/* Simple Mode - Rotation + Uniform Scale in one row */}
      {!isExpanded && (
        <div className="grid grid-cols-2 gap-3">
          {/* Rotation */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Rotation (°)</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="-360"
                max="360"
                step="1"
                value={rotateValue}
                onChange={handleRotateChange}
                placeholder="0"
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <div
                className="w-8 h-8 border-2 border-blue-500 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ transform: `rotate(${rotateValue}deg)` }}
                title={`${rotateValue}°`}
              >
                R
              </div>
            </div>
          </div>

          {/* Uniform Scale */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Scale (×)</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={uniformScaleValue}
                onChange={handleUniformScaleChange}
                placeholder="1"
                className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <div
                className="w-8 h-8 border-2 border-green-500 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ transform: `scale(${Math.min(uniformScaleValue, 2)})` }}
                title={`×${uniformScaleValue.toFixed(1)}`}
              >
                S
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Mode - Rotation + Individual Scale X/Y */}
      {isExpanded && (
        <div className="space-y-3">
          {/* Rotation - Full Width */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Rotation (°)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="-360"
                max="360"
                step="1"
                value={rotateValue}
                onChange={handleRotateChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm text-gray-500 min-w-[60px] text-right">{rotateValue}°</span>
            </div>
          </div>

          {/* Scale X & Y - Side by Side */}
          <div className="grid grid-cols-2 gap-3">
            {/* Scale X */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Scale X</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={scaleXValue}
                  onChange={handleScaleXChange}
                  placeholder="1"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-xs text-gray-500 min-w-[40px] text-right flex-shrink-0">×{scaleXValue.toFixed(1)}</span>
              </div>
            </div>

            {/* Scale Y */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Scale Y</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={scaleYValue}
                  onChange={handleScaleYChange}
                  placeholder="1"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-xs text-gray-500 min-w-[40px] text-right flex-shrink-0">×{scaleYValue.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Visual Preview */}
          <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
            <div className="text-xs text-gray-600 mb-2 text-center">Preview</div>
            <div className="flex items-center justify-center h-24">
              <div
                className="w-16 h-16 bg-blue-500 rounded flex items-center justify-center text-white font-bold"
                style={{
                  transform: `rotate(${rotateValue}deg) scale(${scaleXValue}, ${scaleYValue})`,
                  transition: 'transform 0.2s ease',
                }}
              >
                T
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
