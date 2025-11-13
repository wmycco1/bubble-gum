'use client';

/**
 * AlignmentControl - Visual Alignment selector (V8.1)
 *
 * Features:
 * - Visual buttons with icons showing alignment
 * - No dropdown, direct click selection
 * - Modern 2025 UX with preview icons
 */

import React from 'react';

interface AlignmentControlProps {
  name: string;
  label: string;
  value?: string;
  onChange: (name: string, value: string) => void;
  description?: string;
}

export function AlignmentControl({
  name,
  label,
  value,
  onChange,
  description,
}: AlignmentControlProps) {
  const alignments = [
    {
      value: 'none',
      label: 'None',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    {
      value: 'left',
      label: 'Left',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
        </svg>
      ),
    },
    {
      value: 'center',
      label: 'Center',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
        </svg>
      ),
    },
    {
      value: 'right',
      label: 'Right',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
        </svg>
      ),
    },
    {
      value: 'full',
      label: 'Full',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
    },
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
      <div className="grid grid-cols-5 gap-2">
        {alignments.map((alignment) => (
          <button
            key={alignment.value}
            type="button"
            onClick={() => onChange(name, alignment.value)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-md border-2 transition-all duration-200
              ${value === alignment.value
                ? 'border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-200'
                : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
              }
            `}
            title={alignment.label}
          >
            {alignment.icon}
            <span className="text-xs font-medium mt-1">{alignment.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
