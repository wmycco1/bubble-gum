/**
 * Textarea Component (Atom) - God-Tier 2025
 */
'use client';

import React, { forwardRef } from 'react';
import type { TextareaProps } from './Textarea.types';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'md',
      rows = 4,
      error,
      helperText,
      disabled = false,
      readOnly = false,
      className = '',
      'data-testid': testId = 'textarea',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'text-sm px-2 py-1',
      md: 'text-base px-3 py-2',
      lg: 'text-lg px-4 py-3',
    };

    const classes = [
      'w-full',
      'rounded-md',
      'border',
      error ? 'border-red-500' : 'border-gray-300',
      'focus:outline-none',
      'focus:ring-2',
      error ? 'focus:ring-red-500' : 'focus:ring-blue-500',
      sizeClasses[size],
      disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
      readOnly && 'bg-gray-50',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="w-full">
        <textarea
          ref={ref}
          rows={rows}
          className={classes}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={!!error}
          data-testid={testId}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
