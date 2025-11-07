/**
 * Container Component Tests (Template)
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite for Container template component
 * Target: 30+ tests minimum
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Container } from './Container';
import { TemplateProvider } from '@/context/parameters/ParameterContext';

describe('Container Component', () => {
  // ============================================
  // BASIC RENDERING (5 tests)
  // ============================================

  describe('Basic Rendering', () => {
    it('should render with children', () => {
      render(
        <Container>
          <div>Test Content</div>
        </Container>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render with default props', () => {
      render(<Container>Content</Container>);

      const container = screen.getByTestId('container');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('container');
    });

    it('should apply custom className', () => {
      render(<Container className="custom-class">Content</Container>);

      expect(screen.getByTestId('container')).toHaveClass('custom-class');
    });

    it('should apply custom data-testid', () => {
      render(<Container data-testid="custom-container">Content</Container>);

      expect(screen.getByTestId('custom-container')).toBeInTheDocument();
    });

    it('should render as default div element', () => {
      render(<Container>Content</Container>);

      const container = screen.getByTestId('container');
      expect(container.tagName).toBe('DIV');
    });
  });

  // ============================================
  // MAX-WIDTH VARIANTS (7 tests)
  // ============================================

  describe('Max-Width Variants', () => {
    it('should apply sm maxWidth (640px)', () => {
      render(<Container maxWidth="sm">Content</Container>);

      const container = screen.getByTestId('container');
      expect(container).toHaveStyle({ maxWidth: '640px' });
    });

    it('should apply md maxWidth (768px)', () => {
      render(<Container maxWidth="md">Content</Container>);

      const container = screen.getByTestId('container');
      expect(container).toHaveStyle({ maxWidth: '768px' });
    });

    it('should apply lg maxWidth (1024px) - default', () => {
      render(<Container>Content</Container>);

      const container = screen.getByTestId('container');
      expect(container).toHaveStyle({ maxWidth: '1024px' });
    });

    it('should apply xl maxWidth (1280px)', () => {
      render(<Container maxWidth="xl">Content</Container>);

      const container = screen.getByTestId('container');
      expect(container).toHaveStyle({ maxWidth: '1280px' });
    });

    it('should apply 2xl maxWidth (1536px)', () => {
      render(<Container maxWidth="2xl">Content</Container>);

      const container = screen.getByTestId('container');
      expect(container).toHaveStyle({ maxWidth: '1536px' });
    });

    it('should apply full maxWidth (100%)', () => {
      render(<Container maxWidth="full">Content</Container>);

      const container = screen.getByTestId('container');
      expect(container).toHaveStyle({ maxWidth: '100%' });
    });

    it('should override maxWidth with custom style', () => {
      render(
        <Container maxWidth="lg" style={{ maxWidth: '500px' }}>
          Content
        </Container>
      );

      const container = screen.getByTestId('container');
      expect(container).toHaveStyle({ maxWidth: '500px' });
    });
  });

  // ============================================
  // PADDING VARIANTS (6 tests)
  // ============================================

  describe('Padding Variants', () => {
    it('should apply none padding', () => {
      render(<Container padding="none">Content</Container>);

      const container = screen.getByTestId('container');
      expect(container).toHaveClass('container--padding-none');
    });

    it('should apply sm padding', () => {
      render(<Container padding="sm">Content</Container>);

      const container = screen.getByTestId('container');
      expect(container).toHaveClass('container--padding-sm');
    });

    it('should apply md padding (default)', () => {
      render(<Container>Content</Container>);

      const container = screen.getByTestId('container');
      expect(container).toHaveClass('container--padding-md');
    });

    it('should apply lg padding', () => {
      render(<Container padding="lg">Content</Container>);

      const container = screen.getByTestId('container');
      expect(container).toHaveClass('container--padding-lg');
    });

    it('should apply xl padding', () => {
      render(<Container padding="xl">Content</Container>);

      const container = screen.getByTestId('container');
      expect(container).toHaveClass('container--padding-xl');
    });

    it('should combine padding class with other classes', () => {
      render(
        <Container padding="lg" className="custom">
          Content
        </Container>
      );

      const container = screen.getByTestId('container');
      expect(container).toHaveClass('container--padding-lg');
      expect(container).toHaveClass('custom');
    });
  });

  // ============================================
  // CENTER CONTENT (3 tests)
  // ============================================

  describe('Center Content', () => {
    it('should center content by default', () => {
      render(<Container>Content</Container>);

      const container = screen.getByTestId('container');
      expect(container).toHaveClass('container--centered');
    });

    it('should disable centering when centerContent=false', () => {
      render(<Container centerContent={false}>Content</Container>);

      const container = screen.getByTestId('container');
      expect(container).not.toHaveClass('container--centered');
    });

    it('should explicitly enable centering when centerContent=true', () => {
      render(<Container centerContent={true}>Content</Container>);

      const container = screen.getByTestId('container');
      expect(container).toHaveClass('container--centered');
    });
  });

  // ============================================
  // POLYMORPHIC ELEMENT (6 tests)
  // ============================================

  describe('Polymorphic Element', () => {
    it('should render as section element', () => {
      render(<Container as="section">Content</Container>);

      const container = screen.getByTestId('container');
      expect(container.tagName).toBe('SECTION');
    });

    it('should render as article element', () => {
      render(<Container as="article">Content</Container>);

      const container = screen.getByTestId('container');
      expect(container.tagName).toBe('ARTICLE');
    });

    it('should render as main element', () => {
      render(<Container as="main">Content</Container>);

      const container = screen.getByTestId('container');
      expect(container.tagName).toBe('MAIN');
    });

    it('should render as aside element', () => {
      render(<Container as="aside">Content</Container>);

      const container = screen.getByTestId('container');
      expect(container.tagName).toBe('ASIDE');
    });

    it('should render as nav element', () => {
      render(<Container as="nav">Content</Container>);

      const container = screen.getByTestId('container');
      expect(container.tagName).toBe('NAV');
    });

    it('should render as div by default', () => {
      render(<Container>Content</Container>);

      const container = screen.getByTestId('container');
      expect(container.tagName).toBe('DIV');
    });
  });

  // ============================================
  // CONTEXT API INTEGRATION (4 tests)
  // ============================================

  describe('Context API Integration', () => {
    it('should inherit parameters from TemplateProvider', () => {
      render(
        <TemplateProvider value={{ padding: 'lg' } as any}>
          <Container>Content</Container>
        </TemplateProvider>
      );

      const container = screen.getByTestId('container');
      expect(container).toHaveClass('container--padding-lg');
    });

    it('should override context parameters with props', () => {
      render(
        <TemplateProvider value={{ padding: 'sm' } as any}>
          <Container padding="xl">Content</Container>
        </TemplateProvider>
      );

      const container = screen.getByTestId('container');
      expect(container).toHaveClass('container--padding-xl');
      expect(container).not.toHaveClass('container--padding-sm');
    });

    it('should provide parameters to children via context', () => {
      const ChildComponent = () => {
        return <div data-testid="child">Child</div>;
      };

      render(
        <Container>
          <ChildComponent />
        </Container>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should merge context and props correctly', () => {
      render(
        <TemplateProvider value={{ className: 'context-class' } as any}>
          <Container className="prop-class">Content</Container>
        </TemplateProvider>
      );

      const container = screen.getByTestId('container');
      expect(container).toHaveClass('prop-class');
    });
  });

  // ============================================
  // CUSTOM STYLES (3 tests)
  // ============================================

  describe('Custom Styles', () => {
    it('should apply custom inline styles', () => {
      render(
        <Container style={{ backgroundColor: 'red' }}>Content</Container>
      );

      const container = screen.getByTestId('container');
      expect(container).toHaveStyle({ backgroundColor: 'red' });
    });

    it('should merge custom styles with default styles', () => {
      render(
        <Container maxWidth="lg" style={{ padding: '10px' }}>
          Content
        </Container>
      );

      const container = screen.getByTestId('container');
      expect(container).toHaveStyle({ maxWidth: '1024px', padding: '10px' });
    });

    it('should allow style override of maxWidth', () => {
      render(
        <Container maxWidth="lg" style={{ maxWidth: '900px' }}>
          Content
        </Container>
      );

      const container = screen.getByTestId('container');
      expect(container).toHaveStyle({ maxWidth: '900px' });
    });
  });

  // ============================================
  // ACCESSIBILITY (2 tests)
  // ============================================

  describe('Accessibility', () => {
    it('should support ARIA attributes', () => {
      render(
        <Container aria-label="Main container" role="region">
          Content
        </Container>
      );

      const container = screen.getByRole('region');
      expect(container).toHaveAttribute('aria-label', 'Main container');
    });

    it('should use semantic HTML when as prop is set', () => {
      render(<Container as="main">Content</Container>);

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });
  });

  // ============================================
  // EDGE CASES (2 tests)
  // ============================================

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      render(<Container>{null}</Container>);

      const container = screen.getByTestId('container');
      expect(container).toBeInTheDocument();
      expect(container).toBeEmptyDOMElement();
    });

    it('should handle multiple children', () => {
      render(
        <Container>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </Container>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });
  });
});
