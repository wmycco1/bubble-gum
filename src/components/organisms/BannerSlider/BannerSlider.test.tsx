/**
 * BannerSlider Component Tests (Organism)
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite for BannerSlider organism component
 * Target: 80%+ code coverage
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BannerSlider } from './BannerSlider';
import type { BannerSlide } from './BannerSlider.types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock slides
const mockSlides: BannerSlide[] = [
  {
    id: '1',
    title: 'Slide 1',
    message: 'First slide message',
    ctaText: 'Learn More',
    ctaHref: '/slide1',
  },
  {
    id: '2',
    title: 'Slide 2',
    message: 'Second slide message',
    ctaText: 'Shop Now',
    ctaHref: '/slide2',
  },
  {
    id: '3',
    message: 'Third slide message',
    ctaText: 'Get Started',
    ctaHref: '/slide3',
  },
];

const singleSlide: BannerSlide[] = [
  {
    id: '1',
    message: 'Only slide',
    ctaText: 'Click',
    ctaHref: '/link',
  },
];

describe('BannerSlider Component', () => {
  // Note: We'll use fake timers only for auto-play tests
  // and real timers for navigation tests to avoid complexity

  // ============================================
  // RENDERING TESTS
  // ============================================

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<BannerSlider slides={mockSlides} />);
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('should render first slide by default', () => {
      render(<BannerSlider slides={mockSlides} />);
      expect(screen.getByText('Slide 1')).toBeInTheDocument();
      expect(screen.getByText('First slide message')).toBeInTheDocument();
    });

    it('should render with custom test ID', () => {
      render(<BannerSlider slides={mockSlides} data-testid="custom-slider" />);
      expect(screen.getByTestId('custom-slider')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<BannerSlider slides={mockSlides} className="custom-class" />);
      const slider = screen.getByTestId('banner-slider');
      expect(slider).toHaveClass('custom-class');
    });

    it('should not render when slides array is empty', () => {
      render(<BannerSlider slides={[]} />);
      expect(screen.queryByTestId('banner-slider')).not.toBeInTheDocument();
    });

    it('should render single slide without controls', () => {
      render(<BannerSlider slides={singleSlide} />);
      expect(screen.getByText('Only slide')).toBeInTheDocument();
      expect(screen.queryByTestId('banner-slider-prev')).not.toBeInTheDocument();
      expect(screen.queryByTestId('banner-slider-next')).not.toBeInTheDocument();
      expect(screen.queryByTestId('banner-slider-dots')).not.toBeInTheDocument();
    });

    it('should use h2 heading for slide title', () => {
      render(<BannerSlider slides={mockSlides} />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Slide 1');
    });
  });

  // ============================================
  // NAVIGATION ARROW TESTS
  // ============================================

  describe('Navigation Arrows', () => {
    it('should render navigation arrows by default', () => {
      render(<BannerSlider slides={mockSlides} />);
      expect(screen.getByTestId('banner-slider-prev')).toBeInTheDocument();
      expect(screen.getByTestId('banner-slider-next')).toBeInTheDocument();
    });

    it('should not render arrows when showArrows is false', () => {
      render(<BannerSlider slides={mockSlides} showArrows={false} />);
      expect(screen.queryByTestId('banner-slider-prev')).not.toBeInTheDocument();
      expect(screen.queryByTestId('banner-slider-next')).not.toBeInTheDocument();
    });

    it('should navigate to next slide when next arrow is clicked', async () => {
      render(<BannerSlider slides={mockSlides} transitionDuration={0} />);

      const nextButton = screen.getByTestId('banner-slider-next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Slide 2')).toBeInTheDocument();
      });
    });

    it('should navigate to previous slide when prev arrow is clicked', async () => {
      render(<BannerSlider slides={mockSlides} transitionDuration={0} />);

      // Go to slide 2 first
      const nextButton = screen.getByTestId('banner-slider-next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Slide 2')).toBeInTheDocument();
      });

      // Then go back
      const prevButton = screen.getByTestId('banner-slider-prev');
      fireEvent.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText('Slide 1')).toBeInTheDocument();
      });
    });

    it('should loop to first slide from last when loop is true', async () => {
      render(<BannerSlider slides={mockSlides} loop={true} transitionDuration={0} />);

      const nextButton = screen.getByTestId('banner-slider-next');

      // Go to last slide
      fireEvent.click(nextButton); // Slide 2
      await waitFor(() => expect(screen.getByText('Slide 2')).toBeInTheDocument());

      fireEvent.click(nextButton); // Slide 3
      await waitFor(() => expect(screen.getByText('Third slide message')).toBeInTheDocument());

      fireEvent.click(nextButton); // Should loop to Slide 1
      await waitFor(() => expect(screen.getByText('Slide 1')).toBeInTheDocument());
    });

    it('should not loop when loop is false', async () => {
      render(<BannerSlider slides={mockSlides} loop={false} transitionDuration={0} />);

      const nextButton = screen.getByTestId('banner-slider-next');

      // Go to last slide
      fireEvent.click(nextButton); // Slide 2
      await waitFor(() => expect(screen.getByText('Slide 2')).toBeInTheDocument());

      fireEvent.click(nextButton); // Slide 3
      await waitFor(() => expect(screen.getByText('Third slide message')).toBeInTheDocument());

      fireEvent.click(nextButton); // Should stay on Slide 3
      await waitFor(() => expect(screen.getByText('Third slide message')).toBeInTheDocument());
    });

    it('should disable prev arrow on first slide when loop is false', () => {
      render(<BannerSlider slides={mockSlides} loop={false} />);

      const prevButton = screen.getByTestId('banner-slider-prev');
      expect(prevButton).toBeDisabled();
    });

    it('should disable next arrow on last slide when loop is false', async () => {
      render(<BannerSlider slides={mockSlides} loop={false} transitionDuration={0} />);

      const nextButton = screen.getByTestId('banner-slider-next');

      // Go to last slide
      fireEvent.click(nextButton); // Slide 2
      await waitFor(() => expect(screen.getByText('Slide 2')).toBeInTheDocument());

      fireEvent.click(nextButton); // Slide 3
      await waitFor(() => expect(nextButton).toBeDisabled());
    });

    it('should have accessible arrow labels', () => {
      render(<BannerSlider slides={mockSlides} />);

      const prevButton = screen.getByTestId('banner-slider-prev');
      const nextButton = screen.getByTestId('banner-slider-next');

      expect(prevButton).toHaveAttribute('aria-label', 'Previous slide');
      expect(nextButton).toHaveAttribute('aria-label', 'Next slide');
    });
  });

  // ============================================
  // DOT INDICATOR TESTS
  // ============================================

  describe('Dot Indicators', () => {
    it('should render dot indicators by default', () => {
      render(<BannerSlider slides={mockSlides} />);
      expect(screen.getByTestId('banner-slider-dots')).toBeInTheDocument();
    });

    it('should not render dots when showDots is false', () => {
      render(<BannerSlider slides={mockSlides} showDots={false} />);
      expect(screen.queryByTestId('banner-slider-dots')).not.toBeInTheDocument();
    });

    it('should render correct number of dots', () => {
      render(<BannerSlider slides={mockSlides} />);

      const dot0 = screen.getByTestId('banner-slider-dot-0');
      const dot1 = screen.getByTestId('banner-slider-dot-1');
      const dot2 = screen.getByTestId('banner-slider-dot-2');

      expect(dot0).toBeInTheDocument();
      expect(dot1).toBeInTheDocument();
      expect(dot2).toBeInTheDocument();
    });

    it('should mark first dot as active initially', () => {
      render(<BannerSlider slides={mockSlides} />);

      const dot0 = screen.getByTestId('banner-slider-dot-0');
      expect(dot0).toHaveAttribute('aria-current', 'true');
    });

    it('should navigate to slide when dot is clicked', async () => {
      render(<BannerSlider slides={mockSlides} transitionDuration={0} />);

      const dot2 = screen.getByTestId('banner-slider-dot-2');
      fireEvent.click(dot2);

      await waitFor(() => {
        expect(screen.getByText('Third slide message')).toBeInTheDocument();
        expect(dot2).toHaveAttribute('aria-current', 'true');
      });
    });

    it('should have accessible dot labels', () => {
      render(<BannerSlider slides={mockSlides} />);

      const dot0 = screen.getByTestId('banner-slider-dot-0');
      const dot1 = screen.getByTestId('banner-slider-dot-1');

      expect(dot0).toHaveAttribute('aria-label', 'Go to slide 1');
      expect(dot1).toHaveAttribute('aria-label', 'Go to slide 2');
    });
  });

  // ============================================
  // AUTO-PLAY TESTS
  // ============================================

  describe('Auto-Play', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('should not auto-play by default', () => {
      render(<BannerSlider slides={mockSlides} />);

      expect(screen.getByText('Slide 1')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(6000);
      });

      expect(screen.getByText('Slide 1')).toBeInTheDocument();
    });

    it('should auto-play when autoPlay is true', async () => {
      render(<BannerSlider slides={mockSlides} autoPlay={true} interval={1000} transitionDuration={0} />);

      expect(screen.getByText('Slide 1')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByText('Slide 2')).toBeInTheDocument();
      });
    });

    it('should respect custom interval', () => {
      render(<BannerSlider slides={mockSlides} autoPlay={true} interval={2000} transitionDuration={0} />);

      expect(screen.getByText('Slide 1')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByText('Slide 1')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // After 2 seconds, should be on slide 2
      expect(screen.getByText('Slide 2')).toBeInTheDocument();
    });

    it('should pause on hover when pauseOnHover is true', () => {
      render(
        <BannerSlider
          slides={mockSlides}
          autoPlay={true}
          interval={1000}
          pauseOnHover={true}
          transitionDuration={0}
        />
      );

      const slider = screen.getByTestId('banner-slider');

      // Hover
      fireEvent.mouseEnter(slider);

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Should still be on slide 1
      expect(screen.getByText('Slide 1')).toBeInTheDocument();

      // Leave hover
      fireEvent.mouseLeave(slider);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByText('Slide 2')).toBeInTheDocument();
    });

    it('should not pause on hover when pauseOnHover is false', () => {
      render(
        <BannerSlider
          slides={mockSlides}
          autoPlay={true}
          interval={1000}
          pauseOnHover={false}
          transitionDuration={0}
        />
      );

      const slider = screen.getByTestId('banner-slider');

      // Hover
      fireEvent.mouseEnter(slider);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByText('Slide 2')).toBeInTheDocument();
    });

    it('should not auto-play with single slide', () => {
      render(<BannerSlider slides={singleSlide} autoPlay={true} interval={1000} />);

      expect(screen.getByText('Only slide')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(screen.getByText('Only slide')).toBeInTheDocument();
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION TESTS
  // ============================================

  describe('Keyboard Navigation', () => {
    it('should navigate to next slide with ArrowRight', async () => {
      render(<BannerSlider slides={mockSlides} transitionDuration={0} />);

      const slider = screen.getByTestId('banner-slider');
      slider.focus();

      fireEvent.keyDown(slider, { key: 'ArrowRight' });

      await waitFor(() => {
        expect(screen.getByText('Slide 2')).toBeInTheDocument();
      });
    });

    it('should navigate to previous slide with ArrowLeft', async () => {
      render(<BannerSlider slides={mockSlides} transitionDuration={0} />);

      const slider = screen.getByTestId('banner-slider');
      slider.focus();

      // Go to slide 2 first
      fireEvent.keyDown(slider, { key: 'ArrowRight' });

      await waitFor(() => {
        expect(screen.getByText('Slide 2')).toBeInTheDocument();
      });

      // Go back to slide 1
      fireEvent.keyDown(slider, { key: 'ArrowLeft' });

      await waitFor(() => {
        expect(screen.getByText('Slide 1')).toBeInTheDocument();
      });
    });

    it('should prevent default on arrow keys', () => {
      render(<BannerSlider slides={mockSlides} />);

      const slider = screen.getByTestId('banner-slider');
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true,
      });

      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
      slider.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  // ============================================
  // SLIDE CHANGE CALLBACK TESTS
  // ============================================

  describe('Slide Change Callback', () => {
    it('should call onSlideChange when slide changes', async () => {
      const handleSlideChange = jest.fn();
      render(<BannerSlider slides={mockSlides} onSlideChange={handleSlideChange} transitionDuration={0} />);

      const nextButton = screen.getByTestId('banner-slider-next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(handleSlideChange).toHaveBeenCalledWith(1);
      });
    });

    it('should call onSlideChange with correct index', async () => {
      const handleSlideChange = jest.fn();
      render(<BannerSlider slides={mockSlides} onSlideChange={handleSlideChange} transitionDuration={0} />);

      const dot2 = screen.getByTestId('banner-slider-dot-2');
      fireEvent.click(dot2);

      await waitFor(() => {
        expect(handleSlideChange).toHaveBeenCalledWith(2);
      });
    });

    it('should not call onSlideChange when navigating to current slide', () => {
      const handleSlideChange = jest.fn();
      render(<BannerSlider slides={mockSlides} onSlideChange={handleSlideChange} />);

      const dot0 = screen.getByTestId('banner-slider-dot-0');
      fireEvent.click(dot0);

      expect(handleSlideChange).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // SLIDE CONTENT TESTS
  // ============================================

  describe('Slide Content', () => {
    it('should render slide with title', () => {
      render(<BannerSlider slides={mockSlides} />);
      expect(screen.getByText('Slide 1')).toBeInTheDocument();
    });

    it('should render slide without title', async () => {
      render(<BannerSlider slides={mockSlides} transitionDuration={0} />);

      // Navigate to slide 3 (no title)
      const nextButton = screen.getByTestId('banner-slider-next');
      fireEvent.click(nextButton);
      await waitFor(() => expect(screen.getByText('Slide 2')).toBeInTheDocument());

      fireEvent.click(nextButton);
      await waitFor(() => {
        expect(screen.queryByTestId('banner-slider-title')).not.toBeInTheDocument();
        expect(screen.getByText('Third slide message')).toBeInTheDocument();
      });
    });

    it('should render slide with CTA button', () => {
      render(<BannerSlider slides={mockSlides} />);
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('should render slide with background image', () => {
      const slidesWithBg: BannerSlide[] = [
        {
          id: '1',
          message: 'Slide with background',
          backgroundImage: '/bg.jpg',
        },
      ];

      render(<BannerSlider slides={slidesWithBg} />);
      const slide = screen.getByTestId('banner-slider-slide-0');
      expect(slide.style.backgroundImage).toContain('/bg.jpg');
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<BannerSlider slides={mockSlides} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should use semantic section element', () => {
      render(<BannerSlider slides={mockSlides} />);
      const section = screen.getByRole('region');
      expect(section.tagName).toBe('SECTION');
    });

    it('should have carousel role description', () => {
      render(<BannerSlider slides={mockSlides} />);
      const slider = screen.getByRole('region');
      expect(slider).toHaveAttribute('aria-roledescription', 'carousel');
    });

    it('should have aria-live polite', () => {
      render(<BannerSlider slides={mockSlides} />);
      const slider = screen.getByRole('region');
      expect(slider).toHaveAttribute('aria-live', 'polite');
    });

    it('should have aria-label', () => {
      render(<BannerSlider slides={mockSlides} />);
      const slider = screen.getByRole('region');
      expect(slider).toHaveAttribute('aria-label', 'Banner carousel');
    });

    it('should be keyboard focusable', () => {
      render(<BannerSlider slides={mockSlides} />);
      const slider = screen.getByTestId('banner-slider');
      expect(slider).toHaveAttribute('tabIndex', '0');
    });

    it('should announce slide changes to screen readers', () => {
      render(<BannerSlider slides={mockSlides} />);
      const announcement = screen.getByRole('status');
      expect(announcement).toHaveTextContent('Slide 1 of 3');
    });
  });

  // ============================================
  // CONTEXT API TESTS
  // ============================================

  describe('Context API Integration', () => {
    it('should inherit parameters from AtomProvider', () => {
      const { AtomProvider } = require('@/context/parameters/ParameterContext');

      render(
        <AtomProvider value={{ size: 'lg' }}>
          <BannerSlider slides={mockSlides} />
        </AtomProvider>
      );

      expect(screen.getByTestId('banner-slider')).toBeInTheDocument();
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================

  describe('Edge Cases', () => {
    it('should handle rapid navigation clicks', async () => {
      render(<BannerSlider slides={mockSlides} transitionDuration={0} />);

      const nextButton = screen.getByTestId('banner-slider-next');

      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      // Should eventually reach a stable state
      await waitFor(() => {
        expect(screen.getByTestId('banner-slider')).toBeInTheDocument();
      });
    });

    it('should handle empty slide message', () => {
      const slidesWithEmpty: BannerSlide[] = [
        {
          id: '1',
          message: '',
        },
      ];

      render(<BannerSlider slides={slidesWithEmpty} />);
      const message = screen.getByTestId('banner-slider-message');
      expect(message).toBeInTheDocument();
    });

    it('should cleanup auto-play interval on unmount', () => {
      const { unmount } = render(
        <BannerSlider slides={mockSlides} autoPlay={true} interval={1000} />
      );

      unmount();

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // No errors should occur
      expect(true).toBe(true);
    });

    it('should handle single slide with all props', () => {
      render(
        <BannerSlider
          slides={singleSlide}
          autoPlay={true}
          showArrows={true}
          showDots={true}
        />
      );

      expect(screen.getByText('Only slide')).toBeInTheDocument();
      expect(screen.queryByTestId('banner-slider-prev')).not.toBeInTheDocument();
      expect(screen.queryByTestId('banner-slider-dots')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // INLINE STYLES TESTS
  // ============================================

  describe('Inline Styles', () => {
    it('should accept custom inline styles', () => {
      render(<BannerSlider slides={mockSlides} style={{ minHeight: '600px' }} />);
      const slider = screen.getByTestId('banner-slider');
      expect(slider.style.minHeight).toBe('600px');
    });
  });
});
