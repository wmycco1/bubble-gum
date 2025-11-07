/**
 * FormBuilder Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Dynamic form builder with drag-drop fields
 *
 * @composition Form organism + field components
 */

'use client';

import React from 'react';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import type { FormBuilderProps } from './FormBuilder.types';
import styles from './FormBuilder.module.css';

export const FormBuilder: React.FC<FormBuilderProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as FormBuilderProps;

  // Destructure with defaults
  const {
    data,
    className = '',
    'data-testid': testId = 'form-builder',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles['form-builder'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={style as React.CSSProperties}
      data-testid={testId}
      {...rest}
    >
      <h2>FormBuilder Component</h2>
      <p>Dynamic form builder with drag-drop fields</p>
      {/* TODO: Implement component logic */}
    </div>
  );
};

// Display name for React DevTools
FormBuilder.displayName = 'FormBuilder';

// Default export for convenience
export default FormBuilder;
