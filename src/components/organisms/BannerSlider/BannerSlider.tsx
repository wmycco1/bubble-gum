/**
 * BannerSlider Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Carousel slider for multiple banner announcements.
 * Auto-plays, supports manual navigation, and is fully accessible.
 *
 * @example Basic usage
 * ```tsx
 * <BannerSlider
 *   slides={[
 *     { id: '1', message: 'Slide 1', ctaText: 'Learn More', ctaHref: '/1' },
 *     { id: '2', message: 'Slide 2', ctaText: 'Shop Now', ctaHref: '/2' }
 *   ]}
 * />
 * ```
 *
 * @example Full-featured carousel
 * ```tsx
 * <BannerSlider
 *   slides={promoSlides}
 *   autoPlay={true}
 *   interval={5000}
 *   showArrows={true}
 *   showDots={true}
 *   pauseOnHover={true}
 *   loop={true}
 * />
 * ```
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters, AtomProvider } from '@/context/parameters/ParameterContext';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { BannerSliderProps } from './BannerSlider.types';
import styles from './BannerSlider.module.css';

export const BannerSlider: React.FC<BannerSliderProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as BannerSliderProps;

  // Destructure with defaults
  const {
    slides,
    autoPlay = false,
    interval = 5000,
    showArrows = true,
    showDots = true,
    pauseOnHover = true,
    loop = true,
    transitionDuration = 300,
    onSlideChange,
    className = '',
    'data-testid': testId = 'banner-slider',
    style,
    ...rest
  } = params;

  // Current slide index
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalSlides = slides.length;

  // Navigate to specific slide
  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;

      let newIndex = index;
      if (loop) {
        newIndex = (index + totalSlides) % totalSlides;
      } else {
        newIndex = Math.max(0, Math.min(index, totalSlides - 1));
      }

      if (newIndex !== currentIndex) {
        setIsTransitioning(true);
        setCurrentIndex(newIndex);
        if (onSlideChange) {
          onSlideChange(newIndex);
        }

        setTimeout(() => {
          setIsTransitioning(false);
        }, transitionDuration);
      }
    },
    [currentIndex, totalSlides, loop, isTransitioning, transitionDuration, onSlideChange]
  );

  // Navigate to next slide
  const goToNext = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  // Navigate to previous slide
  const goToPrev = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay || isPaused || totalSlides <= 1) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      goToNext();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoPlay, isPaused, interval, totalSlides, goToNext]);

  // Pause on hover handlers
  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    }
  };

  // No slides
  if (!slides || slides.length === 0) {
    return null;
  }

  // Single slide - render without controls
  if (slides.length === 1) {
    const slide = slides[0];
    return (
      <section
        className={`${styles['banner-slider']} ${className}`}
        style={style}
        data-testid={testId}
        role="region"
        aria-label="Banner announcement"
        {...validDOMProps}
      >
        <div className={styles['slider-track']}>
          <div
            className={styles['slider-slide']}
            style={
              slide.backgroundImage
                ? { backgroundImage: `url(${slide.backgroundImage})` }
                : undefined
            }
            data-testid={`${testId}-slide-0`}
          >
            <div className={styles['slide-content']}>
              <AtomProvider value={{ align: 'center' }}>
                {slide.title && (
                  <Heading level="h2" className={styles['slide-title']}>
                    {slide.title}
                  </Heading>
                )}
                <Text className={styles['slide-message']}>{slide.message}</Text>
                {slide.ctaText && (
                  <Button
                    text={slide.ctaText}
                    variant="primary"
                    size="md"
                    {...(slide.ctaHref ? { as: 'a', href: slide.ctaHref } : {})}
                    className={styles['slide-cta']}
                  />
                )}
              </AtomProvider>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Multiple slides - full carousel
  const currentSlide = slides[currentIndex];

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <section
      className={`${styles['banner-slider']} ${className}`}
      style={style}
      data-testid={testId}
      role="region"
      aria-label="Banner carousel"
      aria-roledescription="carousel"
      aria-live="polite"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      {...validDOMProps}
    >
      {/* Slides */}
      <div className={styles['slider-track']}>
        <div
          className={styles['slider-slide']}
          style={
            currentSlide.backgroundImage
              ? { backgroundImage: `url(${currentSlide.backgroundImage})` }
              : undefined
          }
          data-testid={`${testId}-slide-${currentIndex}`}
        >
          <div className={styles['slide-content']}>
            <AtomProvider value={{ align: 'center' }}>
              {currentSlide.title && (
                <Heading
                  level="h2"
                  className={styles['slide-title']}
                  data-testid={`${testId}-title`}
                >
                  {currentSlide.title}
                </Heading>
              )}
              <Text className={styles['slide-message']} data-testid={`${testId}-message`}>
                {currentSlide.message}
              </Text>
              {currentSlide.ctaText && (
                <Button
                  text={currentSlide.ctaText}
                  variant="primary"
                  size="md"
                  {...(currentSlide.ctaHref ? { as: 'a', href: currentSlide.ctaHref } : {})}
                  className={styles['slide-cta']}
                  data-testid={`${testId}-cta`}
                />
              )}
            </AtomProvider>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            className={`${styles['slider-arrow']} ${styles['slider-arrow--prev']}`}
            onClick={goToPrev}
            aria-label="Previous slide"
            disabled={!loop && currentIndex === 0}
            data-testid={`${testId}-prev`}
          >
            <ChevronLeft size={24} aria-hidden="true" />
          </button>
          <button
            className={`${styles['slider-arrow']} ${styles['slider-arrow--next']}`}
            onClick={goToNext}
            aria-label="Next slide"
            disabled={!loop && currentIndex === totalSlides - 1}
            data-testid={`${testId}-next`}
          >
            <ChevronRight size={24} aria-hidden="true" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {showDots && totalSlides > 1 && (
        <div className={styles['slider-dots']} data-testid={`${testId}-dots`}>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`${styles['slider-dot']} ${
                index === currentIndex ? styles['slider-dot--active'] : ''
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
              data-testid={`${testId}-dot-${index}`}
            />
          ))}
        </div>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {totalSlides}
      </div>
    </section>
  );
};

// Display name for React DevTools
BannerSlider.displayName = 'BannerSlider';

// Default export for convenience
export default BannerSlider;
