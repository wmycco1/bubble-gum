'use client';

/**
 * BorderRadiusControl - Modern UI for Border Radius (V7.4 - Figma-style)
 *
 * Features:
 * - All-corners input (Simple mode)
 * - Figma-like visual preview (Advanced mode)
 * - Individual corner controls with live preview
 * - User-friendly UX 2025
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
  const [unit, setUnit] = useState<'px' | 'rem' | 'em' | '%'>('px');

  // Check if any individual corners are set
  const hasIndividualValues = topLeft !== undefined || topRight !== undefined || bottomLeft !== undefined || bottomRight !== undefined;

  const handleShorthandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);

    // Clear individual corners if they exist (to apply shorthand)
    if (onCornerChange && hasIndividualValues) {
      setTimeout(() => {
        onCornerChange('TopLeft', undefined);
        onCornerChange('TopRight', undefined);
        onCornerChange('BottomLeft', undefined);
        onCornerChange('BottomRight', undefined);
        onChange('borderRadius', newValue);
      }, 0);
    } else {
      onChange('borderRadius', newValue);
    }
  };

  const handleCornerChange = (corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight', e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);
    if (onCornerChange) {
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

      {/* Simple Mode */}
      {!isExpanded && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            step={unit === 'px' ? '1' : '0.1'}
            value={value ?? ''}
            onChange={handleShorthandChange}
            placeholder="All corners"
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

      {/* Advanced Mode - Figma-style with Visual Preview */}
      {isExpanded && (
        <div className="space-y-3">
          {/* Figma-style Visual Model - Symmetric Layout */}
          <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col items-center gap-2">
              {/* Top Row: TopLeft + TopRight */}
              <div className="flex items-center justify-center gap-4 w-full">
                {/* Top Left Corner */}
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-xs font-medium text-gray-600">Top Left</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      step={unit === 'px' ? '1' : '0.1'}
                      value={topLeft ?? value ?? ''}
                      onChange={(e) => handleCornerChange('TopLeft', e)}
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

                {/* Spacer */}
                <div className="w-24"></div>

                {/* Top Right Corner */}
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-xs font-medium text-gray-600">Top Right</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      step={unit === 'px' ? '1' : '0.1'}
                      value={topRight ?? value ?? ''}
                      onChange={(e) => handleCornerChange('TopRight', e)}
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

              {/* Center Box with Border Radius Preview */}
              <div className="flex items-center justify-center py-2">
                <div
                  className="w-24 h-24 bg-white flex items-center justify-center text-xs font-medium text-gray-400 shadow-md transition-all border-2 border-gray-300"
                  style={{
                    borderTopLeftRadius: `${topLeft ?? value ?? 0}px`,
                    borderTopRightRadius: `${topRight ?? value ?? 0}px`,
                    borderBottomLeftRadius: `${bottomLeft ?? value ?? 0}px`,
                    borderBottomRightRadius: `${bottomRight ?? value ?? 0}px`,
                  }}
                >
                  Radius
                </div>
              </div>

              {/* Bottom Row: BottomLeft + BottomRight */}
              <div className="flex items-center justify-center gap-4 w-full">
                {/* Bottom Left Corner */}
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-xs font-medium text-gray-600">Bottom Left</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      step={unit === 'px' ? '1' : '0.1'}
                      value={bottomLeft ?? value ?? ''}
                      onChange={(e) => handleCornerChange('BottomLeft', e)}
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

                {/* Spacer */}
                <div className="w-24"></div>

                {/* Bottom Right Corner */}
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-xs font-medium text-gray-600">Bottom Right</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      step={unit === 'px' ? '1' : '0.1'}
                      value={bottomRight ?? value ?? ''}
                      onChange={(e) => handleCornerChange('BottomRight', e)}
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
