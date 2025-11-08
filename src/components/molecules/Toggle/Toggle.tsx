/**
 * Toggle Component (Molecule)
 * God-Tier Development Protocol 2025
 *
 * A switch toggle component for on/off states.
 * Supports labels, disabled state, and size variants.
 * Composed of Text Atom with Context API integration.
 *
 * @example Basic usage
 * ```tsx
 * <Toggle checked={isEnabled} onChange={setIsEnabled} />
 * ```
 *
 * @example With label
 * ```tsx
 * <Toggle
 *   checked={notifications}
 *   onChange={setNotifications}
 *   label="Enable notifications"
 * />
 * ```
 *
 * @example Disabled
 * ```tsx
 * <Toggle checked={true} disabled label="Read-only" />
 * ```
 */

'use client';

import React, { useId, useCallback } from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters, AtomProvider } from '@/context/parameters/ParameterContext';
import { Text } from '@/components/atoms/Text';
import type { ToggleProps } from './Toggle.types';
import styles from './Toggle.module.css';

export const Toggle: React.FC<ToggleProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as ToggleProps;

  // Destructure with defaults
  const {
    checked = false,
    onChange,
    disabled = false,
    label,
    labelPosition = 'right',
    size = 'md',
    className = '',
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'data-testid': testId = 'toggle',
    id: providedId,
    name,
    ...rest
  } = params;

  // Generate unique ID if not provided
  const autoId = useId();
  const id = providedId || autoId;
  const inputId = `${id}-input`;
  const labelId = `${id}-label`;

  // Handle toggle change
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      onChange?.(event.target.checked);
    },
    [disabled, onChange]
  );

  // Handle label click (for keyboard accessibility)
  const handleLabelClick = useCallback(() => {
    if (disabled || !onChange) return;
    onChange(!checked);
  }, [disabled, onChange, checked]);

  // Compute CSS classes
  const containerClasses = [
    styles.toggle,
    styles[`toggle--${size}`],
    styles[`toggle--label-${labelPosition}`],
    disabled && styles['toggle--disabled'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const switchClasses = [
    styles['toggle__switch'],
    checked && styles['toggle__switch--checked'],
    disabled && styles['toggle__switch--disabled'],
  ]
    .filter(Boolean)
    .join(' ');

  const thumbClasses = [
    styles['toggle__thumb'],
    checked && styles['toggle__thumb--checked'],
  ]
    .filter(Boolean)
    .join(' ');

  // Determine accessible label
  const effectiveAriaLabel = ariaLabel || label || 'Toggle';

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <div className={containerClasses} data-testid={testId} {...validDOMProps}>
      {/* Label (left position) */}
      {label && labelPosition === 'left' && (
        <AtomProvider value={{ size: 'sm' }}>
          <label
            htmlFor={inputId}
            id={labelId}
            className={styles['toggle__label']}
            onClick={handleLabelClick}
            data-testid={`${testId}-label`}
          >
            {label}
          </label>
        </AtomProvider>
      )}

      {/* Toggle switch */}
      <label className={styles['toggle__switch-container']} htmlFor={inputId}>
        {/* Hidden checkbox input */}
        <input
          id={inputId}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={styles['toggle__input']}
          aria-label={effectiveAriaLabel}
          aria-describedby={ariaDescribedBy || (label ? labelId : undefined)}
          aria-checked={checked}
          data-testid={`${testId}-input`}
        />

        {/* Visual switch */}
        <span className={switchClasses} aria-hidden="true">
          <span className={thumbClasses} />
        </span>
      </label>

      {/* Label (right position) */}
      {label && labelPosition === 'right' && (
        <AtomProvider value={{ size: 'sm' }}>
          <label
            htmlFor={inputId}
            id={labelId}
            className={styles['toggle__label']}
            onClick={handleLabelClick}
            data-testid={`${testId}-label`}
          >
            {label}
          </label>
        </AtomProvider>
      )}
    </div>
  );
};

// Display name for React DevTools
Toggle.displayName = 'Toggle';

// Default export for convenience
export default Toggle;
