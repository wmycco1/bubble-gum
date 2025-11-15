'use client';

/**
 * ColorControl - Modern Color Picker (V9.0)
 *
 * Features:
 * - Compact square color swatch (40px × 40px)
 * - Full ColorPicker with alpha channel support
 * - Eyedropper tool to pick colors from page
 * - Click to open advanced color picker
 * - Preset colors and recent colors
 * - User-friendly UX 2025
 */

import React, { useState } from 'react';
import { ColorPicker } from '@/components/editor/controls/ColorPicker';
import { Pipette } from 'lucide-react';

export function ColorControl({ name, label, value = '#000000', onChange }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEyeDropperSupported, setIsEyeDropperSupported] = useState(false);

  // Check if EyeDropper API is supported
  React.useEffect(() => {
    setIsEyeDropperSupported('EyeDropper' in window);
  }, []);

  // Handle eyedropper color pick
  const handleEyeDropper = async () => {
    if (!('EyeDropper' in window)) {
      alert('EyeDropper API не поддерживается в вашем браузере. Используйте Chrome, Edge или Opera.');
      return;
    }

    try {
      // @ts-ignore - EyeDropper API is not in TypeScript types yet
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();

      if (result?.sRGBHex) {
        onChange(name, result.sRGBHex);
      }
    } catch (error) {
      // User cancelled or error occurred
      console.log('EyeDropper cancelled or error:', error);
    }
  };

  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>

      <div className="relative flex items-center gap-2">
        {/* Compact Color Swatch Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 border-2 border-gray-300 rounded-sm cursor-pointer hover:border-blue-400 hover:scale-105 transition-all"
          style={{ backgroundColor: value }}
          title={`${label}: ${value} (click to edit)`}
        />

        {/* Eyedropper Button */}
        {isEyeDropperSupported && (
          <button
            type="button"
            onClick={handleEyeDropper}
            className="p-2 border-2 border-gray-300 rounded-sm hover:border-blue-400 hover:bg-blue-50 transition-all"
            title="Выбрать цвет со страницы (пипетка)"
          >
            <Pipette className="w-4 h-4 text-gray-600" />
          </button>
        )}

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
