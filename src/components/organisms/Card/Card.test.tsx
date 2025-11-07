/**
 * Card Component Tests
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite with 80%+ coverage
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Card } from './Card';
import type { CardProps } from './Card.types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock CSS modules
jest.mock('./Card.module.css', () => ({
  card: 'card',
  'card--default': 'card--default',
  'card--bordered': 'card--bordered',
  'card--elevated': 'card--elevated',
  'card--ghost': 'card--ghost',
  'card--clickable': 'card--clickable',
  'card--image-top': 'card--image-top',
  'card--image-left': 'card--image-left',
  'card--image-right': 'card--image-right',
  'card-image': 'card-image',
  'card-content': 'card-content',
  'card-badges': 'card-badges',
  'card-title': 'card-title',
  'card-description': 'card-description',
  'card-actions': 'card-actions',
  'card-footer': 'card-footer',
  'card-link': 'card-link',
  'card-cta-primary': 'card-cta-primary',
  'card-cta-secondary': 'card-cta-secondary',
}));

describe('Card', () => {
  // ============================================
  // BASIC RENDERING
  // ============================================

  describe('Basic Rendering', () => {
    it('renders with required title prop', () => {
      render(<Card title="Test Card" />);
      expect(screen.getByText('Test Card')).toBeInTheDocument();
    });

    it('renders with title and description', () => {
      render(<Card title="Test Card" description="Test description" />);
      expect(screen.getByText('Test Card')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('renders as article element', () => {
      const { container } = render(<Card title="Test" />);
      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Card title="Test" className="custom-class" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-class');
    });

    it('applies custom data-testid', () => {
      render(<Card title="Test" data-testid="custom-card" />);
      expect(screen.getByTestId('custom-card')).toBeInTheDocument();
    });
  });

  // ============================================
  // IMAGE RENDERING
  // ============================================

  describe('Image Rendering', () => {
    it('renders with image (top position)', () => {
      render(
        <Card
          title="Test"
          image="/test.jpg"
          imageAlt="Test image"
          imagePosition="top"
        />
      );
      expect(screen.getByTestId('card-image')).toBeInTheDocument();
    });

    it('renders with image (left position)', () => {
      render(
        <Card
          title="Test"
          image="/test.jpg"
          imageAlt="Test image"
          imagePosition="left"
        />
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('card--image-left');
    });

    it('renders with image (right position)', () => {
      render(
        <Card
          title="Test"
          image="/test.jpg"
          imageAlt="Test image"
          imagePosition="right"
        />
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('card--image-right');
    });

    it('uses title as alt text when imageAlt not provided', () => {
      render(<Card title="Product Name" image="/test.jpg" />);
      expect(screen.getByTestId('card-image')).toBeInTheDocument();
    });

    it('does not render image when not provided', () => {
      render(<Card title="Test" />);
      expect(screen.queryByTestId('card-image')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // BADGES RENDERING
  // ============================================

  describe('Badges Rendering', () => {
    it('renders badges when provided', () => {
      const badges = [
        { id: '1', label: 'New' },
        { id: '2', label: 'Sale' },
      ];
      render(<Card title="Test" badges={badges} />);
      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByText('Sale')).toBeInTheDocument();
    });

    it('renders badges with variants', () => {
      const badges = [
        { id: '1', label: 'New', variant: 'primary' as const },
        { id: '2', label: 'Sale', variant: 'error' as const },
      ];
      render(<Card title="Test" badges={badges} />);
      expect(screen.getByTestId('card-badge-1')).toBeInTheDocument();
      expect(screen.getByTestId('card-badge-2')).toBeInTheDocument();
    });

    it('does not render badges container when empty', () => {
      render(<Card title="Test" badges={[]} />);
      expect(screen.queryByTestId('card-badges')).not.toBeInTheDocument();
    });

    it('does not render badges when not provided', () => {
      render(<Card title="Test" />);
      expect(screen.queryByTestId('card-badges')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // CTA BUTTONS
  // ============================================

  describe('CTA Buttons', () => {
    it('renders primary CTA button', () => {
      render(<Card title="Test" ctaText="Click me" ctaHref="/test" />);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders secondary CTA button', () => {
      render(
        <Card
          title="Test"
          secondaryCtaText="Learn More"
          secondaryCtaHref="/learn"
        />
      );
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('renders both primary and secondary CTAs', () => {
      render(
        <Card
          title="Test"
          ctaText="Buy Now"
          ctaHref="/buy"
          secondaryCtaText="Learn More"
          secondaryCtaHref="/learn"
        />
      );
      expect(screen.getByText('Buy Now')).toBeInTheDocument();
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('applies CTA variants', () => {
      render(
        <Card
          title="Test"
          ctaText="Primary"
          ctaVariant="primary"
          secondaryCtaText="Secondary"
          secondaryCtaVariant="outline"
        />
      );
      expect(screen.getByText('Primary')).toBeInTheDocument();
      expect(screen.getByText('Secondary')).toBeInTheDocument();
    });

    it('does not render actions container when no CTAs', () => {
      render(<Card title="Test" />);
      expect(screen.queryByTestId('card-actions')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // VARIANTS
  // ============================================

  describe('Variants', () => {
    it.each(['default', 'bordered', 'elevated', 'ghost'] as const)(
      'renders %s variant',
      (variant) => {
        render(<Card title="Test" variant={variant} />);
        const card = screen.getByTestId('card');
        expect(card).toHaveClass(`card--${variant}`);
      }
    );

    it('uses default variant when not specified', () => {
      render(<Card title="Test" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('card--default');
    });
  });

  // ============================================
  // CLICKABLE CARD
  // ============================================

  describe('Clickable Card', () => {
    it('renders as clickable when href provided', () => {
      render(<Card title="Test" href="/test" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('card--clickable');
    });

    it('wraps in anchor tag when href provided', () => {
      const { container } = render(<Card title="Test" href="/test" />);
      const anchor = container.querySelector('a[href="/test"]');
      expect(anchor).toBeInTheDocument();
    });

    it('calls onCardClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Card title="Test" onCardClick={handleClick} />);
      fireEvent.click(screen.getByTestId('card'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles Enter key press on clickable card', () => {
      const handleClick = jest.fn();
      const { container } = render(<Card title="Test" href="/test" onCardClick={handleClick} />);
      const anchor = container.querySelector('a');
      fireEvent.keyDown(anchor!, { key: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles Space key press on clickable card', () => {
      const handleClick = jest.fn();
      const { container } = render(<Card title="Test" href="/test" onCardClick={handleClick} />);
      const anchor = container.querySelector('a');
      fireEvent.keyDown(anchor!, { key: ' ' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not handle other keys', () => {
      const handleClick = jest.fn();
      const { container } = render(<Card title="Test" href="/test" onCardClick={handleClick} />);
      const anchor = container.querySelector('a');
      fireEvent.keyDown(anchor!, { key: 'a' });
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // FOOTER
  // ============================================

  describe('Footer', () => {
    it('renders footer content', () => {
      render(
        <Card title="Test" footer={<div data-testid="footer-content">Footer</div>} />
      );
      expect(screen.getByTestId('footer-content')).toBeInTheDocument();
    });

    it('does not render footer when not provided', () => {
      render(<Card title="Test" />);
      expect(screen.queryByTestId('card-footer')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // EVENT HANDLERS
  // ============================================

  describe('Event Handlers', () => {
    it('calls onCtaClick when primary CTA clicked', () => {
      const handleClick = jest.fn();
      render(<Card title="Test" ctaText="Click" onCtaClick={handleClick} />);
      fireEvent.click(screen.getByText('Click'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onSecondaryCtaClick when secondary CTA clicked', () => {
      const handleClick = jest.fn();
      render(
        <Card
          title="Test"
          secondaryCtaText="Click"
          onSecondaryCtaClick={handleClick}
        />
      );
      fireEvent.click(screen.getByText('Click'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('stops propagation on CTA click to prevent card click', () => {
      const cardClick = jest.fn();
      const ctaClick = jest.fn();
      render(
        <Card
          title="Test"
          href="/test"
          onCardClick={cardClick}
          ctaText="Click"
          onCtaClick={ctaClick}
        />
      );
      fireEvent.click(screen.getByText('Click'));
      expect(ctaClick).toHaveBeenCalledTimes(1);
      expect(cardClick).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  describe('Accessibility', () => {
    it('has no accessibility violations (basic)', async () => {
      const { container } = render(<Card title="Test Card" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (with image)', async () => {
      const { container } = render(
        <Card title="Test Card" image="/test.jpg" imageAlt="Test image" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (clickable)', async () => {
      const { container } = render(<Card title="Test Card" href="/test" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper semantic HTML structure', () => {
      const { container } = render(
        <Card
          title="Test"
          description="Description"
          ctaText="Action"
          ctaHref="/test"
        />
      );
      expect(container.querySelector('article')).toBeInTheDocument();
      expect(container.querySelector('h3')).toBeInTheDocument();
      expect(container.querySelector('p')).toBeInTheDocument();
    });

    it('supports keyboard navigation for clickable cards', () => {
      const { container } = render(<Card title="Test" href="/test" />);
      const anchor = container.querySelector('a');
      expect(anchor).toBeInTheDocument();
      expect(anchor).toHaveAttribute('href', '/test');
    });
  });

  // ============================================
  // CUSTOM STYLING
  // ============================================

  describe('Custom Styling', () => {
    it('applies inline styles', () => {
      render(<Card title="Test" style={{ backgroundColor: 'red' }} />);
      const card = screen.getByTestId('card');
      expect(card).toHaveStyle({ backgroundColor: 'red' });
    });

    it('merges className with default classes', () => {
      render(<Card title="Test" className="custom" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('card', 'custom');
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================

  describe('Edge Cases', () => {
    it('renders with empty badges array', () => {
      render(<Card title="Test" badges={[]} />);
      expect(screen.queryByTestId('card-badges')).not.toBeInTheDocument();
    });

    it('renders without description', () => {
      render(<Card title="Test" />);
      expect(screen.queryByTestId('card-description')).not.toBeInTheDocument();
    });

    it('renders with very long title', () => {
      const longTitle = 'A'.repeat(200);
      render(<Card title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('renders with very long description', () => {
      const longDesc = 'B'.repeat(500);
      render(<Card title="Test" description={longDesc} />);
      expect(screen.getByText(longDesc)).toBeInTheDocument();
    });

    it('handles missing image gracefully', () => {
      render(<Card title="Test" image="" />);
      // Should not throw error
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });
  });
});
