/**
 * Atom Parameters
 * God-Tier Development Protocol 2025
 *
 * Atom components: Button, Input, Icon, Text, Image, etc.
 * Responsible for: Basic UI elements, minimal props, single purpose
 */

import { BaseParameters } from './base';
import {
  ResponsiveValue,
  ColorValue,
  FontWeight,
  TextAlign,
  TextTransform,
  ButtonVariant,
  SizePreset,
  IconType,
  ImageFormat,
} from './utils';

/**
 * AtomParameters
 *
 * Atom-level components are simple, indivisible UI elements.
 * They have minimal props and single, focused purposes.
 *
 * @example
 * <Button
 *   text="Click me"
 *   variant="primary"
 *   size="md"
 *   onClick={handleClick}
 * />
 */
export interface AtomParameters extends BaseParameters {
  // ============================================
  // TYPOGRAPHY (for text-based atoms)
  // ============================================

  /**
   * Text content
   */
  text?: string;

  /**
   * Font size
   */
  fontSize?: ResponsiveValue<number | string>;

  /**
   * Font weight
   */
  fontWeight?: FontWeight;

  /**
   * Text color
   */
  color?: ColorValue;

  /**
   * Text alignment
   */
  textAlign?: TextAlign;

  /**
   * Text transform
   */
  textTransform?: TextTransform;

  /**
   * Line height
   */
  lineHeight?: ResponsiveValue<number | string>;

  // ============================================
  // COLORS (minimal)
  // ============================================

  /**
   * Background color
   */
  backgroundColor?: ColorValue;

  /**
   * Border color
   */
  borderColor?: ColorValue;

  /**
   * Button color (for button atoms)
   */
  buttonColor?: ColorValue;

  /**
   * Divider color (for divider atoms)
   */
  dividerColor?: ColorValue;

  /**
   * Icon color (for icon atoms)
   */
  iconColor?: ColorValue;

  // ============================================
  // FORMS & VALIDATION (for input atoms)
  // ============================================

  /**
   * Input value
   */
  value?: string | number | boolean;

  /**
   * Value change handler
   */
  onChange?: (value: any) => void;

  /**
   * Input type
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'checkbox' | 'radio';

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Required field
   */
  required?: boolean;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Read-only state
   */
  readOnly?: boolean;

  /**
   * Autocomplete attribute
   */
  autoComplete?: string;

  /**
   * Autofocus on mount
   */
  autoFocus?: boolean;

  /**
   * Input name (for forms)
   */
  name?: string;

  /**
   * Min value (for number inputs)
   */
  min?: number;

  /**
   * Max value (for number inputs)
   */
  max?: number;

  /**
   * Step value (for number inputs)
   */
  step?: number;

  /**
   * Min length (for text inputs)
   */
  minLength?: number;

  /**
   * Max length (for text inputs)
   */
  maxLength?: number;

  /**
   * Pattern regex (for validation)
   */
  pattern?: string;

  /**
   * Checked state (for checkbox/radio)
   */
  checked?: boolean;

  /**
   * Default value
   */
  defaultValue?: string | number | boolean;

  /**
   * Error state
   */
  error?: boolean;

  /**
   * Error message
   */
  errorMessage?: string;

  /**
   * Helper text (below input)
   */
  helperText?: string;

  // ============================================
  // INTERACTIONS (basic)
  // ============================================

  /**
   * Click handler (already in BaseParameters, but commonly used)
   */
  onClick?: (e: React.MouseEvent) => void;

  /**
   * Focus handler
   */
  onFocus?: (e: React.FocusEvent) => void;

  /**
   * Blur handler
   */
  onBlur?: (e: React.FocusEvent) => void;

  /**
   * Input handler (for text inputs)
   */
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;

  /**
   * Key down handler
   */
  onKeyDown?: (e: React.KeyboardEvent) => void;

  /**
   * Key up handler
   */
  onKeyUp?: (e: React.KeyboardEvent) => void;

  /**
   * Submit handler (for submit buttons)
   */
  onSubmit?: (e: React.FormEvent) => void;

  /**
   * Hover state
   */
  hover?: boolean;

  /**
   * Active state
   */
  active?: boolean;

  /**
   * Focus state
   */
  focused?: boolean;

  /**
   * Loading state
   */
  loading?: boolean;

  // ============================================
  // SIZE & DIMENSIONS
  // ============================================

  /**
   * Size preset
   */
  size?: SizePreset;

  /**
   * Width
   */
  width?: ResponsiveValue<string | number>;

  /**
   * Height
   */
  height?: ResponsiveValue<string | number>;

  /**
   * Min width
   */
  minWidth?: ResponsiveValue<string | number>;

  /**
   * Max width
   */
  maxWidth?: ResponsiveValue<string | number>;

  /**
   * Full width (100%)
   */
  fullWidth?: boolean;

  // ============================================
  // BUTTON-SPECIFIC
  // ============================================

  /**
   * Button variant
   */
  variant?: ButtonVariant | string;

  /**
   * Button type
   */
  buttonType?: 'button' | 'submit' | 'reset';

  /**
   * Left icon (for button)
   */
  leftIcon?: string;

  /**
   * Right icon (for button)
   */
  rightIcon?: string;

  /**
   * Icon only (no text)
   */
  iconOnly?: boolean;

  // ============================================
  // ICON-SPECIFIC
  // ============================================

  /**
   * Icon name/identifier
   */
  icon?: string;

  /**
   * Icon type
   */
  iconType?: IconType;

  /**
   * Icon name (alternative to icon)
   */
  iconName?: string;

  /**
   * Icon size
   */
  iconSize?: number | string;

  /**
   * Icon rotation (degrees)
   */
  iconRotation?: number;

  /**
   * Icon flip
   */
  iconFlip?: 'horizontal' | 'vertical' | 'both';

  // ============================================
  // IMAGE-SPECIFIC
  // ============================================

  /**
   * Image source URL
   */
  src?: string;

  /**
   * Image alt text (REQUIRED for accessibility)
   */
  alt?: string;

  /**
   * Image loading strategy
   */
  loading?: 'lazy' | 'eager';

  /**
   * Image format
   */
  format?: ImageFormat;

  /**
   * Image object fit
   */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

  /**
   * Image object position
   */
  objectPosition?: string;

  /**
   * Image aspect ratio
   */
  aspectRatio?: string;

  /**
   * Image width (for optimization)
   */
  imageWidth?: number;

  /**
   * Image height (for optimization)
   */
  imageHeight?: number;

  /**
   * Blur placeholder
   */
  blurDataURL?: string;

  /**
   * Priority loading (for LCP images)
   */
  priority?: boolean;

  // ============================================
  // VIDEO-SPECIFIC
  // ============================================

  /**
   * Video source URL
   */
  videoSrc?: string;

  /**
   * Video autoplay
   */
  autoplay?: boolean;

  /**
   * Video loop
   */
  loop?: boolean;

  /**
   * Video muted
   */
  muted?: boolean;

  /**
   * Video controls
   */
  controls?: boolean;

  /**
   * Video poster image
   */
  poster?: string;

  /**
   * Video playback speed
   */
  playbackRate?: number;

  // ============================================
  // LINK-SPECIFIC
  // ============================================

  /**
   * Link URL
   */
  href?: string;

  /**
   * Link target
   */
  target?: '_blank' | '_self' | '_parent' | '_top';

  /**
   * Link rel attribute
   */
  rel?: string;

  /**
   * Link download attribute
   */
  download?: boolean | string;

  /**
   * External link (adds icon/indicator)
   */
  external?: boolean;

  // ============================================
  // DIVIDER-SPECIFIC
  // ============================================

  /**
   * Divider orientation
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Divider thickness
   */
  thickness?: number;

  /**
   * Divider style
   */
  dividerStyle?: 'solid' | 'dashed' | 'dotted';

  /**
   * Divider margin
   */
  margin?: ResponsiveValue<{ value: number; unit: string }>;

  // ============================================
  // SPACER-SPECIFIC
  // ============================================

  /**
   * Spacer height (for vertical spacing)
   */
  spacerHeight?: ResponsiveValue<number | string>;

  /**
   * Spacer width (for horizontal spacing)
   */
  spacerWidth?: ResponsiveValue<number | string>;

  // ============================================
  // BADGE-SPECIFIC
  // ============================================

  /**
   * Badge variant
   */
  badgeVariant?: 'solid' | 'outline' | 'subtle';

  /**
   * Badge color scheme
   */
  colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

  /**
   * Badge dot indicator
   */
  dot?: boolean;

  /**
   * Badge pulse animation
   */
  pulse?: boolean;

  // ============================================
  // HEADING-SPECIFIC
  // ============================================

  /**
   * Heading level (h1-h6)
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * Heading as (render as different element but style as heading)
   */
  headingAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

  // ============================================
  // TEXTAREA-SPECIFIC
  // ============================================

  /**
   * Textarea rows
   */
  rows?: number;

  /**
   * Textarea columns
   */
  cols?: number;

  /**
   * Textarea resize behavior
   */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';

  /**
   * Auto-resize to fit content
   */
  autoResize?: boolean;

  // ============================================
  // CHECKBOX/RADIO-SPECIFIC
  // ============================================

  /**
   * Label text (for checkbox/radio)
   */
  label?: string;

  /**
   * Label position
   */
  labelPosition?: 'left' | 'right';

  /**
   * Indeterminate state (checkbox)
   */
  indeterminate?: boolean;
}

/**
 * Button-specific parameters (extends AtomParameters)
 */
export interface ButtonParameters extends AtomParameters {
  text: string; // REQUIRED for buttons
  onClick?: (e: React.MouseEvent) => void;
  variant?: ButtonVariant;
}

/**
 * Input-specific parameters (extends AtomParameters)
 */
export interface InputParameters extends AtomParameters {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
}

/**
 * Icon-specific parameters (extends AtomParameters)
 */
export interface IconParameters extends AtomParameters {
  icon: string; // REQUIRED for icons
  iconType?: IconType;
  iconSize?: number | string;
}

/**
 * Image-specific parameters (extends AtomParameters)
 */
export interface ImageParameters extends AtomParameters {
  src: string; // REQUIRED for images
  alt: string; // REQUIRED for accessibility
  loading?: 'lazy' | 'eager';
}

/**
 * Link-specific parameters (extends AtomParameters)
 */
export interface LinkParameters extends AtomParameters {
  href: string; // REQUIRED for links
  target?: '_blank' | '_self' | '_parent' | '_top';
  children: React.ReactNode; // REQUIRED for link content
}
