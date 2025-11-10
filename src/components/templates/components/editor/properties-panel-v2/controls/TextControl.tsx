'use client';
import React from 'react';

interface TextControlProps {
  name: string;
  label: string;
  value?: string;
  onChange: (name: string, value: string) => void;
}

export function TextControl({ name, label, value = '', onChange }: TextControlProps) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
