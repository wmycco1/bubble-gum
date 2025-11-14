'use client';

/**
 * TextTransformControl - Text Transform with live preview (V8.1)
 *
 * Features:
 * - Visual buttons showing none, uppercase, lowercase, capitalize
 * - Live preview of each transform
 * - Modern 2025 UX
 */

import React from 'react';

interface TextTransformControlProps {
  name: string;
  label: string;
  value?: string;
  onChange: (name: string, value: string) => void;
  description?: string;
}

export function TextTransformControl({
  name,
  label,
  value = 'none',
  onChange,
  description,
}: TextTransformControlProps) {
  const transforms = [
    { value: 'none', label: 'None', preview: 'Sample Text' },
    { value: 'uppercase', label: 'Upper', preview: 'SAMPLE TEXT' },
    { value: 'lowercase', label: 'Lower', preview: 'sample text' },
    { value: 'capitalize', label: 'Capital', preview: 'Sample Text' },
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
      <div className="grid grid-cols-4 gap-2">
        {transforms.map((transform) => (
          <button
            key={transform.value}
            type="button"
            onClick={() => onChange(name, transform.value)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-md border-2 transition-all duration-200
              ${value === transform.value
                ? 'border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-200'
                : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
              }
            `}
            title={transform.label}
          >
            <span className="text-base font-medium mb-0.5" style={{ textTransform: transform.value as any }}>
              Aa
            </span>
            <span className="text-xs">{transform.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
