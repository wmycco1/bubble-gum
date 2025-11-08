/**
 * Textarea Component (Atom) - God-Tier 2025
 */
'use client';

import { forwardRef } from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import type { TextareaProps } from './Textarea.types';
import styles from './Textarea.module.css';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const contextParams = useAtomContext();
    const params = mergeParameters(contextParams, props) as TextareaProps;

    const {
      size = 'md',
      rows = 4,
      error,
      helperText,
      disabled = false,
      readOnly = false,
      className = '',
      'data-testid': testId = 'textarea',
      id,
      ...rest
    } = params;

    const validationClass = error ? styles['textarea--invalid'] : '';
    
    const classes = [
      styles.textarea,
      styles[`textarea--${size}`],
      validationClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Filter out invalid DOM props from rest
    const validDOMProps = getValidDOMProps(rest);

    return (
      <div className={styles['textarea-wrapper']}>
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          className={classes}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          data-testid={testId}
          {...validDOMProps}
        />
        {error && (
          <p id={`${id}-error`} className={styles['textarea-error']} role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${id}-helper`} className={styles['textarea-helper']}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
