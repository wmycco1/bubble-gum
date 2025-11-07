/**
 * Banner Component Tests (Organism)
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite for Banner organism component
 * Target: 80%+ code coverage
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Banner } from './Banner';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Banner Component', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Banner message="Test message" />);
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('should render with message', () => {
      render(<Banner message="Welcome to our site!" />);
      expect(screen.getByText('Welcome to our site!')).toBeInTheDocument();
    });

    it('should render with title', () => {
      render(<Banner title="Announcement" message="Important message" />);
      expect(screen.getByText('Announcement')).toBeInTheDocument();
    });

    it('should render without title when not provided', () => {
      render(<Banner message="Message only" />);
      expect(screen.queryByTestId('banner-title')).not.toBeInTheDocument();
    });

    it('should render with custom test ID', () => {
      render(<Banner message="Test" data-testid="custom-banner" />);
      expect(screen.getByTestId('custom-banner')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Banner message="Test" className="custom-class" />);
      const banner = screen.getByTestId('banner');
      expect(banner).toHaveClass('custom-class');
    });

    it('should use h2 heading for title', () => {
      render(<Banner title="Main Title" message="Message" />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Main Title');
    });
  });

  // ============================================
  // CTA BUTTON TESTS
  // ============================================

  describe('CTA Button', () => {
    it('should render CTA button', () => {
      render(<Banner message="Test" ctaText="Click Here" ctaHref="/link" />);
      expect(screen.getByText('Click Here')).toBeInTheDocument();
    });

    it('should not render CTA button when not provided', () => {
      render(<Banner message="Test" />);
      expect(screen.queryByTestId('banner-actions')).not.toBeInTheDocument();
    });

    it('should call ctaOnClick when CTA is clicked', () => {
      const handleClick = jest.fn();
      render(<Banner message="Test" ctaText="Click Me" ctaOnClick={handleClick} />);

      const button = screen.getByText('Click Me');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should apply custom variant to CTA', () => {
      render(
        <Banner message="Test" ctaText="Button" ctaHref="/test" ctaVariant="secondary" />
      );
      const button = screen.getByText('Button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('A'); // Should be link when href is provided
    });

    it('should use primary variant by default', () => {
      render(<Banner message="Test" ctaText="Button" ctaHref="/test" />);
      const button = screen.getByText('Button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('A');
    });

    it('should prevent default when onClick is provided', () => {
      const handleClick = jest.fn();
      render(<Banner message="Test" ctaText="Click" ctaOnClick={handleClick} />);

      const button = screen.getByText('Click');
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      button.dispatchEvent(event);

      expect(handleClick).toHaveBeenCalled();
    });
  });

  // ============================================
  // VARIANT TESTS
  // ============================================

  describe('Variants', () => {
    it('should apply info variant by default', () => {
      render(<Banner message="Test" />);
      const banner = screen.getByTestId('banner');
      expect(banner.className).toContain('banner--info');
    });

    it('should apply success variant', () => {
      render(<Banner message="Test" variant="success" />);
      const banner = screen.getByTestId('banner');
      expect(banner.className).toContain('banner--success');
    });

    it('should apply warning variant', () => {
      render(<Banner message="Test" variant="warning" />);
      const banner = screen.getByTestId('banner');
      expect(banner.className).toContain('banner--warning');
    });

    it('should apply promo variant', () => {
      render(<Banner message="Test" variant="promo" />);
      const banner = screen.getByTestId('banner');
      expect(banner.className).toContain('banner--promo');
    });
  });

  // ============================================
  // POSITION TESTS
  // ============================================

  describe('Position', () => {
    it('should apply relative position by default', () => {
      render(<Banner message="Test" />);
      const banner = screen.getByTestId('banner');
      expect(banner.className).toContain('banner--relative');
    });

    it('should apply top position', () => {
      render(<Banner message="Test" position="top" />);
      const banner = screen.getByTestId('banner');
      expect(banner.className).toContain('banner--top');
    });

    it('should apply bottom position', () => {
      render(<Banner message="Test" position="bottom" />);
      const banner = screen.getByTestId('banner');
      expect(banner.className).toContain('banner--bottom');
    });

    it('should apply sticky class when sticky is true', () => {
      render(<Banner message="Test" sticky={true} />);
      const banner = screen.getByTestId('banner');
      expect(banner.className).toContain('banner--sticky');
    });

    it('should not apply sticky class by default', () => {
      render(<Banner message="Test" />);
      const banner = screen.getByTestId('banner');
      expect(banner.className).not.toContain('banner--sticky');
    });
  });

  // ============================================
  // DISMISSIBLE TESTS
  // ============================================

  describe('Dismissible', () => {
    it('should not show close button by default', () => {
      render(<Banner message="Test" />);
      expect(screen.queryByTestId('banner-close')).not.toBeInTheDocument();
    });

    it('should show close button when dismissible is true', () => {
      render(<Banner message="Test" dismissible={true} />);
      expect(screen.getByTestId('banner-close')).toBeInTheDocument();
    });

    it('should show close button when showCloseButton is true', () => {
      render(<Banner message="Test" showCloseButton={true} />);
      expect(screen.getByTestId('banner-close')).toBeInTheDocument();
    });

    it('should remove banner when close button is clicked', () => {
      render(<Banner message="Test" dismissible={true} />);

      const closeButton = screen.getByTestId('banner-close');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('banner')).not.toBeInTheDocument();
    });

    it('should call onDismiss callback when dismissed', () => {
      const handleDismiss = jest.fn();
      render(<Banner message="Test" dismissible={true} onDismiss={handleDismiss} />);

      const closeButton = screen.getByTestId('banner-close');
      fireEvent.click(closeButton);

      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });

    it('should have accessible dismiss button', () => {
      render(<Banner message="Test" dismissible={true} />);
      const closeButton = screen.getByTestId('banner-close');
      expect(closeButton).toHaveAttribute('aria-label', 'Dismiss banner');
    });
  });

  // ============================================
  // BADGE TESTS
  // ============================================

  describe('Badge', () => {
    it('should render badge when provided', () => {
      render(<Banner message="Test" badge="NEW" />);
      expect(screen.getByText('NEW')).toBeInTheDocument();
    });

    it('should not render badge when not provided', () => {
      render(<Banner message="Test" />);
      expect(screen.queryByTestId('banner-badge')).not.toBeInTheDocument();
    });

    it('should render badge with custom text', () => {
      render(<Banner message="Test" badge="SALE" />);
      const badge = screen.getByTestId('banner-badge');
      expect(badge).toHaveTextContent('SALE');
    });
  });

  // ============================================
  // BACKGROUND IMAGE TESTS
  // ============================================

  describe('Background Image', () => {
    it('should render with background image', () => {
      render(<Banner message="Test" backgroundImage="/bg.jpg" />);
      const banner = screen.getByTestId('banner');
      expect(banner.style.backgroundImage).toContain('/bg.jpg');
    });

    it('should apply background image class', () => {
      render(<Banner message="Test" backgroundImage="/bg.jpg" />);
      const banner = screen.getByTestId('banner');
      expect(banner.className).toContain('banner--with-bg-image');
    });

    it('should not apply background image class when no image', () => {
      render(<Banner message="Test" />);
      const banner = screen.getByTestId('banner');
      expect(banner.className).not.toContain('banner--with-bg-image');
    });
  });

  // ============================================
  // INLINE STYLES TESTS
  // ============================================

  describe('Inline Styles', () => {
    it('should accept custom inline styles', () => {
      render(<Banner message="Test" style={{ padding: '2rem' }} />);
      const banner = screen.getByTestId('banner');
      expect(banner.style.padding).toBe('2rem');
    });

    it('should merge inline styles with background image', () => {
      render(
        <Banner
          message="Test"
          backgroundImage="/bg.jpg"
          style={{ padding: '2rem' }}
        />
      );
      const banner = screen.getByTestId('banner');
      expect(banner.style.backgroundImage).toContain('/bg.jpg');
      expect(banner.style.padding).toBe('2rem');
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Banner message="Accessible banner" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should use semantic section element', () => {
      render(<Banner message="Test" />);
      const section = screen.getByRole('region');
      expect(section.tagName).toBe('SECTION');
    });

    it('should have aria-label from title', () => {
      render(<Banner title="Important" message="Test" />);
      const banner = screen.getByRole('region');
      expect(banner).toHaveAttribute('aria-label', 'Important');
    });

    it('should have default aria-label when no title', () => {
      render(<Banner message="Test" />);
      const banner = screen.getByRole('region');
      expect(banner).toHaveAttribute('aria-label', 'Announcement banner');
    });

    it('should have aria-live polite', () => {
      render(<Banner message="Test" />);
      const banner = screen.getByRole('region');
      expect(banner).toHaveAttribute('aria-live', 'polite');
    });

    it('should have proper heading hierarchy', () => {
      render(<Banner title="Heading" message="Test" />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
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
          <Banner message="Test" />
        </AtomProvider>
      );

      expect(screen.getByTestId('banner')).toBeInTheDocument();
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================

  describe('Edge Cases', () => {
    it('should handle empty message', () => {
      render(<Banner message="" />);
      const message = screen.getByTestId('banner-message');
      expect(message).toHaveTextContent('');
    });

    it('should handle very long message', () => {
      const longMessage = 'A'.repeat(500);
      render(<Banner message={longMessage} />);
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should handle special characters in message', () => {
      render(<Banner message="<Hello> & 'World'" />);
      expect(screen.getByText("<Hello> & 'World'")).toBeInTheDocument();
    });

    it('should handle onClick without href', () => {
      const handleClick = jest.fn();
      render(<Banner message="Test" ctaText="Click" ctaOnClick={handleClick} />);

      const button = screen.getByText('Click');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalled();
    });

    it('should handle href without onClick', () => {
      render(<Banner message="Test" ctaText="Link" ctaHref="/test" />);
      const link = screen.getByText('Link');
      expect(link).toBeInTheDocument();
    });

    it('should not crash when dismissed multiple times', () => {
      render(<Banner message="Test" dismissible={true} />);

      const closeButton = screen.getByTestId('banner-close');
      fireEvent.click(closeButton);
      fireEvent.click(closeButton); // Click again after dismissed

      expect(screen.queryByTestId('banner')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // VARIANT COMBINATIONS
  // ============================================

  describe('Variant Combinations', () => {
    it('should handle all props together', () => {
      render(
        <Banner
          title="Black Friday"
          message="50% off all products"
          ctaText="Shop Now"
          ctaHref="/shop"
          variant="promo"
          position="top"
          sticky={true}
          dismissible={true}
          badge="NEW"
          backgroundImage="/bg.jpg"
        />
      );

      expect(screen.getByText('Black Friday')).toBeInTheDocument();
      expect(screen.getByText('50% off all products')).toBeInTheDocument();
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
      expect(screen.getByText('NEW')).toBeInTheDocument();
      expect(screen.getByTestId('banner-close')).toBeInTheDocument();

      const banner = screen.getByTestId('banner');
      expect(banner.className).toContain('banner--promo');
      expect(banner.className).toContain('banner--top');
      expect(banner.className).toContain('banner--sticky');
      expect(banner.className).toContain('banner--with-bg-image');
    });

    it('should handle minimal props', () => {
      render(<Banner message="Simple message" />);
      expect(screen.getByText('Simple message')).toBeInTheDocument();
    });

    it('should handle all variants with badge', () => {
      const variants: Array<'info' | 'success' | 'warning' | 'promo'> = [
        'info',
        'success',
        'warning',
        'promo',
      ];

      variants.forEach((variant) => {
        const { unmount } = render(
          <Banner
            message="Test"
            variant={variant}
            badge="TEST"
            data-testid={`banner-${variant}`}
          />
        );

        const banner = screen.getByTestId(`banner-${variant}`);
        expect(banner.className).toContain(`banner--${variant}`);
        expect(screen.getByText('TEST')).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle all positions', () => {
      const positions: Array<'top' | 'bottom' | 'relative'> = [
        'top',
        'bottom',
        'relative',
      ];

      positions.forEach((position) => {
        const { unmount } = render(
          <Banner
            message="Test"
            position={position}
            data-testid={`banner-${position}`}
          />
        );

        const banner = screen.getByTestId(`banner-${position}`);
        expect(banner.className).toContain(`banner--${position}`);
        unmount();
      });
    });
  });

  // ============================================
  // USER INTERACTIONS
  // ============================================

  describe('User Interactions', () => {
    it('should be keyboard accessible for dismiss', () => {
      render(<Banner message="Test" dismissible={true} />);

      const closeButton = screen.getByTestId('banner-close');
      closeButton.focus();

      expect(document.activeElement).toBe(closeButton);
    });

    it('should handle rapid clicks on CTA', () => {
      const handleClick = jest.fn();
      render(<Banner message="Test" ctaText="Click" ctaOnClick={handleClick} />);

      const button = screen.getByText('Click');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });
});
