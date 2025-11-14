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
      description: 'Normal flow',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {/* Simple box in document flow */}
          <rect x="5" y="8" width="14" height="8" rx="1.5" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
          {/* Flow lines above and below */}
          <path d="M4 6H20M4 18H20" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        </svg>
      ),
    },
    {
      value: 'relative',
      label: 'Relative',
      description: 'Offset from normal position',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {/* Ghost original position */}
          <rect x="6" y="10" width="10" height="8" rx="1.5" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.3" />
          {/* Actual offset position */}
          <rect x="8" y="8" width="10" height="8" rx="1.5" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
          {/* Arrow showing offset */}
          <path d="M11 14L13 12" strokeWidth="1.5" strokeLinecap="round" markerEnd="url(#arrowhead)" />
        </svg>
      ),
    },
    {
      value: 'absolute',
      label: 'Absolute',
      description: 'Position within parent',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {/* Parent container with corner anchors */}
          <rect x="3" y="3" width="18" height="18" rx="1.5" strokeWidth="1" opacity="0.25" strokeDasharray="2 2" />
          {/* Positioned element */}
          <rect x="11" y="7" width="8" height="7" rx="1.5" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
          {/* Corner dots showing anchors */}
          <circle cx="4.5" cy="4.5" r="1.2" fill="currentColor" opacity="0.4" />
          <circle cx="19.5" cy="4.5" r="1.2" fill="currentColor" opacity="0.4" />
          <circle cx="19.5" cy="19.5" r="1.2" fill="currentColor" opacity="0.4" />
          <circle cx="4.5" cy="19.5" r="1.2" fill="currentColor" opacity="0.4" />
        </svg>
      ),
    },
    {
      value: 'fixed',
      label: 'Fixed',
      description: 'Fixed to viewport',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {/* Pin/thumbtack */}
          <circle cx="12" cy="6" r="2.5" strokeWidth="1.5" fill="currentColor" />
          <path d="M12 8.5V12" strokeWidth="1.5" strokeLinecap="round" />
          {/* Fixed box */}
          <rect x="7" y="11" width="10" height="8" rx="1.5" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
        </svg>
      ),
    },
    {
      value: 'sticky',
      label: 'Sticky',
      description: 'Scrolls then sticks',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {/* Scroll track */}
          <path d="M8 4V9M16 4V9" strokeWidth="1.5" opacity="0.3" strokeDasharray="2 2" />
          {/* Sticky element */}
          <rect x="7" y="9" width="10" height="8" rx="1.5" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
          {/* Pin indicator */}
          <circle cx="12" cy="5" r="1.5" fill="currentColor" />
          <path d="M12 6.5V9" strokeWidth="1.5" strokeLinecap="round" />
          {/* Bottom scroll track */}
          <path d="M8 17V20M16 17V20" strokeWidth="1.5" opacity="0.3" strokeDasharray="2 2" />
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
      <div className="@container">
        <div className="grid grid-cols-3 @[301px]:grid-cols-5 gap-2">
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
            <span className="text-[10px] font-medium mt-0.5 leading-tight">{position.label}</span>
          </button>
        ))}
        </div>
      </div>
    </div>
  );
}
