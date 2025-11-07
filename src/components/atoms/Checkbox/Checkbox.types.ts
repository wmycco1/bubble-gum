/**
 * Checkbox Types - God-Tier 2025
 */
import type { ChangeEvent } from 'react';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  indeterminate?: boolean;
  size?: CheckboxSize;
  label?: string;
  name?: string;
  id?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  'aria-label'?: string;
  'data-testid'?: string;
  className?: string;
}
