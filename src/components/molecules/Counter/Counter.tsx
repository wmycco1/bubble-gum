/**
 * Counter Component (Molecule)
 * God-Tier Development Protocol 2025
 *
 * A numeric counter with increment/decrement controls.
 * Supports keyboard navigation, min/max boundaries, and number formatting.
 *
 * @example Basic
 * ```tsx
 * <Counter label="Quantity" value={5} min={0} max={10} />
 * ```
 *
 * @example With formatting
 * ```tsx
 * <Counter label="Price" value={99} format="currency" />
 * <Counter label="Discount" value={25} format="percentage" suffix="%" />
 * ```
 *
 * @example With onChange
 * ```tsx
 * <Counter
 *   label="Items"
 *   value={quantity}
 *   onChange={(val) => setQuantity(val)}
 * />
 * ```
 */

'use client';

import React, { useState, useEffect } from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import type { CounterProps } from './Counter.types';
import styles from './Counter.module.css';

// Icon components (inline SVG for no external dependencies)
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const MinusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
  </svg>
);

export const Counter: React.FC<CounterProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as CounterProps;

  // Destructure with defaults
  const {
    label,
    value: initialValue = 0,
    min = 0,
    max = 100,
    step = 1,
    format = 'number',
    prefix = '',
    suffix = '',
    size = 'md',
    onChange,
    className = '',
    style,
    'data-testid': testId = 'counter',
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    ...rest
  } = params;

  // Local state for counter value
  const [value, setValue] = useState<number>(initialValue);

  // Sync with prop changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Format value based on format type
  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return String(val);
    }
  };

  // Increment with validation
  const increment = () => {
    const newValue = Math.min(value + step, max);
    setValue(newValue);
    onChange?.(newValue);
  };

  // Decrement with validation
  const decrement = () => {
    const newValue = Math.max(value - step, min);
    setValue(newValue);
    onChange?.(newValue);
  };

  // Keyboard support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      increment();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      decrement();
    }
  };

  const isMinReached = value <= min;
  const isMaxReached = value >= max;

  // Compute CSS classes
  const labelClasses = [
    styles.counter__label,
    styles[`counter__label--${size}`],
  ]
    .filter(Boolean)
    .join(' ');

  const buttonClasses = (position: 'left' | 'right') =>
    [
      styles.counter__button,
      styles[`counter__button--${size}`],
      styles[`counter__button--${position}`],
    ]
      .filter(Boolean)
      .join(' ');

  const iconClasses = [styles[`counter__icon--${size}`]].filter(Boolean).join(' ');

  const valueClasses = [
    styles.counter__value,
    styles[`counter__value--${size}`],
  ]
    .filter(Boolean)
    .join(' ');

  const wrapperClasses = [styles.counter, className].filter(Boolean).join(' ');

  // Filter out invalid DOM props
  const validDOMProps = getValidDOMProps(rest);

  return (
    <div className={wrapperClasses} style={style} data-testid={testId} {...validDOMProps}>
      {/* Label */}
      {label && <label className={labelClasses}>{label}</label>}

      {/* Counter Controls */}
      <div
        className={styles.counter__controls}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="spinbutton"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={ariaLabel || label || 'Counter'}
        aria-describedby={ariaDescribedBy}
      >
        {/* Decrement Button */}
        <button
          type="button"
          onClick={decrement}
          disabled={isMinReached}
          className={buttonClasses('left')}
          aria-label="Decrement"
        >
          <MinusIcon className={iconClasses} />
        </button>

        {/* Value Display */}
        <div className={valueClasses}>
          {prefix}
          {formatValue(value)}
          {suffix}
        </div>

        {/* Increment Button */}
        <button
          type="button"
          onClick={increment}
          disabled={isMaxReached}
          className={buttonClasses('right')}
          aria-label="Increment"
        >
          <PlusIcon className={iconClasses} />
        </button>
      </div>

      {/* Min/Max Info */}
      <div className={styles.counter__info}>
        {min} - {max}
      </div>
    </div>
  );
};

// Display name for React DevTools
Counter.displayName = 'Counter';

// Default export for convenience
export default Counter;
