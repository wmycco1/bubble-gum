'use client';

/**
 * DualColorControl - Combined Text & Background Color (V7.8)
 *
 * Features:
 * - Two color pickers in one row
 * - Text Color + Background Color combined
 * - Modern, space-efficient design
 * - User-friendly UX 2025
 */

import React from 'react';

interface DualColorControlProps {
  textColor?: string;
  backgroundColor?: string;
  onTextColorChange: (color: string | undefined) => void;
  onBackgroundColorChange: (color: string | undefined) => void;
}

export function DualColorControl({
  textColor = '#000000',
  backgroundColor = '#ffffff',
  onTextColorChange,
  onBackgroundColorChange,
}: DualColorControlProps) {
  return (
    <div className="mb-3">
      {/* Combined Label */}
      <label className="block text-xs font-medium text-gray-700 mb-2">
        Colors
      </label>

      {/* Two Color Pickers in One Row */}
      <div className="grid grid-cols-2 gap-2">
        {/* Text Color */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">Text</label>
          <input
            type="color"
            value={textColor || '#000000'}
            onChange={(e) => onTextColorChange(e.target.value)}
            className="w-full h-10 border-2 border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition-colors"
            title={`Text Color: ${textColor}`}
          />
        </div>

        {/* Background Color */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">Background</label>
          <input
            type="color"
            value={backgroundColor || '#ffffff'}
            onChange={(e) => onBackgroundColorChange(e.target.value)}
            className="w-full h-10 border-2 border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition-colors"
            title={`Background Color: ${backgroundColor}`}
          />
        </div>
      </div>
    </div>
  );
}
