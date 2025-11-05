// ═══════════════════════════════════════════════════════════════
// CAROUSEL COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M2: New Interactive Components
// Features:
// - Image carousel with slides
// - Auto-play with interval
// - Navigation controls (prev/next)
// - Dot indicators
// - Loop support
// - Smooth transitions
// - Keyboard navigation (arrow keys)
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselComponentProps {
  component: CanvasComponent;
}

interface CarouselSlide {
  id: string;
  image: string;
  title?: string;
  description?: string;
}

export function CarouselComponent({ component }: CarouselComponentProps) {
  const { style, props } = component;

  // Extract props with defaults
  const slides = (props.slides as CarouselSlide[]) || [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      title: 'Slide 1',
      description: 'Beautiful mountain landscape',
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
      title: 'Slide 2',
      description: 'Serene forest path',
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
      title: 'Slide 3',
      description: 'Peaceful beach sunset',
    },
  ];
  const autoPlay = (props.autoPlay as boolean) ?? true;
  const interval = (props.interval as number) ?? 3000;
  const showControls = (props.showControls as boolean) ?? true;
  const showIndicators = (props.showIndicators as boolean) ?? true;
  const loop = (props.loop as boolean) ?? true;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play logic
  useEffect(() => {
    if (autoPlay && !isHovered) {
      intervalRef.current = setInterval(() => {
        goToNext();
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, interval, isHovered, currentIndex]);

  const goToPrevious = () => {
    if (currentIndex === 0) {
      if (loop) {
        setCurrentIndex(slides.length - 1);
      }
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex === slides.length - 1) {
      if (loop) {
        setCurrentIndex(0);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  const currentSlide = slides[currentIndex];

  // Base wrapper className
  const baseClassName = 'w-full max-w-4xl mx-auto';
  const wrapperClassName = mergeClassNameWithSpacing(baseClassName, style);

  return (
    <div
      className={wrapperClassName}
      style={style as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
    >
      {/* Carousel Container */}
      <div className="relative rounded-lg overflow-hidden bg-slate-900 aspect-video">
        {/* Slides */}
        <div className="relative h-full">
          <img
            src={currentSlide?.image}
            alt={currentSlide?.title || `Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-500"
          />

          {/* Overlay Text */}
          {(currentSlide?.title || currentSlide?.description) && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              {currentSlide.title && (
                <h3 className="text-2xl font-bold text-white mb-2">
                  {currentSlide.title}
                </h3>
              )}
              {currentSlide.description && (
                <p className="text-slate-200">{currentSlide.description}</p>
              )}
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        {showControls && (
          <>
            <button
              onClick={goToPrevious}
              disabled={!loop && currentIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={goToNext}
              disabled={!loop && currentIndex === slides.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {showIndicators && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Slide Counter */}
      <div className="mt-4 text-center text-sm text-slate-600">
        {currentIndex + 1} / {slides.length}
      </div>
    </div>
  );
}
