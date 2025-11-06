// ═══════════════════════════════════════════════════════════════
// VIDEO COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M3: Extended Component Library
// Purpose: Video player with YouTube/Vimeo/HTML5 support
// Features:
// - YouTube & Vimeo embed support
// - HTML5 video player
// - Controls, autoplay, loop, muted options
// - Custom thumbnail support
// - Aspect ratio control
// - WCAG AA accessibility (captions support)
// ═══════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { mergeAllStyles, buildClassNameFromProps } from '@/lib/utils/apply-custom-props';
import { Play } from 'lucide-react';

interface VideoComponentProps {
  component: CanvasComponent;
}

export function VideoComponent({ component }: VideoComponentProps) {
  const { style, props } = component;

  // Extract props with defaults
  const url = (props.url as string) || '';
  const provider = (props.provider as 'youtube' | 'vimeo' | 'html5') || 'youtube';
  const autoPlay = (props.autoPlay as boolean) ?? false;
  const loop = (props.loop as boolean) ?? false;
  const muted = (props.muted as boolean) ?? false;
  const controls = (props.controls as boolean) ?? true;
  const showThumbnail = (props.showThumbnail as boolean) ?? true;
  const thumbnail = props.thumbnail as string | undefined;
  const aspectRatio = (props.aspectRatio as string) || '16:9';
  const showCaptions = (props.showCaptions as boolean) ?? false;

  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Extract video ID from URL
  const getVideoId = (urlStr: string, provider: string): string => {
    if (!urlStr) return '';
    if (provider === 'youtube') {
      const match = urlStr.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      return match ? match[1] : '';
    } else if (provider === 'vimeo') {
      const match = urlStr.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : '';
    }
    return urlStr;
  };

  const videoId = getVideoId(url, provider);

  // Aspect ratio classes
  const aspectRatioClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '21:9': 'aspect-[21/9]',
  };

  // Build embed URL
  const getEmbedUrl = (): string => {
    if (provider === 'youtube') {
      const params = new URLSearchParams({
        autoplay: autoPlay ? '1' : '0',
        loop: loop ? '1' : '0',
        muted: muted ? '1' : '0',
        controls: controls ? '1' : '0',
        cc_load_policy: showCaptions ? '1' : '0',
      });
      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    } else if (provider === 'vimeo') {
      const params = new URLSearchParams({
        autoplay: autoPlay ? '1' : '0',
        loop: loop ? '1' : '0',
        muted: muted ? '1' : '0',
        controls: controls ? '1' : '0',
      });
      return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
    }
    return url;
  };

  // Build className
  const baseClassName = `relative ${aspectRatioClasses[aspectRatio as keyof typeof aspectRatioClasses] || 'aspect-video'} overflow-hidden bg-gray-900 rounded-lg`;
  const wrapperClassName = mergeClassNameWithSpacing(
    buildClassNameFromProps(props, baseClassName),
    style
  );

  // Merge styles
  const finalStyle = mergeAllStyles(style as React.CSSProperties, props);

  // Thumbnail view
  if (showThumbnail && !isPlaying && thumbnail) {
    return (
      <div
        id={props.id as string | undefined}
        className={wrapperClassName}
        style={finalStyle}
      >
        <img
          src={thumbnail || ''}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
          aria-label="Play video"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-gray-900 ml-1" />
          </div>
        </button>
      </div>
    );
  }

  // HTML5 video player
  if (provider === 'html5') {
    return (
      <div
        id={props.id as string | undefined}
        className={wrapperClassName}
        style={finalStyle}
      >
        <video
          src={url || ''}
          controls={controls}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          className="w-full h-full"
          aria-label="Video player"
        >
          {showCaptions && (
            <track kind="captions" srcLang="en" label="English captions" />
          )}
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Embedded iframe (YouTube/Vimeo)
  return (
    <div
      id={props.id as string | undefined}
      className={wrapperClassName}
      style={finalStyle}
    >
      <iframe
        src={getEmbedUrl()}
        title="Video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}
