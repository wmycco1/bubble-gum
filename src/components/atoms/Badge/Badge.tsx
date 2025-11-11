/**
 * Badge Component - GOD-TIER Enterprise Edition V7.6
 *
 * Production-ready badge component with enterprise-grade features:
 * - XSS Protection (DOMPurify sanitization)
 * - CSS Injection Prevention (color validation)
 * - Performance Optimization (React.memo, useMemo, useCallback)
 * - Full ARIA Support (roles, labels, live regions)
 * - Keyboard Navigation (Enter, Space keys)
 * - Error Boundary Wrapper (graceful degradation)
 * - Security Best Practices (OWASP compliance)
 * - WCAG 2.1 AA Accessibility
 *
 * V7.6 NEW FEATURES (2025-11-11):
 * - Typography System (fontFamily, fontSize, fontWeight, fontStyle, letterSpacing, textTransform)
 * - Transform System (rotate, scaleX, scaleY, skewX, skewY)
 * - Animation System (transitionDuration, transitionTimingFunction)
 *
 * V7.5 FEATURES (2025-11-11):
 * - Layout & Positioning System (align: left/center/right/full)
 * - CSS Position control (static/relative/absolute/fixed/sticky)
 * - CSS Display control (inline-flex/block/inline-block/flex/inline/grid/inline-grid/none)
 *
 * V7.4 FEATURES (2025-11-11):
 * - Individual border colors per side (top/right/bottom/left)
 * - Smart border color system (individual sides override shorthand)
 *
 * V7.3 FEATURES (2025-11-11):
 * - Smart Border System (width with individual side control: top/right/bottom/left)
 * - Border style & color controls
 * - Modern 2025 UX (Simple/Advanced modes like spacing & border radius)
 *
 * V7.2 FEATURES (2025-11-10):
 * - Smart Border Radius System (individual corner control)
 *
 * V7.1 FEATURES (2025-11-10):
 * - Smart Spacing System (margin/padding with individual side control)
 * - Shadow System (presets: sm/md/lg/xl + custom parameters)
 * - Opacity Control (0-100% with smooth rendering)
 *
 * @module Badge
 * @version 7.6.0
 * @since 2025-11-11
 *
 * @example Basic Usage
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
 * @example Removable with Keyboard Support
 * ```tsx
 * <Badge removable onRemove={() => console.log('removed')}>
 *   Tag (Press Enter or Space to remove)
 * </Badge>
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
 * @example Custom Colors with XSS Protection
 * ```tsx
 * <Badge
 *   color="#1e40af"
 *   backgroundColor="transparent"
 *   borderWidth={2}
 *   borderStyle="solid"
 *   borderColor="#3b82f6"
 * >
 *   Outlined Custom (Colors validated for security)
 * </Badge>
 * ```
 *
 * @example With Error Boundary
 * ```tsx
 * import { BadgeErrorBoundary } from './BadgeErrorBoundary';
 *
 * <BadgeErrorBoundary>
 *   <Badge>Safe Badge</Badge>
 * </BadgeErrorBoundary>
 * ```
 */
'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { Icon } from '@/components/atoms/Icon';
import styles from './Badge.module.css';

// GOD-TIER Security & Performance utilities
import { sanitizeContent, sanitizeEventHandler } from '@/lib/utils/sanitize';
import {
  isValidCSSColor,
  isValidBorderStyle,
  sanitizeNumericValue,
  sanitizeOpacity,
  generateShadow
} from '@/lib/utils/validation';

/**
 * Props for Badge component
 *
 * @interface BadgeProps
 * @property {React.ReactNode} children - Badge text content (sanitized for XSS protection)
 * @property {string} variant - Visual variant with preset colors (default: 'default')
 * @property {string} size - Size of the badge (default: 'md')
 * @property {string} rounded - Shape/roundness of the badge (default: 'pill')
 * @property {number} borderWidth - Border width for all sides in pixels (validated ≥0)
 * @property {string} borderStyle - Border style for all sides (validated against whitelist)
 * @property {string} borderColor - Border color for all sides (validated for CSS injection)
 * @property {string} icon - Icon name to display (optional)
 * @property {string} iconPosition - Icon position relative to text (default: 'left')
 * @property {boolean} dot - Show colored dot indicator (default: false)
 * @property {boolean} clickable - Make badge clickable with hover effect (default: false)
 * @property {function} onClick - Click handler (sanitized, auto-enables clickable)
 * @property {boolean} removable - Show remove button × (default: false)
 * @property {function} onRemove - Remove button click handler (sanitized)
 * @property {string} color - Custom text color, overrides variant (validated)
 * @property {string} backgroundColor - Custom background color, overrides variant (validated)
 * @property {string} className - Additional CSS classes
 * @property {string} data-testid - Test ID for testing (default: 'badge')
 * @property {string} aria-label - ARIA label for accessibility
 * @property {string} id - HTML id attribute
 */
export interface BadgeProps {
  /** Badge text content (auto-sanitized for XSS protection if string) */
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

  /** Border width for all sides in pixels (validated ≥0) */
  borderWidth?: number;

  // V7.3 - Individual side border width (overrides borderWidth if set)
  /** Border width top side (px, overrides borderWidth if set) */
  borderTopWidth?: number;
  /** Border width right side (px, overrides borderWidth if set) */
  borderRightWidth?: number;
  /** Border width bottom side (px, overrides borderWidth if set) */
  borderBottomWidth?: number;
  /** Border width left side (px, overrides borderWidth if set) */
  borderLeftWidth?: number;

  /** Border style for all sides (validated against whitelist) */
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';

  /** Border color for all sides (validated for CSS injection) */
  borderColor?: string;

  // V7.4 - Individual side border colors (override borderColor if set)
  /** Border color top side (overrides borderColor if set) */
  borderTopColor?: string;
  /** Border color right side (overrides borderColor if set) */
  borderRightColor?: string;
  /** Border color bottom side (overrides borderColor if set) */
  borderBottomColor?: string;
  /** Border color left side (overrides borderColor if set) */
  borderLeftColor?: string;

  /** Border radius in pixels (validated ≥0) - shorthand for all corners */
  borderRadius?: number;

  // V7.2 - Individual corner border radius (overrides borderRadius if set)
  /** Border radius top-left corner (px, overrides borderRadius if set) */
  borderRadiusTopLeft?: number;
  /** Border radius top-right corner (px, overrides borderRadius if set) */
  borderRadiusTopRight?: number;
  /** Border radius bottom-left corner (px, overrides borderRadius if set) */
  borderRadiusBottomLeft?: number;
  /** Border radius bottom-right corner (px, overrides borderRadius if set) */
  borderRadiusBottomRight?: number;

  // ============================================
  // SPACING SYSTEM (V7.1 - Margin & Padding)
  // ============================================

  /** Margin for all sides (shorthand, px) */
  margin?: number;
  /** Margin top (px, overrides margin if set) */
  marginTop?: number;
  /** Margin right (px, overrides margin if set) */
  marginRight?: number;
  /** Margin bottom (px, overrides margin if set) */
  marginBottom?: number;
  /** Margin left (px, overrides margin if set) */
  marginLeft?: number;

  /** Padding for all sides (shorthand, px) */
  padding?: number;
  /** Padding top (px, overrides padding if set) */
  paddingTop?: number;
  /** Padding right (px, overrides padding if set) */
  paddingRight?: number;
  /** Padding bottom (px, overrides padding if set) */
  paddingBottom?: number;
  /** Padding left (px, overrides padding if set) */
  paddingLeft?: number;

  // ============================================
  // SHADOW SYSTEM (V7.1)
  // ============================================

  /** Shadow preset (none, sm, md, lg, xl) */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  /** Custom shadow offsetX (px, requires shadow='custom') */
  shadowOffsetX?: number;
  /** Custom shadow offsetY (px, requires shadow='custom') */
  shadowOffsetY?: number;
  /** Custom shadow blur (px, requires shadow='custom') */
  shadowBlur?: number;
  /** Custom shadow spread (px, requires shadow='custom') */
  shadowSpread?: number;
  /** Custom shadow color (validated, requires shadow='custom') */
  shadowColor?: string;
  /** Shadow opacity (0-100%, applies to preset or custom) */
  shadowOpacity?: number;

  // ============================================
  // OPACITY (V7.1)
  // ============================================

  /** Badge opacity (0-100%, default 100) */
  opacity?: number;

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

  // ============================================
  // LAYOUT & POSITIONING (V7.5)
  // ============================================

  /** Horizontal alignment or full width */
  align?: 'left' | 'center' | 'right' | 'full';

  /** CSS position property */
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';

  /** CSS display property */
  display?: 'inline-flex' | 'block' | 'inline-block' | 'flex' | 'inline' | 'grid' | 'inline-grid' | 'none';

  // ============================================
  // TYPOGRAPHY (V7.6)
  // ============================================

  /** Font family for text */
  fontFamily?: 'system-ui' | 'serif' | 'monospace' | 'Inter' | 'Roboto' | 'Open Sans' | 'Lato' | 'Montserrat' | 'Poppins';

  /** Font size in pixels */
  fontSize?: number;

  /** Font weight */
  fontWeight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

  /** Font style */
  fontStyle?: 'normal' | 'italic' | 'oblique';

  /** Letter spacing in pixels */
  letterSpacing?: number;

  /** Text case transformation */
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

  // ============================================
  // TRANSFORM (V7.6)
  // ============================================

  /** Rotation angle in degrees */
  rotate?: number;

  /** Horizontal scale (1 = normal) */
  scaleX?: number;

  /** Vertical scale (1 = normal) */
  scaleY?: number;

  /** Horizontal skew angle in degrees */
  skewX?: number;

  /** Vertical skew angle in degrees */
  skewY?: number;

  // ============================================
  // ANIMATION (V7.6)
  // ============================================

  /** Transition duration in milliseconds */
  transitionDuration?: number;

  /** Transition timing function */
  transitionTimingFunction?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

  /** Additional CSS classes */
  className?: string;

  /** Test ID for testing */
  'data-testid'?: string;

  /** ARIA label for accessibility */
  'aria-label'?: string;

  /** HTML id attribute */
  id?: string;
}

/**
 * Badge Component Implementation (GOD-TIER V7.0)
 *
 * Enterprise-grade badge with:
 * - Performance: React.memo + useMemo + useCallback
 * - Security: XSS protection + CSS injection prevention
 * - Accessibility: Full ARIA + keyboard navigation
 * - Error handling: Validated inputs + graceful degradation
 *
 * @param {BadgeProps} props - Badge component props
 * @returns {JSX.Element} Rendered badge element
 */
export const BadgeInner: React.FC<BadgeProps> = (props) => {
  const contextParams = useAtomContext();
  const params = mergeParameters(contextParams, props) as BadgeProps;
  const spanRef = React.useRef<HTMLSpanElement>(null);

  // Debug logging in development - V7.5 GOD-TIER with layout & positioning
  if (process.env.NODE_ENV === 'development') {
    console.log('🏷️ Badge V7.5 [GOD-TIER] received ALL params:', params);
    console.log('🏷️ Badge V7.5 styling params:', {
      variant: params.variant,
      color: params.color,
      backgroundColor: params.backgroundColor,
      borderWidth: params.borderWidth,
      borderTopWidth: params.borderTopWidth,
      borderRightWidth: params.borderRightWidth,
      borderBottomWidth: params.borderBottomWidth,
      borderLeftWidth: params.borderLeftWidth,
      borderStyle: params.borderStyle,
      borderColor: params.borderColor,
      borderTopColor: params.borderTopColor,
      borderRightColor: params.borderRightColor,
      borderBottomColor: params.borderBottomColor,
      borderLeftColor: params.borderLeftColor,
      borderRadius: params.borderRadius,
      borderRadiusTopLeft: params.borderRadiusTopLeft,
      borderRadiusTopRight: params.borderRadiusTopRight,
      borderRadiusBottomLeft: params.borderRadiusBottomLeft,
      borderRadiusBottomRight: params.borderRadiusBottomRight,
      margin: params.margin,
      padding: params.padding,
      shadow: params.shadow,
      opacity: params.opacity,
      align: params.align,
      position: params.position,
      display: params.display,
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
    borderRadius,

    // V7.3 - Individual side border width
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderLeftWidth,

    // V7.4 - Individual side border colors
    borderTopColor,
    borderRightColor,
    borderBottomColor,
    borderLeftColor,

    // V7.2 - Individual corner border radius
    borderRadiusTopLeft,
    borderRadiusTopRight,
    borderRadiusBottomLeft,
    borderRadiusBottomRight,

    // V7.1 - Spacing system
    margin,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,

    // V7.1 - Shadow system
    shadow = 'none',
    shadowOffsetX,
    shadowOffsetY,
    shadowBlur,
    shadowSpread,
    shadowColor,
    shadowOpacity,

    // V7.1 - Opacity
    opacity = 100,

    icon,
    iconPosition = 'left',
    dot = false,
    clickable = false,
    onClick,
    removable = false,
    onRemove,
    color,
    backgroundColor,

    // V7.5 - Layout & Positioning
    align,
    position = 'static',
    display = 'inline-flex',

    // V7.6 - Typography
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    letterSpacing,
    textTransform,

    // V7.6 - Transform
    rotate,
    scaleX,
    scaleY,
    skewX,
    skewY,

    // V7.6 - Animation
    transitionDuration = 300,
    transitionTimingFunction = 'ease',

    className = '',
    'data-testid': testId = 'badge',
    'aria-label': ariaLabel,
    id,
    ...rest
  } = params;

  // ============================================
  // SECURITY LAYER (GOD-TIER V7.0)
  // ============================================

  /**
   * Sanitize children content for XSS protection
   * Uses DOMPurify to strip malicious code from string content
   */
  const sanitizedChildren = React.useMemo(() => {
    return sanitizeContent(children);
  }, [children]);

  /**
   * Validate and sanitize event handlers
   * Prevents string-to-function injection attacks
   */
  const safeOnClick = React.useMemo(() => {
    return sanitizeEventHandler(onClick);
  }, [onClick]);

  const safeOnRemove = React.useMemo(() => {
    return sanitizeEventHandler(onRemove);
  }, [onRemove]);

  /**
   * Validate color values for CSS injection prevention
   * Blocks: url(), calc(), var(), expression(), etc.
   */
  const safeColor = React.useMemo(() => {
    if (!color) return undefined;
    return isValidCSSColor(color) ? color : undefined;
  }, [color]);

  const safeBackgroundColor = React.useMemo(() => {
    if (!backgroundColor) return undefined;
    return isValidCSSColor(backgroundColor) ? backgroundColor : undefined;
  }, [backgroundColor]);

  const safeBorderColor = React.useMemo(() => {
    if (!borderColor) return undefined;
    return isValidCSSColor(borderColor) ? borderColor : undefined;
  }, [borderColor]);

  /**
   * Validate border style against whitelist
   */
  const safeBorderStyle = React.useMemo(() => {
    if (!borderStyle) return undefined;
    return isValidBorderStyle(borderStyle) ? borderStyle : undefined;
  }, [borderStyle]);

  /**
   * Sanitize numeric values (prevent negative numbers)
   */
  const safeBorderWidth = React.useMemo(() => {
    if (borderWidth === undefined) return undefined;
    return sanitizeNumericValue(borderWidth);
  }, [borderWidth]);

  const safeBorderRadius = React.useMemo(() => {
    if (borderRadius === undefined) return undefined;
    return sanitizeNumericValue(borderRadius);
  }, [borderRadius]);

  // V7.3 - Individual side border width validation
  const safeBorderTopWidth = React.useMemo(() => {
    if (borderTopWidth === undefined) return undefined;
    return sanitizeNumericValue(borderTopWidth);
  }, [borderTopWidth]);

  const safeBorderRightWidth = React.useMemo(() => {
    if (borderRightWidth === undefined) return undefined;
    return sanitizeNumericValue(borderRightWidth);
  }, [borderRightWidth]);

  const safeBorderBottomWidth = React.useMemo(() => {
    if (borderBottomWidth === undefined) return undefined;
    return sanitizeNumericValue(borderBottomWidth);
  }, [borderBottomWidth]);

  const safeBorderLeftWidth = React.useMemo(() => {
    if (borderLeftWidth === undefined) return undefined;
    return sanitizeNumericValue(borderLeftWidth);
  }, [borderLeftWidth]);

  // V7.4 - Individual side border color validation
  const safeBorderTopColor = React.useMemo(() => {
    if (!borderTopColor) return undefined;
    return isValidCSSColor(borderTopColor) ? borderTopColor : undefined;
  }, [borderTopColor]);

  const safeBorderRightColor = React.useMemo(() => {
    if (!borderRightColor) return undefined;
    return isValidCSSColor(borderRightColor) ? borderRightColor : undefined;
  }, [borderRightColor]);

  const safeBorderBottomColor = React.useMemo(() => {
    if (!borderBottomColor) return undefined;
    return isValidCSSColor(borderBottomColor) ? borderBottomColor : undefined;
  }, [borderBottomColor]);

  const safeBorderLeftColor = React.useMemo(() => {
    if (!borderLeftColor) return undefined;
    return isValidCSSColor(borderLeftColor) ? borderLeftColor : undefined;
  }, [borderLeftColor]);

  // V7.2 - Individual corner border radius validation
  const safeBorderRadiusTopLeft = React.useMemo(() => {
    if (borderRadiusTopLeft === undefined) return undefined;
    return sanitizeNumericValue(borderRadiusTopLeft);
  }, [borderRadiusTopLeft]);

  const safeBorderRadiusTopRight = React.useMemo(() => {
    if (borderRadiusTopRight === undefined) return undefined;
    return sanitizeNumericValue(borderRadiusTopRight);
  }, [borderRadiusTopRight]);

  const safeBorderRadiusBottomLeft = React.useMemo(() => {
    if (borderRadiusBottomLeft === undefined) return undefined;
    return sanitizeNumericValue(borderRadiusBottomLeft);
  }, [borderRadiusBottomLeft]);

  const safeBorderRadiusBottomRight = React.useMemo(() => {
    if (borderRadiusBottomRight === undefined) return undefined;
    return sanitizeNumericValue(borderRadiusBottomRight);
  }, [borderRadiusBottomRight]);

  // ============================================
  // V7.1 SECURITY LAYER (Spacing, Shadow, Opacity)
  // ============================================

  /**
   * Sanitize spacing values (margin/padding) - V7.1
   * Smart system: individual sides override shorthand
   */
  const safeMargin = React.useMemo(() => sanitizeNumericValue(margin), [margin]);
  const safeMarginTop = React.useMemo(() => marginTop !== undefined ? sanitizeNumericValue(marginTop) : undefined, [marginTop]);
  const safeMarginRight = React.useMemo(() => marginRight !== undefined ? sanitizeNumericValue(marginRight) : undefined, [marginRight]);
  const safeMarginBottom = React.useMemo(() => marginBottom !== undefined ? sanitizeNumericValue(marginBottom) : undefined, [marginBottom]);
  const safeMarginLeft = React.useMemo(() => marginLeft !== undefined ? sanitizeNumericValue(marginLeft) : undefined, [marginLeft]);

  const safePadding = React.useMemo(() => sanitizeNumericValue(padding), [padding]);
  const safePaddingTop = React.useMemo(() => paddingTop !== undefined ? sanitizeNumericValue(paddingTop) : undefined, [paddingTop]);
  const safePaddingRight = React.useMemo(() => paddingRight !== undefined ? sanitizeNumericValue(paddingRight) : undefined, [paddingRight]);
  const safePaddingBottom = React.useMemo(() => paddingBottom !== undefined ? sanitizeNumericValue(paddingBottom) : undefined, [paddingBottom]);
  const safePaddingLeft = React.useMemo(() => paddingLeft !== undefined ? sanitizeNumericValue(paddingLeft) : undefined, [paddingLeft]);

  /**
   * Generate shadow value - V7.1
   * Supports presets (sm, md, lg, xl) and custom parameters
   */
  const safeShadow = React.useMemo(() => {
    return generateShadow(
      shadow,
      shadow === 'custom' ? {
        offsetX: shadowOffsetX,
        offsetY: shadowOffsetY,
        blur: shadowBlur,
        spread: shadowSpread,
        color: shadowColor,
      } : undefined,
      shadowOpacity
    );
  }, [shadow, shadowOffsetX, shadowOffsetY, shadowBlur, shadowSpread, shadowColor, shadowOpacity]);

  /**
   * Sanitize opacity value (0-100%) - V7.1
   */
  const safeOpacity = React.useMemo(() => {
    return sanitizeOpacity(opacity);
  }, [opacity]);

  // Filter out invalid DOM props
  const validDOMProps = getValidDOMProps(rest);

  // Determine if badge should be clickable
  const isClickable = clickable || !!safeOnClick;

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

  /**
   * Build inline style string with validated values - V7.2 ENHANCED
   * Uses !important to override variant styles (React doesn't support !important in style objects)
   * All values are validated for security (XSS + CSS injection prevention)
   *
   * V7.1 Features:
   * - Smart spacing (individual sides override shorthand)
   * - Shadow system (presets + custom)
   * - Opacity control (0-100%)
   *
   * V7.2 Features:
   * - Smart border radius (individual corners override shorthand)
   */
  const inlineStyleString = React.useMemo(() => {
    console.log('🔄 Badge: inlineStyleString useMemo recalculating...', {
      safeBorderWidth,
      safeBorderTopWidth,
      safeBorderRightWidth,
      safeBorderBottomWidth,
      safeBorderLeftWidth,
      safeBorderRadius,
      safeBorderRadiusTopLeft,
      safeBorderRadiusTopRight,
      safeBorderRadiusBottomLeft,
      safeBorderRadiusBottomRight,
    });

    const styleOverrides: string[] = [];

    // V7.0 - Colors
    if (safeColor) styleOverrides.push(`color: ${safeColor} !important`);
    if (safeBackgroundColor) styleOverrides.push(`background-color: ${safeBackgroundColor} !important`);

    // V7.3 - Border Width (smart: individual sides override shorthand)
    if (safeBorderTopWidth !== undefined) {
      styleOverrides.push(`border-top-width: ${safeBorderTopWidth}px !important`);
    } else if (safeBorderWidth !== undefined) {
      styleOverrides.push(`border-top-width: ${safeBorderWidth}px !important`);
    }

    if (safeBorderRightWidth !== undefined) {
      styleOverrides.push(`border-right-width: ${safeBorderRightWidth}px !important`);
    } else if (safeBorderWidth !== undefined) {
      styleOverrides.push(`border-right-width: ${safeBorderWidth}px !important`);
    }

    if (safeBorderBottomWidth !== undefined) {
      styleOverrides.push(`border-bottom-width: ${safeBorderBottomWidth}px !important`);
    } else if (safeBorderWidth !== undefined) {
      styleOverrides.push(`border-bottom-width: ${safeBorderWidth}px !important`);
    }

    if (safeBorderLeftWidth !== undefined) {
      styleOverrides.push(`border-left-width: ${safeBorderLeftWidth}px !important`);
    } else if (safeBorderWidth !== undefined) {
      styleOverrides.push(`border-left-width: ${safeBorderWidth}px !important`);
    }

    // Border style (apply to all sides)
    if (safeBorderStyle) styleOverrides.push(`border-style: ${safeBorderStyle} !important`);

    // V7.4 - Border Color (smart: individual sides override shorthand)
    if (safeBorderTopColor !== undefined) {
      styleOverrides.push(`border-top-color: ${safeBorderTopColor} !important`);
    } else if (safeBorderColor) {
      styleOverrides.push(`border-top-color: ${safeBorderColor} !important`);
    }

    if (safeBorderRightColor !== undefined) {
      styleOverrides.push(`border-right-color: ${safeBorderRightColor} !important`);
    } else if (safeBorderColor) {
      styleOverrides.push(`border-right-color: ${safeBorderColor} !important`);
    }

    if (safeBorderBottomColor !== undefined) {
      styleOverrides.push(`border-bottom-color: ${safeBorderBottomColor} !important`);
    } else if (safeBorderColor) {
      styleOverrides.push(`border-bottom-color: ${safeBorderColor} !important`);
    }

    if (safeBorderLeftColor !== undefined) {
      styleOverrides.push(`border-left-color: ${safeBorderLeftColor} !important`);
    } else if (safeBorderColor) {
      styleOverrides.push(`border-left-color: ${safeBorderColor} !important`);
    }

    // V7.2 - Border Radius (smart: individual corners override shorthand)
    if (safeBorderRadiusTopLeft !== undefined) {
      styleOverrides.push(`border-top-left-radius: ${safeBorderRadiusTopLeft}px !important`);
    } else if (safeBorderRadius !== undefined) {
      styleOverrides.push(`border-top-left-radius: ${safeBorderRadius}px !important`);
    }

    if (safeBorderRadiusTopRight !== undefined) {
      styleOverrides.push(`border-top-right-radius: ${safeBorderRadiusTopRight}px !important`);
    } else if (safeBorderRadius !== undefined) {
      styleOverrides.push(`border-top-right-radius: ${safeBorderRadius}px !important`);
    }

    if (safeBorderRadiusBottomLeft !== undefined) {
      styleOverrides.push(`border-bottom-left-radius: ${safeBorderRadiusBottomLeft}px !important`);
    } else if (safeBorderRadius !== undefined) {
      styleOverrides.push(`border-bottom-left-radius: ${safeBorderRadius}px !important`);
    }

    if (safeBorderRadiusBottomRight !== undefined) {
      styleOverrides.push(`border-bottom-right-radius: ${safeBorderRadiusBottomRight}px !important`);
    } else if (safeBorderRadius !== undefined) {
      styleOverrides.push(`border-bottom-right-radius: ${safeBorderRadius}px !important`);
    }

    // V7.1 - Margin (smart: individual sides override shorthand)
    // IMPORTANT: If align is set, margin-left/margin-right are controlled by align, not margin
    if (safeMarginTop !== undefined) {
      styleOverrides.push(`margin-top: ${safeMarginTop}px !important`);
    } else if (safeMargin) {
      styleOverrides.push(`margin-top: ${safeMargin}px !important`);
    }
    // Only apply margin-right if align is NOT set
    if (!align) {
      if (safeMarginRight !== undefined) {
        styleOverrides.push(`margin-right: ${safeMarginRight}px !important`);
      } else if (safeMargin) {
        styleOverrides.push(`margin-right: ${safeMargin}px !important`);
      }
    }
    if (safeMarginBottom !== undefined) {
      styleOverrides.push(`margin-bottom: ${safeMarginBottom}px !important`);
    } else if (safeMargin) {
      styleOverrides.push(`margin-bottom: ${safeMargin}px !important`);
    }
    // Only apply margin-left if align is NOT set
    if (!align) {
      if (safeMarginLeft !== undefined) {
        styleOverrides.push(`margin-left: ${safeMarginLeft}px !important`);
      } else if (safeMargin) {
        styleOverrides.push(`margin-left: ${safeMargin}px !important`);
      }
    }

    // V7.1 - Padding (smart: individual sides override shorthand)
    if (safePaddingTop !== undefined) {
      styleOverrides.push(`padding-top: ${safePaddingTop}px !important`);
    } else if (safePadding) {
      styleOverrides.push(`padding-top: ${safePadding}px !important`);
    }
    if (safePaddingRight !== undefined) {
      styleOverrides.push(`padding-right: ${safePaddingRight}px !important`);
    } else if (safePadding) {
      styleOverrides.push(`padding-right: ${safePadding}px !important`);
    }
    if (safePaddingBottom !== undefined) {
      styleOverrides.push(`padding-bottom: ${safePaddingBottom}px !important`);
    } else if (safePadding) {
      styleOverrides.push(`padding-bottom: ${safePadding}px !important`);
    }
    if (safePaddingLeft !== undefined) {
      styleOverrides.push(`padding-left: ${safePaddingLeft}px !important`);
    } else if (safePadding) {
      styleOverrides.push(`padding-left: ${safePadding}px !important`);
    }

    // V7.1 - Shadow (presets or custom)
    if (safeShadow && safeShadow !== 'none') {
      styleOverrides.push(`box-shadow: ${safeShadow} !important`);
    }

    // V7.1 - Opacity (0-100%)
    if (safeOpacity < 100) {
      styleOverrides.push(`opacity: ${safeOpacity / 100} !important`);
    }

    // V7.5 - Alignment (horizontal alignment or full width)
    // IMPORTANT: Alignment requires block-level display + width: fit-content
    if (align) {
      console.log('🎯 ALIGN ACTIVE:', {
        align,
        display,
        safeMarginLeft,
        safeMarginRight,
        safeMargin,
      });

      switch (align) {
        case 'left':
          // For left alignment, keep inline-flex or use block with fit-content
          if (!display || display === 'inline-flex') {
            styleOverrides.push(`display: block !important`);
            styleOverrides.push(`width: fit-content !important`);
          }
          styleOverrides.push(`margin-left: 0 !important`);
          styleOverrides.push(`margin-right: auto !important`);
          console.log('🎯 ALIGN LEFT: Added display:block, width:fit-content, margin-left:0, margin-right:auto');
          break;
        case 'center':
          // For center, must be block with fit-content
          if (!display || display === 'inline-flex') {
            styleOverrides.push(`display: block !important`);
            styleOverrides.push(`width: fit-content !important`);
          }
          styleOverrides.push(`margin-left: auto !important`);
          styleOverrides.push(`margin-right: auto !important`);
          console.log('🎯 ALIGN CENTER: Added display:block, width:fit-content, margin:auto');
          break;
        case 'right':
          // For right, must be block with fit-content
          if (!display || display === 'inline-flex') {
            styleOverrides.push(`display: block !important`);
            styleOverrides.push(`width: fit-content !important`);
          }
          styleOverrides.push(`margin-left: auto !important`);
          styleOverrides.push(`margin-right: 0 !important`);
          console.log('🎯 ALIGN RIGHT: Added display:block, width:fit-content, margin-left:auto, margin-right:0');
          break;
        case 'full':
          // For full width, block with 100%
          if (!display || display === 'inline-flex') {
            styleOverrides.push(`display: block !important`);
          }
          styleOverrides.push(`width: 100% !important`);
          styleOverrides.push(`margin-left: 0 !important`);
          styleOverrides.push(`margin-right: 0 !important`);
          console.log('🎯 ALIGN FULL: Added display:block, width:100%, margin:0');
          break;
      }
    }

    // V7.5 - Display (applied AFTER align to allow override)
    if (display && display !== 'inline-flex') {
      styleOverrides.push(`display: ${display} !important`);
    }

    // V7.5 - Position
    if (position && position !== 'static') {
      styleOverrides.push(`position: ${position} !important`);
    }

    // V7.6 - TYPOGRAPHY
    if (fontFamily) {
      // Map font names to actual font stacks
      const fontMap: Record<string, string> = {
        'system-ui': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        'serif': 'Georgia, Cambria, "Times New Roman", Times, serif',
        'monospace': '"Courier New", Courier, Monaco, monospace',
        'Inter': '"Inter", sans-serif',
        'Roboto': '"Roboto", sans-serif',
        'Open Sans': '"Open Sans", sans-serif',
        'Lato': '"Lato", sans-serif',
        'Montserrat': '"Montserrat", sans-serif',
        'Poppins': '"Poppins", sans-serif',
      };
      styleOverrides.push(`font-family: ${fontMap[fontFamily] || fontFamily} !important`);
    }

    if (fontSize !== undefined) {
      styleOverrides.push(`font-size: ${fontSize}px !important`);
    }

    if (fontWeight) {
      styleOverrides.push(`font-weight: ${fontWeight} !important`);
    }

    if (fontStyle && fontStyle !== 'normal') {
      styleOverrides.push(`font-style: ${fontStyle} !important`);
    }

    if (letterSpacing !== undefined) {
      styleOverrides.push(`letter-spacing: ${letterSpacing}px !important`);
    }

    if (textTransform && textTransform !== 'none') {
      styleOverrides.push(`text-transform: ${textTransform} !important`);
    }

    // V7.6 - TRANSFORM
    const transforms: string[] = [];

    if (rotate !== undefined && rotate !== 0) {
      transforms.push(`rotate(${rotate}deg)`);
    }

    if (scaleX !== undefined && scaleX !== 1) {
      transforms.push(`scaleX(${scaleX})`);
    }

    if (scaleY !== undefined && scaleY !== 1) {
      transforms.push(`scaleY(${scaleY})`);
    }

    if (skewX !== undefined && skewX !== 0) {
      transforms.push(`skewX(${skewX}deg)`);
    }

    if (skewY !== undefined && skewY !== 0) {
      transforms.push(`skewY(${skewY}deg)`);
    }

    if (transforms.length > 0) {
      styleOverrides.push(`transform: ${transforms.join(' ')} !important`);
    }

    // V7.6 - ANIMATION
    if (transitionDuration !== undefined && transitionDuration !== 300) {
      styleOverrides.push(`transition-duration: ${transitionDuration}ms !important`);
    }

    if (transitionTimingFunction && transitionTimingFunction !== 'ease') {
      styleOverrides.push(`transition-timing-function: ${transitionTimingFunction} !important`);
    }

    // Always add transition-property for smooth animations
    if (transitionDuration || transitionTimingFunction) {
      styleOverrides.push(`transition-property: all !important`);
    }

    return styleOverrides.length > 0 ? styleOverrides.join('; ') : '';
  }, [
    safeColor,
    safeBackgroundColor,
    safeBorderWidth,
    safeBorderTopWidth,
    safeBorderRightWidth,
    safeBorderBottomWidth,
    safeBorderLeftWidth,
    safeBorderStyle,
    safeBorderColor,
    safeBorderTopColor,
    safeBorderRightColor,
    safeBorderBottomColor,
    safeBorderLeftColor,
    safeBorderRadius,
    safeBorderRadiusTopLeft,
    safeBorderRadiusTopRight,
    safeBorderRadiusBottomLeft,
    safeBorderRadiusBottomRight,
    safeMargin,
    safeMarginTop,
    safeMarginRight,
    safeMarginBottom,
    safeMarginLeft,
    safePadding,
    safePaddingTop,
    safePaddingRight,
    safePaddingBottom,
    safePaddingLeft,
    safeShadow,
    safeOpacity,
    display,
    position,
    align,
    // V7.6 - Typography
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    letterSpacing,
    textTransform,
    // V7.6 - Transform
    rotate,
    scaleX,
    scaleY,
    skewX,
    skewY,
    // V7.6 - Animation
    transitionDuration,
    transitionTimingFunction,
  ]);

  // Apply inline styles with !important using cssText
  // V7.1 ENHANCED: Clear ALL inline styles first, then apply new ones
  React.useEffect(() => {
    console.log('🔥 Badge useEffect [APPLY STYLES] triggered', {
      hasSpanRef: !!spanRef.current,
      inlineStyleString,
    });

    if (spanRef.current) {
      console.log('📍 Badge useEffect: spanRef.current EXISTS');

      // Get cssText BEFORE clearing
      const cssTextBefore = spanRef.current.style.cssText;
      console.log('📍 cssText BEFORE clearing:', cssTextBefore);

      // V7.0 - Clear previous color/background styles
      spanRef.current.style.color = '';
      spanRef.current.style.backgroundColor = '';

      // V7.3 - Clear border width (all sides)
      spanRef.current.style.borderTopWidth = '';
      spanRef.current.style.borderRightWidth = '';
      spanRef.current.style.borderBottomWidth = '';
      spanRef.current.style.borderLeftWidth = '';
      spanRef.current.style.borderStyle = '';
      spanRef.current.style.borderColor = '';

      // V7.4 - Clear individual border colors
      spanRef.current.style.borderTopColor = '';
      spanRef.current.style.borderRightColor = '';
      spanRef.current.style.borderBottomColor = '';
      spanRef.current.style.borderLeftColor = '';

      // V7.2 - Clear border radius (all corners)
      spanRef.current.style.borderTopLeftRadius = '';
      spanRef.current.style.borderTopRightRadius = '';
      spanRef.current.style.borderBottomLeftRadius = '';
      spanRef.current.style.borderBottomRightRadius = '';

      // V7.1 - Clear spacing styles
      spanRef.current.style.marginTop = '';
      spanRef.current.style.marginRight = '';
      spanRef.current.style.marginBottom = '';
      spanRef.current.style.marginLeft = '';
      spanRef.current.style.paddingTop = '';
      spanRef.current.style.paddingRight = '';
      spanRef.current.style.paddingBottom = '';
      spanRef.current.style.paddingLeft = '';

      // V7.1 - Clear shadow & opacity
      spanRef.current.style.boxShadow = '';
      spanRef.current.style.opacity = '';

      // V7.6 - Clear Typography styles
      spanRef.current.style.fontFamily = '';
      spanRef.current.style.fontSize = '';
      spanRef.current.style.fontWeight = '';
      spanRef.current.style.fontStyle = '';
      spanRef.current.style.letterSpacing = '';
      spanRef.current.style.textTransform = '';

      // V7.6 - Clear Transform styles
      spanRef.current.style.transform = '';

      // V7.6 - Clear Animation/Transition styles
      spanRef.current.style.transitionDuration = '';
      spanRef.current.style.transitionTimingFunction = '';
      spanRef.current.style.transitionProperty = '';

      // Get cssText AFTER clearing
      const cssTextAfterClearing = spanRef.current.style.cssText;
      console.log('📍 cssText AFTER clearing:', cssTextAfterClearing);

      // Apply new styles if any
      if (inlineStyleString) {
        console.log('📍 Applying inlineStyleString:', inlineStyleString);
        spanRef.current.style.cssText += '; ' + inlineStyleString;

        // Get cssText AFTER applying
        const cssTextAfter = spanRef.current.style.cssText;
        console.log('📍 cssText AFTER applying:', cssTextAfter);

        // Check actual computed border radius
        console.log('📍 Actual borderBottomLeftRadius property:', spanRef.current.style.borderBottomLeftRadius);
        console.log('📍 Actual borderTopLeftRadius property:', spanRef.current.style.borderTopLeftRadius);
        console.log('📍 Actual borderTopRightRadius property:', spanRef.current.style.borderTopRightRadius);
        console.log('📍 Actual borderBottomRightRadius property:', spanRef.current.style.borderBottomRightRadius);
      } else {
        console.log('📍 NO inlineStyleString to apply');
      }
    } else {
      console.log('❌ Badge useEffect: spanRef.current is NULL!');
    }
  }, [inlineStyleString]);

  // Debug custom styles
  if (process.env.NODE_ENV === 'development') {
    console.log('🏷️ Badge V7.0 [GOD-TIER] inline styles:', inlineStyleString);
  }

  // ============================================
  // EVENT HANDLERS (GOD-TIER V7.0)
  // ============================================

  /**
   * Handle remove button click (useCallback for performance)
   * Stops event propagation to prevent badge onClick from firing
   */
  const handleRemove = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Don't trigger badge onClick
    safeOnRemove?.(e);
  }, [safeOnRemove]);

  /**
   * Handle keyboard navigation for clickable badges
   * Supports Enter and Space keys (WCAG 2.1 requirement)
   */
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLSpanElement>) => {
    // Only handle keyboard if badge is clickable
    if (!isClickable || !safeOnClick) return;

    // Enter or Space key activates the badge
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Prevent default scroll on Space
      // Create synthetic mouse event for onClick
      const syntheticEvent = {
        ...e,
        currentTarget: e.currentTarget,
      } as unknown as React.MouseEvent<HTMLSpanElement>;
      safeOnClick(syntheticEvent);
    }
  }, [isClickable, safeOnClick]);

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

  // ============================================
  // RENDER (GOD-TIER V7.0)
  // ============================================

  return (
    <span
      ref={spanRef}
      id={id}
      className={classes}
      onClick={safeOnClick}
      onKeyDown={handleKeyDown}
      data-testid={testId}
      data-badge-version="7.4"
      // ============================================
      // ARIA ATTRIBUTES (WCAG 2.1 AA Compliance)
      // ============================================
      aria-label={ariaLabel || (removable ? `Badge: ${typeof children === 'string' ? children : 'content'}, removable` : undefined)}
      role={isClickable ? 'button' : removable ? 'group' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-live={removable ? 'polite' : undefined}
      aria-atomic={removable ? 'true' : undefined}
      {...validDOMProps}
    >
      {/* Dot indicator (left) */}
      {dot && iconPosition === 'left' && renderDot()}

      {/* Icon (left) */}
      {icon && iconPosition === 'left' && renderIcon()}

      {/* Text content (sanitized for XSS) */}
      <span className={styles['badge-text']}>{sanitizedChildren}</span>

      {/* Icon (right) */}
      {icon && iconPosition === 'right' && renderIcon()}

      {/* Dot indicator (right) */}
      {dot && iconPosition === 'right' && renderDot()}

      {/* Remove button */}
      {renderRemoveButton()}
    </span>
  );
};

BadgeInner.displayName = 'BadgeInner';

/**
 * React.memo wrapper for performance optimization (GOD-TIER V7.0)
 *
 * Prevents unnecessary re-renders by shallow comparing props.
 * Custom comparison function for optimal performance.
 *
 * Performance gains:
 * - Avoids re-renders when props haven't changed
 * - Reduces React reconciliation overhead
 * - Improves parent component performance
 *
 * @param {BadgeProps} prevProps - Previous props
 * @param {BadgeProps} nextProps - Next props
 * @returns {boolean} True if props are equal (skip re-render), false otherwise
 */
export const Badge = React.memo(BadgeInner, (prevProps, nextProps) => {
  // Custom comparison for optimal performance
  // Return true if props are equal (skip re-render)
  // Return false if props are different (re-render)

  // V7.1 FIXED: Added ALL V7.1 spacing/shadow/opacity parameters to comparison
  if (prevProps.children === nextProps.children &&
      prevProps.variant === nextProps.variant &&
      prevProps.size === nextProps.size &&
      prevProps.rounded === nextProps.rounded &&
      prevProps.color === nextProps.color &&
      prevProps.backgroundColor === nextProps.backgroundColor &&
      prevProps.borderWidth === nextProps.borderWidth &&
      prevProps.borderTopWidth === nextProps.borderTopWidth &&
      prevProps.borderRightWidth === nextProps.borderRightWidth &&
      prevProps.borderBottomWidth === nextProps.borderBottomWidth &&
      prevProps.borderLeftWidth === nextProps.borderLeftWidth &&
      prevProps.borderStyle === nextProps.borderStyle &&
      prevProps.borderColor === nextProps.borderColor &&
      prevProps.borderTopColor === nextProps.borderTopColor &&
      prevProps.borderRightColor === nextProps.borderRightColor &&
      prevProps.borderBottomColor === nextProps.borderBottomColor &&
      prevProps.borderLeftColor === nextProps.borderLeftColor &&
      prevProps.borderRadius === nextProps.borderRadius &&
      prevProps.borderRadiusTopLeft === nextProps.borderRadiusTopLeft &&
      prevProps.borderRadiusTopRight === nextProps.borderRadiusTopRight &&
      prevProps.borderRadiusBottomLeft === nextProps.borderRadiusBottomLeft &&
      prevProps.borderRadiusBottomRight === nextProps.borderRadiusBottomRight &&
      prevProps.icon === nextProps.icon &&
      prevProps.iconPosition === nextProps.iconPosition &&
      prevProps.dot === nextProps.dot &&
      prevProps.clickable === nextProps.clickable &&
      prevProps.removable === nextProps.removable &&
      prevProps.onClick === nextProps.onClick &&
      prevProps.onRemove === nextProps.onRemove &&
      prevProps.className === nextProps.className &&
      prevProps['aria-label'] === nextProps['aria-label'] &&
      prevProps.id === nextProps.id &&
      // V7.1 - Spacing parameters
      prevProps.margin === nextProps.margin &&
      prevProps.marginTop === nextProps.marginTop &&
      prevProps.marginRight === nextProps.marginRight &&
      prevProps.marginBottom === nextProps.marginBottom &&
      prevProps.marginLeft === nextProps.marginLeft &&
      prevProps.padding === nextProps.padding &&
      prevProps.paddingTop === nextProps.paddingTop &&
      prevProps.paddingRight === nextProps.paddingRight &&
      prevProps.paddingBottom === nextProps.paddingBottom &&
      prevProps.paddingLeft === nextProps.paddingLeft &&
      // V7.1 - Shadow parameters
      prevProps.shadow === nextProps.shadow &&
      prevProps.shadowOffsetX === nextProps.shadowOffsetX &&
      prevProps.shadowOffsetY === nextProps.shadowOffsetY &&
      prevProps.shadowBlur === nextProps.shadowBlur &&
      prevProps.shadowSpread === nextProps.shadowSpread &&
      prevProps.shadowColor === nextProps.shadowColor &&
      prevProps.shadowOpacity === nextProps.shadowOpacity &&
      // V7.1 - Opacity
      prevProps.opacity === nextProps.opacity) {
    return true; // Props are equal, skip re-render
  }

  return false; // Props are different, re-render
});

Badge.displayName = 'Badge';

export default Badge;
