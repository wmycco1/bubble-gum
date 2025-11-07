/**
 * Submit Component - God-Tier 2025
 */
'use client';

import React from 'react';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import styles from './Submit.module.css';

export interface SubmitProps {
  value?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  'data-testid'?: string;
}

export const Submit: React.FC<SubmitProps> = (props) => {
  const contextParams = useAtomContext();
  const params = mergeParameters(contextParams, props) as SubmitProps;

  const {
    value = 'Submit',
    disabled = false,
    loading = false,
    className = '',
    'data-testid': testId = 'submit',
  } = params;

  const classes = [
    styles.submit,
    loading && styles['submit--loading'],
    className,
  ].filter(Boolean).join(' ');

  return (
    <input
      type="submit"
      value={loading ? 'Submitting...' : value}
      disabled={disabled || loading}
      className={classes}
      data-testid={testId}
    />
  );
};

Submit.displayName = 'Submit';

export default Submit;
