/**
 * Video Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Video player (YouTube/Vimeo/HTML5)
 *
 * @composition Image (thumbnail) + Button (play)
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import type { VideoProps } from './Video.types';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import styles from './Video.module.css';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';

export const Video: React.FC<VideoProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as VideoProps;

  // Destructure with defaults
  const {
    data,
    className = '',
    'data-testid': testId = 'video',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const classes = [
    styles['video'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <div
      className={classes}
      style={style as React.CSSProperties}
      data-testid={testId}
      {...validDOMProps}
    >
      <h2>Video Component</h2>
      <p>Video player (YouTube/Vimeo/HTML5)</p>
      {/* TODO: Implement component logic */}
    </div>
  );
};

// Display name for React DevTools
Video.displayName = 'Video';

// Default export for convenience
export default Video;
