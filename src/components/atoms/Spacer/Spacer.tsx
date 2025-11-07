/**
 * Spacer Component - God-Tier 2025
 */
'use client';

import React from 'react';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import styles from './Spacer.module.css';

export interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  orientation?: 'horizontal' | 'vertical';
}

export const Spacer: React.FC<SpacerProps> = (props) => {
  const contextParams = useAtomContext();
  const params = mergeParameters(contextParams, props) as SpacerProps;

  const {
    size = 'md',
    orientation = 'vertical',
  } = params;

  const classes = [
    styles.spacer,
    styles[`spacer--${orientation}`],
    styles[`spacer--${size}`],
  ].filter(Boolean).join(' ');

  return <div className={classes} aria-hidden="true" />;
};

Spacer.displayName = 'Spacer';

export default Spacer;
