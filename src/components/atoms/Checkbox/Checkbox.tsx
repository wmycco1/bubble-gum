/**
 * Checkbox Component (Atom) - God-Tier 2025
 * 
 * @example
 * ```tsx
 * <Checkbox label="Accept terms" />
 * ```
 * 
 * @example With Context API
 * ```tsx
 * <AtomProvider value={{ size: 'lg' }}>
 *   <Checkbox label="Large checkbox" />
 * </AtomProvider>
 * ```
 */
'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import type { CheckboxProps } from './Checkbox.types';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import styles from './Checkbox.module.css';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const contextParams = useAtomContext();
    const params = mergeParameters(contextParams, props) as CheckboxProps;

    const {
      size = 'md',
      label,
      disabled = false,
      indeterminate = false,
      className = '',
      'data-testid': testId = 'checkbox',
      ...rest
    } = params;

    const internalRef = useRef<HTMLInputElement>(null);
    const checkboxRef = (ref as any) || internalRef;

    useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, checkboxRef]);

    const classes = [
      styles.checkbox,
      styles[`checkbox--${size}`],
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
        {...validDOMProps}
      />
    );

    if (label) {
      return (
        <label className={styles['checkbox-label']}>
          {checkbox}
          <span className={styles['checkbox-label-text']}>{label}</span>
        </label>
      );
    }

    return checkbox;
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
