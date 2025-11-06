/**
 * Parameter Utility Types
 * God-Tier Development Protocol 2025
 *
 * Shared utility types for parameter inheritance system
 */

/**
 * Responsive value that can be a single value or breakpoint-specific values
 *
 * @example
 * // Single value
 * const fontSize: ResponsiveValue<number> = 16;
 *
 * // Responsive values
 * const fontSize: ResponsiveValue<number> = {
 *   mobile: 14,
 *   tablet: 16,
 *   desktop: 18
 * };
 */
export type ResponsiveValue<T> =
  | T
  | {
      mobile?: T;
      tablet?: T;
      desktop?: T;
    };

/**
 * Spacing value with unit
 *
 * @example
 * const padding: SpacingValue = { value: 16, unit: 'px' };
 * const margin: SpacingValue = { value: 2, unit: 'rem', preset: 'md' };
 */
export type SpacingValue = {
  value: number;
  unit: 'px' | 'rem' | 'em' | '%' | 'vw' | 'vh';
  preset?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};

/**
 * Responsive spacing for all sides of a box
 *
 * @example
 * // All sides
 * const padding: ResponsiveSpacing = { all: { value: 16, unit: 'px' } };
 *
 * // Individual sides
 * const margin: ResponsiveSpacing = {
 *   top: { value: 8, unit: 'px' },
 *   bottom: { value: 16, unit: 'px' }
 * };
 *
 * // Responsive
 * const padding: ResponsiveSpacing = {
 *   all: {
 *     mobile: { value: 8, unit: 'px' },
 *     desktop: { value: 16, unit: 'px' }
 *   }
 * };
 */
export type ResponsiveSpacing = {
  top?: ResponsiveValue<SpacingValue>;
  right?: ResponsiveValue<SpacingValue>;
  bottom?: ResponsiveValue<SpacingValue>;
  left?: ResponsiveValue<SpacingValue>;
  all?: ResponsiveValue<SpacingValue>;
  x?: ResponsiveValue<SpacingValue>; // Horizontal (left + right)
  y?: ResponsiveValue<SpacingValue>; // Vertical (top + bottom)
};

/**
 * Size preset values
 */
export type SizePreset = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Border style values
 */
export type BorderStyle =
  | 'none'
  | 'solid'
  | 'dashed'
  | 'dotted'
  | 'double'
  | 'groove'
  | 'ridge'
  | 'inset'
  | 'outset';

/**
 * Border radius preset
 */
export type BorderRadiusPreset = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Animation type
 */
export type AnimationType = 'fade' | 'slide' | 'zoom' | 'bounce' | 'none';

/**
 * Transition configuration
 *
 * @example
 * const transition: TransitionConfig = {
 *   duration: 300,
 *   delay: 0,
 *   easing: 'ease-in-out'
 * };
 */
export type TransitionConfig = {
  duration?: number; // milliseconds
  delay?: number; // milliseconds
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | string;
};

/**
 * Hover effect type
 */
export type HoverEffect = 'scale' | 'lift' | 'glow' | 'none';

/**
 * Text alignment
 */
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

/**
 * Vertical alignment
 */
export type VerticalAlign = 'top' | 'middle' | 'bottom' | 'baseline';

/**
 * Display type
 */
export type Display =
  | 'block'
  | 'inline-block'
  | 'inline'
  | 'flex'
  | 'inline-flex'
  | 'grid'
  | 'inline-grid'
  | 'none';

/**
 * Position type
 */
export type Position = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';

/**
 * Flex direction
 */
export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

/**
 * Flex justify content
 */
export type JustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

/**
 * Flex align items
 */
export type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

/**
 * Flex wrap
 */
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

/**
 * Color value (hex, rgb, rgba, hsl, hsla, named)
 *
 * @example
 * const color: ColorValue = '#FF0000';
 * const color: ColorValue = 'rgb(255, 0, 0)';
 * const color: ColorValue = 'rgba(255, 0, 0, 0.5)';
 * const color: ColorValue = 'hsl(0, 100%, 50%)';
 * const color: ColorValue = 'red';
 */
export type ColorValue = string;

/**
 * Font weight
 */
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/**
 * Font style
 */
export type FontStyle = 'normal' | 'italic' | 'oblique';

/**
 * Text transform
 */
export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

/**
 * Text decoration line
 */
export type TextDecorationLine = 'none' | 'underline' | 'overline' | 'line-through';

/**
 * Text decoration style
 */
export type TextDecorationStyle = 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy';

/**
 * Link target
 */
export type LinkTarget = '_blank' | '_self' | '_parent' | '_top';

/**
 * Breakpoint configuration
 */
export type Breakpoint = {
  mobile: number; // pixels
  tablet: number;
  desktop: number;
};

/**
 * Default breakpoints (2025 standards)
 */
export const DEFAULT_BREAKPOINTS: Breakpoint = {
  mobile: 640, // 0-640px
  tablet: 1024, // 641-1024px
  desktop: 1280, // 1025px+
};

/**
 * Visibility configuration per breakpoint
 *
 * @example
 * // Hide on mobile
 * const visibility: VisibilityConfig = { mobile: false };
 *
 * // Show only on desktop
 * const visibility: VisibilityConfig = {
 *   mobile: false,
 *   tablet: false,
 *   desktop: true
 * };
 */
export type VisibilityConfig = {
  mobile?: boolean;
  tablet?: boolean;
  desktop?: boolean;
};

/**
 * Background type
 */
export type BackgroundType = 'color' | 'gradient' | 'image' | 'video' | 'pattern';

/**
 * Background size
 */
export type BackgroundSize = 'auto' | 'cover' | 'contain' | string;

/**
 * Background repeat
 */
export type BackgroundRepeat =
  | 'no-repeat'
  | 'repeat'
  | 'repeat-x'
  | 'repeat-y'
  | 'space'
  | 'round';

/**
 * Background attachment
 */
export type BackgroundAttachment = 'scroll' | 'fixed' | 'local';

/**
 * Gradient type
 */
export type GradientType = 'linear' | 'radial' | 'conic';

/**
 * Gradient stop
 */
export type GradientStop = {
  color: ColorValue;
  position: number; // 0-100%
};

/**
 * Shadow configuration
 */
export type ShadowConfig = {
  inset?: boolean;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread?: number;
  color: ColorValue;
  opacity?: number;
};

/**
 * Shadow preset
 */
export type ShadowPreset = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'custom';

/**
 * Validation rule
 */
export type ValidationRule = {
  required?: boolean;
  pattern?: RegExp | string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (value: any) => boolean | string;
};

/**
 * Validation rules map
 */
export type ValidationRules = Record<string, ValidationRule>;

/**
 * Form field error
 */
export type FieldError = {
  field: string;
  message: string;
};

/**
 * Image format
 */
export type ImageFormat = 'webp' | 'avif' | 'jpg' | 'png' | 'svg';

/**
 * Icon type
 */
export type IconType = 'solid' | 'outline' | 'duotone' | 'custom';

/**
 * Component variant (common pattern)
 */
export type ComponentVariant = 'default' | 'outlined' | 'filled' | 'ghost' | 'text';

/**
 * Button variant
 */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'ghost';

/**
 * Alert variant
 */
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

/**
 * Loading state
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Orientation
 */
export type Orientation = 'horizontal' | 'vertical';

/**
 * Direction
 */
export type Direction = 'ltr' | 'rtl';

/**
 * Z-index layer
 */
export type ZIndexLayer =
  | 'base'
  | 'dropdown'
  | 'sticky'
  | 'fixed'
  | 'modal-backdrop'
  | 'modal'
  | 'popover'
  | 'tooltip';

/**
 * Default z-index values
 */
export const DEFAULT_Z_INDEX: Record<ZIndexLayer, number> = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  'modal-backdrop': 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

/**
 * Helper function to resolve responsive value
 *
 * @param value - Responsive value
 * @param breakpoint - Current breakpoint
 * @returns Resolved value for the breakpoint
 *
 * @example
 * const fontSize = { mobile: 14, desktop: 18 };
 * resolveResponsive(fontSize, 'mobile'); // 14
 * resolveResponsive(fontSize, 'desktop'); // 18
 * resolveResponsive(16, 'mobile'); // 16
 */
export function resolveResponsive<T>(
  value: ResponsiveValue<T>,
  breakpoint: 'mobile' | 'tablet' | 'desktop'
): T {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return (value as any)[breakpoint] ?? (value as any).mobile ?? (value as any);
  }
  return value as T;
}

/**
 * Helper function to convert spacing value to CSS string
 *
 * @param value - Spacing value
 * @returns CSS string
 *
 * @example
 * spacingToCss({ value: 16, unit: 'px' }); // '16px'
 * spacingToCss({ value: 2, unit: 'rem' }); // '2rem'
 */
export function spacingToCss(value: SpacingValue): string {
  return `${value.value}${value.unit}`;
}

/**
 * Helper function to convert shadow config to CSS string
 *
 * @param shadow - Shadow configuration
 * @returns CSS box-shadow string
 *
 * @example
 * shadowToCss({
 *   offsetX: 0,
 *   offsetY: 4,
 *   blur: 6,
 *   spread: 0,
 *   color: '#000',
 *   opacity: 0.1
 * });
 * // '0px 4px 6px 0px rgba(0, 0, 0, 0.1)'
 */
export function shadowToCss(shadow: ShadowConfig): string {
  const { inset, offsetX, offsetY, blur, spread = 0, color, opacity = 1 } = shadow;

  // Convert color to rgba if opacity < 1
  let shadowColor = color;
  if (opacity < 1) {
    // Simple rgba conversion (assumes hex or rgb)
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      shadowColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    } else if (color.startsWith('rgb')) {
      shadowColor = color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
    }
  }

  const parts = [
    inset ? 'inset' : '',
    `${offsetX}px`,
    `${offsetY}px`,
    `${blur}px`,
    `${spread}px`,
    shadowColor,
  ].filter(Boolean);

  return parts.join(' ');
}

/**
 * Type guard to check if value is responsive
 *
 * @param value - Value to check
 * @returns True if value is responsive object
 *
 * @example
 * isResponsive({ mobile: 14, desktop: 18 }); // true
 * isResponsive(16); // false
 */
export function isResponsive<T>(value: ResponsiveValue<T>): value is Exclude<ResponsiveValue<T>, T> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
