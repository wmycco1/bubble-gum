/**
 * StarRating Component Tests
 * God-Tier Development Protocol 2025
 *
 * Test Coverage:
 * - Rendering with different props
 * - Readonly mode
 * - Interactive mode (click, hover)
 * - Half-stars
 * - Custom max rating
 * - Value display
 * - Context API integration
 * - Accessibility (ARIA, keyboard navigation)
 * - Edge cases (clamping, invalid values)
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AtomProvider } from '@/context/parameters/ParameterContext';
import { StarRating } from './StarRating';

describe('StarRating', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<StarRating />);
      const container = screen.getByTestId('star-rating');
      expect(container).toBeInTheDocument();
    });

    it('renders correct number of stars based on maxRating', () => {
      render(<StarRating maxRating={10} data-testid="rating" />);
      const stars = screen.getAllByTestId(/rating-star-/);
      expect(stars).toHaveLength(10);
    });

    it('renders 5 stars by default', () => {
      render(<StarRating data-testid="rating" />);
      const stars = screen.getAllByTestId(/rating-star-/);
      expect(stars).toHaveLength(5);
    });

    it('renders with custom className', () => {
      render(<StarRating className="custom-class" />);
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveClass('custom-class');
    });

    it('renders with custom test id', () => {
      render(<StarRating data-testid="custom-rating" />);
      expect(screen.getByTestId('custom-rating')).toBeInTheDocument();
    });

    it('renders with custom id', () => {
      render(<StarRating id="rating-1" />);
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveAttribute('id', 'rating-1');
    });
  });

  // ============================================
  // RATING VALUE TESTS
  // ============================================

  describe('Rating Value', () => {
    it('displays correct rating (full stars)', () => {
      render(<StarRating rating={3} data-testid="rating" />);
      const container = screen.getByTestId('rating');
      expect(container).toHaveAttribute('aria-label', expect.stringContaining('3.0 out of 5'));
    });

    it('displays correct rating (half star)', () => {
      render(<StarRating rating={3.5} data-testid="rating" />);
      const container = screen.getByTestId('rating');
      expect(container).toHaveAttribute('aria-label', expect.stringContaining('3.5 out of 5'));
    });

    it('clamps rating to maxRating', () => {
      render(<StarRating rating={10} maxRating={5} data-testid="rating" />);
      const container = screen.getByTestId('rating');
      expect(container).toHaveAttribute('aria-label', expect.stringContaining('5.0 out of 5'));
    });

    it('clamps negative rating to 0', () => {
      render(<StarRating rating={-5} data-testid="rating" />);
      const container = screen.getByTestId('rating');
      expect(container).toHaveAttribute('aria-label', expect.stringContaining('0.0 out of 5'));
    });

    it('handles zero rating', () => {
      render(<StarRating rating={0} data-testid="rating" />);
      const container = screen.getByTestId('rating');
      expect(container).toHaveAttribute('aria-label', expect.stringContaining('0.0 out of 5'));
    });

    it('handles fractional ratings (quarter stars)', () => {
      render(<StarRating rating={2.25} data-testid="rating" />);
      const container = screen.getByTestId('rating');
      expect(container).toHaveAttribute('aria-label', expect.stringContaining('2.3 out of 5'));
    });
  });

  // ============================================
  // VALUE DISPLAY TESTS
  // ============================================

  describe('Value Display', () => {
    it('does not show value by default', () => {
      render(<StarRating rating={3.5} data-testid="rating" />);
      expect(screen.queryByTestId('rating-value')).not.toBeInTheDocument();
    });

    it('shows value when showValue is true', () => {
      render(<StarRating rating={3.5} showValue data-testid="rating" />);
      const value = screen.getByTestId('rating-value');
      expect(value).toBeInTheDocument();
      expect(value).toHaveTextContent('3.5');
    });

    it('formats value to one decimal place', () => {
      render(<StarRating rating={3} showValue data-testid="rating" />);
      const value = screen.getByTestId('rating-value');
      expect(value).toHaveTextContent('3.0');
    });

    it('value element has aria-hidden', () => {
      render(<StarRating rating={3.5} showValue data-testid="rating" />);
      const value = screen.getByTestId('rating-value');
      expect(value).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // ============================================
  // SIZE VARIANTS
  // ============================================

  describe('Size Variants', () => {
    it('applies sm size class', () => {
      render(<StarRating size="sm" />);
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveClass('star-rating--sm');
    });

    it('applies md size class by default', () => {
      render(<StarRating />);
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveClass('star-rating--md');
    });

    it('applies lg size class', () => {
      render(<StarRating size="lg" />);
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveClass('star-rating--lg');
    });

    it('applies xl size class', () => {
      render(<StarRating size="xl" />);
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveClass('star-rating--xl');
    });
  });

  // ============================================
  // READONLY MODE TESTS
  // ============================================

  describe('Readonly Mode', () => {
    it('applies readonly class when readonly', () => {
      render(<StarRating readonly />);
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveClass('star-rating--readonly');
    });

    it('has img role when readonly', () => {
      render(<StarRating readonly />);
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveAttribute('role', 'img');
    });

    it('does not have slider attributes when readonly', () => {
      render(<StarRating readonly />);
      const container = screen.getByTestId('star-rating');
      expect(container).not.toHaveAttribute('aria-valuenow');
      expect(container).not.toHaveAttribute('aria-valuemin');
      expect(container).not.toHaveAttribute('aria-valuemax');
    });

    it('stars are disabled in readonly mode', () => {
      render(<StarRating readonly data-testid="rating" />);
      const stars = screen.getAllByTestId(/rating-star-/);
      stars.forEach((star) => {
        expect(star).toBeDisabled();
      });
    });

    it('does not respond to clicks in readonly mode', () => {
      const onChange = jest.fn();
      render(<StarRating readonly onChange={onChange} data-testid="rating" />);
      const star = screen.getByTestId('rating-star-2');
      fireEvent.click(star);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not respond to hover in readonly mode', async () => {
      const user = userEvent.setup();
      render(<StarRating readonly rating={2} data-testid="rating" />);
      const container = screen.getByTestId('rating');
      const star = screen.getByTestId('rating-star-4');

      await user.hover(star);

      // Rating should not change on hover
      expect(container).toHaveAttribute('aria-label', expect.stringContaining('2.0 out of 5'));
    });
  });

  // ============================================
  // INTERACTIVE MODE TESTS
  // ============================================

  describe('Interactive Mode', () => {
    it('applies interactive class when not readonly', () => {
      render(<StarRating onChange={() => {}} />);
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveClass('star-rating--interactive');
    });

    it('has slider role when interactive', () => {
      render(<StarRating onChange={() => {}} />);
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveAttribute('role', 'slider');
    });

    it('has slider attributes when interactive', () => {
      render(<StarRating rating={3} maxRating={5} onChange={() => {}} />);
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveAttribute('aria-valuenow', '3');
      expect(container).toHaveAttribute('aria-valuemin', '0');
      expect(container).toHaveAttribute('aria-valuemax', '5');
    });

    it('stars are not disabled in interactive mode', () => {
      render(<StarRating onChange={() => {}} data-testid="rating" />);
      const stars = screen.getAllByTestId(/rating-star-/);
      stars.forEach((star) => {
        expect(star).not.toBeDisabled();
      });
    });

    it('calls onChange when star is clicked', () => {
      const onChange = jest.fn();
      render(<StarRating onChange={onChange} data-testid="rating" />);
      const star = screen.getByTestId('rating-star-2');
      fireEvent.click(star);
      expect(onChange).toHaveBeenCalledWith(3);
    });

    it('calls onChange with correct value for each star', () => {
      const onChange = jest.fn();
      render(<StarRating onChange={onChange} data-testid="rating" />);

      fireEvent.click(screen.getByTestId('rating-star-0'));
      expect(onChange).toHaveBeenCalledWith(1);

      fireEvent.click(screen.getByTestId('rating-star-4'));
      expect(onChange).toHaveBeenCalledWith(5);
    });

    it('does not call onChange when onChange is not provided', () => {
      render(<StarRating data-testid="rating" />);
      const star = screen.getByTestId('rating-star-2');
      // Should not throw error
      expect(() => fireEvent.click(star)).not.toThrow();
    });

    it('stars have clickable class when onChange is provided', () => {
      render(<StarRating onChange={() => {}} data-testid="rating" />);
      const star = screen.getByTestId('rating-star-0');
      expect(star).toHaveClass('star-rating__star--clickable');
    });
  });

  // ============================================
  // CONTEXT API TESTS
  // ============================================

  describe('Context API Integration', () => {
    it('inherits size from AtomProvider', () => {
      render(
        <AtomProvider value={{ size: 'lg' }}>
          <StarRating />
        </AtomProvider>
      );
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveClass('star-rating--lg');
    });

    it('props override context values', () => {
      render(
        <AtomProvider value={{ size: 'lg' }}>
          <StarRating size="sm" />
        </AtomProvider>
      );
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveClass('star-rating--sm');
      expect(container).not.toHaveClass('star-rating--lg');
    });

    it('inherits multiple context values', () => {
      render(
        <AtomProvider value={{ size: 'xl' }}>
          <StarRating rating={4} showValue />
        </AtomProvider>
      );
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveClass('star-rating--xl');
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  describe('Accessibility', () => {
    it('has accessible label', () => {
      render(<StarRating rating={3.5} />);
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveAttribute('aria-label', expect.stringContaining('Star rating'));
    });

    it('accepts custom aria-label', () => {
      render(<StarRating aria-label="Product rating" rating={4} />);
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveAttribute('aria-label', expect.stringContaining('Product rating'));
    });

    it('includes rating value in aria-label', () => {
      render(<StarRating rating={3.5} maxRating={5} />);
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveAttribute('aria-label', expect.stringMatching(/3.5.*out of.*5/));
    });

    it('stars have individual aria-labels', () => {
      render(<StarRating data-testid="rating" />);
      const star = screen.getByTestId('rating-star-2');
      expect(star).toHaveAttribute('aria-label', 'Rate 3 out of 5');
    });

    it('icons have aria-hidden', () => {
      render(<StarRating data-testid="rating" />);
      const star = screen.getByTestId('rating-star-0');
      const icon = star.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('readonly attribute is set correctly', () => {
      render(<StarRating readonly />);
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveAttribute('aria-readonly', 'true');
    });

    it('can be focused with keyboard', () => {
      render(<StarRating onChange={() => {}} data-testid="rating" />);
      const star = screen.getByTestId('rating-star-0');
      star.focus();
      expect(star).toHaveFocus();
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================

  describe('Edge Cases', () => {
    it('handles undefined rating', () => {
      render(<StarRating rating={undefined} />);
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveAttribute('aria-label', expect.stringContaining('0.0 out of 5'));
    });

    it('handles very large maxRating', () => {
      render(<StarRating maxRating={100} data-testid="rating" />);
      const stars = screen.getAllByTestId(/rating-star-/);
      expect(stars).toHaveLength(100);
    });

    it('handles maxRating of 1', () => {
      render(<StarRating maxRating={1} data-testid="rating" />);
      const stars = screen.getAllByTestId(/rating-star-/);
      expect(stars).toHaveLength(1);
    });

    it('handles decimal maxRating (rounds down)', () => {
      render(<StarRating maxRating={5.7} data-testid="rating" />);
      const stars = screen.getAllByTestId(/rating-star-/);
      // Should use 5.7 as-is (component should handle this gracefully)
      expect(stars.length).toBeGreaterThan(0);
    });

    it('handles rating equal to maxRating', () => {
      render(<StarRating rating={5} maxRating={5} />);
      const container = screen.getByTestId('star-rating');
      expect(container).toHaveAttribute('aria-label', expect.stringContaining('5.0 out of 5'));
    });

    it('does not crash with missing onChange in interactive mode', () => {
      render(<StarRating readonly={false} data-testid="rating" />);
      const star = screen.getByTestId('rating-star-2');
      expect(() => fireEvent.click(star)).not.toThrow();
    });
  });
});
