/**
 * HTML Component - God-Tier 2025
 */
'use client';

import React from 'react';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import styles from './HTML.module.css';

export interface HTMLProps {
  content: string;
  sanitize?: boolean;
  className?: string;
  'data-testid'?: string;
}

export const HTML: React.FC<HTMLProps> = (props) => {
  const contextParams = useAtomContext();
  const params = mergeParameters(contextParams, props) as HTMLProps;

  const {
    content,
    sanitize = true,
    className = '',
    'data-testid': testId = 'html',
  } = params;

  const sanitized = sanitize
    ? content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    : content;

  const classes = [styles.html, className].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      dangerouslySetInnerHTML={{ __html: sanitized }}
      data-testid={testId}
    />
  );
};

HTML.displayName = 'HTML';

export default HTML;
