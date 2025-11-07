/**
 * Submit Component - Specialized button for forms
 */
'use client';

import React from 'react';

export interface SubmitProps {
  value?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  'data-testid'?: string;
}

export const Submit: React.FC<SubmitProps> = ({
  value = 'Submit',
  disabled = false,
  loading = false,
  className = '',
  'data-testid': testId = 'submit',
}) => {
  const classes = [
    'px-6 py-2 rounded-md font-medium transition-colors',
    'bg-blue-600 text-white hover:bg-blue-700',
    'focus:outline-none focus:ring-2 focus:ring-blue-500',
    (disabled || loading) && 'opacity-50 cursor-not-allowed',
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
