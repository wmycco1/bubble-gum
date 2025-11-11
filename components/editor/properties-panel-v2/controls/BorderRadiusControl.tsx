'use client';

/**
 * BorderRadiusControl - Modern UI for Border Radius (V7.2)
 *
 * Features:
 * - All-corners input (Simple mode)
 * - Individual corner controls (Advanced mode)
 * - Visual preview
 * - User-friendly UX 2025
 *
 * Similar to SpacingControl but for border-radius
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
}: BorderRadiusControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if any individual corners are set
  const hasIndividualValues = topLeft !== undefined || topRight !== undefined || bottomLeft !== undefined || bottomRight !== undefined;

  // Debug: Log props on every render
  console.log(`🔍 BorderRadiusControl RENDER:`, {
    value,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    hasIndividualValues,
    isExpanded
  });

  const handleShorthandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);

    console.log(`🔧 BorderRadiusControl: handleShorthandChange called`, {
      inputValue: e.target.value,
      newValue,
      currentValue: value,
      hasIndividualValues,
      topLeft, topRight, bottomLeft, bottomRight
    });

    // Clear individual corners if they exist (to apply shorthand)
    if (onCornerChange && hasIndividualValues) {
      console.log(`🔧 BorderRadiusControl: Will clear corners + apply shorthand in setTimeout`);

      setTimeout(() => {
        console.log(`🔧 BorderRadiusControl: Step 1 - Clearing individual corners`);
        onCornerChange('TopLeft', undefined);
        onCornerChange('TopRight', undefined);
        onCornerChange('BottomLeft', undefined);
        onCornerChange('BottomRight', undefined);

        console.log(`🔧 BorderRadiusControl: Step 2 - Applying shorthand borderRadius=${newValue}`);
        onChange('borderRadius', newValue);
      }, 0);
    } else {
      console.log(`🔧 BorderRadiusControl: No individual values, applying shorthand directly`);
      onChange('borderRadius', newValue);
    }
  };

  const handleCornerChange = (corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight', e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);

    console.log(`🔧 BorderRadiusControl: handleCornerChange called`, {
      corner,
      inputValue: e.target.value,
      newValue,
      currentValue: value,
      hasIndividualValues,
      topLeft, topRight, bottomLeft, bottomRight
    });

    // Don't clear shorthand! Individual values automatically override shorthand in Badge component
    // This allows fallback: if corner is undefined, use shorthand value
    if (onCornerChange) {
      console.log(`🔧 BorderRadiusControl: Calling onCornerChange for ${corner}=${newValue}`);
      onCornerChange(corner, newValue);
    }
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

      {/* Shorthand Input (Simple Mode) */}
      {!isExpanded && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={value ?? ''}
            onChange={handleShorthandChange}
            placeholder="All corners"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-sm text-gray-500">px</span>
        </div>
      )}

      {/* Individual Corners (Advanced Mode) */}
      {isExpanded && (
        <div className="space-y-2">
          {/* Visual Corner Model */}
          <div className="grid grid-cols-2 gap-2 mb-3 p-3 bg-gray-50 rounded border border-gray-200">
            {/* Top Left */}
            <div className="flex flex-col items-start gap-1">
              <label className="text-xs text-gray-600">Top Left</label>
              <input
                type="number"
                min="0"
                value={topLeft ?? value ?? ''}
                onChange={(e) => handleCornerChange('TopLeft', e)}
                placeholder="TL"
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Top Right */}
            <div className="flex flex-col items-end gap-1">
              <label className="text-xs text-gray-600">Top Right</label>
              <input
                type="number"
                min="0"
                value={topRight ?? value ?? ''}
                onChange={(e) => handleCornerChange('TopRight', e)}
                placeholder="TR"
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Bottom Left */}
            <div className="flex flex-col items-start gap-1">
              <label className="text-xs text-gray-600">Bottom Left</label>
              <input
                type="number"
                min="0"
                value={bottomLeft ?? value ?? ''}
                onChange={(e) => handleCornerChange('BottomLeft', e)}
                placeholder="BL"
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Bottom Right */}
            <div className="flex flex-col items-end gap-1">
              <label className="text-xs text-gray-600">Bottom Right</label>
              <input
                type="number"
                min="0"
                value={bottomRight ?? value ?? ''}
                onChange={(e) => handleCornerChange('BottomRight', e)}
                placeholder="BR"
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Helper Text */}
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
