/**
 * Badge Component - God-Tier 2025
 */
'use client';

import React from 'react';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import styles from './Badge.module.css';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  'data-testid'?: string;
}

export const Badge: React.FC<BadgeProps> = (props) => {
  const contextParams = useAtomContext();
  const params = mergeParameters(contextParams, props) as BadgeProps;

  const {
    children,
    variant = 'default',
    size = 'md',
    className = '',
    'data-testid': testId = 'badge',
  } = params;

  const classes = [
    styles.badge,
    styles[`badge--${variant}`],
    styles[`badge--${size}`],
    className,
  ].filter(Boolean).join(' ');

  return <span className={classes} data-testid={testId}>{children}</span>;
};

Badge.displayName = 'Badge';

export default Badge;
