/**
 * CTA Component Tests
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite with 80%+ coverage
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CTA } from './CTA';
import type { CTAProps } from './CTA.types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock CSS modules
jest.mock('./CTA.module.css', () => ({
  cta: 'cta',
  'cta--default': 'cta--default',
  'cta--outlined': 'cta--outlined',
  'cta--filled': 'cta--filled',
  'cta--centered': 'cta--centered',
  'cta--split': 'cta--split',
  'cta--full-width': 'cta--full-width',
  'cta--with-bg-image': 'cta--with-bg-image',
  'cta--with-side-image': 'cta--with-side-image',
  'cta--image-left': 'cta--image-left',
  'cta--image-right': 'cta--image-right',
  'cta-overlay': 'cta-overlay',
  'cta-container': 'cta-container',
  'cta-content': 'cta-content',
  'cta-title': 'cta-title',
  'cta-description': 'cta-description',
  'cta-actions': 'cta-actions',
  'cta-primary': 'cta-primary',
  'cta-secondary': 'cta-secondary',
  'cta-image': 'cta-image',
}));

describe('CTA', () => {
  // ============================================
  // BASIC RENDERING
  // ============================================

  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      render(<CTA title="Test CTA" primaryCtaText="Click me" />);
      expect(screen.getByText('Test CTA')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders with title and description', () => {
      render(
        <CTA
          title="Test CTA"
          description="Test description"
          primaryCtaText="Action"
        />
      );
      expect(screen.getByText('Test CTA')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('renders as section element', () => {
      const { container } = render(
        <CTA title="Test" primaryCtaText="Action" />
      );
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <CTA
          title="Test"
          primaryCtaText="Action"
          className="custom-class"
        />
      );
      const cta = screen.getByTestId('cta');
      expect(cta).toHaveClass('custom-class');
    });

    it('applies custom data-testid', () => {
      render(
        <CTA
          title="Test"
          primaryCtaText="Action"
          data-testid="custom-cta"
        />
      );
      expect(screen.getByTestId('custom-cta')).toBeInTheDocument();
    });
  });

  // ============================================
  // DESCRIPTION RENDERING
  // ============================================

  describe('Description Rendering', () => {
    it('renders description when provided', () => {
      render(
        <CTA
          title="Test"
          description="Test description"
          primaryCtaText="Action"
        />
      );
      expect(screen.getByTestId('cta-description')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('does not render description when not provided', () => {
      render(<CTA title="Test" primaryCtaText="Action" />);
      expect(screen.queryByTestId('cta-description')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // PRIMARY CTA BUTTON
  // ============================================

  describe('Primary CTA Button', () => {
    it('renders primary CTA button', () => {
      render(<CTA title="Test" primaryCtaText="Click me" />);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders primary CTA with href', () => {
      render(
        <CTA
          title="Test"
          primaryCtaText="Click"
          primaryCtaHref="/test"
        />
      );
      expect(screen.getByText('Click')).toBeInTheDocument();
    });

    it('applies primary CTA variant', () => {
      render(
        <CTA
          title="Test"
          primaryCtaText="Click"
          primaryCtaVariant="primary"
        />
      );
      expect(screen.getByTestId('cta-primary')).toBeInTheDocument();
    });

    it('calls onPrimaryClick when clicked', () => {
      const handleClick = jest.fn();
      render(
        <CTA
          title="Test"
          primaryCtaText="Click"
          onPrimaryClick={handleClick}
        />
      );
      fireEvent.click(screen.getByText('Click'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('prevents default when onPrimaryClick provided', () => {
      const handleClick = jest.fn();
      render(
        <CTA
          title="Test"
          primaryCtaText="Click"
          onPrimaryClick={handleClick}
        />
      );
      const button = screen.getByText('Click');
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
      button.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  // ============================================
  // SECONDARY CTA BUTTON
  // ============================================

  describe('Secondary CTA Button', () => {
    it('renders secondary CTA button', () => {
      render(
        <CTA
          title="Test"
          primaryCtaText="Primary"
          secondaryCtaText="Secondary"
        />
      );
      expect(screen.getByText('Secondary')).toBeInTheDocument();
    });

    it('renders secondary CTA with href', () => {
      render(
        <CTA
          title="Test"
          primaryCtaText="Primary"
          secondaryCtaText="Secondary"
          secondaryCtaHref="/learn"
        />
      );
      expect(screen.getByText('Secondary')).toBeInTheDocument();
    });

    it('applies secondary CTA variant', () => {
      render(
        <CTA
          title="Test"
          primaryCtaText="Primary"
          secondaryCtaText="Secondary"
          secondaryCtaVariant="outline"
        />
      );
      expect(screen.getByTestId('cta-secondary')).toBeInTheDocument();
    });

    it('calls onSecondaryClick when clicked', () => {
      const handleClick = jest.fn();
      render(
        <CTA
          title="Test"
          primaryCtaText="Primary"
          secondaryCtaText="Secondary"
          onSecondaryClick={handleClick}
        />
      );
      fireEvent.click(screen.getByText('Secondary'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not render when not provided', () => {
      render(<CTA title="Test" primaryCtaText="Primary" />);
      expect(screen.queryByTestId('cta-secondary')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // BACKGROUND IMAGE
  // ============================================

  describe('Background Image', () => {
    it('renders with background image', () => {
      render(
        <CTA
          title="Test"
          primaryCtaText="Action"
          backgroundImage="/bg.jpg"
        />
      );
      const cta = screen.getByTestId('cta');
      expect(cta).toHaveClass('cta--with-bg-image');
      expect(cta).toHaveStyle({ backgroundImage: 'url(/bg.jpg)' });
    });

    it('renders overlay when backgroundOverlay is true', () => {
      const { container } = render(
        <CTA
          title="Test"
          primaryCtaText="Action"
          backgroundImage="/bg.jpg"
          backgroundOverlay={true}
        />
      );
      const overlay = container.querySelector('.cta-overlay');
      expect(overlay).toBeInTheDocument();
    });

    it('does not render overlay when backgroundOverlay is false', () => {
      const { container } = render(
        <CTA
          title="Test"
          primaryCtaText="Action"
          backgroundImage="/bg.jpg"
          backgroundOverlay={false}
        />
      );
      const overlay = container.querySelector('.cta-overlay');
      expect(overlay).not.toBeInTheDocument();
    });

    it('applies custom overlay opacity', () => {
      const { container } = render(
        <CTA
          title="Test"
          primaryCtaText="Action"
          backgroundImage="/bg.jpg"
          backgroundOverlay={true}
          overlayOpacity={0.7}
        />
      );
      const overlay = container.querySelector('.cta-overlay');
      expect(overlay).toHaveStyle({ opacity: 0.7 });
    });

    it('does not render overlay when no background image', () => {
      const { container } = render(
        <CTA
          title="Test"
          primaryCtaText="Action"
          backgroundOverlay={true}
        />
      );
      const overlay = container.querySelector('.cta-overlay');
      expect(overlay).not.toBeInTheDocument();
    });
  });

  // ============================================
  // SIDE IMAGE
  // ============================================

  describe('Side Image', () => {
    it('renders with side image', () => {
      render(
        <CTA
          title="Test"
          primaryCtaText="Action"
          sideImage="/side.jpg"
          sideImageAlt="Side image"
        />
      );
      expect(screen.getByTestId('cta-image')).toBeInTheDocument();
    });

    it('renders side image on right by default', () => {
      render(
        <CTA
          title="Test"
          primaryCtaText="Action"
          sideImage="/side.jpg"
        />
      );
      const cta = screen.getByTestId('cta');
      expect(cta).toHaveClass('cta--image-right');
    });

    it('renders side image on left', () => {
      render(
        <CTA
          title="Test"
          primaryCtaText="Action"
          sideImage="/side.jpg"
          sideImagePosition="left"
        />
      );
      const cta = screen.getByTestId('cta');
      expect(cta).toHaveClass('cta--image-left');
    });

    it('does not render side image when not provided', () => {
      render(<CTA title="Test" primaryCtaText="Action" />);
      expect(screen.queryByTestId('cta-image')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // LAYOUTS
  // ============================================

  describe('Layouts', () => {
    it('renders centered layout by default', () => {
      render(<CTA title="Test" primaryCtaText="Action" />);
      const cta = screen.getByTestId('cta');
      expect(cta).toHaveClass('cta--centered');
    });

    it('renders split layout', () => {
      render(
        <CTA
          title="Test"
          primaryCtaText="Action"
          layout="split"
        />
      );
      const cta = screen.getByTestId('cta');
      expect(cta).toHaveClass('cta--split');
    });

    it.each(['centered', 'split'] as const)(
      'renders %s layout',
      (layout) => {
        render(
          <CTA
            title="Test"
            primaryCtaText="Action"
            layout={layout}
          />
        );
        const cta = screen.getByTestId('cta');
        expect(cta).toHaveClass(`cta--${layout}`);
      }
    );
  });

  // ============================================
  // VARIANTS
  // ============================================

  describe('Variants', () => {
    it.each(['default', 'outlined', 'filled'] as const)(
      'renders %s variant',
      (variant) => {
        render(
          <CTA
            title="Test"
            primaryCtaText="Action"
            variant={variant}
          />
        );
        const cta = screen.getByTestId('cta');
        expect(cta).toHaveClass(`cta--${variant}`);
      }
    );

    it('uses default variant when not specified', () => {
      render(<CTA title="Test" primaryCtaText="Action" />);
      const cta = screen.getByTestId('cta');
      expect(cta).toHaveClass('cta--default');
    });
  });

  // ============================================
  // FULL WIDTH
  // ============================================

  describe('Full Width', () => {
    it('renders full width by default', () => {
      render(<CTA title="Test" primaryCtaText="Action" />);
      const cta = screen.getByTestId('cta');
      expect(cta).toHaveClass('cta--full-width');
    });

    it('renders not full width when disabled', () => {
      render(
        <CTA
          title="Test"
          primaryCtaText="Action"
          fullWidth={false}
        />
      );
      const cta = screen.getByTestId('cta');
      expect(cta).not.toHaveClass('cta--full-width');
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  describe('Accessibility', () => {
    it('has no accessibility violations (basic)', async () => {
      const { container } = render(
        <CTA title="Test CTA" primaryCtaText="Click me" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (with description)', async () => {
      const { container } = render(
        <CTA
          title="Test CTA"
          description="Test description"
          primaryCtaText="Click me"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations (with side image)', async () => {
      const { container } = render(
        <CTA
          title="Test CTA"
          primaryCtaText="Click me"
          sideImage="/side.jpg"
          sideImageAlt="Side image"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper semantic HTML structure', () => {
      const { container } = render(
        <CTA
          title="Test"
          description="Description"
          primaryCtaText="Action"
        />
      );
      expect(container.querySelector('section')).toBeInTheDocument();
      expect(container.querySelector('h2')).toBeInTheDocument();
      expect(container.querySelector('p')).toBeInTheDocument();
    });
  });

  // ============================================
  // CUSTOM STYLING
  // ============================================

  describe('Custom Styling', () => {
    it('applies inline styles', () => {
      render(
        <CTA
          title="Test"
          primaryCtaText="Action"
          style={{ backgroundColor: 'red' }}
        />
      );
      const cta = screen.getByTestId('cta');
      expect(cta).toHaveStyle({ backgroundColor: 'red' });
    });

    it('merges className with default classes', () => {
      render(
        <CTA
          title="Test"
          primaryCtaText="Action"
          className="custom"
        />
      );
      const cta = screen.getByTestId('cta');
      expect(cta).toHaveClass('cta', 'custom');
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================

  describe('Edge Cases', () => {
    it('renders without description', () => {
      render(<CTA title="Test" primaryCtaText="Action" />);
      expect(screen.queryByTestId('cta-description')).not.toBeInTheDocument();
    });

    it('renders with very long title', () => {
      const longTitle = 'A'.repeat(200);
      render(<CTA title={longTitle} primaryCtaText="Action" />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('renders with very long description', () => {
      const longDesc = 'B'.repeat(500);
      render(
        <CTA
          title="Test"
          description={longDesc}
          primaryCtaText="Action"
        />
      );
      expect(screen.getByText(longDesc)).toBeInTheDocument();
    });

    it('handles missing background image gracefully', () => {
      render(
        <CTA
          title="Test"
          primaryCtaText="Action"
          backgroundImage=""
        />
      );
      expect(screen.getByTestId('cta')).toBeInTheDocument();
    });

    it('handles both onClick and href', () => {
      const handleClick = jest.fn();
      render(
        <CTA
          title="Test"
          primaryCtaText="Action"
          primaryCtaHref="/test"
          onPrimaryClick={handleClick}
        />
      );
      fireEvent.click(screen.getByText('Action'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
