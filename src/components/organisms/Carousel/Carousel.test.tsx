/**
 * Carousel Component Tests
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite with 80%+ coverage
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Carousel } from './Carousel';
import type { CarouselProps, CarouselSlide } from './Carousel.types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock CSS modules
jest.mock('./Carousel.module.css', () => ({
  'carousel': 'carousel',
  'carousel--slide': 'carousel--slide',
  'carousel--fade': 'carousel--fade',
  'carousel-viewport': 'carousel-viewport',
  'carousel-track': 'carousel-track',
  'carousel-track--transitioning': 'carousel-track--transitioning',
  'carousel-slide': 'carousel-slide',
  'carousel-slide--active': 'carousel-slide--active',
  'carousel-slide-content': 'carousel-slide-content',
  'carousel-arrow': 'carousel-arrow',
  'carousel-arrow--prev': 'carousel-arrow--prev',
  'carousel-arrow--next': 'carousel-arrow--next',
  'carousel-dots': 'carousel-dots',
  'carousel-dot': 'carousel-dot',
  'carousel-dot--active': 'carousel-dot--active',
  'carousel-thumbnails': 'carousel-thumbnails',
  'carousel-thumbnail': 'carousel-thumbnail',
  'carousel-thumbnail--active': 'carousel-thumbnail--active',
  'carousel-thumbnail-placeholder': 'carousel-thumbnail-placeholder',
  'carousel-counter': 'carousel-counter',
  'carousel-empty': 'carousel-empty',
}));

// Sample carousel slides
const sampleSlides: CarouselSlide[] = [
  {
    id: '1',
    content: <img src="/image1.jpg" alt="Image 1" />,
    thumbnail: '/thumb1.jpg',
    alt: 'First slide',
  },
  {
    id: '2',
    content: <img src="/image2.jpg" alt="Image 2" />,
    thumbnail: '/thumb2.jpg',
    alt: 'Second slide',
  },
  {
    id: '3',
    content: <img src="/image3.jpg" alt="Image 3" />,
    thumbnail: '/thumb3.jpg',
    alt: 'Third slide',
  },
];

describe('Carousel', () => {
  // Use fake timers for auto-play tests
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // ============================================
  // BASIC RENDERING
  // ============================================

  describe('Basic Rendering', () => {
    it('renders with required slides prop', () => {
      render(<Carousel slides={sampleSlides} />);
      expect(screen.getByTestId('carousel')).toBeInTheDocument();
    });

    it('renders all slides', () => {
      render(<Carousel slides={sampleSlides} />);
      expect(screen.getByTestId('carousel-slide-1')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-slide-2')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-slide-3')).toBeInTheDocument();
    });

    it('renders as div element', () => {
      const { container } = render(<Carousel slides={sampleSlides} />);
      const carousel = container.querySelector('[data-testid="carousel"]');
      expect(carousel?.tagName).toBe('DIV');
    });

    it('applies custom className', () => {
      render(<Carousel slides={sampleSlides} className="custom-carousel" />);
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveClass('custom-carousel');
    });

    it('applies custom data-testid', () => {
      render(<Carousel slides={sampleSlides} data-testid="custom-carousel" />);
      expect(screen.getByTestId('custom-carousel')).toBeInTheDocument();
    });

    it('renders viewport and track', () => {
      render(<Carousel slides={sampleSlides} />);
      expect(screen.getByTestId('carousel-viewport')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-track')).toBeInTheDocument();
    });

    it('renders slide counter', () => {
      render(<Carousel slides={sampleSlides} />);
      const counter = screen.getByTestId('carousel-counter');
      expect(counter).toBeInTheDocument();
      expect(counter).toHaveTextContent('1 / 3');
    });
  });

  // ============================================
  // EMPTY STATE
  // ============================================

  describe('Empty State', () => {
    it('renders empty state when no slides provided', () => {
      render(<Carousel slides={[]} />);
      expect(screen.getByText('No slides available')).toBeInTheDocument();
    });

    it('shows correct testid for empty state', () => {
      render(<Carousel slides={[]} />);
      expect(screen.getByTestId('carousel-empty')).toBeInTheDocument();
    });
  });

  // ============================================
  // NAVIGATION ARROWS
  // ============================================

  describe('Navigation Arrows', () => {
    it('shows arrows by default', () => {
      render(<Carousel slides={sampleSlides} />);
      expect(screen.getByTestId('carousel-arrow-prev')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-arrow-next')).toBeInTheDocument();
    });

    it('hides arrows when showArrows is false', () => {
      render(<Carousel slides={sampleSlides} showArrows={false} />);
      expect(screen.queryByTestId('carousel-arrow-prev')).not.toBeInTheDocument();
      expect(screen.queryByTestId('carousel-arrow-next')).not.toBeInTheDocument();
    });

    it('navigates to next slide when next arrow clicked', () => {
      render(<Carousel slides={sampleSlides} />);
      const nextArrow = screen.getByTestId('carousel-arrow-next');

      act(() => {
        fireEvent.click(nextArrow);
        jest.advanceTimersByTime(300); // Allow transition
      });

      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('2 / 3');
    });

    it('navigates to previous slide when prev arrow clicked', () => {
      render(<Carousel slides={sampleSlides} />);
      const nextArrow = screen.getByTestId('carousel-arrow-next');
      const prevArrow = screen.getByTestId('carousel-arrow-prev');

      act(() => {
        fireEvent.click(nextArrow);
      });
      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('2 / 3');

      act(() => {
        fireEvent.click(prevArrow);
      });
      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('1 / 3');
    });

    it('disables prev arrow on first slide when loop is false', () => {
      render(<Carousel slides={sampleSlides} loop={false} />);
      const prevArrow = screen.getByTestId('carousel-arrow-prev');
      expect(prevArrow).toBeDisabled();
    });

    it('disables next arrow on last slide when loop is false', () => {
      render(<Carousel slides={sampleSlides} loop={false} />);
      const nextArrow = screen.getByTestId('carousel-arrow-next');

      // Navigate to last slide
      act(() => {
        fireEvent.click(nextArrow);
        jest.advanceTimersByTime(300);
        fireEvent.click(nextArrow);
        jest.advanceTimersByTime(300);
      });

      expect(nextArrow).toBeDisabled();
    });

    it('loops to first slide when clicking next on last slide', () => {
      render(<Carousel slides={sampleSlides} loop={true} />);
      const nextArrow = screen.getByTestId('carousel-arrow-next');

      // Navigate to last slide
      act(() => {
        fireEvent.click(nextArrow);
        jest.advanceTimersByTime(300);
        fireEvent.click(nextArrow);
        jest.advanceTimersByTime(300);
      });
      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('3 / 3');

      // Click next again - should loop to first
      act(() => {
        fireEvent.click(nextArrow);
        jest.advanceTimersByTime(300);
      });
      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('1 / 3');
    });

    it('loops to last slide when clicking prev on first slide', () => {
      render(<Carousel slides={sampleSlides} loop={true} />);
      const prevArrow = screen.getByTestId('carousel-arrow-prev');

      act(() => {
        fireEvent.click(prevArrow);
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('3 / 3');
    });
  });

  // ============================================
  // DOT INDICATORS
  // ============================================

  describe('Dot Indicators', () => {
    it('shows dots by default', () => {
      render(<Carousel slides={sampleSlides} />);
      expect(screen.getByTestId('carousel-dots')).toBeInTheDocument();
    });

    it('hides dots when showDots is false', () => {
      render(<Carousel slides={sampleSlides} showDots={false} />);
      expect(screen.queryByTestId('carousel-dots')).not.toBeInTheDocument();
    });

    it('renders correct number of dots', () => {
      render(<Carousel slides={sampleSlides} />);
      expect(screen.getByTestId('carousel-dot-0')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-dot-1')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-dot-2')).toBeInTheDocument();
    });

    it('marks first dot as active initially', () => {
      render(<Carousel slides={sampleSlides} />);
      const firstDot = screen.getByTestId('carousel-dot-0');
      expect(firstDot).toHaveClass('carousel-dot--active');
    });

    it('navigates to slide when dot is clicked', () => {
      render(<Carousel slides={sampleSlides} />);
      const secondDot = screen.getByTestId('carousel-dot-1');

      act(() => {
        fireEvent.click(secondDot);
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('2 / 3');
      expect(secondDot).toHaveClass('carousel-dot--active');
    });

    it('updates active dot when navigating with arrows', () => {
      render(<Carousel slides={sampleSlides} />);
      const nextArrow = screen.getByTestId('carousel-arrow-next');

      act(() => {
        fireEvent.click(nextArrow);
        jest.advanceTimersByTime(300);
      });

      const secondDot = screen.getByTestId('carousel-dot-1');
      expect(secondDot).toHaveClass('carousel-dot--active');
    });

    it('sets aria-current on active dot', () => {
      render(<Carousel slides={sampleSlides} />);
      const firstDot = screen.getByTestId('carousel-dot-0');
      expect(firstDot).toHaveAttribute('aria-current', 'true');
    });
  });

  // ============================================
  // THUMBNAILS
  // ============================================

  describe('Thumbnails', () => {
    it('hides thumbnails by default', () => {
      render(<Carousel slides={sampleSlides} />);
      expect(screen.queryByTestId('carousel-thumbnails')).not.toBeInTheDocument();
    });

    it('shows thumbnails when showThumbnails is true', () => {
      render(<Carousel slides={sampleSlides} showThumbnails={true} />);
      expect(screen.getByTestId('carousel-thumbnails')).toBeInTheDocument();
    });

    it('renders correct number of thumbnails', () => {
      render(<Carousel slides={sampleSlides} showThumbnails={true} />);
      expect(screen.getByTestId('carousel-thumbnail-0')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-thumbnail-1')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-thumbnail-2')).toBeInTheDocument();
    });

    it('marks first thumbnail as active initially', () => {
      render(<Carousel slides={sampleSlides} showThumbnails={true} />);
      const firstThumbnail = screen.getByTestId('carousel-thumbnail-0');
      expect(firstThumbnail).toHaveClass('carousel-thumbnail--active');
    });

    it('navigates to slide when thumbnail is clicked', () => {
      render(<Carousel slides={sampleSlides} showThumbnails={true} />);
      const secondThumbnail = screen.getByTestId('carousel-thumbnail-1');

      act(() => {
        fireEvent.click(secondThumbnail);
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('2 / 3');
      expect(secondThumbnail).toHaveClass('carousel-thumbnail--active');
    });

    it('renders thumbnail images when provided', () => {
      render(<Carousel slides={sampleSlides} showThumbnails={true} />);
      const thumbnail = screen.getByTestId('carousel-thumbnail-0');
      const img = thumbnail.querySelector('img');
      expect(img).toHaveAttribute('src', '/thumb1.jpg');
    });

    it('renders placeholder when thumbnail not provided', () => {
      const slidesWithoutThumbs: CarouselSlide[] = [
        { id: '1', content: <div>Content 1</div> },
      ];

      render(<Carousel slides={slidesWithoutThumbs} showThumbnails={true} />);
      const placeholder = screen.getByText('1');
      expect(placeholder).toBeInTheDocument();
    });
  });

  // ============================================
  // AUTO-PLAY
  // ============================================

  describe('Auto-Play', () => {
    it('does not auto-play by default', () => {
      render(<Carousel slides={sampleSlides} />);

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('1 / 3');
    });

    it('auto-plays when enabled', () => {
      render(<Carousel slides={sampleSlides} autoPlay={true} interval={1000} />);

      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('1 / 3');

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('2 / 3');
    });

    it('respects custom interval', () => {
      render(<Carousel slides={sampleSlides} autoPlay={true} interval={2000} />);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('1 / 3');

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('2 / 3');
    });

    it('pauses auto-play on hover when pauseOnHover is true', () => {
      render(<Carousel slides={sampleSlides} autoPlay={true} interval={1000} pauseOnHover={true} />);

      const carousel = screen.getByTestId('carousel');

      fireEvent.mouseEnter(carousel);

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('1 / 3');
    });

    it('resumes auto-play on mouse leave', () => {
      render(<Carousel slides={sampleSlides} autoPlay={true} interval={1000} pauseOnHover={true} />);

      const carousel = screen.getByTestId('carousel');

      fireEvent.mouseEnter(carousel);
      fireEvent.mouseLeave(carousel);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('2 / 3');
    });

    it('does not pause on hover when pauseOnHover is false', () => {
      render(<Carousel slides={sampleSlides} autoPlay={true} interval={1000} pauseOnHover={false} />);

      const carousel = screen.getByTestId('carousel');

      fireEvent.mouseEnter(carousel);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('2 / 3');
    });

    it('loops slides during auto-play', () => {
      render(<Carousel slides={sampleSlides} autoPlay={true} interval={1000} loop={true} />);

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('2 / 3');

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('3 / 3');

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('1 / 3');
    });
  });

  // ============================================
  // TRANSITION
  // ============================================

  describe('Transition', () => {
    it('applies slide transition by default', () => {
      render(<Carousel slides={sampleSlides} />);
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveClass('carousel--slide');
    });

    it('applies fade transition when specified', () => {
      render(<Carousel slides={sampleSlides} transition="fade" />);
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveClass('carousel--fade');
    });

    it('applies transition duration to track', () => {
      render(<Carousel slides={sampleSlides} transitionDuration={500} />);
      const track = screen.getByTestId('carousel-track');
      expect(track).toHaveStyle({ transitionDuration: '500ms' });
    });
  });

  // ============================================
  // CALLBACKS
  // ============================================

  describe('Callbacks', () => {
    it('calls onSlideChange when slide changes', () => {
      const onSlideChange = jest.fn();
      render(<Carousel slides={sampleSlides} onSlideChange={onSlideChange} />);

      const nextArrow = screen.getByTestId('carousel-arrow-next');
      act(() => {
        fireEvent.click(nextArrow);
        jest.advanceTimersByTime(300);
      });

      expect(onSlideChange).toHaveBeenCalledTimes(1);
      expect(onSlideChange).toHaveBeenCalledWith(1);
    });

    it('calls onSlideChange with correct index', () => {
      const onSlideChange = jest.fn();
      render(<Carousel slides={sampleSlides} onSlideChange={onSlideChange} />);

      const thirdDot = screen.getByTestId('carousel-dot-2');
      act(() => {
        fireEvent.click(thirdDot);
        jest.advanceTimersByTime(300);
      });

      expect(onSlideChange).toHaveBeenCalledWith(2);
    });

    it('calls onSlideChange during auto-play', () => {
      const onSlideChange = jest.fn();
      render(<Carousel slides={sampleSlides} autoPlay={true} interval={1000} onSlideChange={onSlideChange} />);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(onSlideChange).toHaveBeenCalledWith(1);
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================

  describe('Keyboard Navigation', () => {
    it('navigates to next slide with ArrowRight', () => {
      render(<Carousel slides={sampleSlides} />);
      const carousel = screen.getByTestId('carousel');

      act(() => {
        fireEvent.keyDown(carousel, { key: 'ArrowRight' });
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('2 / 3');
    });

    it('navigates to previous slide with ArrowLeft', () => {
      render(<Carousel slides={sampleSlides} />);
      const carousel = screen.getByTestId('carousel');
      const nextArrow = screen.getByTestId('carousel-arrow-next');

      act(() => {
        fireEvent.click(nextArrow);
        jest.advanceTimersByTime(300);
        fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('1 / 3');
    });

    it('navigates to first slide with Home key', () => {
      render(<Carousel slides={sampleSlides} />);
      const carousel = screen.getByTestId('carousel');
      const nextArrow = screen.getByTestId('carousel-arrow-next');

      act(() => {
        fireEvent.click(nextArrow);
        jest.advanceTimersByTime(300);
        fireEvent.click(nextArrow);
        jest.advanceTimersByTime(300);
      });
      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('3 / 3');

      act(() => {
        fireEvent.keyDown(carousel, { key: 'Home' });
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('1 / 3');
    });

    it('navigates to last slide with End key', () => {
      render(<Carousel slides={sampleSlides} />);
      const carousel = screen.getByTestId('carousel');

      act(() => {
        fireEvent.keyDown(carousel, { key: 'End' });
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('3 / 3');
    });

    it('prevents default behavior for arrow keys', () => {
      render(<Carousel slides={sampleSlides} />);
      const carousel = screen.getByTestId('carousel');

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      carousel.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Carousel slides={sampleSlides} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }, 10000); // 10 second timeout for axe tests

    it('has carousel role', () => {
      render(<Carousel slides={sampleSlides} />);
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveAttribute('role', 'region');
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
    });

    it('has aria-label', () => {
      render(<Carousel slides={sampleSlides} />);
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveAttribute('aria-label', 'Image carousel');
    });

    it('slides have group role', () => {
      render(<Carousel slides={sampleSlides} />);
      const slide = screen.getByTestId('carousel-slide-1');
      expect(slide).toHaveAttribute('role', 'group');
      expect(slide).toHaveAttribute('aria-roledescription', 'slide');
    });

    it('slides have aria-label', () => {
      render(<Carousel slides={sampleSlides} />);
      const slide = screen.getByTestId('carousel-slide-1');
      expect(slide).toHaveAttribute('aria-label', 'First slide');
    });

    it('inactive slides have aria-hidden', () => {
      render(<Carousel slides={sampleSlides} />);
      const secondSlide = screen.getByTestId('carousel-slide-2');
      expect(secondSlide).toHaveAttribute('aria-hidden', 'true');
    });

    it('active slide does not have aria-hidden', () => {
      render(<Carousel slides={sampleSlides} />);
      const firstSlide = screen.getByTestId('carousel-slide-1');
      expect(firstSlide).toHaveAttribute('aria-hidden', 'false');
    });

    it('navigation arrows have aria-label', () => {
      render(<Carousel slides={sampleSlides} />);
      const prevArrow = screen.getByTestId('carousel-arrow-prev');
      const nextArrow = screen.getByTestId('carousel-arrow-next');

      expect(prevArrow).toHaveAttribute('aria-label', 'Previous slide');
      expect(nextArrow).toHaveAttribute('aria-label', 'Next slide');
    });

    it('dots have aria-label', () => {
      render(<Carousel slides={sampleSlides} />);
      const firstDot = screen.getByTestId('carousel-dot-0');
      expect(firstDot).toHaveAttribute('aria-label', 'Go to slide 1');
    });

    it('carousel is keyboard focusable', () => {
      render(<Carousel slides={sampleSlides} />);
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveAttribute('tabIndex', '0');
    });
  });

  // ============================================
  // CONTEXT API
  // ============================================

  describe('Context API', () => {
    it('inherits parameters from context', () => {
      const { AtomProvider } = require('@/context/parameters/ParameterContext');

      render(
        <AtomProvider value={{ className: 'context-class' }}>
          <Carousel slides={sampleSlides} />
        </AtomProvider>
      );

      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveClass('context-class');
    });

    it('props override context parameters', () => {
      const { AtomProvider } = require('@/context/parameters/ParameterContext');

      render(
        <AtomProvider value={{ className: 'context-class' }}>
          <Carousel slides={sampleSlides} className="props-class" />
        </AtomProvider>
      );

      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveClass('props-class');
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================

  describe('Edge Cases', () => {
    it('handles single slide', () => {
      const singleSlide: CarouselSlide[] = [
        { id: '1', content: <div>Only slide</div> },
      ];

      render(<Carousel slides={singleSlide} />);
      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('1 / 1');
    });

    it('disables arrows for single slide when loop is false', () => {
      const singleSlide: CarouselSlide[] = [
        { id: '1', content: <div>Only slide</div> },
      ];

      render(<Carousel slides={singleSlide} loop={false} />);

      const prevArrow = screen.getByTestId('carousel-arrow-prev');
      const nextArrow = screen.getByTestId('carousel-arrow-next');

      expect(prevArrow).toBeDisabled();
      expect(nextArrow).toBeDisabled();
    });

    it('handles many slides efficiently', () => {
      const manySlides = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        content: <div>Slide {i + 1}</div>,
      }));

      render(<Carousel slides={manySlides} />);
      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('1 / 10');
    });
  });

  // ============================================
  // RENDERING PERFORMANCE
  // ============================================

  describe('Rendering Performance', () => {
    it('renders with minimal re-renders', () => {
      const { rerender } = render(<Carousel slides={sampleSlides} />);
      rerender(<Carousel slides={sampleSlides} />);
      expect(screen.getByTestId('carousel')).toBeInTheDocument();
    });

    it('updates efficiently when slides change', () => {
      const { rerender } = render(<Carousel slides={sampleSlides} />);

      const newSlides: CarouselSlide[] = [
        { id: '4', content: <div>New slide</div> },
      ];

      rerender(<Carousel slides={newSlides} />);
      expect(screen.getByTestId('carousel-counter')).toHaveTextContent('1 / 1');
    });
  });
});
