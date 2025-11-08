/**
 * Carousel Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * An image/content carousel with auto-play, navigation, and transitions.
 * Composed of Image, Button, and Icon atoms.
 *
 * @example Basic carousel
 * ```tsx
 * <Carousel
 *   slides={[
 *     { id: '1', content: <img src="image1.jpg" alt="Image 1" /> },
 *     { id: '2', content: <img src="image2.jpg" alt="Image 2" /> }
 *   ]}
 * />
 * ```
 *
 * @example Full-featured carousel
 * ```tsx
 * <Carousel
 *   slides={slides}
 *   autoPlay={true}
 *   interval={5000}
 *   showArrows={true}
 *   showDots={true}
 *   pauseOnHover={true}
 *   loop={true}
 *   onSlideChange={(index) => console.log(index)}
 * />
 * ```
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters, AtomProvider } from '@/context/parameters/ParameterContext';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { Button } from '@/components/atoms/Button';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { Icon } from '@/components/atoms/Icon';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { Text } from '@/components/atoms/Text';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import type { CarouselProps, CarouselSlide } from './Carousel.types';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import styles from './Carousel.module.css';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';

export const Carousel: React.FC<CarouselProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as CarouselProps;

  // Destructure with defaults
  const {
    slides,
    autoPlay = false,
    interval = 3000,
    showArrows = true,
    showDots = true,
    showThumbnails = false,
    pauseOnHover = true,
    loop = true,
    transition = 'slide',
    transitionDuration = 300,
    onSlideChange,
    className = '',
    'data-testid': testId = 'carousel',
    style,
    ...rest
  } = params;

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Go to specific slide
  const goToSlide = useCallback(
    (index: number) => {
      if (index === currentIndex) return;

      setIsTransitioning(true);
      setCurrentIndex(index);
      onSlideChange?.(index);

      // Reset transition flag after animation completes
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, transitionDuration);
    },
    [currentIndex, onSlideChange, transitionDuration]
  );

  // Go to next slide
  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;

    if (isLastSlide) {
      if (loop) {
        goToSlide(0);
      }
    } else {
      goToSlide(currentIndex + 1);
    }
  }, [currentIndex, slides.length, loop, goToSlide]);

  // Go to previous slide
  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;

    if (isFirstSlide) {
      if (loop) {
        goToSlide(slides.length - 1);
      }
    } else {
      goToSlide(currentIndex - 1);
    }
  }, [currentIndex, slides.length, loop, goToSlide]);

  // Auto-play logic
  useEffect(() => {
    if (!autoPlay || isHovered) return;

    intervalRef.current = setInterval(() => {
      goToNext();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, interval, isHovered, goToNext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(slides.length - 1);
      }
    },
    [goToPrevious, goToNext, goToSlide, slides.length]
  );

  // Mouse enter/leave handlers
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsHovered(true);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      setIsHovered(false);
    }
  }, [pauseOnHover]);

  // Compute CSS classes
  const containerClasses = [
    styles['carousel'],
    styles[`carousel--${transition}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const trackClasses = [
    styles['carousel-track'],
    isTransitioning && styles['carousel-track--transitioning'],
  ]
    .filter(Boolean)
    .join(' ');

  // Empty state
  if (!slides || slides.length === 0) {
    return (
      <div className={styles['carousel-empty']} data-testid={`${testId}-empty`}>
        <Text align="center" color="muted">
          No slides available
        </Text>
      </div>
    );
  }

  const canGoPrevious = loop || currentIndex > 0;
  const canGoNext = loop || currentIndex < slides.length - 1;

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <div
      className={containerClasses}
      style={style as React.CSSProperties}
      data-testid={testId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
      {...validDOMProps}
    >
      {/* Carousel Viewport */}
      <div className={styles['carousel-viewport']} data-testid={`${testId}-viewport`}>
        {/* Carousel Track */}
        <div
          className={trackClasses}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transitionDuration: `${transitionDuration}ms`,
          }}
          data-testid={`${testId}-track`}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={[
                styles['carousel-slide'],
                index === currentIndex && styles['carousel-slide--active'],
              ]
                .filter(Boolean)
                .join(' ')}
              role="group"
              aria-roledescription="slide"
              aria-label={slide.alt || `Slide ${index + 1} of ${slides.length}`}
              aria-hidden={index !== currentIndex}
              data-testid={`${testId}-slide-${slide.id}`}
            >
              <div className={styles['carousel-slide-content']}>
                {slide.content}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {showArrows && (
          <>
            <button
              className={[
                styles['carousel-arrow'],
                styles['carousel-arrow--prev'],
              ].join(' ')}
              onClick={goToPrevious}
              disabled={!canGoPrevious}
              aria-label="Previous slide"
              data-testid={`${testId}-arrow-prev`}
            >
              <Icon name="chevron-left" size="md" color="white" />
            </button>

            <button
              className={[
                styles['carousel-arrow'],
                styles['carousel-arrow--next'],
              ].join(' ')}
              onClick={goToNext}
              disabled={!canGoNext}
              aria-label="Next slide"
              data-testid={`${testId}-arrow-next`}
            >
              <Icon name="chevron-right" size="md" color="white" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {showDots && (
          <div className={styles['carousel-dots']} data-testid={`${testId}-dots`}>
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                className={[
                  styles['carousel-dot'],
                  index === currentIndex && styles['carousel-dot--active'],
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
                data-testid={`${testId}-dot-${index}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {showThumbnails && (
        <div className={styles['carousel-thumbnails']} data-testid={`${testId}-thumbnails`}>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={[
                styles['carousel-thumbnail'],
                index === currentIndex && styles['carousel-thumbnail--active'],
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => goToSlide(index)}
              aria-label={`Thumbnail for slide ${index + 1}`}
              data-testid={`${testId}-thumbnail-${index}`}
            >
              {slide.thumbnail ? (
                <img src={slide.thumbnail} alt={slide.alt || `Thumbnail ${index + 1}`} />
              ) : (
                <div className={styles['carousel-thumbnail-placeholder']}>
                  <Text size="xs" color="muted">
                    {index + 1}
                  </Text>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Slide Counter */}
      <div className={styles['carousel-counter']} data-testid={`${testId}-counter`}>
        <Text size="sm" color="default">
          {currentIndex + 1} / {slides.length}
        </Text>
      </div>
    </div>
  );
};

// Display name for React DevTools
Carousel.displayName = 'Carousel';

// Default export for convenience
export default Carousel;
