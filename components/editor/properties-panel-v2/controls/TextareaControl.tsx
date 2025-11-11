'use client';
import React from 'react';

interface TextareaControlProps {
  name: string;
  label: string;
  value?: string;
  onChange: (name: string, value: string) => void;
  description?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  required?: boolean;
}

export function TextareaControl({
  name,
  label,
  value = '',
  onChange,
  description,
  placeholder,
  rows = 4,
  maxLength,
  required
}: TextareaControlProps) {
  const characterCount = value.length;
  const showCounter = maxLength !== undefined;
  const isNearLimit = maxLength && characterCount > maxLength * 0.8;
  const isAtLimit = maxLength && characterCount >= maxLength;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {description && (
            <span className="block text-xs text-gray-500 font-normal mt-0.5">
              {description}
            </span>
          )}
        </label>
        {showCounter && (
          <span className={`text-xs transition-colors ${
            isAtLimit ? 'text-red-500 font-semibold' :
            isNearLimit ? 'text-orange-500' :
            'text-gray-400'
          }`}>
            {characterCount}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical transition-all"
      />
    </div>
  );
}
