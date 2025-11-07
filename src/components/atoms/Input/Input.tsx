/**
 * Input Component (Atom)
 * God-Tier Development Protocol 2025
 *
 * A text input field with multiple types, validation, and accessibility support.
 *
 * @example
 * ```tsx
 * <Input type="email" placeholder="Enter email" required />
 * ```
 */

'use client';

import React, { forwardRef } from 'react';
import type { InputProps } from './Input.types';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      size = 'md',
      validation,
      error,
      helperText,
      disabled = false,
      readOnly = false,
      required = false,
      className = '',
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      'data-testid': testId = 'input',
      ...props
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      sm: 'h-8 px-2 text-sm',
      md: 'h-10 px-3 text-base',
      lg: 'h-12 px-4 text-lg',
    };

    // Validation classes
    const validationClasses = {
      valid: 'border-green-500 focus:border-green-600 focus:ring-green-500',
      invalid: 'border-red-500 focus:border-red-600 focus:ring-red-500',
      warning: 'border-yellow-500 focus:border-yellow-600 focus:ring-yellow-500',
      undefined: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    };

    // Build class names
    const classes = [
      // Base styles
      'w-full',
      'rounded-md',
      'border',
      'bg-white',
      'transition-all',
      'duration-200',

      // Focus styles
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-0',

      // Size
      sizeClasses[size],

      // Validation
      validationClasses[validation || 'undefined'],

      // States
      disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
      readOnly && 'bg-gray-50 cursor-default',

      // Custom classes
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Determine aria-describedby
    const describedBy = [
      ariaDescribedBy,
      error && `${props.id}-error`,
      helperText && `${props.id}-helper`,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="w-full">
        <input
          ref={ref}
          type={type}
          className={classes}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-label={ariaLabel}
          aria-describedby={describedBy || undefined}
          aria-invalid={ariaInvalid || validation === 'invalid'}
          data-testid={testId}
          {...props}
        />

        {/* Error message */}
        {error && (
          <p
            id={`${props.id}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p
            id={`${props.id}-helper`}
            className="mt-1 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
