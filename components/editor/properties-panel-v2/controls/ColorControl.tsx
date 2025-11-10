'use client';
import React from 'react';

export function ColorControl({ name, label, value = '#000000', onChange }: any) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
