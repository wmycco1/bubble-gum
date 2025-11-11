'use client';

/**
 * BorderControl - Modern UI for Border (V7.4 - Figma-style)
 *
 * Features:
 * - Visual border style selector (Simple mode)
 * - Figma-like box model preview (Advanced mode)
 * - Individual side controls with colors
 * - User-friendly UX 2025
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

// Border style options with visual previews
const BORDER_STYLES = [
  { value: 'none', label: 'None', preview: 'none' },
  { value: 'solid', label: 'Solid', preview: 'solid' },
  { value: 'dashed', label: 'Dashed', preview: 'dashed' },
  { value: 'dotted', label: 'Dotted', preview: 'dotted' },
  { value: 'double', label: 'Double', preview: 'double' },
];

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
  const [unit, setUnit] = useState<'px' | 'rem' | 'em' | '%'>('px');

  // Check if any individual sides are set
  const hasIndividualValues = top !== undefined || right !== undefined || bottom !== undefined || left !== undefined;

  const handleShorthandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);

    // Clear individual sides if they exist (to apply shorthand)
    if (onSideChange && hasIndividualValues) {
      setTimeout(() => {
        onSideChange('Top', undefined);
        onSideChange('Right', undefined);
        onSideChange('Bottom', undefined);
        onSideChange('Left', undefined);
        onChange('borderWidth', newValue);
      }, 0);
    } else {
      onChange('borderWidth', newValue);
    }
  };

  const handleSideChange = (side: 'Top' | 'Right' | 'Bottom' | 'Left', e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);
    if (onSideChange) {
      onSideChange(side, newValue);
    }
  };

  const handleStyleClick = (style: string) => {
    if (onStyleChange) {
      onStyleChange(style);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    const hasIndividualColors = topColor !== undefined || rightColor !== undefined || bottomColor !== undefined || leftColor !== undefined;

    if (onSideColorChange && hasIndividualColors && onColorChange) {
      setTimeout(() => {
        onSideColorChange('Top', undefined);
        onSideColorChange('Right', undefined);
        onSideColorChange('Bottom', undefined);
        onSideColorChange('Left', undefined);
        onColorChange(newColor);
      }, 0);
    } else if (onColorChange) {
      onColorChange(newColor);
    }
  };

  const handleSideColorChange = (side: 'Top' | 'Right' | 'Bottom' | 'Left', e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSideColorChange) {
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

      {/* Simple Mode */}
      {!isExpanded && (
        <div className="space-y-3">
          {/* Visual Border Style Selector */}
          <div>
            <label className="block text-xs text-gray-600 mb-2">Style</label>
            <div className="grid grid-cols-5 gap-1">
              {BORDER_STYLES.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => handleStyleClick(style.value)}
                  className={`
                    flex flex-col items-center justify-center p-2 rounded-md transition-all
                    ${borderStyle === style.value
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'ring-1 ring-gray-200 hover:ring-gray-300 bg-white'
                    }
                  `}
                  title={style.label}
                >
                  {/* Visual Preview */}
                  <div className="w-full h-8 flex items-center justify-center mb-1">
                    {style.value === 'none' ? (
                      <div className="w-full h-0.5 bg-gray-200 relative">
                        <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">×</span>
                      </div>
                    ) : (
                      <div
                        className="w-full h-0"
                        style={{
                          borderTop: `3px ${style.preview} ${borderStyle === style.value ? '#3b82f6' : '#374151'}`,
                        }}
                      />
                    )}
                  </div>
                  {/* Label */}
                  <span className={`text-xs ${borderStyle === style.value ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                    {style.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Width & Color */}
          <div className="grid grid-cols-2 gap-2">
            {/* Width */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Width</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  step={unit === 'px' ? '1' : '0.1'}
                  value={value ?? ''}
                  onChange={handleShorthandChange}
                  placeholder="0"
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
            </div>

            {/* Color */}
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
        </div>
      )}

      {/* Advanced Mode - Figma-style Box Model */}
      {isExpanded && (
        <div className="space-y-3">
          {/* Visual Border Style Selector (same as Simple) */}
          <div>
            <label className="block text-xs text-gray-600 mb-2">Style</label>
            <div className="grid grid-cols-5 gap-1">
              {BORDER_STYLES.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => handleStyleClick(style.value)}
                  className={`
                    flex flex-col items-center justify-center p-2 rounded-md transition-all
                    ${borderStyle === style.value
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'ring-1 ring-gray-200 hover:ring-gray-300 bg-white'
                    }
                  `}
                  title={style.label}
                >
                  {/* Visual Preview */}
                  <div className="w-full h-8 flex items-center justify-center mb-1">
                    {style.value === 'none' ? (
                      <div className="w-full h-0.5 bg-gray-200 relative">
                        <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">×</span>
                      </div>
                    ) : (
                      <div
                        className="w-full h-0"
                        style={{
                          borderTop: `3px ${style.preview} ${borderStyle === style.value ? '#3b82f6' : '#374151'}`,
                        }}
                      />
                    )}
                  </div>
                  {/* Label */}
                  <span className={`text-xs ${borderStyle === style.value ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                    {style.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Figma-style Box Model - Symmetric Layout */}
          <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col items-center gap-2">
              {/* Top Border - Centered */}
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
                  <input
                    type="color"
                    value={topColor ?? borderColor}
                    onChange={(e) => handleSideColorChange('Top', e)}
                    className="w-9 h-9 border-2 border-gray-300 rounded-md cursor-pointer shadow-sm hover:border-blue-400 transition-colors"
                    title="Top color"
                  />
                </div>
              </div>

              {/* Middle Row: Left + Center Box + Right - Symmetric */}
              <div className="flex items-center gap-2">
                {/* Left Border */}
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-xs font-medium text-gray-600">Left</span>
                  <div className="flex flex-col items-center gap-1.5">
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
                    <input
                      type="color"
                      value={leftColor ?? borderColor}
                      onChange={(e) => handleSideColorChange('Left', e)}
                      className="w-9 h-9 border-2 border-gray-300 rounded-md cursor-pointer shadow-sm hover:border-blue-400 transition-colors"
                      title="Left color"
                    />
                  </div>
                </div>

                {/* Center Box with Border Preview */}
                <div className="flex items-center justify-center">
                  <div
                    className="w-24 h-24 bg-white flex items-center justify-center text-xs font-medium text-gray-400 rounded shadow-md transition-all"
                    style={{
                      borderTopWidth: `${top ?? value ?? 0}px`,
                      borderRightWidth: `${right ?? value ?? 0}px`,
                      borderBottomWidth: `${bottom ?? value ?? 0}px`,
                      borderLeftWidth: `${left ?? value ?? 0}px`,
                      borderStyle: borderStyle,
                      borderTopColor: topColor ?? borderColor,
                      borderRightColor: rightColor ?? borderColor,
                      borderBottomColor: bottomColor ?? borderColor,
                      borderLeftColor: leftColor ?? borderColor,
                    }}
                  >
                    Preview
                  </div>
                </div>

                {/* Right Border */}
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-xs font-medium text-gray-600">Right</span>
                  <div className="flex flex-col items-center gap-1.5">
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
                    <input
                      type="color"
                      value={rightColor ?? borderColor}
                      onChange={(e) => handleSideColorChange('Right', e)}
                      className="w-9 h-9 border-2 border-gray-300 rounded-md cursor-pointer shadow-sm hover:border-blue-400 transition-colors"
                      title="Right color"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Border - Centered */}
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
                  <input
                    type="color"
                    value={bottomColor ?? borderColor}
                    onChange={(e) => handleSideColorChange('Bottom', e)}
                    className="w-9 h-9 border-2 border-gray-300 rounded-md cursor-pointer shadow-sm hover:border-blue-400 transition-colors"
                    title="Bottom color"
                  />
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
