'use client';

/**
 * DisplayControl - Visual Display property selector (V8.2)
 *
 * Features:
 * - Visual buttons with icons showing display types
 * - No dropdown, direct click selection
 * - Icons representing CSS display behavior
 * - Modern 2025 UX with preview icons
 */

import React from 'react';

interface DisplayControlProps {
  name: string;
  label: string;
  value?: string;
  onChange: (name: string, value: string) => void;
  description?: string;
}

export function DisplayControl({
  name,
  label,
  value = 'block',
  onChange,
  description,
}: DisplayControlProps) {
  const displays = [
    {
      value: 'block',
      label: 'Block',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="4" rx="1" />
          <rect x="3" y="11" width="18" height="4" rx="1" />
          <rect x="3" y="17" width="18" height="4" rx="1" />
        </svg>
      ),
    },
    {
      value: 'inline-block',
      label: 'Inline Block',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="8" width="6" height="8" rx="1" />
          <rect x="11" y="8" width="6" height="8" rx="1" />
          <rect x="19" y="8" width="2" height="8" rx="0.5" />
        </svg>
      ),
    },
    {
      value: 'inline',
      label: 'Inline',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <text x="3" y="16" fontSize="10" fontWeight="bold">ABC</text>
        </svg>
      ),
    },
    {
      value: 'flex',
      label: 'Flex',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="7" width="5" height="10" rx="1" strokeWidth="2" />
          <rect x="10" y="7" width="5" height="10" rx="1" strokeWidth="2" />
          <rect x="17" y="7" width="4" height="10" rx="1" strokeWidth="2" />
        </svg>
      ),
    },
    {
      value: 'inline-flex',
      label: 'Inline Flex',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="4" y="9" width="4" height="6" rx="0.5" strokeWidth="1.5" />
          <rect x="9" y="9" width="4" height="6" rx="0.5" strokeWidth="1.5" />
          <rect x="14" y="9" width="3" height="6" rx="0.5" strokeWidth="1.5" />
          <rect x="18" y="9" width="2" height="6" rx="0.5" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      value: 'grid',
      label: 'Grid',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="8" height="8" rx="1" />
          <rect x="13" y="3" width="8" height="8" rx="1" />
          <rect x="3" y="13" width="8" height="8" rx="1" />
          <rect x="13" y="13" width="8" height="8" rx="1" />
        </svg>
      ),
    },
    {
      value: 'inline-grid',
      label: 'Inline Grid',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <rect x="5" y="6" width="5" height="5" rx="0.5" />
          <rect x="11" y="6" width="5" height="5" rx="0.5" />
          <rect x="5" y="12" width="5" height="5" rx="0.5" />
          <rect x="11" y="12" width="5" height="5" rx="0.5" />
          <rect x="17" y="9" width="2" height="6" rx="0.5" />
        </svg>
      ),
    },
    {
      value: 'none',
      label: 'None',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="1" strokeWidth="2" opacity="0.3" />
          <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
          <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
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
      <div className="grid grid-cols-4 gap-2">
        {displays.map((display) => (
          <button
            key={display.value}
            type="button"
            onClick={() => onChange(name, display.value)}
            className={`
              flex flex-col items-center justify-center p-2.5 rounded-md border-2 transition-all duration-200
              ${value === display.value
                ? 'border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-200'
                : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
              }
            `}
            title={display.label}
          >
            {display.icon}
            <span className="text-[10px] font-medium mt-1 leading-tight">{display.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
