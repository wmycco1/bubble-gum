'use client';

/**
 * SpacingControl - Modern UI for Margin/Padding (V7.6)
 *
 * Features:
 * - All-sides input (shorthand)
 * - Individual side controls (expand/collapse)
 * - Visual box model preview
 * - User-friendly UX 2025
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
  const [unit, setUnit] = useState<'px' | 'rem' | 'em' | '%'>('px');

  // Check if any individual sides are set
  const hasIndividualValues = top !== undefined || right !== undefined || bottom !== undefined || left !== undefined;

  // Debug: Log props on every render
  console.log(`🔍 SpacingControl RENDER for ${paramName}:`, {
    value,
    top,
    right,
    bottom,
    left,
    hasIndividualValues,
    isExpanded
  });

  const handleShorthandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);

    console.log(`🔧 SpacingControl: handleShorthandChange called`, {
      paramName,
      inputValue: e.target.value,
      newValue,
      currentValue: value,
      hasIndividualValues,
      top, right, bottom, left
    });

    // V7.5 FIX CORRECTED: Set shorthand FIRST (immediate), then clear sides in next tick
    // This ensures Badge processes shorthand before individual values are cleared
    console.log(`🔧 SpacingControl: Step 1 - Applying shorthand ${paramName}=${newValue} (immediate)`);
    onChange(paramName, newValue);

    // Then clear individual sides in next event loop tick (if they exist)
    if (onSideChange && hasIndividualValues) {
      console.log(`🔧 SpacingControl: Step 2 - Will clear individual sides in next tick for ${paramName}`);
      setTimeout(() => {
        console.log(`🔧 SpacingControl: Step 2 - Clearing individual sides for ${paramName}`);
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

  // NOTE: setSelectionRange handlers removed because input[type="number"] doesn't support selection
  // Number inputs don't allow text selection API, causing InvalidStateError

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
            step={unit === 'px' ? '1' : '0.1'}
            value={value ?? ''}
            onChange={handleShorthandChange}
            placeholder="All sides"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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

      {/* Individual Sides (Advanced Mode) - Figma-style */}
      {isExpanded && (
        <div className="space-y-3">
          {/* Figma-style Box Model - Symmetric Layout */}
          <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col items-center gap-2">
              {/* Top Side - Centered */}
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-xs font-medium text-gray-600">Top</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    step={unit === 'px' ? '1' : '0.1'}
                    value={top ?? value ?? ''}
                    onChange={(e) => handleSideChange('Top', e)}
                    placeholder="0"
                    className="w-12 px-1.5 py-1.5 text-xs text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as 'px' | 'rem' | 'em' | '%')}
                    className="px-1 py-1 text-xs border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="px">px</option>
                    <option value="rem">rem</option>
                    <option value="em">em</option>
                    <option value="%">%</option>
                  </select>
                </div>
              </div>

              {/* Middle Row: Left + Center Box + Right - Symmetric */}
              <div className="flex items-center gap-2">
                {/* Left Side */}
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-xs font-medium text-gray-600">Left</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      step={unit === 'px' ? '1' : '0.1'}
                      value={left ?? value ?? ''}
                      onChange={(e) => handleSideChange('Left', e)}
                      placeholder="0"
                      className="w-12 px-1.5 py-1.5 text-xs text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                    />
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as 'px' | 'rem' | 'em' | '%')}
                      className="px-1 py-1 text-xs border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    >
                      <option value="px">px</option>
                      <option value="rem">rem</option>
                      <option value="em">em</option>
                      <option value="%">%</option>
                    </select>
                  </div>
                </div>

                {/* Center Box */}
                <div className="flex items-center justify-center">
                  <div className="w-24 h-24 bg-white flex items-center justify-center rounded shadow-md border-2 border-gray-300">
                    <span className="text-2xl font-bold text-gray-400">
                      {paramName === 'margin' ? 'M' : 'P'}
                    </span>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-xs font-medium text-gray-600">Right</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      step={unit === 'px' ? '1' : '0.1'}
                      value={right ?? value ?? ''}
                      onChange={(e) => handleSideChange('Right', e)}
                      placeholder="0"
                      className="w-12 px-1.5 py-1.5 text-xs text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                    />
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as 'px' | 'rem' | 'em' | '%')}
                      className="px-1 py-1 text-xs border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
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
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-xs font-medium text-gray-600">Bottom</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    step={unit === 'px' ? '1' : '0.1'}
                    value={bottom ?? value ?? ''}
                    onChange={(e) => handleSideChange('Bottom', e)}
                    placeholder="0"
                    className="w-12 px-1.5 py-1.5 text-xs text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as 'px' | 'rem' | 'em' | '%')}
                    className="px-1 py-1 text-xs border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="px">px</option>
                    <option value="rem">rem</option>
                    <option value="em">em</option>
                    <option value="%">%</option>
                  </select>
                </div>
              </div>
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
