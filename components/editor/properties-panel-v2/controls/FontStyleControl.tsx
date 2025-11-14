'use client';

/**
 * FontStyleControl - Font Style selector with visual preview (V8.1)
 *
 * Features:
 * - Visual buttons showing normal, italic, oblique
 * - Live preview of each style
 * - Modern 2025 UX
 */

import React from 'react';

interface FontStyleControlProps {
  name: string;
  label: string;
  value?: string;
  onChange: (name: string, value: string) => void;
  description?: string;
}

export function FontStyleControl({
  name,
  label,
  value = 'normal',
  onChange,
  description,
}: FontStyleControlProps) {
  const styles = [
    { value: 'normal', label: 'Normal', style: 'normal' },
    { value: 'italic', label: 'Italic', style: 'italic' },
    { value: 'oblique', label: 'Oblique', style: 'oblique' },
  ];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {description && (
          <span className="block text-xs text-gray-500 font-normal mt-0.5">
            {description}
          </span>
        )}
      </label>
      <div className="grid grid-cols-3 gap-2">
        {styles.map((styleItem) => (
          <button
            key={styleItem.value}
            type="button"
            onClick={() => onChange(name, styleItem.value)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-md border-2 transition-all duration-200
              ${value === styleItem.value
                ? 'border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-200'
                : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
              }
            `}
            title={styleItem.label}
          >
            <span className="text-lg font-medium mb-0.5" style={{ fontStyle: styleItem.style }}>
              Aa
            </span>
            <span className="text-xs">{styleItem.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
