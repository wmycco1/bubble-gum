/**
 * Badge Component - God-Tier 2025
 *
 * Enhanced badge with icon support, removable option, and professional border control.
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
 * @example Border Control (All Sides)
 * ```tsx
 * <Badge borderWidth={2} borderStyle="solid" borderColor="#3b82f6">
 *   Bordered
 * </Badge>
 * <Badge borderWidth={3} borderStyle="dashed" borderColor="#ef4444">
 *   Dashed Border
 * </Badge>
 * ```
 *
 * @example Border Control (Individual Sides)
 * ```tsx
 * <Badge
 *   borderTopWidth={3} borderTopColor="#3b82f6" borderTopStyle="solid"
 *   borderBottomWidth={3} borderBottomColor="#ef4444" borderBottomStyle="solid"
 * >
 *   Top & Bottom Border
 * </Badge>
 * <Badge
 *   borderLeftWidth={5} borderLeftColor="#10b981" borderLeftStyle="solid"
 *   backgroundColor="#d1fae5"
 * >
 *   Left Accent
 * </Badge>
 * ```
 *
 * @example Custom Colors with Border
 * ```tsx
 * <Badge
 *   color="#1e40af"
 *   backgroundColor="transparent"
 *   borderWidth={2}
 *   borderStyle="solid"
 *   borderColor="#3b82f6"
 * >
 *   Outlined Custom
 * </Badge>
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

  // ============================================
  // BORDER SYSTEM (Simple & Modern 2025)
  // ============================================

  /** Border width for all sides - in pixels */
  borderWidth?: number;

  /** Border style for all sides */
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';

  /** Border color for all sides */
  borderColor?: string;

  // ============================================
  // ICON & INTERACTIVE
  // ============================================

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
  const spanRef = React.useRef<HTMLSpanElement>(null);

  // Debug logging in development - V6.6 with proper style clearing
  if (process.env.NODE_ENV === 'development') {
    console.log('🏷️ Badge V6.6 [style clearing] received ALL params:', params);
    console.log('🏷️ Badge V6.6 color params:', {
      variant: params.variant,
      color: params.color,
      backgroundColor: params.backgroundColor,
    });
  }

  const {
    children,
    variant = 'default',
    size = 'md',
    rounded = 'pill',

    // Border system (simple)
    borderWidth,
    borderStyle,
    borderColor,

    icon,
    iconPosition = 'left',
    dot = false,
    clickable = false,
    onClick,
    removable = false,
    onRemove,
    color,
    backgroundColor,
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

  // Compute CSS classes - ALWAYS include variant class, custom colors override via !important
  const classes = [
    styles.badge,
    styles[`badge--${variant}`], // Always apply variant for base colors
    styles[`badge--${size}`],
    styles[`badge--${rounded}`],
    isClickable && styles['badge--clickable'],
    removable && styles['badge--removable'],
    className,
  ].filter(Boolean).join(' ');

  // Build inline style string with !important (React doesn't support !important in style objects)
  const styleOverrides: string[] = [];

  if (color) styleOverrides.push(`color: ${color} !important`);
  if (backgroundColor) styleOverrides.push(`background-color: ${backgroundColor} !important`);
  if (borderWidth !== undefined && borderWidth >= 0) styleOverrides.push(`border-width: ${borderWidth}px !important`);
  if (borderStyle) styleOverrides.push(`border-style: ${borderStyle} !important`);
  if (borderColor) styleOverrides.push(`border-color: ${borderColor} !important`);

  const inlineStyleString = styleOverrides.length > 0 ? styleOverrides.join('; ') : '';

  // Apply inline styles with !important using cssText
  // CRITICAL FIX V6.6: Clear ALL inline styles first, then apply new ones
  React.useEffect(() => {
    if (spanRef.current) {
      // Clear previous inline color/background/border styles
      spanRef.current.style.color = '';
      spanRef.current.style.backgroundColor = '';
      spanRef.current.style.borderWidth = '';
      spanRef.current.style.borderStyle = '';
      spanRef.current.style.borderColor = '';

      // Apply new styles if any
      if (inlineStyleString) {
        spanRef.current.style.cssText += '; ' + inlineStyleString;
      }
    }
  }, [inlineStyleString]);

  // Debug custom styles
  if (process.env.NODE_ENV === 'development') {
    console.log('🏷️ Badge V6.6 [style clearing] inline styles:', inlineStyleString);
  }

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
      ref={spanRef}
      id={id}
      className={classes}
      onClick={onClick}
      data-testid={testId}
      data-badge-version="6.6"
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
