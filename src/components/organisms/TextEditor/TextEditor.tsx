/**
 * TextEditor Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Rich text editor component
 *
 * @composition Textarea + formatting buttons
 */

'use client';

import React from 'react';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import type { TextEditorProps } from './TextEditor.types';
import styles from './TextEditor.module.css';

export const TextEditor: React.FC<TextEditorProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as TextEditorProps;

  // Destructure with defaults
  const {
    data,
    className = '',
    'data-testid': testId = 'text-editor',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles['text-editor'],
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
      <h2>TextEditor Component</h2>
      <p>Rich text editor component</p>
      {/* TODO: Implement component logic */}
    </div>
  );
};

// Display name for React DevTools
TextEditor.displayName = 'TextEditor';

// Default export for convenience
export default TextEditor;
