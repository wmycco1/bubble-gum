'use client';
import React from 'react';

export function TextareaControl({ name, label, value = '', onChange }: any) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        rows={4}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
      />
    </div>
  );
}
