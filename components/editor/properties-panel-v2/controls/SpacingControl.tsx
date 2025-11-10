'use client';

/**
 * SpacingControl - Modern UI for Margin/Padding (V7.4)
 *
 * Features:
 * - All-sides input (shorthand)
 * - Individual side controls (expand/collapse)
 * - Visual box model preview
 * - User-friendly UX 2025
 *
 * V7.4 Fix (Nov 10, 2025):
 * - Fixed: Simple mode ALWAYS overwrites ALL 4 sides now (including Advanced-set values)
 * - Changed order: set shorthand FIRST, then clear individual sides
 * - This ensures Badge component sees shorthand before checking individual values
 * - Badge priority is: individual > shorthand, so order matters for React batching
 * - User can switch modes freely, values cleared only when editing Simple field
 */

import React, { useState } from 'react';

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
}: SpacingControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if any individual sides are set
  const hasIndividualValues = top !== undefined || right !== undefined || bottom !== undefined || left !== undefined;

  const handleShorthandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);

    // CRITICAL: Set shorthand FIRST, then clear individual sides
    // This order ensures Badge sees the new shorthand before checking individual values
    // Badge priority: individual > shorthand, so we need shorthand set before clearing
    onChange(paramName, newValue);

    // Clear ALL individual sides AFTER setting shorthand
    // This ensures Simple mode value applies to ALL 4 sides
    if (onSideChange) {
      onSideChange('Top', undefined);
      onSideChange('Right', undefined);
      onSideChange('Bottom', undefined);
      onSideChange('Left', undefined);
    }
  };

  const handleSideChange = (side: 'Top' | 'Right' | 'Bottom' | 'Left', e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);
    if (onSideChange) {
      onSideChange(side, newValue);
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
            placeholder="All sides"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-sm text-gray-500">px</span>
        </div>
      )}

      {/* Individual Sides (Advanced Mode) */}
      {isExpanded && (
        <div className="space-y-2">
          {/* Visual Box Model */}
          <div className="grid grid-cols-3 gap-1 mb-3 p-2 bg-gray-50 rounded border border-gray-200">
            {/* Top */}
            <div className="col-span-3 flex justify-center">
              <input
                type="number"
                min="0"
                value={top ?? value ?? ''}
                onChange={(e) => handleSideChange('Top', e)}
                placeholder="Top"
                className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Left - Center - Right */}
            <div className="flex justify-center items-center">
              <input
                type="number"
                min="0"
                value={left ?? value ?? ''}
                onChange={(e) => handleSideChange('Left', e)}
                placeholder="L"
                className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-center text-xs text-gray-400">
              {paramName === 'margin' ? 'M' : 'P'}
            </div>
            <div className="flex justify-center items-center">
              <input
                type="number"
                min="0"
                value={right ?? value ?? ''}
                onChange={(e) => handleSideChange('Right', e)}
                placeholder="R"
                className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Bottom */}
            <div className="col-span-3 flex justify-center">
              <input
                type="number"
                min="0"
                value={bottom ?? value ?? ''}
                onChange={(e) => handleSideChange('Bottom', e)}
                placeholder="Bottom"
                className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
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
