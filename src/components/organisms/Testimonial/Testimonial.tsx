/**
 * Testimonial Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Testimonial section for displaying customer reviews and social proof.
 * Composed of Image, Heading, Text, StarRating molecules, and Icon atoms.
 *
 * @example Basic usage
 * ```tsx
 * <Testimonial
 *   testimonials={[
 *     { id: '1', quote: 'Great!', author: 'John', rating: 5 }
 *   ]}
 * />
 * ```
 *
 * @example Full-featured
 * ```tsx
 * <Testimonial
 *   testimonials={testimonials}
 *   layout="grid"
 *   variant="card"
 *   showRating
 *   showQuoteIcon
 * />
 * ```
 */

'use client';

import React, { useState, useCallback } from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useOrganismContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { Image } from '@/components/atoms/Image';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import { StarRating } from '@/components/molecules/StarRating';
import type { TestimonialProps, TestimonialItem } from './Testimonial.types';
import styles from './Testimonial.module.css';

export const Testimonial: React.FC<TestimonialProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useOrganismContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as TestimonialProps;

  // Destructure with defaults
  const {
    testimonials = [], // Default to empty array
    layout = 'grid',
    variant = 'default',
    showRating = true,
    showQuoteIcon = true,
    columns = 3,
    className = '',
    'data-testid': testId = 'testimonial',
    ...rest
  } = params;

  // Carousel state
  const [activeIndex, setActiveIndex] = useState(0);

  // Navigate carousel
  const handlePrev = useCallback(() => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }, [testimonials.length]);

  const handleNext = useCallback(() => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }, [testimonials.length]);

  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  // Compute CSS classes
  const classes = [
    styles.testimonial,
    styles[`testimonial--${layout}`],
    styles[`testimonial--${variant}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Compute grid classes
  const gridClasses = [
    styles['testimonial-grid'],
    styles[`testimonial-grid--cols-${columns}`],
  ]
    .filter(Boolean)
    .join(' ');

  // Render single testimonial card
  const renderTestimonialCard = (testimonial: TestimonialItem, index?: number) => (
    <div
      key={testimonial.id}
      className={styles['testimonial-card']}
      data-testid={`${testId}-card-${testimonial.id}`}
    >
      {/* Quote Icon */}
      {showQuoteIcon && (
        <div className={styles['testimonial-quote-icon']} aria-hidden="true">
          <Icon name="quote" size="lg" color="muted" />
        </div>
      )}

      {/* Rating */}
      {showRating && testimonial.rating && (
        <div className={styles['testimonial-rating']}>
          <StarRating rating={testimonial.rating} readonly size="sm" />
        </div>
      )}

      {/* Quote */}
      <blockquote className={styles['testimonial-quote']}>
        <Text size="md" color="default">
          "{testimonial.quote}"
        </Text>
      </blockquote>

      {/* Author Info */}
      <div className={styles['testimonial-author']}>
        {/* Avatar */}
        {testimonial.avatar && (
          <div className={styles['testimonial-avatar']}>
            <Image
              src={testimonial.avatar}
              alt={testimonial.author}
              aspectRatio="1/1"
              fit="cover"
              rounded
              width={48}
              height={48}
            />
          </div>
        )}

        {/* Details */}
        <div className={styles['testimonial-details']}>
          <Heading level="h4" className={styles['testimonial-name']}>
            {testimonial.author}
          </Heading>

          {testimonial.role && (
            <Text size="sm" color="muted" className={styles['testimonial-role']}>
              {testimonial.role}
            </Text>
          )}

          {testimonial.company && (
            <Text size="xs" color="muted" className={styles['testimonial-company']}>
              {testimonial.company}
            </Text>
          )}
        </div>

        {/* Company Logo */}
        {testimonial.companyLogo && (
          <div className={styles['testimonial-logo']}>
            <Image
              src={testimonial.companyLogo}
              alt={`${testimonial.company} logo`}
              aspectRatio="16/9"
              fit="contain"
              width={80}
              height={40}
            />
          </div>
        )}
      </div>
    </div>
  );

  // Empty state
  if (!testimonials || testimonials.length === 0) {
    return (
      <section
        className={styles.testimonial}
        data-testid={testId}
        {...validDOMProps}
      >
        <div className={styles['testimonial-empty']}>
          <div className={styles['testimonial-empty-icon']}>💬</div>
          <Heading level="h3" align="center">No testimonials added</Heading>
          <Text align="center" color="muted">
            Add customer testimonials to build trust and credibility
          </Text>
        </div>
      </section>
    );
  }

  return (
    <section
      className={classes}
      data-testid={testId}
      {...validDOMProps}
    >
      <div className={styles['testimonial-container']}>
        {/* Single Layout */}
        {layout === 'single' && renderTestimonialCard(testimonials[0])}

        {/* Grid Layout */}
        {layout === 'grid' && (
          <div className={gridClasses} data-testid={`${testId}-grid`}>
            {testimonials.map((testimonial) => renderTestimonialCard(testimonial))}
          </div>
        )}

        {/* Carousel Layout */}
        {layout === 'carousel' && (
          <div className={styles['testimonial-carousel']} data-testid={`${testId}-carousel`}>
            {/* Active Testimonial */}
            <div className={styles['testimonial-carousel-content']}>
              {renderTestimonialCard(testimonials[activeIndex], activeIndex)}
            </div>

            {/* Navigation */}
            {testimonials.length > 1 && (
              <>
                <button
                  type="button"
                  className={`${styles['testimonial-carousel-button']} ${styles['testimonial-carousel-button--prev']}`}
                  onClick={handlePrev}
                  aria-label="Previous testimonial"
                  data-testid={`${testId}-prev`}
                >
                  <Icon name="chevron-left" size="md" />
                </button>

                <button
                  type="button"
                  className={`${styles['testimonial-carousel-button']} ${styles['testimonial-carousel-button--next']}`}
                  onClick={handleNext}
                  aria-label="Next testimonial"
                  data-testid={`${testId}-next`}
                >
                  <Icon name="chevron-right" size="md" />
                </button>

                {/* Dots Indicator */}
                <div className={styles['testimonial-carousel-dots']} data-testid={`${testId}-dots`}>
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={[
                        styles['testimonial-carousel-dot'],
                        index === activeIndex && styles['testimonial-carousel-dot--active'],
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => handleDotClick(index)}
                      aria-label={`Go to testimonial ${index + 1}`}
                      aria-current={index === activeIndex}
                      data-testid={`${testId}-dot-${index}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

// Display name for React DevTools
Testimonial.displayName = 'Testimonial';

// Default export for convenience
export default Testimonial;
