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

/**
 * Clamps opacity value to 0-100 range
 *
 * @param value - Opacity value (0-100)
 * @returns Clamped opacity value
 *
 * @example
 * ```typescript
 * sanitizeOpacity(50)   // 50
 * sanitizeOpacity(-10)  // 0
 * sanitizeOpacity(150)  // 100
 * ```
 */
export function sanitizeOpacity(value: number | undefined): number {
  if (value === undefined || value === null) return 100;
  if (typeof value !== 'number') return 100;
  if (Number.isNaN(value)) return 100;
  return Math.max(0, Math.min(100, value));
}

/**
 * Shadow preset configurations (Tailwind-inspired, modern 2025)
 */
export const SHADOW_PRESETS = {
  none: '0 0 0 0 rgba(0, 0, 0, 0)',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

/**
 * Generates box-shadow CSS value from parameters
 *
 * @param preset - Shadow preset or 'custom'
 * @param params - Custom shadow parameters (for preset='custom')
 * @param opacity - Shadow opacity override (0-100%)
 * @returns box-shadow CSS value
 */
export function generateShadow(
  preset: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'custom' = 'none',
  params?: {
    offsetX?: number;
    offsetY?: number;
    blur?: number;
    spread?: number;
    color?: string;
  },
  opacity?: number
): string {
  // No shadow
  if (preset === 'none') return 'none';

  // Custom shadow
  if (preset === 'custom' && params) {
    const x = params.offsetX ?? 0;
    const y = params.offsetY ?? 4;
    const blur = params.blur ?? 6;
    const spread = params.spread ?? 0;
    const color = params.color && isValidCSSColor(params.color) ? params.color : 'rgba(0, 0, 0, 0.1)';

    // Apply opacity if provided
    const finalOpacity = opacity !== undefined ? sanitizeOpacity(opacity) / 100 : 1;

    // Convert color to rgba with opacity
    let finalColor = color;
    if (color.startsWith('#')) {
      // Convert hex to rgba
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      finalColor = `rgba(${r}, ${g}, ${b}, ${finalOpacity})`;
    } else if (color.startsWith('rgb')) {
      // Modify existing rgb/rgba
      finalColor = color.replace(/rgba?\(([^)]+)\)/, (match, values) => {
        const parts = values.split(',').map((v: string) => v.trim());
        return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${finalOpacity})`;
      });
    }

    return `${x}px ${y}px ${blur}px ${spread}px ${finalColor}`;
  }

  // Preset shadow with optional opacity override
  let shadowValue = SHADOW_PRESETS[preset as keyof typeof SHADOW_PRESETS];

  if (opacity !== undefined && opacity !== 100) {
    const finalOpacity = sanitizeOpacity(opacity) / 100;
    // Adjust opacity in preset shadow
    shadowValue = shadowValue.replace(/rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/g, (match, r, g, b) => {
      return `rgba(${r},${g},${b},${finalOpacity})`;
    });
  }

  return shadowValue;
}
