/**
 * Badge Component - God-Tier 2025
 *
 * Enhanced badge with icon support, removable option, and custom styling.
 *
 * @example Basic
 * ```tsx
 * <Badge>New</Badge>
 * <Badge variant="success">Active</Badge>
 * ```
 *
 * @example With Icon
 * ```tsx
 * <Badge icon="star" variant="primary">Featured</Badge>
 * <Badge icon="check" iconPosition="right">Verified</Badge>
 * ```
 *
 * @example Removable
 * ```tsx
 * <Badge removable onRemove={() => console.log('removed')}>Tag</Badge>
 * ```
 *
 * @example Custom Colors
 * ```tsx
 * <Badge color="#fff" backgroundColor="#ff6b6b">Custom</Badge>
 * ```
 */
'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { Icon } from '@/components/atoms/Icon';
import styles from './Badge.module.css';

export interface BadgeProps {
  /** Badge text content */
  children: React.ReactNode;

  /** Visual variant (preset colors) */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

  /** Size of the badge */
  size?: 'sm' | 'md' | 'lg';

  /** Shape/roundness of the badge */
  rounded?: 'pill' | 'rounded' | 'square';

  /** Use outline style instead of filled */
  outlined?: boolean;

  /** Icon name to display */
  icon?: string;

  /** Icon position relative to text */
  iconPosition?: 'left' | 'right';

  /** Show colored dot indicator */
  dot?: boolean;

  /** Make badge clickable (shows hover effect) */
  clickable?: boolean;

  /** Click handler (automatically makes clickable) */
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;

  /** Show remove button (×) */
  removable?: boolean;

  /** Remove button click handler */
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  /** Custom text color (overrides variant) */
  color?: string;

  /** Custom background color (overrides variant) */
  backgroundColor?: string;

  /** Custom border color (for outlined mode) */
  borderColor?: string;

  /** Additional CSS classes */
  className?: string;

  /** Test ID for testing */
  'data-testid'?: string;

  /** ARIA label for accessibility */
  'aria-label'?: string;

  /** HTML id attribute */
  id?: string;
}

export const Badge: React.FC<BadgeProps> = (props) => {
  const contextParams = useAtomContext();
  const params = mergeParameters(contextParams, props) as BadgeProps;

  const {
    children,
    variant = 'default',
    size = 'md',
    rounded = 'pill',
    outlined = false,
    icon,
    iconPosition = 'left',
    dot = false,
    clickable = false,
    onClick,
    removable = false,
    onRemove,
    color,
    backgroundColor,
    borderColor,
    className = '',
    'data-testid': testId = 'badge',
    'aria-label': ariaLabel,
    id,
    ...rest
  } = params;

  // Filter out invalid DOM props
  const validDOMProps = getValidDOMProps(rest);

  // Determine if badge should be clickable
  const isClickable = clickable || !!onClick;

  // Compute CSS classes
  const classes = [
    styles.badge,
    styles[`badge--${variant}`],
    styles[`badge--${size}`],
    styles[`badge--${rounded}`],
    outlined && styles['badge--outlined'],
    isClickable && styles['badge--clickable'],
    removable && styles['badge--removable'],
    className,
  ].filter(Boolean).join(' ');

  // Compute custom styles
  const customStyles: React.CSSProperties = {};
  if (color) customStyles.color = color;
  if (backgroundColor) customStyles.backgroundColor = backgroundColor;
  if (borderColor && outlined) customStyles.borderColor = borderColor;

  // Handle remove click
  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Don't trigger badge onClick
    onRemove?.(e);
  };

  // Render icon based on position
  const renderIcon = () => {
    if (!icon) return null;
    return (
      <Icon
        name={icon}
        size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14}
        className={styles['badge-icon']}
        aria-hidden="true"
      />
    );
  };

  // Render dot indicator
  const renderDot = () => {
    if (!dot) return null;
    return <span className={styles['badge-dot']} aria-hidden="true" />;
  };

  // Render remove button
  const renderRemoveButton = () => {
    if (!removable) return null;
    return (
      <button
        type="button"
        className={styles['badge-remove']}
        onClick={handleRemove}
        aria-label="Remove"
        tabIndex={-1}
      >
        <Icon name="x" size={size === 'sm' ? 10 : size === 'lg' ? 16 : 12} />
      </button>
    );
  };

  return (
    <span
      id={id}
      className={classes}
      style={Object.keys(customStyles).length > 0 ? customStyles : undefined}
      onClick={onClick}
      data-testid={testId}
      aria-label={ariaLabel}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      {...validDOMProps}
    >
      {/* Dot indicator (left) */}
      {dot && iconPosition === 'left' && renderDot()}

      {/* Icon (left) */}
      {icon && iconPosition === 'left' && renderIcon()}

      {/* Text content */}
      <span className={styles['badge-text']}>{children}</span>

      {/* Icon (right) */}
      {icon && iconPosition === 'right' && renderIcon()}

      {/* Dot indicator (right) */}
      {dot && iconPosition === 'right' && renderDot()}

      {/* Remove button */}
      {renderRemoveButton()}
    </span>
  );
};

Badge.displayName = 'Badge';

export default Badge;
