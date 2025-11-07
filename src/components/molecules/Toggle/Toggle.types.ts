/**
 * Toggle Component Types (Molecule)
 * God-Tier Development Protocol 2025
 */

import type { AtomParameters } from '@/types/parameters';

/**
 * Toggle size variants
 */
export type ToggleSize = 'sm' | 'md' | 'lg';

/**
 * Toggle Props
 *
 * @example Basic usage
 * ```tsx
 * <Toggle checked={isEnabled} onChange={setIsEnabled} />
 * ```
 *
 * @example With label
 * ```tsx
 * <Toggle
 *   checked={notifications}
 *   onChange={setNotifications}
 *   label="Enable notifications"
 * />
 * ```
 *
 * @example Disabled
 * ```tsx
 * <Toggle checked={true} disabled label="Read-only setting" />
 * ```
 *
 * @example With Context API
 * ```tsx
 * <AtomProvider value={{ size: 'lg' }}>
 *   <Toggle checked={darkMode} onChange={setDarkMode} />
 * </AtomProvider>
 * ```
 */
export interface ToggleProps extends Partial<AtomParameters> {
  /**
   * Whether the toggle is checked (on)
   * @default false
   */
  checked?: boolean;

  /**
   * Callback when toggle state changes
   * Receives the new checked state
   */
  onChange?: (checked: boolean) => void;

  /**
   * Whether the toggle is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Label text to display next to toggle
   * If provided, renders as a clickable label
   */
  label?: string;

  /**
   * Position of the label relative to toggle
   * @default 'right'
   */
  labelPosition?: 'left' | 'right';

  /**
   * Size of the toggle switch
   * @default 'md'
   */
  size?: ToggleSize;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Accessible label for screen readers
   * If not provided, uses 'label' prop or defaults to 'Toggle'
   */
  'aria-label'?: string;

  /**
   * ID of element that describes this toggle
   */
  'aria-describedby'?: string;

  /**
   * Test ID for testing
   * @default 'toggle'
   */
  'data-testid'?: string;

  /**
   * HTML ID attribute
   * If not provided, auto-generates unique ID
   */
  id?: string;

  /**
   * HTML name attribute (for form integration)
   */
  name?: string;
}

/**
 * Toggle component that supports Context API parameter inheritance
 */
export type ToggleComponent = React.FC<ToggleProps>;
