/**
 * Image Component (Atom)
 * God-Tier Development Protocol 2025
 *
 * Optimized image component with Context API support.
 * Uses AtomParameters for styling and behavior through Context API.
 *
 * @example Basic
 * ```tsx
 * <Image src="/photo.jpg" alt="Description" />
 * <Image src="/photo.jpg" alt="Photo" size="md" rounded />
 * ```
 *
 * @example With Context API
 * ```tsx
 * <AtomProvider value={{ size: 'lg' }}>
 *   <Image src="/photo.jpg" alt="Large photo" />
 * </AtomProvider>
 * ```
 *
 * @example With aspect ratio
 * ```tsx
 * <Image
 *   src="/photo.jpg"
 *   alt="Photo"
 *   aspectRatio="16/9"
 *   fit="cover"
 * />
 * ```
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import type { ImageProps } from './Image.types';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import styles from './Image.module.css';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';

export const Image: React.FC<ImageProps> = (props) => {
  // Get inherited parameters from Atom context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as ImageProps;

  // Destructure with defaults
  const {
    src,
    alt,
    size = 'full',
    fit = 'cover',
    aspectRatio,
    rounded = false,
    loading = 'lazy',
    className = '',
    'data-testid': testId = 'image',
    priority, // Extract but don't use (Next.js specific, not for native <img>)
    ...rest
  } = params;

  // Compute CSS classes (using CSS modules)
  const containerClasses = [
    styles['image-container'],
    size !== 'full' && styles[`image-container--${size}`],
    aspectRatio && styles[`image-container--${aspectRatio.replace('/', '-')}`],
    rounded && styles['image-container--rounded'],
  ]
    .filter(Boolean)
    .join(' ');

  const imageClasses = [
    styles.image,
    styles[`image--${fit}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <div className={containerClasses} data-testid={`${testId}-container`}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={imageClasses}
        data-testid={testId}
        {...validDOMProps}
      />
    </div>
  );
};

// Display name for React DevTools
Image.displayName = 'Image';

// Default export for convenience
export default Image;
