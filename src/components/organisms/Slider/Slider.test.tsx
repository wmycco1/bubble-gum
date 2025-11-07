/**
 * Slider Component Tests
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite with 80%+ coverage
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Slider } from './Slider';
import type { SliderProps, SliderItem } from './Slider.types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock CSS modules
jest.mock('./Slider.module.css', () => ({
  slider: 'slider',
  'slider--center': 'slider--center',
  'slider-viewport': 'slider-viewport',
  'slider-track': 'slider-track',
  'slider-slide': 'slider-slide',
  'slider-arrow-prev': 'slider-arrow-prev',
  'slider-arrow-next': 'slider-arrow-next',
  'slider-dots': 'slider-dots',
  'slider-dot': 'slider-dot',
  'slider-dot--active': 'slider-dot--active',
}));

// Mock atoms
jest.mock('@/components/atoms/Button', () => ({
  Button: ({ children, onClick, disabled, 'data-testid': testId, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} data-testid={testId} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/atoms/Icon', () => ({
  Icon: ({ name, 'data-testid': testId }: any) => (
    <span data-testid={testId || `icon-${name}`}>{name}</span>
  ),
}));

// Helper: Create mock slides
const createSlides = (count: number): SliderItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `slide-${i + 1}`,
    content: <div data-testid={`content-${i + 1}`}>Slide {i + 1}</div>,
  }));

describe('Slider', () => {
  // ============================================
  // BASIC RENDERING
  // ============================================

  describe('Basic Rendering', () => {
    it('renders with items', () => {
      const items = createSlides(3);
      render(<Slider items={items} />);
      expect(screen.getByTestId('slider')).toBeInTheDocument();
      expect(screen.getByTestId('content-1')).toBeInTheDocument();
      expect(screen.getByTestId('content-2')).toBeInTheDocument();
      expect(screen.getByTestId('content-3')).toBeInTheDocument();
    });

    it('renders correct number of slides', () => {
      const items = createSlides(5);
      render(<Slider items={items} />);
      items.forEach((item) => {
        expect(screen.getByTestId(`slider-slide-${item.id}`)).toBeInTheDocument();
      });
    });

    it('applies custom className', () => {
      const items = createSlides(2);
      render(<Slider items={items} className="custom-slider" />);
      expect(screen.getByTestId('slider')).toHaveClass('custom-slider');
    });

    it('applies custom data-testid', () => {
      const items = createSlides(2);
      render(<Slider items={items} data-testid="my-slider" />);
      expect(screen.getByTestId('my-slider')).toBeInTheDocument();
    });

    it('applies inline styles', () => {
      const items = createSlides(2);
      render(<Slider items={items} style={{ backgroundColor: 'red' }} />);
      expect(screen.getByTestId('slider')).toHaveStyle({ backgroundColor: 'red' });
    });
  });

  // ============================================
  // SLIDES PER VIEW
  // ============================================

  describe('Slides Per View', () => {
    it('defaults to 1 slide per view', () => {
      const items = createSlides(3);
      render(<Slider items={items} />);
      const track = screen.getByTestId('slider-track');
      expect(track).toBeInTheDocument();
    });

    it('renders with 2 slides per view', () => {
      const items = createSlides(4);
      render(<Slider items={items} slidesPerView={2} />);
      expect(screen.getByTestId('slider-track')).toBeInTheDocument();
    });

    it('renders with 3 slides per view', () => {
      const items = createSlides(6);
      render(<Slider items={items} slidesPerView={3} />);
      expect(screen.getByTestId('slider-track')).toBeInTheDocument();
    });

    it('renders with 4 slides per view', () => {
      const items = createSlides(8);
      render(<Slider items={items} slidesPerView={4} />);
      expect(screen.getByTestId('slider-track')).toBeInTheDocument();
    });
  });

  // ============================================
  // NAVIGATION ARROWS
  // ============================================

  describe('Navigation Arrows', () => {
    it('shows arrows by default', () => {
      const items = createSlides(3);
      render(<Slider items={items} />);
      expect(screen.getByTestId('slider-arrow-prev')).toBeInTheDocument();
      expect(screen.getByTestId('slider-arrow-next')).toBeInTheDocument();
    });

    it('hides arrows when showArrows is false', () => {
      const items = createSlides(3);
      render(<Slider items={items} showArrows={false} />);
      expect(screen.queryByTestId('slider-arrow-prev')).not.toBeInTheDocument();
      expect(screen.queryByTestId('slider-arrow-next')).not.toBeInTheDocument();
    });

    it('disables previous arrow on first slide (no loop)', () => {
      const items = createSlides(3);
      render(<Slider items={items} loop={false} />);
      const prevButton = screen.getByTestId('slider-arrow-prev');
      expect(prevButton).toBeDisabled();
    });

    it('enables next arrow on first slide', () => {
      const items = createSlides(3);
      render(<Slider items={items} loop={false} />);
      const nextButton = screen.getByTestId('slider-arrow-next');
      expect(nextButton).not.toBeDisabled();
    });

    it('navigates to next slide on next arrow click', () => {
      const items = createSlides(3);
      const handleChange = jest.fn();
      render(<Slider items={items} onSlideChange={handleChange} />);

      fireEvent.click(screen.getByTestId('slider-arrow-next'));

      expect(handleChange).toHaveBeenCalledWith(1);
    });

    it('navigates to previous slide on prev arrow click', () => {
      const items = createSlides(3);
      const handleChange = jest.fn();
      render(<Slider items={items} onSlideChange={handleChange} />);

      // Go to second slide first
      fireEvent.click(screen.getByTestId('slider-arrow-next'));
      // Then go back
      fireEvent.click(screen.getByTestId('slider-arrow-prev'));

      expect(handleChange).toHaveBeenCalledWith(0);
    });

    it('hides arrows when only one page', () => {
      const items = createSlides(2);
      render(<Slider items={items} slidesPerView={2} />);
      expect(screen.queryByTestId('slider-arrow-prev')).not.toBeInTheDocument();
      expect(screen.queryByTestId('slider-arrow-next')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // DOT INDICATORS
  // ============================================

  describe('Dot Indicators', () => {
    it('shows dots by default', () => {
      const items = createSlides(3);
      render(<Slider items={items} />);
      expect(screen.getByTestId('slider-dots')).toBeInTheDocument();
    });

    it('hides dots when showDots is false', () => {
      const items = createSlides(3);
      render(<Slider items={items} showDots={false} />);
      expect(screen.queryByTestId('slider-dots')).not.toBeInTheDocument();
    });

    it('renders correct number of dots', () => {
      const items = createSlides(5);
      render(<Slider items={items} />);
      expect(screen.getByTestId('slider-dot-0')).toBeInTheDocument();
      expect(screen.getByTestId('slider-dot-4')).toBeInTheDocument();
    });

    it('activates first dot by default', () => {
      const items = createSlides(3);
      render(<Slider items={items} />);
      const firstDot = screen.getByTestId('slider-dot-0');
      expect(firstDot).toHaveClass('slider-dot--active');
    });

    it('navigates to slide on dot click', () => {
      const items = createSlides(5);
      const handleChange = jest.fn();
      render(<Slider items={items} onSlideChange={handleChange} />);

      fireEvent.click(screen.getByTestId('slider-dot-2'));

      expect(handleChange).toHaveBeenCalledWith(2);
    });

    it('updates active dot after navigation', () => {
      const items = createSlides(3);
      render(<Slider items={items} />);

      fireEvent.click(screen.getByTestId('slider-arrow-next'));

      const secondDot = screen.getByTestId('slider-dot-1');
      expect(secondDot).toHaveClass('slider-dot--active');
    });

    it('hides dots when only one page', () => {
      const items = createSlides(2);
      render(<Slider items={items} slidesPerView={2} />);
      expect(screen.queryByTestId('slider-dots')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // LOOP MODE
  // ============================================

  describe('Loop Mode', () => {
    it('disables loop by default', () => {
      const items = createSlides(3);
      render(<Slider items={items} />);
      const prevButton = screen.getByTestId('slider-arrow-prev');
      expect(prevButton).toBeDisabled();
    });

    it('enables navigation beyond bounds with loop', () => {
      const items = createSlides(3);
      render(<Slider items={items} loop={true} />);
      const prevButton = screen.getByTestId('slider-arrow-prev');
      expect(prevButton).not.toBeDisabled();
    });

    it('wraps to last slide on prev from first (loop)', () => {
      const items = createSlides(3);
      const handleChange = jest.fn();
      render(<Slider items={items} loop={true} onSlideChange={handleChange} />);

      fireEvent.click(screen.getByTestId('slider-arrow-prev'));

      expect(handleChange).toHaveBeenCalledWith(2);
    });

    it('wraps to first slide on next from last (loop)', () => {
      const items = createSlides(3);
      const handleChange = jest.fn();
      render(<Slider items={items} loop={true} onSlideChange={handleChange} />);

      // Go to last slide
      fireEvent.click(screen.getByTestId('slider-dot-2'));
      // Then click next
      fireEvent.click(screen.getByTestId('slider-arrow-next'));

      expect(handleChange).toHaveBeenCalledWith(0);
    });
  });

  // ============================================
  // AUTO-PLAY
  // ============================================

  describe('Auto-Play', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('does not auto-play by default', () => {
      const items = createSlides(3);
      const handleChange = jest.fn();
      render(<Slider items={items} onSlideChange={handleChange} />);

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('auto-plays when enabled', () => {
      const items = createSlides(3);
      render(<Slider items={items} autoPlay={true} interval={1000} />);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      const secondDot = screen.getByTestId('slider-dot-1');
      expect(secondDot).toHaveClass('slider-dot--active');
    });

    it('uses custom interval', () => {
      const items = createSlides(3);
      render(<Slider items={items} autoPlay={true} interval={2000} />);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      const firstDot = screen.getByTestId('slider-dot-0');
      expect(firstDot).toHaveClass('slider-dot--active');

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      const secondDot = screen.getByTestId('slider-dot-1');
      expect(secondDot).toHaveClass('slider-dot--active');
    });

    it('pauses on hover', () => {
      const items = createSlides(3);
      render(<Slider items={items} autoPlay={true} interval={1000} />);

      fireEvent.mouseEnter(screen.getByTestId('slider'));

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      const firstDot = screen.getByTestId('slider-dot-0');
      expect(firstDot).toHaveClass('slider-dot--active');
    });

    it('resumes after mouse leave', () => {
      const items = createSlides(3);
      render(<Slider items={items} autoPlay={true} interval={1000} />);

      fireEvent.mouseEnter(screen.getByTestId('slider'));
      fireEvent.mouseLeave(screen.getByTestId('slider'));

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      const secondDot = screen.getByTestId('slider-dot-1');
      expect(secondDot).toHaveClass('slider-dot--active');
    });

    it('stops at last slide without loop', () => {
      const items = createSlides(2);
      render(<Slider items={items} autoPlay={true} interval={1000} loop={false} />);

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      const lastDot = screen.getByTestId('slider-dot-1');
      expect(lastDot).toHaveClass('slider-dot--active');
    });

    it('loops with auto-play', () => {
      const items = createSlides(2);
      render(<Slider items={items} autoPlay={true} interval={1000} loop={true} />);

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      const firstDot = screen.getByTestId('slider-dot-0');
      expect(firstDot).toHaveClass('slider-dot--active');
    });
  });

  // ============================================
  // CENTER MODE
  // ============================================

  describe('Center Mode', () => {
    it('applies center mode class', () => {
      const items = createSlides(3);
      render(<Slider items={items} centerMode={true} />);
      expect(screen.getByTestId('slider')).toHaveClass('slider--center');
    });

    it('does not apply center mode by default', () => {
      const items = createSlides(3);
      render(<Slider items={items} />);
      expect(screen.getByTestId('slider')).not.toHaveClass('slider--center');
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================

  describe('Keyboard Navigation', () => {
    it('navigates to next slide on ArrowRight', () => {
      const items = createSlides(3);
      const handleChange = jest.fn();
      render(<Slider items={items} onSlideChange={handleChange} />);

      fireEvent.keyDown(screen.getByTestId('slider'), { key: 'ArrowRight' });

      expect(handleChange).toHaveBeenCalledWith(1);
    });

    it('navigates to previous slide on ArrowLeft', () => {
      const items = createSlides(3);
      const handleChange = jest.fn();
      render(<Slider items={items} onSlideChange={handleChange} />);

      // Go to second slide first
      fireEvent.click(screen.getByTestId('slider-arrow-next'));
      // Then use keyboard
      fireEvent.keyDown(screen.getByTestId('slider'), { key: 'ArrowLeft' });

      expect(handleChange).toHaveBeenCalledWith(0);
    });

    it('ignores other keys', () => {
      const items = createSlides(3);
      const handleChange = jest.fn();
      render(<Slider items={items} onSlideChange={handleChange} />);

      fireEvent.keyDown(screen.getByTestId('slider'), { key: 'Enter' });

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // SPACE BETWEEN
  // ============================================

  describe('Space Between', () => {
    it('applies default space between', () => {
      const items = createSlides(3);
      render(<Slider items={items} />);
      const track = screen.getByTestId('slider-track');
      expect(track).toHaveStyle({ gap: '16px' });
    });

    it('applies custom space between', () => {
      const items = createSlides(3);
      render(<Slider items={items} spaceBetween={24} />);
      const track = screen.getByTestId('slider-track');
      expect(track).toHaveStyle({ gap: '24px' });
    });

    it('applies zero space between', () => {
      const items = createSlides(3);
      render(<Slider items={items} spaceBetween={0} />);
      const track = screen.getByTestId('slider-track');
      expect(track).toHaveStyle({ gap: '0px' });
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const items = createSlides(3);
      const { container } = render(<Slider items={items} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper ARIA attributes on slider', () => {
      const items = createSlides(3);
      render(<Slider items={items} />);
      const slider = screen.getByTestId('slider');
      expect(slider).toHaveAttribute('role', 'region');
      expect(slider).toHaveAttribute('aria-label', 'Content slider');
      expect(slider).toHaveAttribute('aria-roledescription', 'carousel');
    });

    it('has proper ARIA attributes on slides', () => {
      const items = createSlides(3);
      render(<Slider items={items} />);
      const firstSlide = screen.getByTestId('slider-slide-slide-1');
      expect(firstSlide).toHaveAttribute('role', 'group');
      expect(firstSlide).toHaveAttribute('aria-roledescription', 'slide');
      expect(firstSlide).toHaveAttribute('aria-label', 'Slide 1 of 3');
    });

    it('has proper ARIA attributes on dots', () => {
      const items = createSlides(3);
      render(<Slider items={items} />);
      const dots = screen.getByTestId('slider-dots');
      expect(dots).toHaveAttribute('role', 'tablist');
      expect(dots).toHaveAttribute('aria-label', 'Slide navigation');
    });

    it('has proper ARIA attributes on individual dots', () => {
      const items = createSlides(3);
      render(<Slider items={items} />);
      const firstDot = screen.getByTestId('slider-dot-0');
      expect(firstDot).toHaveAttribute('role', 'tab');
      expect(firstDot).toHaveAttribute('aria-selected', 'true');
      expect(firstDot).toHaveAttribute('aria-label', 'Go to slide 1');
    });

    it('announces current slide to screen readers', () => {
      const items = createSlides(3);
      render(<Slider items={items} />);
      expect(screen.getByText('Slide 1 of 3')).toBeInTheDocument();
    });

    it('updates screen reader announcement on navigation', () => {
      const items = createSlides(3);
      render(<Slider items={items} />);

      fireEvent.click(screen.getByTestId('slider-arrow-next'));

      expect(screen.getByText('Slide 2 of 3')).toBeInTheDocument();
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================

  describe('Edge Cases', () => {
    it('handles single slide', () => {
      const items = createSlides(1);
      render(<Slider items={items} />);
      expect(screen.getByTestId('content-1')).toBeInTheDocument();
      expect(screen.queryByTestId('slider-arrow-prev')).not.toBeInTheDocument();
    });

    it('handles empty items array', () => {
      render(<Slider items={[]} />);
      expect(screen.getByTestId('slider')).toBeInTheDocument();
    });

    it('handles slides per view greater than items', () => {
      const items = createSlides(2);
      render(<Slider items={items} slidesPerView={5} />);
      expect(screen.getByTestId('slider-track')).toBeInTheDocument();
    });

    it('handles very large number of slides', () => {
      const items = createSlides(100);
      render(<Slider items={items} />);
      expect(screen.getByTestId('slider-track')).toBeInTheDocument();
    });
  });
});
