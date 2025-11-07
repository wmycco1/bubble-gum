'use client';
import React from 'react';

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
}

export const Video: React.FC<VideoProps> = ({
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
}) => {
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
      className={`rounded-lg ${className}`}
      aria-label={ariaLabel || 'Video player'}
    >
      Your browser does not support the video tag.
    </video>
  );
};
