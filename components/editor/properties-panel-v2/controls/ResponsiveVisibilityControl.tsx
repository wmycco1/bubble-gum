'use client';

/**
 * ResponsiveVisibilityControl - Device Visibility Toggle (V7.8)
 *
 * Features:
 * - Toggle visibility on Mobile/Tablet/Desktop
 * - Visual device icons
 * - Modern toggle button design
 * - User-friendly UX 2025
 */

import React from 'react';

interface ResponsiveVisibilityControlProps {
  label: string;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  onChange: (device: 'mobile' | 'tablet' | 'desktop', hide: boolean) => void;
  description?: string;
}

export function ResponsiveVisibilityControl({
  label,
  hideOnMobile = false,
  hideOnTablet = false,
  hideOnDesktop = false,
  onChange,
  description,
}: ResponsiveVisibilityControlProps) {
  const devices = [
    {
      id: 'mobile' as const,
      label: 'Mobile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" strokeWidth="2"/>
          <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      isHidden: hideOnMobile,
    },
    {
      id: 'tablet' as const,
      label: 'Tablet',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="16" rx="2" ry="2" strokeWidth="2"/>
          <line x1="12" y1="17" x2="12" y2="17" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      isHidden: hideOnTablet,
    },
    {
      id: 'desktop' as const,
      label: 'Desktop',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth="2"/>
          <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" strokeLinecap="round"/>
          <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2"/>
        </svg>
      ),
      isHidden: hideOnDesktop,
    },
  ];

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

      {/* Device Toggle Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {devices.map((device) => (
          <button
            key={device.id}
            type="button"
            onClick={() => onChange(device.id, !device.isHidden)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-md border-2 transition-all duration-200
              ${device.isHidden
                ? 'border-red-300 bg-red-50 text-red-600'
                : 'border-green-300 bg-green-50 text-green-600'
              }
              hover:shadow-md
            `}
            title={device.isHidden ? `Hidden on ${device.label}` : `Visible on ${device.label}`}
          >
            {/* Device Icon */}
            <div className="mb-1">{device.icon}</div>

            {/* Device Label */}
            <span className="text-xs font-medium">{device.label}</span>

            {/* Status Indicator */}
            <span className="text-xs mt-1">
              {device.isHidden ? (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                  </svg>
                  Hidden
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  Visible
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-500 mt-2 text-center">
        Click to toggle visibility on each device
      </p>
    </div>
  );
}
