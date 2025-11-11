'use client';

/**
 * BorderControl - Modern UI for Border (V7.3)
 *
 * Features:
 * - All-sides input (Simple mode)
 * - Individual side controls (Advanced mode)
 * - Border style & color
 * - Visual preview
 * - User-friendly UX 2025
 *
 * Similar to SpacingControl and BorderRadiusControl
 */

import React, { useState } from 'react';

interface BorderControlProps {
  label: string;
  /** Shorthand value for all sides */
  value?: number;
  /** Individual side values (override shorthand) */
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  /** Border style */
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  /** Border color (shorthand for all sides) */
  borderColor?: string;
  /** Individual side colors (override shorthand) */
  topColor?: string;
  rightColor?: string;
  bottomColor?: string;
  leftColor?: string;
  /** Callback for shorthand change */
  onChange: (name: string, value: number | undefined) => void;
  /** Callback for individual side change */
  onSideChange?: (side: 'Top' | 'Right' | 'Bottom' | 'Left', value: number | undefined) => void;
  /** Callback for style change */
  onStyleChange?: (style: string) => void;
  /** Callback for color change (shorthand) */
  onColorChange?: (color: string) => void;
  /** Callback for individual side color change (can be undefined to clear) */
  onSideColorChange?: (side: 'Top' | 'Right' | 'Bottom' | 'Left', color: string | undefined) => void;
  description?: string;
}

export function BorderControl({
  label,
  value,
  top,
  right,
  bottom,
  left,
  borderStyle = 'solid',
  borderColor = '#000000',
  topColor,
  rightColor,
  bottomColor,
  leftColor,
  onChange,
  onSideChange,
  onStyleChange,
  onColorChange,
  onSideColorChange,
  description,
}: BorderControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if any individual sides are set
  const hasIndividualValues = top !== undefined || right !== undefined || bottom !== undefined || left !== undefined;

  // Debug: Log props on every render
  console.log(`🔍 BorderControl RENDER:`, {
    value,
    top,
    right,
    bottom,
    left,
    hasIndividualValues,
    isExpanded,
    borderStyle,
    borderColor,
  });

  const handleShorthandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);

    console.log(`🔧 BorderControl: handleShorthandChange called`, {
      inputValue: e.target.value,
      newValue,
      currentValue: value,
      hasIndividualValues,
      top, right, bottom, left
    });

    // Clear individual sides if they exist (to apply shorthand)
    if (onSideChange && hasIndividualValues) {
      console.log(`🔧 BorderControl: Will clear sides + apply shorthand in setTimeout`);

      setTimeout(() => {
        console.log(`🔧 BorderControl: Step 1 - Clearing individual sides`);
        onSideChange('Top', undefined);
        onSideChange('Right', undefined);
        onSideChange('Bottom', undefined);
        onSideChange('Left', undefined);

        console.log(`🔧 BorderControl: Step 2 - Applying shorthand borderWidth=${newValue}`);
        onChange('borderWidth', newValue);
      }, 0);
    } else {
      console.log(`🔧 BorderControl: No individual values, applying shorthand directly`);
      onChange('borderWidth', newValue);
    }
  };

  const handleSideChange = (side: 'Top' | 'Right' | 'Bottom' | 'Left', e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);

    console.log(`🔧 BorderControl: handleSideChange called`, {
      side,
      inputValue: e.target.value,
      newValue,
      currentValue: value,
      hasIndividualValues,
      top, right, bottom, left
    });

    // Don't clear shorthand! Individual values automatically override shorthand in Badge component
    // This allows fallback: if side is undefined, use shorthand value
    if (onSideChange) {
      console.log(`🔧 BorderControl: Calling onSideChange for ${side}=${newValue}`);
      onSideChange(side, newValue);
    }
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onStyleChange) {
      console.log(`🔧 BorderControl: Changing borderStyle to ${e.target.value}`);
      onStyleChange(e.target.value);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;

    console.log(`🔧 BorderControl: handleColorChange called`, {
      newColor,
      currentBorderColor: borderColor,
      hasIndividualColors: topColor !== undefined || rightColor !== undefined || bottomColor !== undefined || leftColor !== undefined,
      topColor, rightColor, bottomColor, leftColor
    });

    // Check if any individual side colors are set
    const hasIndividualColors = topColor !== undefined || rightColor !== undefined || bottomColor !== undefined || leftColor !== undefined;

    // Clear individual side colors if they exist (to apply shorthand)
    if (onSideColorChange && hasIndividualColors && onColorChange) {
      console.log(`🔧 BorderControl: Will clear individual side colors + apply shorthand borderColor in setTimeout`);

      setTimeout(() => {
        console.log(`🔧 BorderControl: Step 1 - Clearing individual side colors`);
        onSideColorChange('Top', undefined);
        onSideColorChange('Right', undefined);
        onSideColorChange('Bottom', undefined);
        onSideColorChange('Left', undefined);

        console.log(`🔧 BorderControl: Step 2 - Applying shorthand borderColor=${newColor}`);
        onColorChange(newColor);
      }, 0);
    } else if (onColorChange) {
      console.log(`🔧 BorderControl: No individual colors, applying shorthand directly`);
      onColorChange(newColor);
    }
  };

  const handleSideColorChange = (side: 'Top' | 'Right' | 'Bottom' | 'Left', e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSideColorChange) {
      console.log(`🔧 BorderControl: Changing border${side}Color to ${e.target.value}`);
      onSideColorChange(side, e.target.value);
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

      {/* Simple Mode - Compact 3-column layout */}
      {!isExpanded && (
        <div className="grid grid-cols-3 gap-2">
          {/* Border Style */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Style</label>
            <select
              value={borderStyle}
              onChange={handleStyleChange}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="none">None</option>
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
            </select>
          </div>

          {/* Width (All sides) */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Width</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                value={value ?? ''}
                onChange={handleShorthandChange}
                placeholder="0"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
          </div>

          {/* Border Color */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Color</label>
            <input
              type="color"
              value={borderColor}
              onChange={handleColorChange}
              className="w-full h-9 border border-gray-300 rounded cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Individual Sides (Advanced Mode) - Compact 2x2 Grid */}
      {isExpanded && (
        <div className="space-y-2">
          {/* Border Style (Advanced mode) */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Style</label>
            <select
              value={borderStyle}
              onChange={handleStyleChange}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="none">None</option>
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
            </select>
          </div>

          {/* Row 1: Top + Right */}
          <div className="grid grid-cols-2 gap-2">
            {/* Top Side */}
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              <label className="block text-xs font-medium text-gray-700 mb-1">Top</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  value={top ?? value ?? ''}
                  onChange={(e) => handleSideChange('Top', e)}
                  placeholder="px"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="color"
                  value={topColor ?? borderColor}
                  onChange={(e) => handleSideColorChange('Top', e)}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  title="Top color"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              <label className="block text-xs font-medium text-gray-700 mb-1">Right</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  value={right ?? value ?? ''}
                  onChange={(e) => handleSideChange('Right', e)}
                  placeholder="px"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="color"
                  value={rightColor ?? borderColor}
                  onChange={(e) => handleSideColorChange('Right', e)}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  title="Right color"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Bottom + Left */}
          <div className="grid grid-cols-2 gap-2">
            {/* Bottom Side */}
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              <label className="block text-xs font-medium text-gray-700 mb-1">Bottom</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  value={bottom ?? value ?? ''}
                  onChange={(e) => handleSideChange('Bottom', e)}
                  placeholder="px"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="color"
                  value={bottomColor ?? borderColor}
                  onChange={(e) => handleSideColorChange('Bottom', e)}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  title="Bottom color"
                />
              </div>
            </div>

            {/* Left Side */}
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              <label className="block text-xs font-medium text-gray-700 mb-1">Left</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  value={left ?? value ?? ''}
                  onChange={(e) => handleSideChange('Left', e)}
                  placeholder="px"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="color"
                  value={leftColor ?? borderColor}
                  onChange={(e) => handleSideColorChange('Left', e)}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  title="Left color"
                />
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
