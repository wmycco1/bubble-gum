'use client';

/**
 * FontFamilyControl - Font Family selector with visual preview (V8.1)
 *
 * Features:
 * - Dropdown with font preview in each option
 * - Shows actual font rendering
 * - Modern 2025 UX
 */

import React from 'react';

interface FontFamilyControlProps {
  name: string;
  label: string;
  value?: string;
  options?: string[];
  onChange: (name: string, value: string) => void;
  description?: string;
}

export function FontFamilyControl({
  name,
  label,
  value = '',
  options = [],
  onChange,
  description,
}: FontFamilyControlProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {description && (
          <span className="block text-xs text-gray-500 font-normal mt-0.5">
            {description}
          </span>
        )}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer"
          style={{ fontFamily: value || 'system-ui' }}
        >
          <option value="">Select {label}</option>
          {options.map((font: string) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
        {/* Chevron Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {/* Font Preview */}
      {value && (
        <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Preview:</p>
          <p className="text-lg" style={{ fontFamily: value }}>
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
      )}
    </div>
  );
}
