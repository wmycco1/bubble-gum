'use client';

/**
 * ColorControl - Modern Color Picker (V7.8)
 *
 * Features:
 * - Clean color picker only design (no hex input)
 * - Shows current color value on hover
 * - Modern border and hover effects
 * - User-friendly UX 2025
 */

import React from 'react';

export function ColorControl({ name, label, value = '#000000', onChange }: any) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full h-10 border-2 border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition-colors"
        title={`${label}: ${value}`}
      />
    </div>
  );
}
