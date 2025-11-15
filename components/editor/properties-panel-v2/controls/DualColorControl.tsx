'use client';

/**
 * DualColorControl - Combined Text & Background Color (V9.0)
 *
 * Features:
 * - Two advanced color pickers in one row
 * - Text Color + Background Color combined
 * - Alpha channel support (RGBA)
 * - Eyedropper tool to pick colors from page
 * - Preset colors and recent colors
 * - Modern, space-efficient design
 * - User-friendly UX 2025
 */

import React, { useState } from 'react';
import { ColorPicker } from '@/components/editor/controls/ColorPicker';
import { Pipette } from 'lucide-react';

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
  const [textPickerOpen, setTextPickerOpen] = useState(false);
  const [bgPickerOpen, setBgPickerOpen] = useState(false);
  const isEyeDropperSupported = typeof window !== 'undefined' && 'EyeDropper' in window;

  // Debug log
  console.log('[DualColorControl] EyeDropper supported:', isEyeDropperSupported);
  console.log('[DualColorControl] Window EyeDropper:', typeof window !== 'undefined' ? window.EyeDropper : 'undefined');

  // Handle eyedropper for text color
  const handleTextEyeDropper = async () => {
    if (!('EyeDropper' in window)) {
      alert('EyeDropper API не поддерживается в вашем браузере. Используйте Chrome, Edge или Opera.');
      return;
    }

    try {
      // @ts-ignore - EyeDropper API is not in TypeScript types yet
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();

      if (result?.sRGBHex) {
        onTextColorChange(result.sRGBHex);
      }
    } catch (error) {
      console.log('EyeDropper cancelled or error:', error);
    }
  };

  // Handle eyedropper for background color
  const handleBgEyeDropper = async () => {
    if (!('EyeDropper' in window)) {
      alert('EyeDropper API не поддерживается в вашем браузере. Используйте Chrome, Edge или Opera.');
      return;
    }

    try {
      // @ts-ignore - EyeDropper API is not in TypeScript types yet
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();

      if (result?.sRGBHex) {
        onBackgroundColorChange(result.sRGBHex);
      }
    } catch (error) {
      console.log('EyeDropper cancelled or error:', error);
    }
  };

  return (
    <div className="mb-3">
      {/* Combined Label */}
      <label className="block text-xs font-medium text-gray-700 mb-2">
        Colors
      </label>

      {/* Two Color Pickers in One Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Text Color */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">Text</label>
          <div className="relative flex items-center gap-2">
            {/* Color Swatch */}
            <button
              type="button"
              onClick={() => setTextPickerOpen(!textPickerOpen)}
              className="w-10 h-10 border-2 border-gray-300 rounded-sm cursor-pointer hover:border-blue-400 hover:scale-105 transition-all"
              style={{ backgroundColor: textColor }}
              title={`Text Color: ${textColor} (click to edit)`}
            />

            {/* Eyedropper Button */}
            {isEyeDropperSupported && (
              <button
                type="button"
                onClick={handleTextEyeDropper}
                className="p-2 border-2 border-gray-300 rounded-sm hover:border-blue-400 hover:bg-blue-50 transition-all"
                title="Выбрать цвет со страницы"
              >
                <Pipette className="w-4 h-4 text-gray-600" />
              </button>
            )}

            {/* Dropdown Color Picker */}
            {textPickerOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setTextPickerOpen(false)}
                />
                <div className="absolute left-0 top-12 z-50 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4 min-w-[280px]">
                  <ColorPicker
                    value={textColor}
                    onChange={onTextColorChange}
                    showOpacity={true}
                    showPresets={true}
                    label=""
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Background Color */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">Background</label>
          <div className="relative flex items-center gap-2">
            {/* Color Swatch */}
            <button
              type="button"
              onClick={() => setBgPickerOpen(!bgPickerOpen)}
              className="w-10 h-10 border-2 border-gray-300 rounded-sm cursor-pointer hover:border-blue-400 hover:scale-105 transition-all"
              style={{ backgroundColor: backgroundColor }}
              title={`Background Color: ${backgroundColor} (click to edit)`}
            />

            {/* Eyedropper Button */}
            {isEyeDropperSupported && (
              <button
                type="button"
                onClick={handleBgEyeDropper}
                className="p-2 border-2 border-gray-300 rounded-sm hover:border-blue-400 hover:bg-blue-50 transition-all"
                title="Выбрать цвет со страницы"
              >
                <Pipette className="w-4 h-4 text-gray-600" />
              </button>
            )}

            {/* Dropdown Color Picker */}
            {bgPickerOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setBgPickerOpen(false)}
                />
                <div className="absolute left-0 top-12 z-50 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4 min-w-[280px]">
                  <ColorPicker
                    value={backgroundColor}
                    onChange={onBackgroundColorChange}
                    showOpacity={true}
                    showPresets={true}
                    label=""
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
