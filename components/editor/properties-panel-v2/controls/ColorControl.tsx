'use client';

/**
 * ColorControl - Modern Color Picker (V8.0)
 *
 * Features:
 * - Compact square color swatch (40px × 40px)
 * - Full ColorPicker with alpha channel support
 * - Click to open advanced color picker
 * - Preset colors and recent colors
 * - User-friendly UX 2025
 */

import React, { useState } from 'react';
import { ColorPicker } from '@/components/editor/controls/ColorPicker';

export function ColorControl({ name, label, value = '#000000', onChange }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>

      <div className="relative">
        {/* Compact Color Swatch Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 border-2 border-gray-300 rounded-sm cursor-pointer hover:border-blue-400 hover:scale-105 transition-all"
          style={{ backgroundColor: value }}
          title={`${label}: ${value} (click to edit)`}
        />

        {/* Dropdown Color Picker */}
        {isOpen && (
          <>
            {/* Backdrop to close picker */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Color Picker Popover */}
            <div className="absolute left-0 top-12 z-50 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4 min-w-[280px]">
              <ColorPicker
                value={value}
                onChange={(newColor) => onChange(name, newColor)}
                showOpacity={true}
                showPresets={true}
                label=""
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
