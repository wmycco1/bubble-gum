/**
 * Input Types
 * God-Tier Development Protocol 2025
 *
 * Type-safe props for Input component
 */

import type { ChangeEvent, FocusEvent } from 'react';

/**
 * Supported input types
 */
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local';

/**
 * Input size variants
 */
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * Input validation state
 */
export type InputValidation = 'valid' | 'invalid' | 'warning' | undefined;

/**
 * Input component props
 */
export interface InputProps {
  /** Input type */
  type?: InputType;

  /** Input value (controlled) */
  value?: string | number;

  /** Default value (uncontrolled) */
  defaultValue?: string | number;

  /** Placeholder text */
  placeholder?: string;

  /** Disabled state */
  disabled?: boolean;

  /** Readonly state */
  readOnly?: boolean;

  /** Required field */
  required?: boolean;

  /** Size variant */
  size?: InputSize;

  /** Validation state */
  validation?: InputValidation;

  /** Error message */
  error?: string;

  /** Helper text */
  helperText?: string;

  /** Input name (for forms) */
  name?: string;

  /** Input ID */
  id?: string;

  /** Autocomplete attribute */
  autoComplete?: string;

  /** Autofocus on mount */
  autoFocus?: boolean;

  /** Maximum length */
  maxLength?: number;

  /** Minimum value (for number inputs) */
  min?: number;

  /** Maximum value (for number inputs) */
  max?: number;

  /** Step value (for number inputs) */
  step?: number;

  /** Pattern for validation (regex) */
  pattern?: string;

  /** Change handler */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;

  /** Focus handler */
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;

  /** Blur handler */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;

  /** Accessibility label */
  'aria-label'?: string;

  /** Accessibility described by */
  'aria-describedby'?: string;

  /** Accessibility invalid state */
  'aria-invalid'?: boolean;

  /** Custom class name */
  className?: string;

  /** Test ID */
  'data-testid'?: string;
}
