/**
 * SoundCloud Component Types
 * God-Tier Development Protocol 2025
 */

import type { CSSProperties } from 'react';
import type { AtomParameters } from '@/context/parameters/ParameterContext';

/**
 * SoundCloud embed types
 */
export type SoundCloudType = 'track' | 'playlist' | 'user';

/**
 * SoundCloud Component Props
 *
 * Embeds a SoundCloud player for tracks, playlists, or user profiles.
 *
 * @interface SoundCloudProps
 * @extends {AtomParameters}
 */
export interface SoundCloudProps extends AtomParameters {
  /**
   * SoundCloud URL (track, playlist, or user URL)
   * @example 'https://soundcloud.com/artist/track-name'
   */
  url: string;

  /**
   * Embed type
   * @default 'track'
   */
  type?: SoundCloudType;

  /**
   * Auto-play track on load
   * @default false
   */
  autoPlay?: boolean;

  /**
   * Hide related tracks
   * @default true
   */
  hideRelated?: boolean;

  /**
   * Show comments
   * @default false
   */
  showComments?: boolean;

  /**
   * Show user info
   * @default true
   */
  showUser?: boolean;

  /**
   * Show artwork
   * @default true
   */
  showArtwork?: boolean;

  /**
   * Player color (hex without #)
   * @default 'ff5500'
   */
  color?: string;

  /**
   * Player height (in pixels)
   * @default 166 for track, 450 for playlist
   */
  height?: number;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Test ID for testing
   * @default 'soundcloud'
   */
  'data-testid'?: string;

  /**
   * ARIA label
   */
  'aria-label'?: string;
}
