/**
 * Input Component (Atom)
 * God-Tier Development Protocol 2025
 *
 * A text input field with Context API, validation, and full accessibility.
 * Uses AtomParameters for styling and behavior through Context API.
 *
 * @example Basic
 * ```tsx
 * <Input type="email" placeholder="Enter email" required />
 * ```
 *
 * @example With Context API
 * ```tsx
 * <AtomProvider value={{ size: 'lg' }}>
 *   <Input placeholder="Inherits large size" />
 * </AtomProvider>
 * ```
 *
 * @example With Validation
 * ```tsx
 * <Input
 *   type="email"
 *   validation="invalid"
 *   error="Please enter a valid email"
 * />
 * ```
 */

'use client';

import { forwardRef } from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import type { InputProps } from './Input.types';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import styles from './Input.module.css';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    // Get inherited parameters from Atom context
    const contextParams = useAtomContext();

    // Merge context + props (props win in case of conflicts)
    const params = mergeParameters(contextParams, props) as InputProps;

    // Destructure with defaults
    const {
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
      id,
      style,
      ...rest
    } = params;

    // Compute CSS classes
    const baseClasses = styles.input;
    const sizeClasses = styles[`input--${size}`];
    const validationClasses = validation ? styles[`input--${validation}`] : '';

    const classes = [baseClasses, sizeClasses, validationClasses, className]
      .filter(Boolean)
      .join(' ');

    // Determine aria-describedby
    const describedBy = [
      ariaDescribedBy,
      error && `${id}-error`,
      helperText && `${id}-helper`,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles['input-wrapper']}>
        <input
          ref={ref}
          id={id}
          type={type}
          className={classes}
          style={style}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-label={ariaLabel}
          aria-describedby={describedBy || undefined}
          aria-invalid={ariaInvalid || validation === 'invalid' || !!error}
          data-testid={testId}
          {...validDOMProps}
        />

        {/* Error message */}
        {error && (
          <p
            id={`${id}-error`}
            className={styles['input-error']}
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p
            id={`${id}-helper`}
            className={styles['input-helper']}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

// Display name for React DevTools
Input.displayName = 'Input';

// Default export for convenience
export default Input;
