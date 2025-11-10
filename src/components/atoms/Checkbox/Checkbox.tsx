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
import type { CheckboxProps } from './Checkbox.types';
import styles from './Checkbox.module.css';

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const contextParams = useAtomContext();
    const params = mergeParameters(contextParams, props) as CheckboxProps;

    const {
      size = 'md',
      label,
      disabled = false,
      indeterminate = false,
      checked,
      defaultChecked,
      onChange,
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

    // Filter out invalid DOM props from rest
    const validDOMProps = getValidDOMProps(rest);

    // Auto-fix: If checked is provided without onChange, convert to defaultChecked
    // This handles old components from localStorage
    const isControlled = checked !== undefined && onChange !== undefined;
    const checkboxProps: any = {
      ref: checkboxRef,
      type: 'checkbox',
      className: classes,
      disabled,
      'data-testid': testId,
      ...validDOMProps,
    };

    if (isControlled) {
      // Controlled mode: checked + onChange
      checkboxProps.checked = checked;
      checkboxProps.onChange = onChange;
    } else if (checked !== undefined) {
      // Uncontrolled mode: checked without onChange -> use defaultChecked
      checkboxProps.defaultChecked = checked;
    } else if (defaultChecked !== undefined) {
      // Explicit defaultChecked
      checkboxProps.defaultChecked = defaultChecked;
    }

    if (onChange && !isControlled) {
      // If onChange is provided but checked is not, attach it
      checkboxProps.onChange = onChange;
    }

    const checkbox = <input {...checkboxProps} />;

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
