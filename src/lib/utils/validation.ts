/**
 * Validation utilities for Badge component
 * Prevents XSS and CSS injection attacks
 *
 * @module validation
 * @packageDocumentation
 */

/**
 * Validates if a string is a safe CSS color value
 *
 * Allows:
 * - Hex colors (#RGB, #RRGGBB, #RRGGBBAA)
 * - RGB/RGBA colors
 * - HSL/HSLA colors
 * - Named colors (common ones)
 *
 * Blocks:
 * - CSS expressions (expression(), calc(), var())
 * - URLs (url())
 * - JavaScript execution attempts
 * - Any other potentially malicious values
 *
 * @param color - Color string to validate
 * @returns True if color is safe, false otherwise
 *
 * @example
 * ```typescript
 * isValidCSSColor('#ff0000')        // true
 * isValidCSSColor('rgb(255, 0, 0)') // true
 * isValidCSSColor('red')            // true
 * isValidCSSColor('url(evil.com)')  // false
 * isValidCSSColor('expression(alert(1))') // false
 * ```
 */
export function isValidCSSColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false;

  // Trim whitespace
  const trimmed = color.trim();

  // Allow hex colors (#RGB, #RRGGBB, #RRGGBBAA)
  const hexRegex = /^#([0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})$/i;
  if (hexRegex.test(trimmed)) return true;

  // Allow rgb/rgba
  const rgbRegex = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/;
  if (rgbRegex.test(trimmed)) return true;

  // Allow hsl/hsla
  const hslRegex = /^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+\s*)?\)$/;
  if (hslRegex.test(trimmed)) return true;

  // Allow named colors (common ones for safety)
  const namedColors = [
    'transparent',
    'currentColor',
    'inherit',
    'initial',
    'unset',
    'black',
    'white',
    'red',
    'green',
    'blue',
    'yellow',
    'orange',
    'purple',
    'pink',
    'brown',
    'gray',
    'grey',
    'cyan',
    'magenta',
    'lime',
    'olive',
    'navy',
    'teal',
    'aqua',
    'maroon',
    'silver',
    'fuchsia',
  ];
  if (namedColors.includes(trimmed.toLowerCase())) return true;

  // Block everything else (url(), calc(), var(), expression(), etc.)
  return false;
}

/**
 * Validates if a border style is safe
 *
 * Only allows CSS-standard border styles:
 * - none
 * - solid
 * - dashed
 * - dotted
 * - double
 *
 * @param style - Border style string to validate
 * @returns True if style is valid, false otherwise (type guard)
 *
 * @example
 * ```typescript
 * isValidBorderStyle('solid')  // true
 * isValidBorderStyle('dashed') // true
 * isValidBorderStyle('groove') // false (not in allowed list)
 * isValidBorderStyle('url()')  // false
 * ```
 */
export function isValidBorderStyle(
  style: string
): style is 'none' | 'solid' | 'dashed' | 'dotted' | 'double' {
  const validStyles = ['none', 'solid', 'dashed', 'dotted', 'double'];
  return validStyles.includes(style);
}

/**
 * Sanitizes a numeric value to prevent negative numbers
 *
 * Returns 0 if:
 * - Value is undefined/null
 * - Value is not a number
 * - Value is NaN
 * - Value is negative
 *
 * @param value - Numeric value to sanitize
 * @returns Sanitized value (>= 0)
 *
 * @example
 * ```typescript
 * sanitizeNumericValue(5)         // 5
 * sanitizeNumericValue(-5)        // 0
 * sanitizeNumericValue(undefined) // 0
 * sanitizeNumericValue(NaN)       // 0
 * ```
 */
export function sanitizeNumericValue(value: number | undefined): number {
  if (value === undefined || value === null) return 0;
  if (typeof value !== 'number') return 0;
  if (Number.isNaN(value)) return 0;
  return Math.max(0, value);
}
