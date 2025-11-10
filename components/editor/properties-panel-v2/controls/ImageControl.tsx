'use client';
import React from 'react';

export function ImageControl({ name, label, value = '', onChange }: any) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <div className="space-y-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder="Enter image URL"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {value && (
          <div className="border border-gray-300 rounded-md overflow-hidden bg-gray-50 p-2">
            <img
              src={value}
              alt="Preview"
              className="max-w-full h-auto max-h-32 mx-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const errorDiv = document.createElement('div');
                errorDiv.textContent = '⚠️ Failed to load image';
                errorDiv.className = 'text-xs text-red-500 text-center py-2';
                target.parentElement?.appendChild(errorDiv);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
