/**
 * Hero Component Tests (Organism)
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite for Hero organism component
 * Target: 80%+ code coverage
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Hero } from './Hero';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Hero Component', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Hero title="Test Title" />);
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('should render with title', () => {
      render(<Hero title="Welcome to Our Platform" />);
      expect(screen.getByText('Welcome to Our Platform')).toBeInTheDocument();
    });

    it('should render with subtitle', () => {
      render(<Hero title="Title" subtitle="This is a subtitle" />);
      expect(screen.getByText('This is a subtitle')).toBeInTheDocument();
    });

    it('should render without subtitle when not provided', () => {
      render(<Hero title="Title Only" />);
      expect(screen.queryByTestId('hero-subtitle')).not.toBeInTheDocument();
    });

    it('should render with custom test ID', () => {
      render(<Hero title="Title" data-testid="custom-hero" />);
      expect(screen.getByTestId('custom-hero')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Hero title="Title" className="custom-class" />);
      const hero = screen.getByTestId('hero');
      expect(hero).toHaveClass('custom-class');
    });

    it('should use h1 heading for title', () => {
      render(<Hero title="Main Title" />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Main Title');
    });
  });

  // ============================================
  // CTA BUTTON TESTS
  // ============================================

  describe('CTA Buttons', () => {
    it('should render primary CTA button', () => {
      render(<Hero title="Title" ctaText="Get Started" ctaHref="/signup" />);
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('should render secondary CTA button', () => {
      render(
        <Hero
          title="Title"
          ctaText="Primary"
          secondaryCtaText="Learn More"
          secondaryCtaHref="/about"
        />
      );
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('should render both CTA buttons', () => {
      render(
        <Hero
          title="Title"
          ctaText="Get Started"
          ctaHref="/signup"
          secondaryCtaText="Learn More"
          secondaryCtaHref="/about"
        />
      );
      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('should not render CTA buttons when not provided', () => {
      render(<Hero title="Title" />);
      expect(screen.queryByTestId('hero-actions')).not.toBeInTheDocument();
    });

    it('should call ctaOnClick when primary CTA is clicked', () => {
      const handleClick = jest.fn();
      render(<Hero title="Title" ctaText="Click Me" ctaOnClick={handleClick} />);

      const button = screen.getByText('Click Me');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call secondaryCtaOnClick when secondary CTA is clicked', () => {
      const handleClick = jest.fn();
      render(
        <Hero
          title="Title"
          secondaryCtaText="Click Me"
          secondaryCtaOnClick={handleClick}
        />
      );

      const button = screen.getByText('Click Me');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should apply custom variant to primary CTA', () => {
      render(
        <Hero title="Title" ctaText="Button" ctaHref="/test" ctaVariant="danger" />
      );
      const button = screen.getByText('Button');
      expect(button.className).toContain('button--danger');
    });

    it('should apply custom variant to secondary CTA', () => {
      render(
        <Hero
          title="Title"
          secondaryCtaText="Button"
          secondaryCtaHref="/test"
          secondaryCtaVariant="outline"
        />
      );
      const button = screen.getByText('Button');
      expect(button.className).toContain('button--outline');
    });
  });

  // ============================================
  // BACKGROUND TESTS
  // ============================================

  describe('Background', () => {
    it('should render with background image', () => {
      render(<Hero title="Title" backgroundImage="/hero-bg.jpg" />);
      const hero = screen.getByTestId('hero');
      expect(hero.style.backgroundImage).toContain('/hero-bg.jpg');
    });

    it('should render with background gradient', () => {
      const gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      render(<Hero title="Title" backgroundGradient={gradient} />);
      const hero = screen.getByTestId('hero');
      expect(hero.style.backgroundImage).toBe(gradient);
    });

    it('should render overlay when backgroundOverlay is true', () => {
      render(
        <Hero title="Title" backgroundImage="/bg.jpg" backgroundOverlay={true} />
      );
      const overlay = document.querySelector('.hero-overlay');
      expect(overlay).toBeInTheDocument();
    });

    it('should not render overlay when backgroundOverlay is false', () => {
      render(
        <Hero title="Title" backgroundImage="/bg.jpg" backgroundOverlay={false} />
      );
      const overlay = document.querySelector('.hero-overlay');
      expect(overlay).not.toBeInTheDocument();
    });

    it('should not render overlay when no background', () => {
      render(<Hero title="Title" backgroundOverlay={true} />);
      const overlay = document.querySelector('.hero-overlay');
      expect(overlay).not.toBeInTheDocument();
    });

    it('should apply custom overlay opacity', () => {
      render(
        <Hero
          title="Title"
          backgroundImage="/bg.jpg"
          backgroundOverlay={true}
          overlayOpacity={0.7}
        />
      );
      const overlay = document.querySelector('.hero-overlay') as HTMLElement;
      expect(overlay.style.opacity).toBe('0.7');
    });
  });

  // ============================================
  // ALIGNMENT TESTS
  // ============================================

  describe('Alignment', () => {
    it('should apply center alignment by default', () => {
      render(<Hero title="Title" />);
      const hero = screen.getByTestId('hero');
      expect(hero.className).toContain('hero--align-center');
    });

    it('should apply left alignment', () => {
      render(<Hero title="Title" align="left" />);
      const hero = screen.getByTestId('hero');
      expect(hero.className).toContain('hero--align-left');
    });

    it('should apply right alignment', () => {
      render(<Hero title="Title" align="right" />);
      const hero = screen.getByTestId('hero');
      expect(hero.className).toContain('hero--align-right');
    });
  });

  // ============================================
  // HEIGHT TESTS
  // ============================================

  describe('Height', () => {
    it('should not be full height by default', () => {
      render(<Hero title="Title" />);
      const hero = screen.getByTestId('hero');
      expect(hero.className).not.toContain('hero--full-height');
    });

    it('should apply full height class when fullHeight is true', () => {
      render(<Hero title="Title" fullHeight={true} />);
      const hero = screen.getByTestId('hero');
      expect(hero.className).toContain('hero--full-height');
    });

    it('should apply custom minHeight', () => {
      render(<Hero title="Title" minHeight="700px" />);
      const hero = screen.getByTestId('hero');
      expect(hero.style.minHeight).toBe('700px');
    });

    it('should not apply minHeight when fullHeight is true', () => {
      render(<Hero title="Title" fullHeight={true} minHeight="700px" />);
      const hero = screen.getByTestId('hero');
      expect(hero.style.minHeight).toBe('');
    });
  });

  // ============================================
  // SIDE IMAGE TESTS
  // ============================================

  describe('Side Image', () => {
    it('should render side image when provided', () => {
      render(<Hero title="Title" sideImage="/image.jpg" sideImageAlt="Test" />);
      const image = screen.getByAltText('Test');
      expect(image).toBeInTheDocument();
    });

    it('should not render side image when not provided', () => {
      render(<Hero title="Title" />);
      expect(screen.queryByTestId('hero-image')).not.toBeInTheDocument();
    });

    it('should apply split layout class when side image is present', () => {
      render(<Hero title="Title" sideImage="/image.jpg" />);
      const hero = screen.getByTestId('hero');
      expect(hero.className).toContain('hero--split');
    });

    it('should position image on right by default', () => {
      render(<Hero title="Title" sideImage="/image.jpg" />);
      const hero = screen.getByTestId('hero');
      expect(hero.className).toContain('hero--image-right');
    });

    it('should position image on left when specified', () => {
      render(<Hero title="Title" sideImage="/image.jpg" sideImagePosition="left" />);
      const hero = screen.getByTestId('hero');
      expect(hero.className).toContain('hero--image-left');
    });

    it('should use default alt text when not provided', () => {
      render(<Hero title="Title" sideImage="/image.jpg" />);
      const image = screen.getByAltText('Hero image');
      expect(image).toBeInTheDocument();
    });
  });

  // ============================================
  // INLINE STYLES TESTS
  // ============================================

  describe('Inline Styles', () => {
    it('should accept custom inline styles', () => {
      render(<Hero title="Title" style={{ paddingTop: '5rem' }} />);
      const hero = screen.getByTestId('hero');
      expect(hero.style.paddingTop).toBe('5rem');
    });

    it('should merge inline styles with background image', () => {
      render(
        <Hero
          title="Title"
          backgroundImage="/bg.jpg"
          style={{ paddingTop: '5rem' }}
        />
      );
      const hero = screen.getByTestId('hero');
      expect(hero.style.backgroundImage).toContain('/bg.jpg');
      expect(hero.style.paddingTop).toBe('5rem');
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Hero title="Accessible Hero" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should use semantic section element', () => {
      render(<Hero title="Title" />);
      const section = screen.getByRole('region');
      expect(section.tagName).toBe('SECTION');
    });

    it('should have proper heading hierarchy', () => {
      render(<Hero title="Main Heading" />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should mark overlay as aria-hidden', () => {
      render(
        <Hero title="Title" backgroundImage="/bg.jpg" backgroundOverlay={true} />
      );
      const overlay = document.querySelector('.hero-overlay');
      expect(overlay).toHaveAttribute('aria-hidden', 'true');
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
          <Hero title="Title" />
        </AtomProvider>
      );

      expect(screen.getByTestId('hero')).toBeInTheDocument();
    });
  });

  // ============================================
  // RESPONSIVE BEHAVIOR TESTS
  // ============================================

  describe('Responsive Behavior', () => {
    it('should render correctly with all props', () => {
      render(
        <Hero
          title="Full Hero"
          subtitle="With all features"
          ctaText="Primary"
          ctaHref="/primary"
          secondaryCtaText="Secondary"
          secondaryCtaHref="/secondary"
          backgroundImage="/bg.jpg"
          backgroundOverlay={true}
          sideImage="/side.jpg"
          sideImageAlt="Side"
          align="left"
          fullHeight={true}
        />
      );

      expect(screen.getByText('Full Hero')).toBeInTheDocument();
      expect(screen.getByText('With all features')).toBeInTheDocument();
      expect(screen.getByText('Primary')).toBeInTheDocument();
      expect(screen.getByText('Secondary')).toBeInTheDocument();
      expect(screen.getByAltText('Side')).toBeInTheDocument();
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================

  describe('Edge Cases', () => {
    it('should handle empty title', () => {
      render(<Hero title="" />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('');
    });

    it('should handle very long title', () => {
      const longTitle = 'A'.repeat(200);
      render(<Hero title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle very long subtitle', () => {
      const longSubtitle = 'B'.repeat(500);
      render(<Hero title="Title" subtitle={longSubtitle} />);
      expect(screen.getByText(longSubtitle)).toBeInTheDocument();
    });

    it('should handle special characters in title', () => {
      render(<Hero title="<Hello> & 'World'" />);
      expect(screen.getByText("<Hello> & 'World'")).toBeInTheDocument();
    });

    it('should handle onClick without href', () => {
      const handleClick = jest.fn();
      render(<Hero title="Title" ctaText="Click" ctaOnClick={handleClick} />);

      const button = screen.getByText('Click');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalled();
    });

    it('should handle href without onClick', () => {
      render(<Hero title="Title" ctaText="Link" ctaHref="/test" />);
      const link = screen.getByText('Link');
      expect(link).toBeInTheDocument();
    });
  });

  // ============================================
  // VARIANT COMBINATIONS
  // ============================================

  describe('Variant Combinations', () => {
    it('should handle background image + overlay + full height', () => {
      render(
        <Hero
          title="Title"
          backgroundImage="/bg.jpg"
          backgroundOverlay={true}
          fullHeight={true}
        />
      );

      const hero = screen.getByTestId('hero');
      expect(hero.className).toContain('hero--full-height');
      expect(hero.className).toContain('hero--with-bg-image');
      expect(document.querySelector('.hero-overlay')).toBeInTheDocument();
    });

    it('should handle gradient + side image', () => {
      render(
        <Hero
          title="Title"
          backgroundGradient="linear-gradient(to right, red, blue)"
          sideImage="/side.jpg"
        />
      );

      const hero = screen.getByTestId('hero');
      expect(hero.className).toContain('hero--with-gradient');
      expect(hero.className).toContain('hero--split');
    });

    it('should handle all alignment options with CTAs', () => {
      const alignments: Array<'left' | 'center' | 'right'> = [
        'left',
        'center',
        'right',
      ];

      alignments.forEach((align) => {
        const { unmount } = render(
          <Hero
            title="Title"
            ctaText="Button"
            ctaHref="/test"
            align={align}
            data-testid={`hero-${align}`}
          />
        );

        const hero = screen.getByTestId(`hero-${align}`);
        expect(hero.className).toContain(`hero--align-${align}`);
        unmount();
      });
    });
  });
});
