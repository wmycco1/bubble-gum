/**
 * Checkbox Component (Atom) - God-Tier 2025
 */
'use client';

import React, { forwardRef, useEffect, useRef } from 'react';
import type { CheckboxProps } from './Checkbox.types';

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'md',
      label,
      disabled = false,
      indeterminate = false,
      className = '',
      'data-testid': testId = 'checkbox',
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const checkboxRef = (ref as any) || internalRef;

    useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, checkboxRef]);

    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    const classes = [
      'rounded',
      'border-gray-300',
      'text-blue-600',
      'focus:ring-2',
      'focus:ring-blue-500',
      'focus:ring-offset-0',
      sizeClasses[size],
      disabled && 'opacity-50 cursor-not-allowed',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const checkbox = (
      <input
        ref={checkboxRef}
        type="checkbox"
        className={classes}
        disabled={disabled}
        data-testid={testId}
        {...props}
      />
    );

    if (label) {
      return (
        <label className="inline-flex items-center gap-2 cursor-pointer">
          {checkbox}
          <span className="text-gray-700">{label}</span>
        </label>
      );
    }

    return checkbox;
  }
);

Checkbox.displayName = 'Checkbox';
