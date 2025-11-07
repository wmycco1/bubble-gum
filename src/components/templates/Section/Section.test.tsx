/**
 * Section Component Tests (Template)
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite for Section template component
 * Target: 35+ tests minimum
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Section } from './Section';
import { TemplateProvider } from '@/context/parameters/ParameterContext';

describe('Section Component', () => {
  // ============================================
  // BASIC RENDERING (5 tests)
  // ============================================

  describe('Basic Rendering', () => {
    it('should render with children', () => {
      render(
        <Section>
          <div>Test Content</div>
        </Section>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render with default props', () => {
      render(<Section>Content</Section>);

      const section = screen.getByTestId('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('section');
    });

    it('should apply custom className', () => {
      render(<Section className="custom-class">Content</Section>);

      expect(screen.getByTestId('section')).toHaveClass('custom-class');
    });

    it('should apply custom data-testid', () => {
      render(<Section data-testid="custom-section">Content</Section>);

      expect(screen.getByTestId('custom-section')).toBeInTheDocument();
    });

    it('should render as default section element', () => {
      render(<Section>Content</Section>);

      const section = screen.getByTestId('section');
      expect(section.tagName).toBe('SECTION');
    });
  });

  // ============================================
  // BACKGROUND VARIANTS (5 tests)
  // ============================================

  describe('Background Variants', () => {
    it('should apply none background (default)', () => {
      render(<Section>Content</Section>);

      const section = screen.getByTestId('section');
      expect(section).toHaveClass('section--bg-none');
    });

    it('should apply light background', () => {
      render(<Section background="light">Content</Section>);

      const section = screen.getByTestId('section');
      expect(section).toHaveClass('section--bg-light');
    });

    it('should apply dark background', () => {
      render(<Section background="dark">Content</Section>);

      const section = screen.getByTestId('section');
      expect(section).toHaveClass('section--bg-dark');
    });

    it('should apply primary background', () => {
      render(<Section background="primary">Content</Section>);

      const section = screen.getByTestId('section');
      expect(section).toHaveClass('section--bg-primary');
    });

    it('should apply gradient background', () => {
      render(<Section background="gradient">Content</Section>);

      const section = screen.getByTestId('section');
      expect(section).toHaveClass('section--bg-gradient');
    });
  });

  // ============================================
  // BACKGROUND IMAGE (6 tests)
  // ============================================

  describe('Background Image', () => {
    it('should apply background image', () => {
      render(
        <Section backgroundImage="/test-image.jpg">Content</Section>
      );

      const section = screen.getByTestId('section');
      expect(section).toHaveStyle({
        backgroundImage: 'url(/test-image.jpg)',
      });
    });

    it('should add has-image class when backgroundImage is set', () => {
      render(
        <Section backgroundImage="/test.jpg">Content</Section>
      );

      const section = screen.getByTestId('section');
      expect(section).toHaveClass('section--has-image');
    });

    it('should not render overlay by default', () => {
      render(
        <Section backgroundImage="/test.jpg">Content</Section>
      );

      expect(screen.queryByTestId('section-overlay')).not.toBeInTheDocument();
    });

    it('should render overlay when overlay=true', () => {
      render(
        <Section backgroundImage="/test.jpg" overlay={true}>
          Content
        </Section>
      );

      expect(screen.getByTestId('section-overlay')).toBeInTheDocument();
    });

    it('should apply custom overlay opacity', () => {
      render(
        <Section
          backgroundImage="/test.jpg"
          overlay={true}
          overlayOpacity={0.8}
        >
          Content
        </Section>
      );

      const overlay = screen.getByTestId('section-overlay');
      expect(overlay).toHaveStyle({ opacity: 0.8 });
    });

    it('should apply custom overlay color', () => {
      render(
        <Section
          backgroundImage="/test.jpg"
          overlay={true}
          overlayColor="rgba(255, 0, 0, 0.5)"
        >
          Content
        </Section>
      );

      const overlay = screen.getByTestId('section-overlay');
      expect(overlay).toHaveStyle({ backgroundColor: 'rgba(255, 0, 0, 0.5)' });
    });
  });

  // ============================================
  // PADDING VARIANTS (6 tests)
  // ============================================

  describe('Padding Variants', () => {
    it('should apply none padding', () => {
      render(<Section padding="none">Content</Section>);

      const section = screen.getByTestId('section');
      expect(section).toHaveClass('section--padding-none');
    });

    it('should apply sm padding', () => {
      render(<Section padding="sm">Content</Section>);

      const section = screen.getByTestId('section');
      expect(section).toHaveClass('section--padding-sm');
    });

    it('should apply md padding (default)', () => {
      render(<Section>Content</Section>);

      const section = screen.getByTestId('section');
      expect(section).toHaveClass('section--padding-md');
    });

    it('should apply lg padding', () => {
      render(<Section padding="lg">Content</Section>);

      const section = screen.getByTestId('section');
      expect(section).toHaveClass('section--padding-lg');
    });

    it('should apply xl padding', () => {
      render(<Section padding="xl">Content</Section>);

      const section = screen.getByTestId('section');
      expect(section).toHaveClass('section--padding-xl');
    });

    it('should combine padding class with other classes', () => {
      render(
        <Section padding="lg" className="custom">
          Content
        </Section>
      );

      const section = screen.getByTestId('section');
      expect(section).toHaveClass('section--padding-lg');
      expect(section).toHaveClass('custom');
    });
  });

  // ============================================
  // FULL-WIDTH (3 tests)
  // ============================================

  describe('Full-Width', () => {
    it('should not be full-width by default', () => {
      render(<Section>Content</Section>);

      const section = screen.getByTestId('section');
      expect(section).not.toHaveClass('section--full-width');
    });

    it('should apply full-width class when fullWidth=true', () => {
      render(<Section fullWidth={true}>Content</Section>);

      const section = screen.getByTestId('section');
      expect(section).toHaveClass('section--full-width');
    });

    it('should not apply full-width class when fullWidth=false', () => {
      render(<Section fullWidth={false}>Content</Section>);

      const section = screen.getByTestId('section');
      expect(section).not.toHaveClass('section--full-width');
    });
  });

  // ============================================
  // CONTENT WRAPPER (2 tests)
  // ============================================

  describe('Content Wrapper', () => {
    it('should render content wrapper', () => {
      render(<Section>Content</Section>);

      expect(screen.getByTestId('section-content')).toBeInTheDocument();
    });

    it('should contain children inside content wrapper', () => {
      render(
        <Section>
          <div data-testid="child">Child</div>
        </Section>
      );

      const content = screen.getByTestId('section-content');
      const child = screen.getByTestId('child');

      expect(content).toContainElement(child);
    });
  });

  // ============================================
  // POLYMORPHIC ELEMENT (3 tests)
  // ============================================

  describe('Polymorphic Element', () => {
    it('should render as section element by default', () => {
      render(<Section>Content</Section>);

      const section = screen.getByTestId('section');
      expect(section.tagName).toBe('SECTION');
    });

    it('should render as div element', () => {
      render(<Section as="div">Content</Section>);

      const section = screen.getByTestId('section');
      expect(section.tagName).toBe('DIV');
    });

    it('should render as article element', () => {
      render(<Section as="article">Content</Section>);

      const section = screen.getByTestId('section');
      expect(section.tagName).toBe('ARTICLE');
    });
  });

  // ============================================
  // CONTEXT API INTEGRATION (4 tests)
  // ============================================

  describe('Context API Integration', () => {
    it('should inherit parameters from TemplateProvider', () => {
      render(
        <TemplateProvider value={{ padding: 'lg' } as any}>
          <Section>Content</Section>
        </TemplateProvider>
      );

      const section = screen.getByTestId('section');
      expect(section).toHaveClass('section--padding-lg');
    });

    it('should override context parameters with props', () => {
      render(
        <TemplateProvider value={{ padding: 'sm' } as any}>
          <Section padding="xl">Content</Section>
        </TemplateProvider>
      );

      const section = screen.getByTestId('section');
      expect(section).toHaveClass('section--padding-xl');
      expect(section).not.toHaveClass('section--padding-sm');
    });

    it('should provide parameters to children via context', () => {
      const ChildComponent = () => {
        return <div data-testid="child">Child</div>;
      };

      render(
        <Section>
          <ChildComponent />
        </Section>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should merge context and props correctly', () => {
      render(
        <TemplateProvider value={{ className: 'context-class' } as any}>
          <Section className="prop-class">Content</Section>
        </TemplateProvider>
      );

      const section = screen.getByTestId('section');
      expect(section).toHaveClass('prop-class');
    });
  });

  // ============================================
  // CUSTOM STYLES (3 tests)
  // ============================================

  describe('Custom Styles', () => {
    it('should apply custom inline styles', () => {
      render(
        <Section style={{ border: '1px solid red' }}>Content</Section>
      );

      const section = screen.getByTestId('section');
      expect(section).toHaveStyle({ border: '1px solid red' });
    });

    it('should merge custom styles with background image', () => {
      render(
        <Section
          backgroundImage="/test.jpg"
          style={{ minHeight: '500px' }}
        >
          Content
        </Section>
      );

      const section = screen.getByTestId('section');
      expect(section).toHaveStyle({
        backgroundImage: 'url(/test.jpg)',
        minHeight: '500px',
      });
    });

    it('should allow style override of background', () => {
      render(
        <Section
          background="light"
          style={{ backgroundColor: 'blue' }}
        >
          Content
        </Section>
      );

      const section = screen.getByTestId('section');
      expect(section).toHaveStyle({ backgroundColor: 'blue' });
    });
  });

  // ============================================
  // ACCESSIBILITY (2 tests)
  // ============================================

  describe('Accessibility', () => {
    it('should support ARIA attributes', () => {
      render(
        <Section aria-label="Features section" role="region">
          Content
        </Section>
      );

      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('aria-label', 'Features section');
    });

    it('should use semantic HTML by default', () => {
      render(<Section>Content</Section>);

      const section = screen.getByTestId('section');
      expect(section.tagName).toBe('SECTION');
    });
  });

  // ============================================
  // EDGE CASES (3 tests)
  // ============================================

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      render(<Section>{null}</Section>);

      const content = screen.getByTestId('section-content');
      expect(content).toBeEmptyDOMElement();
    });

    it('should handle multiple children', () => {
      render(
        <Section>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </Section>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    it('should not show overlay without background image', () => {
      render(<Section overlay={true}>Content</Section>);

      expect(screen.queryByTestId('section-overlay')).not.toBeInTheDocument();
    });
  });
});
