/**
 * Video Component - God-Tier 2025
 */
'use client';

import React from 'react';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import styles from './Video.module.css';

export interface VideoProps {
  src: string;
  poster?: string;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

export const Video: React.FC<VideoProps> = (props) => {
  const contextParams = useAtomContext();
  const params = mergeParameters(contextParams, props) as VideoProps;

  const {
    src,
    poster,
    controls = true,
    autoplay = false,
    loop = false,
    muted = false,
    width = '100%',
    height = 'auto',
    className = '',
    'aria-label': ariaLabel,
    'data-testid': testId = 'video',
  } = params;

  const classes = [styles.video, className].filter(Boolean).join(' ');

  return (
    <video
      src={src}
      poster={poster}
      controls={controls}
      autoPlay={autoplay}
      loop={loop}
      muted={muted}
      width={width}
      height={height}
      className={classes}
      aria-label={ariaLabel || 'Video player'}
      data-testid={testId}
    >
      Your browser does not support the video tag.
    </video>
  );
};

Video.displayName = 'Video';

export default Video;
