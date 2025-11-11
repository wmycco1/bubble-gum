'use client';

/**
 * PositionControl - Visual Position property selector (V8.2)
 *
 * Features:
 * - Visual buttons with icons showing position types
 * - No dropdown, direct click selection
 * - Icons representing CSS position behavior
 * - Modern 2025 UX with preview icons
 */

import React from 'react';

interface PositionControlProps {
  name: string;
  label: string;
  value?: string;
  onChange: (name: string, value: string) => void;
  description?: string;
}

export function PositionControl({
  name,
  label,
  value = 'static',
  onChange,
  description,
}: PositionControlProps) {
  const positions = [
    {
      value: 'static',
      label: 'Static',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="8" width="12" height="8" rx="1" strokeWidth="2" />
          <path d="M6 8L6 6M18 8L18 6M18 16L18 18M6 16L6 18" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      value: 'relative',
      label: 'Relative',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="7" y="9" width="10" height="6" rx="1" strokeWidth="2" strokeDasharray="2 2" opacity="0.3" />
          <rect x="8" y="10" width="10" height="6" rx="1" strokeWidth="2" />
          <path d="M8 10L7 9" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 10L17 9" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      value: 'absolute',
      label: 'Absolute',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" rx="1" strokeWidth="1.5" opacity="0.3" />
          <rect x="9" y="8" width="8" height="6" rx="1" strokeWidth="2" />
          <circle cx="6" cy="6" r="1" fill="currentColor" />
          <circle cx="18" cy="6" r="1" fill="currentColor" />
          <circle cx="18" cy="18" r="1" fill="currentColor" />
          <circle cx="6" cy="18" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      value: 'fixed',
      label: 'Fixed',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="8" y="10" width="8" height="6" rx="1" strokeWidth="2" />
          <path d="M12 10V6M12 6L10 8M12 6L14 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="5" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      value: 'sticky',
      label: 'Sticky',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M8 4V12M16 4V12" strokeWidth="1.5" opacity="0.3" strokeDasharray="2 2" />
          <rect x="7" y="10" width="10" height="8" rx="1" strokeWidth="2" />
          <path d="M12 4L12 10" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="3" r="1" fill="currentColor" />
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
        {positions.map((position) => (
          <button
            key={position.value}
            type="button"
            onClick={() => onChange(name, position.value)}
            className={`
              flex flex-col items-center justify-center p-2.5 rounded-md border-2 transition-all duration-200
              ${value === position.value
                ? 'border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-200'
                : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
              }
            `}
            title={position.label}
          >
            {position.icon}
            <span className="text-[10px] font-medium mt-1 leading-tight">{position.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
