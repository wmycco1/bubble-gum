/**
 * Button Component (Atom)
 * God-Tier Development Protocol 2025
 *
 * A clickable button element with variants, sizes, and loading states.
 * Uses AtomParameters for styling and behavior through Context API.
 *
 * @example
 * ```tsx
 * <Button text="Click me" variant="primary" onClick={() => alert('Clicked!')} />
 * ```
 *
 * @example With Context
 * ```tsx
 * <AtomProvider value={{ size: 'lg', variant: 'primary' }}>
 *   <Button text="Inherits size and variant" />
 * </AtomProvider>
 * ```
 */

import React from 'react';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import type { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = (props) => {
  // Get inherited parameters from Atom context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as ButtonProps;

  // Destructure with defaults
  const {
    text,
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    onClick,
    className = '',
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'data-testid': testId = 'button',
    id,
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const baseClasses = 'button';
  const variantClasses = `button--${variant}`;
  const sizeClasses = `button--${size}`;
  const stateClasses = [
    disabled && 'button--disabled',
    loading && 'button--loading',
    fullWidth && 'button--full-width',
  ]
    .filter(Boolean)
    .join(' ');

  const classes = [baseClasses, variantClasses, sizeClasses, stateClasses, className]
    .filter(Boolean)
    .join(' ');

  // Handle click with disabled/loading guards
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  // Determine if button should be disabled
  const isDisabled = disabled || loading;

  return (
    <button
      id={id}
      type={type}
      className={classes}
      style={style}
      disabled={isDisabled}
      onClick={handleClick}
      aria-label={ariaLabel || text}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled}
      aria-busy={loading}
      data-testid={testId}
      {...rest}
    >
      {/* Loading spinner */}
      {loading && (
        <span className="button__spinner" aria-hidden="true" role="status">
          <span className="visually-hidden">Loading...</span>
        </span>
      )}

      {/* Left icon (hidden when loading) */}
      {leftIcon && !loading && (
        <span className="button__icon button__icon--left" aria-hidden="true">
          {leftIcon}
        </span>
      )}

      {/* Button text */}
      <span className="button__text">{text}</span>

      {/* Right icon (hidden when loading) */}
      {rightIcon && !loading && (
        <span className="button__icon button__icon--right" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
};

// Display name for React DevTools
Button.displayName = 'Button';

// Default export for convenience
export default Button;
