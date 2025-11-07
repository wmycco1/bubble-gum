/**
 * Textarea Types - God-Tier 2025
 */
import type { ChangeEvent } from 'react';

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  size?: TextareaSize;
  error?: string;
  helperText?: string;
  name?: string;
  id?: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  'aria-label'?: string;
  'data-testid'?: string;
  className?: string;
}
