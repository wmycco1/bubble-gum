/**
 * Divider Component - God-Tier 2025
 */
'use client';

import React from 'react';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import styles from './Divider.module.css';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: 'thin' | 'medium' | 'thick';
  color?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = (props) => {
  const contextParams = useAtomContext();
  const params = mergeParameters(contextParams, props) as DividerProps;

  const {
    orientation = 'horizontal',
    thickness = 'thin',
    className = '',
  } = params;

  const classes = [
    styles.divider,
    styles[`divider--${orientation}`],
    styles[`divider--${thickness}`],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={classes}
    />
  );
};

Divider.displayName = 'Divider';

export default Divider;
