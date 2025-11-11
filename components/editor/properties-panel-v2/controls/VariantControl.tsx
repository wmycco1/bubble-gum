'use client';

/**
 * VariantControl - Visual variant selector for Badge
 *
 * Features:
 * - Visual preview of each variant
 * - Letter "A" with variant colors
 * - Elegant padding and rounded corners
 * - Grid/flex layout for responsive display
 * - Clear visual selection without dropdown
 */

import React from 'react';

interface VariantControlProps {
  label: string;
  value?: string;
  options: string[];
  onChange: (name: string, value: string) => void;
  name: string;
  description?: string;
}

// Variant color mappings - EXACT colors from Badge.module.css (dark mode)
// These match what actually renders on canvas
const VARIANT_COLORS: Record<string, { color: string; background: string; label: string }> = {
  default: {
    color: '#f9fafb',
    background: '#374151',
    label: 'Default'
  },
  primary: {
    color: '#dbeafe',
    background: '#1e3a8a',
    label: 'Primary'
  },
  success: {
    color: '#d1fae5',
    background: '#064e3b',
    label: 'Success'
  },
  warning: {
    color: '#fef3c7',
    background: '#78350f',
    label: 'Warning'
  },
  error: {
    color: '#fee2e2',
    background: '#7f1d1d',
    label: 'Error'
  },
  info: {
    color: '#e0f2fe',
    background: '#0c4a6e',
    label: 'Info'
  },
};

export function VariantControl({
  label,
  value,
  options,
  onChange,
  name,
  description,
}: VariantControlProps) {
  const handleVariantClick = (variant: string) => {
    onChange(name, variant);
  };

  return (
    <div className="mb-4">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {description && (
          <span className="block text-xs text-gray-500 font-normal mt-0.5">
            {description}
          </span>
        )}
      </label>

      {/* Variant Grid */}
      <div className="grid grid-cols-4 gap-2">
        {options.map((variant) => {
          const colors = VARIANT_COLORS[variant];
          const isSelected = value === variant;

          return (
            <button
              key={variant}
              type="button"
              onClick={() => handleVariantClick(variant)}
              className={`
                relative flex flex-col items-center justify-center
                rounded-md transition-all duration-200
                ${isSelected
                  ? 'ring-2 ring-blue-500 ring-offset-2 shadow-md'
                  : 'ring-1 ring-gray-200 hover:ring-gray-300 hover:shadow-sm'
                }
              `}
              title={colors.label}
            >
              {/* Variant Preview Box */}
              <div
                className="w-full h-12 flex items-center justify-center rounded-sm mb-1"
                style={{
                  backgroundColor: colors.background,
                  color: colors.color,
                }}
              >
                <span className="text-xl font-bold">A</span>
              </div>

              {/* Variant Label */}
              <span className={`
                text-xs font-medium pb-1
                ${isSelected ? 'text-blue-600' : 'text-gray-600'}
              `}>
                {colors.label}
              </span>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
