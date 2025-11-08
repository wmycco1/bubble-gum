/**
 * StarRating Component (Molecule)
 * God-Tier Development Protocol 2025
 *
 * A star rating component for displaying and collecting ratings.
 * Supports half-stars, readonly mode, and custom max ratings.
 * Composed of Icon and Text Atoms with Context API integration.
 *
 * @example Basic usage
 * ```tsx
 * <StarRating rating={3.5} />
 * ```
 *
 * @example Interactive
 * ```tsx
 * <StarRating
 *   rating={4}
 *   onChange={(rating) => setRating(rating)}
 * />
 * ```
 *
 * @example Readonly with value
 * ```tsx
 * <StarRating rating={4.5} readonly showValue size="lg" />
 * ```
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters, AtomProvider } from '@/context/parameters/ParameterContext';
import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import type { StarRatingProps } from './StarRating.types';
import styles from './StarRating.module.css';

export const StarRating: React.FC<StarRatingProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as StarRatingProps;

  // Destructure with defaults
  const {
    rating = 0,
    maxRating = 5,
    readonly = false,
    size = 'md',
    showValue = false,
    onChange,
    className = '',
    'aria-label': ariaLabel = 'Star rating',
    'data-testid': testId = 'star-rating',
    id,
    ...rest
  } = params;

  // Hover state for interactive mode
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Clamp rating to valid range
  const clampedRating = useMemo(() => {
    return Math.max(0, Math.min(maxRating, rating));
  }, [rating, maxRating]);

  // Current display rating (hover overrides actual rating)
  const displayRating = hoverRating !== null ? hoverRating : clampedRating;

  // Handle star click
  const handleStarClick = useCallback(
    (starIndex: number) => {
      if (readonly || !onChange) return;
      onChange(starIndex + 1);
    },
    [readonly, onChange]
  );

  // Handle mouse enter on star
  const handleStarMouseEnter = useCallback(
    (starIndex: number) => {
      if (readonly) return;
      setHoverRating(starIndex + 1);
    },
    [readonly]
  );

  // Handle mouse leave from container
  const handleMouseLeave = useCallback(() => {
    if (readonly) return;
    setHoverRating(null);
  }, [readonly]);

  // Determine fill type for a star
  const getStarFill = useCallback(
    (starIndex: number): 'full' | 'half' | 'empty' => {
      const starValue = starIndex + 1;
      const diff = displayRating - starIndex;

      if (diff >= 1) return 'full';
      if (diff > 0 && diff < 1) return 'half';
      return 'empty';
    },
    [displayRating]
  );

  // Generate array of stars
  const stars = useMemo(() => {
    return Array.from({ length: maxRating }, (_, i) => i);
  }, [maxRating]);

  // Compute CSS classes
  const containerClasses = [
    styles['star-rating'],
    styles[`star-rating--${size}`],
    readonly ? styles['star-rating--readonly'] : styles['star-rating--interactive'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Format rating value for display
  const formattedRating = clampedRating.toFixed(1);

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <div
      id={id}
      className={containerClasses}
      onMouseLeave={handleMouseLeave}
      role={readonly ? 'img' : 'slider'}
      aria-label={`${ariaLabel}: ${formattedRating} out of ${maxRating}`}
      aria-valuenow={readonly ? undefined : clampedRating}
      aria-valuemin={readonly ? undefined : 0}
      aria-valuemax={readonly ? undefined : maxRating}
      aria-readonly={readonly}
      data-testid={testId}
      {...validDOMProps}
    >
      {/* Stars container */}
      <div className={styles['star-rating__stars']}>
        {stars.map((starIndex) => {
          const fill = getStarFill(starIndex);
          const isInteractive = !readonly && onChange;

          return (
            <button
              key={starIndex}
              type="button"
              className={[
                styles['star-rating__star'],
                styles[`star-rating__star--${fill}`],
                isInteractive && styles['star-rating__star--clickable'],
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleStarClick(starIndex)}
              onMouseEnter={() => handleStarMouseEnter(starIndex)}
              disabled={readonly || !onChange}
              aria-label={`Rate ${starIndex + 1} out of ${maxRating}`}
              data-testid={`${testId}-star-${starIndex}`}
            >
              {fill === 'half' ? (
                // Half-star: filled and empty overlaid
                <span className={styles['star-rating__star-half']}>
                  <Icon name="star" aria-hidden className={styles['star-rating__star-icon-empty']} />
                  <Icon name="star" aria-hidden className={styles['star-rating__star-icon-filled']} />
                </span>
              ) : (
                // Full or empty star
                <Icon
                  name="star"
                  aria-hidden
                  className={
                    fill === 'full'
                      ? styles['star-rating__star-icon-filled']
                      : styles['star-rating__star-icon-empty']
                  }
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Rating value display */}
      {showValue && (
        <AtomProvider value={{ size: 'sm', color: 'muted' }}>
          <Text
            className={styles['star-rating__value']}
            data-testid={`${testId}-value`}
            aria-hidden
          >
            {formattedRating}
          </Text>
        </AtomProvider>
      )}
    </div>
  );
};

// Display name for React DevTools
StarRating.displayName = 'StarRating';

// Default export for convenience
export default StarRating;
