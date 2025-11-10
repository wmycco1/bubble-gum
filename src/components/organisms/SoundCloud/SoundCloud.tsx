/**
 * SoundCloud Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Embeds a SoundCloud player for tracks, playlists, or user profiles.
 *
 * @example Track embed
 * ```tsx
 * <SoundCloud
 *   url="https://soundcloud.com/artist/track-name"
 *   autoPlay={false}
 * />
 * ```
 *
 * @example Playlist embed
 * ```tsx
 * <SoundCloud
 *   type="playlist"
 *   url="https://soundcloud.com/artist/sets/playlist-name"
 *   height={450}
 *   color="00aabb"
 * />
 * ```
 *
 * @example Custom styling
 * ```tsx
 * <SoundCloud
 *   url="https://soundcloud.com/artist/track"
 *   showComments={true}
 *   showUser={true}
 *   hideRelated={false}
 * />
 * ```
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import type { SoundCloudProps } from './SoundCloud.types';
import styles from './SoundCloud.module.css';

export const SoundCloud: React.FC<SoundCloudProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as SoundCloudProps;

  // Destructure with defaults
  const {
    url,
    type = 'track',
    autoPlay = false,
    hideRelated = true,
    showComments = false,
    showUser = true,
    showArtwork = true,
    color = 'ff5500',
    height,
    className = '',
    style,
    'data-testid': testId = 'soundcloud',
    'aria-label': ariaLabel,
    ...rest
  } = params;

  // Error icon constant
  const ERROR_ICON = String.fromCodePoint(0x1F50A); // 🔊 speaker emoji

  // Validate URL
  if (!url || !url.includes('soundcloud.com')) {
    return (
      <div className={styles['soundcloud__error']} data-testid={`${testId}-error`}>
        <div className={styles['soundcloud__error-icon']}>{ERROR_ICON}</div>
        <div className={styles['soundcloud__error-title']}>Invalid SoundCloud URL</div>
        <div className={styles['soundcloud__error-message']}>
          {url ? 'Please provide a valid SoundCloud URL' : 'No URL provided'}
        </div>
      </div>
    );
  }

  // Default heights based on type
  const defaultHeight = type === 'playlist' ? 450 : 166;
  const embedHeight = height || defaultHeight;

  // Build SoundCloud embed URL
  const embedUrl = new URL('https://w.soundcloud.com/player/');
  embedUrl.searchParams.set('url', url);
  embedUrl.searchParams.set('color', color);
  embedUrl.searchParams.set('auto_play', String(autoPlay));
  embedUrl.searchParams.set('hide_related', String(hideRelated));
  embedUrl.searchParams.set('show_comments', String(showComments));
  embedUrl.searchParams.set('show_user', String(showUser));
  embedUrl.searchParams.set('show_reposts', 'false');
  embedUrl.searchParams.set('show_teaser', 'false');
  embedUrl.searchParams.set('visual', String(showArtwork));

  // Compute CSS classes
  const wrapperClasses = [styles['soundcloud'], className].filter(Boolean).join(' ');

  // Filter out invalid DOM props
  const validDOMProps = getValidDOMProps(rest);

  return (
    <div
      className={wrapperClasses}
      style={style}
      data-testid={testId}
      {...validDOMProps}
    >
      <iframe
        className={styles['soundcloud__iframe']}
        width="100%"
        height={embedHeight}
        allow="autoplay"
        src={embedUrl.toString()}
        title={ariaLabel || 'SoundCloud Player'}
        aria-label={ariaLabel || 'SoundCloud embedded player'}
        style={{ border: 'none', overflow: 'hidden' }}
      />
    </div>
  );
};

// Display name for React DevTools
SoundCloud.displayName = 'SoundCloud';

// Default export for convenience
export default SoundCloud;
