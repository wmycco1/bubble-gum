/**
 * Button Component Types
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Button component (Atom level)
 */

import type { AtomParameters } from '@/types/parameters';

/**
 * Button visual variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

/**
 * Button sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Button-specific parameters
 * Extends AtomParameters with button-specific props
 *
 * @example
 * ```tsx
 * <Button
 *   text="Click me"
 *   variant="primary"
 *   size="md"
 *   onClick={() => console.log('clicked')}
 * />
 * ```
 */
export interface ButtonProps extends AtomParameters {
  /**
   * Button text (required)
   * Displayed as the main button label
   */
  text: string;

  /**
   * Visual variant
   * Determines the button's appearance and color scheme
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * Controls padding, font size, and overall dimensions
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Disabled state
   * When true, button cannot be clicked and appears grayed out
   * @default false
   */
  disabled?: boolean;

  /**
   * Loading state
   * When true, shows spinner and prevents clicks
   * @default false
   */
  loading?: boolean;

  /**
   * Icon to display before text
   * Can be a string (emoji, character) or React component
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon to display after text
   * Can be a string (emoji, character) or React component
   */
  rightIcon?: React.ReactNode;

  /**
   * Click handler
   * Called when button is clicked (not called when disabled or loading)
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Button HTML type attribute
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Full width button
   * When true, button takes up 100% of container width
   * @default false
   */
  fullWidth?: boolean;
}
