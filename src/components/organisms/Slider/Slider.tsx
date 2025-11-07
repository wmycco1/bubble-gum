/**
 * Slider Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * A content slider/carousel component with navigation, indicators, and auto-play.
 * Composed of Button and Icon atoms for navigation and controls.
 *
 * @example Basic slider
 * ```tsx
 * <Slider
 *   items={[
 *     { id: '1', content: <Card title="Slide 1" /> },
 *     { id: '2', content: <Card title="Slide 2" /> }
 *   ]}
 * />
 * ```
 *
 * @example Advanced slider
 * ```tsx
 * <Slider
 *   items={slides}
 *   slidesPerView={3}
 *   autoPlay={true}
 *   showArrows={true}
 *   centerMode={true}
 * />
 * ```
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import type { SliderProps } from './Slider.types';
import styles from './Slider.module.css';

export const Slider: React.FC<SliderProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as SliderProps;

  // Destructure with defaults
  const {
    items,
    slidesPerView = 1,
    spaceBetween = 16,
    showArrows = true,
    showDots = true,
    autoPlay = false,
    interval = 3000,
    loop = false,
    centerMode = false,
    breakpoints,
    onSlideChange,
    className = '',
    'data-testid': testId = 'slider',
    style,
    ...rest
  } = params;

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate total slides
  const totalSlides = items.length;
  const totalPages = Math.ceil(totalSlides / slidesPerView);

  // Navigate to specific slide
  const goToSlide = useCallback(
    (index: number) => {
      let newIndex = index;

      if (loop) {
        // Loop mode: wrap around
        if (newIndex < 0) {
          newIndex = totalPages - 1;
        } else if (newIndex >= totalPages) {
          newIndex = 0;
        }
      } else {
        // No loop: clamp to bounds
        newIndex = Math.max(0, Math.min(index, totalPages - 1));
      }

      setCurrentIndex(newIndex);
      onSlideChange?.(newIndex);
    },
    [totalPages, loop, onSlideChange]
  );

  // Navigation handlers
  const handlePrevious = () => {
    goToSlide(currentIndex - 1);
  };

  const handleNext = () => {
    goToSlide(currentIndex + 1);
  };

  // Auto-play effect
  useEffect(() => {
    if (autoPlay && !isHovered && totalPages > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          if (loop) {
            return next >= totalPages ? 0 : next;
          }
          return next >= totalPages ? prev : next;
        });
      }, interval);

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }
  }, [autoPlay, isHovered, interval, loop, totalPages]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Calculate transform for sliding
  const slideWidth = 100 / slidesPerView;
  const transform = `translateX(-${currentIndex * slideWidth}%)`;

  // Compute CSS classes
  const classes = [
    styles.slider,
    centerMode && styles['slider--center'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Check if navigation is enabled
  const canGoPrevious = loop || currentIndex > 0;
  const canGoNext = loop || currentIndex < totalPages - 1;

  return (
    <div
      className={classes}
      style={style as React.CSSProperties}
      data-testid={testId}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Content slider"
      aria-roledescription="carousel"
      {...rest}
    >
      {/* Slider track */}
      <div className={styles['slider-viewport']} data-testid={`${testId}-viewport`}>
        <div
          className={styles['slider-track']}
          style={{
            transform,
            gap: `${spaceBetween}px`,
          }}
          data-testid={`${testId}-track`}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className={styles['slider-slide']}
              style={{
                minWidth: `calc(${slideWidth}% - ${spaceBetween * (slidesPerView - 1) / slidesPerView}px)`,
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${totalSlides}`}
              data-testid={`${testId}-slide-${item.id}`}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {showArrows && totalPages > 1 && (
        <>
          <Button
            variant="ghost"
            size="md"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className={styles['slider-arrow-prev']}
            aria-label="Previous slide"
            data-testid={`${testId}-arrow-prev`}
          >
            <Icon name="chevron-left" size="md" />
          </Button>

          <Button
            variant="ghost"
            size="md"
            onClick={handleNext}
            disabled={!canGoNext}
            className={styles['slider-arrow-next']}
            aria-label="Next slide"
            data-testid={`${testId}-arrow-next`}
          >
            <Icon name="chevron-right" size="md" />
          </Button>
        </>
      )}

      {/* Dot indicators */}
      {showDots && totalPages > 1 && (
        <div
          className={styles['slider-dots']}
          role="tablist"
          aria-label="Slide navigation"
          data-testid={`${testId}-dots`}
        >
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
              className={[
                styles['slider-dot'],
                index === currentIndex && styles['slider-dot--active'],
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => goToSlide(index)}
              data-testid={`${testId}-dot-${index}`}
            />
          ))}
        </div>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {totalPages}
      </div>
    </div>
  );
};

// Display name for React DevTools
Slider.displayName = 'Slider';

// Default export for convenience
export default Slider;
