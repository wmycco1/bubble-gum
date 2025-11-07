/**
 * Progress Component (Molecule)
 * God-Tier Development Protocol 2025
 *
 * A molecule component that composes Text atoms and styled dividers
 * to create progress bars with labels, percentages, and visual variants.
 *
 * @example Basic usage
 * ```tsx
 * <Progress value={75} label="Upload Progress" />
 * ```
 *
 * @example With Context API
 * ```tsx
 * <MoleculeProvider value={{ size: 'lg', animated: true }}>
 *   <Progress value={60} label="Processing" />
 * </MoleculeProvider>
 * ```
 */

import React from 'react';
import { useMoleculeContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { Text } from '@/components/atoms/Text';
import type { ProgressProps } from './Progress.types';
import styles from './Progress.module.css';

export const Progress: React.FC<ProgressProps> = (props) => {
  // Get inherited parameters from Molecule context
  const contextParams = useMoleculeContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as ProgressProps;

  // Destructure with defaults
  const {
    value: rawValue,
    label,
    showPercentage = true,
    variant = 'default',
    size = 'md',
    animated = true,
    striped = false,
    labelSize = 'sm',
    labelColor = 'default',
    percentageSize = 'sm',
    percentageColor = 'muted',
    className = '',
    id,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'data-testid': testId = 'progress',
    children,
    indeterminate = false,
    color,
    backgroundColor,
  } = params;

  // Clamp value to 0-100 range (handle NaN and Infinity)
  const value = Math.min(100, Math.max(0, isNaN(rawValue) ? 0 : rawValue));

  // Compute CSS classes for container
  const containerClasses = [
    styles.progress,
    styles[`progress--${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Compute CSS classes for bar
  const barClasses = [
    styles.progress__bar,
    styles[`progress__bar--${variant}`],
    animated && styles['progress__bar--animated'],
    striped && styles['progress__bar--striped'],
    indeterminate && styles['progress__bar--indeterminate'],
  ]
    .filter(Boolean)
    .join(' ');

  // Custom inline styles for bar
  const barStyle: React.CSSProperties = {
    width: indeterminate ? '100%' : `${value}%`,
    ...(color && { backgroundColor: color }),
  };

  // Custom inline styles for track
  const trackStyle: React.CSSProperties = {
    ...(backgroundColor && { backgroundColor }),
  };

  return (
    <div
      id={id}
      className={containerClasses}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      data-testid={testId}
    >
      {/* Label and Percentage */}
      {(label || children || showPercentage) && (
        <div className={styles.progress__header} data-testid={`${testId}-header`}>
          {/* Label or Children */}
          {children ? (
            <div className={styles.progress__children}>{children}</div>
          ) : label ? (
            <div className={styles.progress__label}>
              <Text
                size={labelSize}
                color={labelColor}
                weight="medium"
                data-testid={`${testId}-label`}
              >
                {label}
              </Text>
            </div>
          ) : null}

          {/* Percentage */}
          {showPercentage && !indeterminate && (
            <div className={styles.progress__percentage}>
              <Text
                size={percentageSize}
                color={percentageColor}
                weight="medium"
                data-testid={`${testId}-percentage`}
              >
                {value}%
              </Text>
            </div>
          )}
        </div>
      )}

      {/* Progress Bar Track */}
      <div
        className={styles.progress__track}
        style={trackStyle}
        data-testid={`${testId}-track`}
      >
        {/* Progress Bar Fill */}
        <div
          className={barClasses}
          style={barStyle}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={ariaLabel || label}
          data-testid={`${testId}-bar`}
        />
      </div>
    </div>
  );
};

// Display name for React DevTools
Progress.displayName = 'Progress';

// Default export for convenience
export default Progress;
