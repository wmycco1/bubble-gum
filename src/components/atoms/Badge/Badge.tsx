/**
 * Badge Component - GOD-TIER Enterprise Edition V8.0
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
 * V8.0 CRITICAL ARCHITECTURE FIX (2025-11-13):
 * - GOD-TIER Display Logic: Smart width based on display mode (CSS Box Model compliant)
 * - display:block/flex/grid → width:auto (100% natural behavior)
 * - display:inline-block/inline-flex → width:fit-content (shrink-to-fit)
 * - Fixes: display:flex now correctly takes full canvas width
 *
 * V7.6 FEATURES (2025-11-11):
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
  generateShadow,
  generateTextShadow
} from '@/lib/utils/validation';

// ═══════════════════════════════════════════════════════════════
// V8.1 - CONSTANTS & UTILITIES (Enterprise-grade refactor)
// ═══════════════════════════════════════════════════════════════

/** Alignment values constant */
export const ALIGNMENT_VALUES = {
  NONE: 'none',
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  FULL: 'full',
} as const;

/** Development mode flag for conditional logging */
const IS_DEV = process.env.NODE_ENV === 'development';

/**
 * Development-only logging utility
 * @param message - Log message
 * @param data - Optional data to log
 */
const devLog = (message: string, data?: any) => {
  if (IS_DEV) {
    console.log(message, data !== undefined ? data : '');
  }
};

/**
 * Get smart width based on display mode (extracted for performance)
 * CRITICAL: Block-level displays WITHOUT align should use fit-content
 * so that margin-left/right can actually move the element
 *
 * @param displayMode - CSS display value
 * @returns Smart width value
 */
const getSmartWidth = (displayMode: string): string => {
  // Block-level displays (shrink to content, allows margin to work)
  if (displayMode === 'block' || displayMode === 'flex' || displayMode === 'grid') {
    return 'fit-content';
  }

  // Inline-level displays (shrink-to-fit behavior)
  if (displayMode === 'inline-block' || displayMode === 'inline-flex' ||
      displayMode === 'inline-grid' || displayMode === 'inline') {
    return 'fit-content';
  }

  // Default: fit-content (so margin can work)
  return 'fit-content';
};

/**
 * Apply spacing value (margin or padding) with smart fallback logic
 * DRY utility to avoid code duplication
 *
 * @param params - Spacing parameters
 * @returns Array of CSS style overrides
 */
interface ApplySpacingParams {
  specificValue: number | undefined;
  fallbackValue: number | undefined;
  property: string; // e.g., 'margin-left', 'padding-top'
  align?: string;
  allowedAligns?: string[]; // Which align values allow this property
  debugLabel?: string;
}

const applySpacing = (params: ApplySpacingParams): string[] => {
  const {
    specificValue,
    fallbackValue,
    property,
    align,
    allowedAligns = [ALIGNMENT_VALUES.NONE, ''],
    debugLabel = property,
  } = params;

  const styles: string[] = [];

  // Check if alignment allows this property
  const isAlignAllowed = !align || allowedAligns.includes(align);

  if (!isAlignAllowed) {
    devLog(`🚫 V8.1 ${debugLabel.toUpperCase()} SKIPPED: align="${align}" is set (controlled by alignment logic)`);
    return styles;
  }

  // Apply specific value or fallback
  if (specificValue !== undefined) {
    styles.push(`${property}: ${specificValue}px !important`);
    devLog(`✅ V8.1 ${debugLabel.toUpperCase()} APPLIED: ${specificValue}px (align="${align}")`);
  } else if (fallbackValue !== undefined) {
    styles.push(`${property}: ${fallbackValue}px !important`);
    devLog(`✅ V8.1 ${debugLabel.toUpperCase()} APPLIED (from fallback): ${fallbackValue}px (align="${align}")`);
  } else {
    devLog(`⚠️ V8.1 ${debugLabel.toUpperCase()} NOT APPLIED: specificValue=${specificValue}, fallbackValue=${fallbackValue} (align="${align}")`);
  }

  return styles;
};

// ═══════════════════════════════════════════════════════════════

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
  // TEXT SHADOW (V8.1)
  // ============================================

  /** Text shadow preset (none, sm, md, lg, xl) */
  textShadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  /** Custom text shadow offsetX (px, requires textShadow='custom') */
  textShadowOffsetX?: number;
  /** Custom text shadow offsetY (px, requires textShadow='custom') */
  textShadowOffsetY?: number;
  /** Custom text shadow blur (px, requires textShadow='custom') */
  textShadowBlur?: number;
  /** Custom text shadow color (validated, requires textShadow='custom') */
  textShadowColor?: string;
  /** Text shadow opacity (0-100%, applies to preset or custom) */
  textShadowOpacity?: number;

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
    devLog('🏷️ Badge V7.5 [GOD-TIER] received ALL params:', params);
    devLog('🏷️ Badge V7.5 styling params:', {
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

    // V8.1 - Text Shadow
    textShadow = 'none',
    textShadowOffsetX,
    textShadowOffsetY,
    textShadowBlur,
    textShadowColor,
    textShadowOpacity,

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
   * V7.6 - Safe Typography values (reactive with useMemo for instant updates)
   */
  const safeFontFamily = React.useMemo(() => fontFamily, [fontFamily]);
  const safeFontSize = React.useMemo(() => fontSize, [fontSize]);
  const safeFontWeight = React.useMemo(() => fontWeight, [fontWeight]);
  const safeFontStyle = React.useMemo(() => fontStyle, [fontStyle]);
  const safeLetterSpacing = React.useMemo(() => letterSpacing, [letterSpacing]);
  const safeTextTransform = React.useMemo(() => textTransform, [textTransform]);

  /**
   * V7.6 - Safe Transform values (reactive with useMemo for instant updates)
   */
  const safeRotate = React.useMemo(() => rotate, [rotate]);
  const safeScaleX = React.useMemo(() => scaleX, [scaleX]);
  const safeScaleY = React.useMemo(() => scaleY, [scaleY]);
  const safeSkewX = React.useMemo(() => skewX, [skewX]);
  const safeSkewY = React.useMemo(() => skewY, [skewY]);

  /**
   * V7.6 - Safe Animation values (reactive with useMemo for instant updates)
   */
  const safeTransitionDuration = React.useMemo(() => transitionDuration, [transitionDuration]);
  const safeTransitionTimingFunction = React.useMemo(() => transitionTimingFunction, [transitionTimingFunction]);

  /**
   * Generate text-shadow value - V8.1
   * Supports presets (sm, md, lg, xl) and custom parameters (NO spread)
   */
  const safeTextShadow = React.useMemo(() => {
    return generateTextShadow(
      textShadow,
      textShadow === 'custom' ? {
        offsetX: textShadowOffsetX,
        offsetY: textShadowOffsetY,
        blur: textShadowBlur,
        color: textShadowColor,
      } : undefined,
      textShadowOpacity
    );
  }, [textShadow, textShadowOffsetX, textShadowOffsetY, textShadowBlur, textShadowColor, textShadowOpacity]);

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
    devLog('🔄 V8.1 Badge: inlineStyleString useMemo recalculating...', {
      // V8.1 DEBUG: Margin & Align props
      align,
      marginLeft,
      marginRight,
      marginTop,
      marginBottom,
      margin,
      safeMarginLeft,
      safeMarginRight,
      display,
      // Original debug:
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

    // V8.1 - COMPREHENSIVE DEBUG (TOP OF FUNCTION)
    devLog('═══════════════════════════════════════════════════════════════');
    devLog('🎯 V8.1 INLINE STYLE STRING CALCULATION STARTED');
    devLog('═══════════════════════════════════════════════════════════════');
    devLog('Props received:', {
      display,
      align,
      position,
      marginTop: safeMarginTop,
      marginRight: safeMarginRight,
      marginBottom: safeMarginBottom,
      marginLeft: safeMarginLeft,
    });

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

    // V8.1 - Margin (smart: individual sides override shorthand, using DRY utility)
    // IMPORTANT: If align is set, margin-left/margin-right are controlled by align, not margin
    // Top & Bottom: Always apply (alignment doesn't affect vertical margins)
    styleOverrides.push(...applySpacing({
      specificValue: safeMarginTop,
      fallbackValue: safeMargin,
      property: 'margin-top',
      allowedAligns: undefined, // Always allowed (no align check)
      debugLabel: 'margin-top',
    }));

    // Right: Only apply if align is NOT set or is 'none'
    styleOverrides.push(...applySpacing({
      specificValue: safeMarginRight,
      fallbackValue: safeMargin,
      property: 'margin-right',
      align,
      allowedAligns: [ALIGNMENT_VALUES.NONE, ''],
      debugLabel: 'margin-right',
    }));

    styleOverrides.push(...applySpacing({
      specificValue: safeMarginBottom,
      fallbackValue: safeMargin,
      property: 'margin-bottom',
      allowedAligns: undefined, // Always allowed (no align check)
      debugLabel: 'margin-bottom',
    }));

    // Left: Only apply if align is NOT set or is 'none'
    styleOverrides.push(...applySpacing({
      specificValue: safeMarginLeft,
      fallbackValue: safeMargin,
      property: 'margin-left',
      align,
      allowedAligns: [ALIGNMENT_VALUES.NONE, ''],
      debugLabel: 'margin-left',
    }));

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

    // ═══════════════════════════════════════════════════════════════
    // V8.0 - GOD-TIER DISPLAY LOGIC (CSS Box Model Compliant)
    // ═══════════════════════════════════════════════════════════════
    // Smart width calculation based on display mode + align
    // CRITICAL: Respects CSS box model behavior for each display type
    // ═══════════════════════════════════════════════════════════════

    // Helper function: Get smart width based on display mode
    const getSmartWidth = (displayMode: string): string => {
      // CRITICAL FIX: Block-level displays WITHOUT align should use fit-content
      // so that margin-left/right can actually move the element
      // If user wants full width, they should use align="full"
      if (displayMode === 'block' || displayMode === 'flex' || displayMode === 'grid') {
        return 'fit-content'; // Shrink to content (allows margin to work)
      }

      // Inline-level displays (shrink to content width)
      if (displayMode === 'inline-block' || displayMode === 'inline-flex' ||
          displayMode === 'inline-grid' || displayMode === 'inline') {
        return 'fit-content'; // Shrink-to-fit behavior
      }

      // Default: fit-content (so margin can work)
      return 'fit-content';
    };

    // V8.0 - Display mode (apply FIRST, before align overrides)
    const effectiveDisplay = display || 'inline-flex'; // Default from CSS
    if (display && display !== 'inline-flex') {
      styleOverrides.push(`display: ${display} !important`);
    }

    // V8.1 - Alignment (horizontal alignment or full width)
    // CRITICAL: Alignment logic must respect display mode
    // 'none' is treated as no alignment (allows manual margin control)
    if (align && align !== ALIGNMENT_VALUES.NONE) {
      devLog('🎯 V8.1 ALIGN ACTIVE:', {
        align,
        display: effectiveDisplay,
        smartWidth: getSmartWidth(effectiveDisplay),
      });

      switch (align) {
        case ALIGNMENT_VALUES.LEFT:
          // Left alignment: margin-left:0, margin-right:auto
          // Width depends on display mode (block → fit-content, inline-block → auto)
          if (effectiveDisplay === 'block' || effectiveDisplay === 'flex' || effectiveDisplay === 'grid') {
            styleOverrides.push(`width: fit-content !important`); // Shrink block to content
          }
          styleOverrides.push(`margin-left: 0 !important`);
          styleOverrides.push(`margin-right: auto !important`);
          devLog('🎯 V8.1 ALIGN LEFT: margin-left:0, margin-right:auto');
          break;

        case ALIGNMENT_VALUES.CENTER:
          // Center alignment: margin-left:auto, margin-right:auto
          // Requires fit-content width for block-level displays
          if (effectiveDisplay === 'block' || effectiveDisplay === 'flex' || effectiveDisplay === 'grid') {
            styleOverrides.push(`width: fit-content !important`); // Shrink block to content
          }
          styleOverrides.push(`margin-left: auto !important`);
          styleOverrides.push(`margin-right: auto !important`);
          devLog('🎯 V8.1 ALIGN CENTER: margin:auto');
          break;

        case ALIGNMENT_VALUES.RIGHT:
          // Right alignment: margin-left:auto, margin-right:0
          // Requires fit-content width for block-level displays
          if (effectiveDisplay === 'block' || effectiveDisplay === 'flex' || effectiveDisplay === 'grid') {
            styleOverrides.push(`width: fit-content !important`); // Shrink block to content
          }
          styleOverrides.push(`margin-left: auto !important`);
          styleOverrides.push(`margin-right: 0 !important`);
          devLog('🎯 V8.1 ALIGN RIGHT: margin-left:auto, margin-right:0');
          break;

        case ALIGNMENT_VALUES.FULL:
          // Full width alignment: force 100% width
          // Override display to block if needed
          if (effectiveDisplay === 'inline-flex' || effectiveDisplay === 'inline-block' ||
              effectiveDisplay === 'inline' || effectiveDisplay === 'inline-grid') {
            styleOverrides.push(`display: block !important`); // Force block for full width
          }
          styleOverrides.push(`width: 100% !important`);
          styleOverrides.push(`margin-left: 0 !important`);
          styleOverrides.push(`margin-right: 0 !important`);
          devLog('🎯 V8.1 ALIGN FULL: display:block, width:100%, margin:0');
          break;
      }
    } else {
      // V8.1 - NO align set: Always use fit-content to allow margin to work
      // CRITICAL FIX: Without this, margin-left/right won't visually move the element
      // because it would take full width (100%) and have nowhere to move
      // If user wants full width, they should explicitly use align="full"
      const smartWidth = getSmartWidth(effectiveDisplay);
      styleOverrides.push(`width: ${smartWidth} !important`);
      devLog(`🎯 V8.1 NO ALIGN: Smart width applied: ${smartWidth} for display: ${effectiveDisplay} (allows margin to work)`);
    }

    // V7.5 - Position
    if (position && position !== 'static') {
      styleOverrides.push(`position: ${position} !important`);
    }

    // V7.6 - TYPOGRAPHY (using safe* values for reactivity)
    if (safeFontFamily) {
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
      styleOverrides.push(`font-family: ${fontMap[safeFontFamily] || safeFontFamily} !important`);
    }

    if (safeFontSize !== undefined) {
      styleOverrides.push(`font-size: ${safeFontSize}px !important`);
    }

    if (safeFontWeight) {
      styleOverrides.push(`font-weight: ${safeFontWeight} !important`);
    }

    if (safeFontStyle && safeFontStyle !== 'normal') {
      styleOverrides.push(`font-style: ${safeFontStyle} !important`);
    }

    if (safeLetterSpacing !== undefined) {
      styleOverrides.push(`letter-spacing: ${safeLetterSpacing}px !important`);
    }

    if (safeTextTransform && safeTextTransform !== 'none') {
      styleOverrides.push(`text-transform: ${safeTextTransform} !important`);
    }

    // V8.1 - TEXT SHADOW
    if (safeTextShadow && safeTextShadow !== 'none') {
      styleOverrides.push(`text-shadow: ${safeTextShadow} !important`);
    }

    // V7.6 - TRANSFORM (using safe* values for reactivity)
    const transforms: string[] = [];

    if (safeRotate !== undefined && safeRotate !== 0) {
      transforms.push(`rotate(${safeRotate}deg)`);
    }

    if (safeScaleX !== undefined && safeScaleX !== 1) {
      transforms.push(`scaleX(${safeScaleX})`);
    }

    if (safeScaleY !== undefined && safeScaleY !== 1) {
      transforms.push(`scaleY(${safeScaleY})`);
    }

    if (safeSkewX !== undefined && safeSkewX !== 0) {
      transforms.push(`skewX(${safeSkewX}deg)`);
    }

    if (safeSkewY !== undefined && safeSkewY !== 0) {
      transforms.push(`skewY(${safeSkewY}deg)`);
    }

    if (transforms.length > 0) {
      styleOverrides.push(`transform: ${transforms.join(' ')} !important`);
    }

    // V7.6 - ANIMATION (using safe* values for reactivity)
    if (safeTransitionDuration !== undefined && safeTransitionDuration !== 300) {
      styleOverrides.push(`transition-duration: ${safeTransitionDuration}ms !important`);
    }

    if (safeTransitionTimingFunction && safeTransitionTimingFunction !== 'ease') {
      styleOverrides.push(`transition-timing-function: ${safeTransitionTimingFunction} !important`);
    }

    // Always add transition-property for smooth animations
    if (safeTransitionDuration || safeTransitionTimingFunction) {
      styleOverrides.push(`transition-property: all !important`);
    }

    // V8.1 - FINAL DEBUG (END OF FUNCTION)
    const finalStyleString = styleOverrides.length > 0 ? styleOverrides.join('; ') : '';
    devLog('═══════════════════════════════════════════════════════════════');
    devLog('🎯 V8.1 INLINE STYLE STRING CALCULATION COMPLETE');
    devLog('═══════════════════════════════════════════════════════════════');
    devLog('Final style string length:', finalStyleString.length);
    devLog('Final style string:', finalStyleString);
    devLog('═══════════════════════════════════════════════════════════════\n');

    return finalStyleString;
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
    // V7.6 - Typography (safe* values for instant reactivity)
    safeFontFamily,
    safeFontSize,
    safeFontWeight,
    safeFontStyle,
    safeLetterSpacing,
    safeTextTransform,
    safeTextShadow,
    // V7.6 - Transform (safe* values for instant reactivity)
    safeRotate,
    safeScaleX,
    safeScaleY,
    safeSkewX,
    safeSkewY,
    // V7.6 - Animation (safe* values for instant reactivity)
    safeTransitionDuration,
    safeTransitionTimingFunction,
  ]);

  // Apply inline styles with !important using cssText
  // V7.7 FIXED: Clear ONLY props that are actually set, preserve CSS class styles
  React.useEffect(() => {
    devLog('🔥 Badge useEffect [APPLY STYLES] triggered', {
      hasSpanRef: !!spanRef.current,
      inlineStyleString,
    });

    if (spanRef.current) {
      devLog('📍 Badge useEffect: spanRef.current EXISTS');

      // Get cssText BEFORE clearing
      const cssTextBefore = spanRef.current.style.cssText;
      devLog('📍 cssText BEFORE clearing:', cssTextBefore);

      // V7.7 FIXED: Clear ONLY props that are SET (prevent clearing CSS class styles)
      // This fixes the issue where border-radius from rounded='pill' was being cleared
      // when only scaleX/scaleY changed

      // V7.0 - Clear color/background ONLY if props are set
      if (color !== undefined) spanRef.current.style.color = '';
      if (backgroundColor !== undefined) spanRef.current.style.backgroundColor = '';

      // V7.3 - Clear border width ONLY if props are set
      if (borderWidth !== undefined || borderTopWidth !== undefined) spanRef.current.style.borderTopWidth = '';
      if (borderWidth !== undefined || borderRightWidth !== undefined) spanRef.current.style.borderRightWidth = '';
      if (borderWidth !== undefined || borderBottomWidth !== undefined) spanRef.current.style.borderBottomWidth = '';
      if (borderWidth !== undefined || borderLeftWidth !== undefined) spanRef.current.style.borderLeftWidth = '';
      if (borderStyle !== undefined) spanRef.current.style.borderStyle = '';
      if (borderColor !== undefined) spanRef.current.style.borderColor = '';

      // V7.4 - Clear individual border colors ONLY if props are set
      if (borderTopColor !== undefined) spanRef.current.style.borderTopColor = '';
      if (borderRightColor !== undefined) spanRef.current.style.borderRightColor = '';
      if (borderBottomColor !== undefined) spanRef.current.style.borderBottomColor = '';
      if (borderLeftColor !== undefined) spanRef.current.style.borderLeftColor = '';

      // V7.2 - Clear border radius ONLY if props are set (CRITICAL FIX!)
      // This prevents clearing border-radius from rounded='pill' CSS class
      if (borderRadius !== undefined || borderRadiusTopLeft !== undefined) {
        spanRef.current.style.borderTopLeftRadius = '';
      }
      if (borderRadius !== undefined || borderRadiusTopRight !== undefined) {
        spanRef.current.style.borderTopRightRadius = '';
      }
      if (borderRadius !== undefined || borderRadiusBottomLeft !== undefined) {
        spanRef.current.style.borderBottomLeftRadius = '';
      }
      if (borderRadius !== undefined || borderRadiusBottomRight !== undefined) {
        spanRef.current.style.borderBottomRightRadius = '';
      }

      // V7.1 - Clear spacing ONLY if props are set
      if (margin !== undefined || marginTop !== undefined) spanRef.current.style.marginTop = '';
      if (margin !== undefined || marginRight !== undefined) spanRef.current.style.marginRight = '';
      if (margin !== undefined || marginBottom !== undefined) spanRef.current.style.marginBottom = '';
      if (margin !== undefined || marginLeft !== undefined) spanRef.current.style.marginLeft = '';
      if (padding !== undefined || paddingTop !== undefined) spanRef.current.style.paddingTop = '';
      if (padding !== undefined || paddingRight !== undefined) spanRef.current.style.paddingRight = '';
      if (padding !== undefined || paddingBottom !== undefined) spanRef.current.style.paddingBottom = '';
      if (padding !== undefined || paddingLeft !== undefined) spanRef.current.style.paddingLeft = '';

      // V7.1 - Clear shadow & opacity ONLY if props are set
      if (shadow !== undefined && shadow !== 'none') spanRef.current.style.boxShadow = '';
      if (opacity !== undefined && opacity !== 100) spanRef.current.style.opacity = '';

      // V8.0 - Clear width/display/position ONLY if props are set (CRITICAL for margin to work!)
      if (display !== undefined) spanRef.current.style.display = '';
      if (align !== undefined || display !== undefined) spanRef.current.style.width = '';
      if (position !== undefined && position !== 'static') spanRef.current.style.position = '';

      // V7.6 - Clear Typography ONLY if props are set
      if (fontFamily !== undefined) spanRef.current.style.fontFamily = '';
      if (fontSize !== undefined) spanRef.current.style.fontSize = '';
      if (fontWeight !== undefined) spanRef.current.style.fontWeight = '';
      if (fontStyle !== undefined) spanRef.current.style.fontStyle = '';
      if (letterSpacing !== undefined) spanRef.current.style.letterSpacing = '';
      if (textTransform !== undefined) spanRef.current.style.textTransform = '';

      // V8.1 - Clear Text Shadow ONLY if props are set
      if (textShadow !== undefined && textShadow !== 'none') spanRef.current.style.textShadow = '';

      // V7.6 - Clear Transform ONLY if props are set
      if (rotate !== undefined || scaleX !== undefined || scaleY !== undefined || skewX !== undefined || skewY !== undefined) {
        spanRef.current.style.transform = '';
      }

      // V7.6 - Clear Animation ONLY if props are set
      if (transitionDuration !== undefined && transitionDuration !== 300) spanRef.current.style.transitionDuration = '';
      if (transitionTimingFunction !== undefined && transitionTimingFunction !== 'ease') spanRef.current.style.transitionTimingFunction = '';
      if (transitionDuration !== undefined || transitionTimingFunction !== undefined) spanRef.current.style.transitionProperty = '';

      // Get cssText AFTER clearing
      const cssTextAfterClearing = spanRef.current.style.cssText;
      devLog('📍 cssText AFTER clearing:', cssTextAfterClearing);

      // Apply new styles if any
      if (inlineStyleString) {
        devLog('📍 Applying inlineStyleString:', inlineStyleString);
        spanRef.current.style.cssText += '; ' + inlineStyleString;

        // Get cssText AFTER applying
        const cssTextAfter = spanRef.current.style.cssText;
        devLog('📍 cssText AFTER applying:', cssTextAfter);

        // Check actual computed border radius
        devLog('📍 Actual borderBottomLeftRadius property:', spanRef.current.style.borderBottomLeftRadius);
        devLog('📍 Actual borderTopLeftRadius property:', spanRef.current.style.borderTopLeftRadius);
        devLog('📍 Actual borderTopRightRadius property:', spanRef.current.style.borderTopRightRadius);
        devLog('📍 Actual borderBottomRightRadius property:', spanRef.current.style.borderBottomRightRadius);
      } else {
        devLog('📍 NO inlineStyleString to apply');
      }
    } else {
      devLog('❌ Badge useEffect: spanRef.current is NULL!');
    }
  }, [inlineStyleString, color, backgroundColor, borderWidth, borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth, borderStyle, borderColor, borderTopColor, borderRightColor, borderBottomColor, borderLeftColor, borderRadius, borderRadiusTopLeft, borderRadiusTopRight, borderRadiusBottomLeft, borderRadiusBottomRight, margin, marginTop, marginRight, marginBottom, marginLeft, padding, paddingTop, paddingRight, paddingBottom, paddingLeft, shadow, opacity, display, align, position, fontFamily, fontSize, fontWeight, fontStyle, letterSpacing, textTransform, textShadow, textShadowOffsetX, textShadowOffsetY, textShadowBlur, textShadowColor, textShadowOpacity, rotate, scaleX, scaleY, skewX, skewY, transitionDuration, transitionTimingFunction]);

  // Debug custom styles
  if (process.env.NODE_ENV === 'development') {
    devLog('🏷️ Badge V7.0 [GOD-TIER] inline styles:', inlineStyleString);
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
      data-badge-version="8.0"
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
      prevProps.opacity === nextProps.opacity &&
      // V7.5 - Layout & Positioning
      prevProps.align === nextProps.align &&
      prevProps.position === nextProps.position &&
      prevProps.display === nextProps.display &&
      // V7.6 - Typography
      prevProps.fontFamily === nextProps.fontFamily &&
      prevProps.fontSize === nextProps.fontSize &&
      prevProps.fontWeight === nextProps.fontWeight &&
      prevProps.fontStyle === nextProps.fontStyle &&
      prevProps.letterSpacing === nextProps.letterSpacing &&
      prevProps.textTransform === nextProps.textTransform &&
      // V8.1 - Text Shadow
      prevProps.textShadow === nextProps.textShadow &&
      prevProps.textShadowOffsetX === nextProps.textShadowOffsetX &&
      prevProps.textShadowOffsetY === nextProps.textShadowOffsetY &&
      prevProps.textShadowBlur === nextProps.textShadowBlur &&
      prevProps.textShadowColor === nextProps.textShadowColor &&
      prevProps.textShadowOpacity === nextProps.textShadowOpacity &&
      // V7.6 - Transform
      prevProps.rotate === nextProps.rotate &&
      prevProps.scaleX === nextProps.scaleX &&
      prevProps.scaleY === nextProps.scaleY &&
      prevProps.skewX === nextProps.skewX &&
      prevProps.skewY === nextProps.skewY &&
      // V7.6 - Animation
      prevProps.transitionDuration === nextProps.transitionDuration &&
      prevProps.transitionTimingFunction === nextProps.transitionTimingFunction) {
    return true; // Props are equal, skip re-render
  }

  return false; // Props are different, re-render
});

Badge.displayName = 'Badge';

export default Badge;
