'use client';
import React from 'react';

export function ToggleControl({ name, label, value = false, onChange }: any) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <label className="text-xs font-medium text-gray-700">{label}</label>
      <button
        onClick={() => onChange(name, !value)}
        className={'relative inline-flex h-6 w-11 items-center rounded-full transition-colors ' + (value ? 'bg-blue-600' : 'bg-gray-200')}
      >
        <span className={'inline-block h-4 w-4 transform rounded-full bg-white transition-transform ' + (value ? 'translate-x-6' : 'translate-x-1')} />
      </button>
    </div>
  );
}
