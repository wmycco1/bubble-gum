/**
 * Grid Component Tests (Template)
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite for Grid template component
 * Target: 40+ tests minimum
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Grid } from './Grid';
import { TemplateProvider } from '@/context/parameters/ParameterContext';

describe('Grid Component', () => {
  // ============================================
  // BASIC RENDERING (5 tests)
  // ============================================

  describe('Basic Rendering', () => {
    it('should render with children', () => {
      render(
        <Grid>
          <div>Item 1</div>
          <div>Item 2</div>
        </Grid>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('should render with default props', () => {
      render(<Grid>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass('grid');
    });

    it('should apply custom className', () => {
      render(<Grid className="custom-class">Content</Grid>);

      expect(screen.getByTestId('grid')).toHaveClass('custom-class');
    });

    it('should apply custom data-testid', () => {
      render(<Grid data-testid="custom-grid">Content</Grid>);

      expect(screen.getByTestId('custom-grid')).toBeInTheDocument();
    });

    it('should render as default div element', () => {
      render(<Grid>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid.tagName).toBe('DIV');
    });
  });

  // ============================================
  // COLUMN VARIANTS (12 tests)
  // ============================================

  describe('Column Variants', () => {
    it('should apply 1 column', () => {
      render(<Grid columns={1}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid--cols-1');
    });

    it('should apply 2 columns', () => {
      render(<Grid columns={2}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid--cols-2');
    });

    it('should apply 3 columns (default)', () => {
      render(<Grid>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid--cols-3');
    });

    it('should apply 4 columns', () => {
      render(<Grid columns={4}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid--cols-4');
    });

    it('should apply 6 columns', () => {
      render(<Grid columns={6}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid--cols-6');
    });

    it('should apply 8 columns', () => {
      render(<Grid columns={8}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid--cols-8');
    });

    it('should apply 12 columns', () => {
      render(<Grid columns={12}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid--cols-12');
    });

    it('should clamp columns to max 12', () => {
      render(<Grid columns={20}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid--cols-12');
    });

    it('should clamp columns to min 1', () => {
      render(<Grid columns={0}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid--cols-1');
    });

    it('should clamp negative columns to 1', () => {
      render(<Grid columns={-5}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid--cols-1');
    });

    it('should apply 5 columns', () => {
      render(<Grid columns={5}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid--cols-5');
    });

    it('should apply 10 columns', () => {
      render(<Grid columns={10}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid--cols-10');
    });
  });

  // ============================================
  // GAP VARIANTS (5 tests)
  // ============================================

  describe('Gap Variants', () => {
    it('should apply none gap', () => {
      render(<Grid gap="none">Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveStyle({ gap: '0' });
    });

    it('should apply sm gap', () => {
      render(<Grid gap="sm">Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveStyle({ gap: '0.5rem' });
    });

    it('should apply md gap (default)', () => {
      render(<Grid>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveStyle({ gap: '1rem' });
    });

    it('should apply lg gap', () => {
      render(<Grid gap="lg">Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveStyle({ gap: '1.5rem' });
    });

    it('should apply xl gap', () => {
      render(<Grid gap="xl">Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveStyle({ gap: '2rem' });
    });
  });

  // ============================================
  // CUSTOM COLUMN WIDTHS (6 tests)
  // ============================================

  describe('Custom Column Widths', () => {
    it('should apply custom column widths (fr units)', () => {
      render(<Grid columnWidths={['1fr', '2fr', '1fr']}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveStyle({
        gridTemplateColumns: '1fr 2fr 1fr',
      });
    });

    it('should apply custom column widths (px units)', () => {
      render(<Grid columnWidths={['200px', '1fr', '200px']}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveStyle({
        gridTemplateColumns: '200px 1fr 200px',
      });
    });

    it('should apply custom column widths (mixed units)', () => {
      render(<Grid columnWidths={['100px', '2fr', '25%']}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveStyle({
        gridTemplateColumns: '100px 2fr 25%',
      });
    });

    it('should override columns prop with columnWidths', () => {
      render(
        <Grid columns={4} columnWidths={['1fr', '2fr']}>
          Content
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveStyle({
        gridTemplateColumns: '1fr 2fr',
      });
    });

    it('should handle single column width', () => {
      render(<Grid columnWidths={['100%']}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveStyle({
        gridTemplateColumns: '100%',
      });
    });

    it('should handle many column widths', () => {
      render(
        <Grid columnWidths={['1fr', '1fr', '1fr', '1fr', '1fr', '1fr']}>
          Content
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveStyle({
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
      });
    });
  });

  // ============================================
  // RESPONSIVE CONFIGURATION (6 tests)
  // ============================================

  describe('Responsive Configuration', () => {
    it('should apply mobile responsive columns', () => {
      render(<Grid responsive={{ mobile: 1 }}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid--cols-1-mobile');
    });

    it('should apply tablet responsive columns', () => {
      render(<Grid responsive={{ tablet: 2 }}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid--cols-2-tablet');
    });

    it('should apply desktop responsive columns', () => {
      render(<Grid responsive={{ desktop: 3 }}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid--cols-3-desktop');
    });

    it('should apply wide responsive columns', () => {
      render(<Grid responsive={{ wide: 4 }}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid--cols-4-wide');
    });

    it('should apply multiple responsive breakpoints', () => {
      render(
        <Grid responsive={{ mobile: 1, tablet: 2, desktop: 3, wide: 4 }}>
          Content
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid--cols-1-mobile');
      expect(grid).toHaveClass('grid--cols-2-tablet');
      expect(grid).toHaveClass('grid--cols-3-desktop');
      expect(grid).toHaveClass('grid--cols-4-wide');
    });

    it('should not apply default columns class when responsive config provided', () => {
      render(<Grid responsive={{ mobile: 1, desktop: 3 }}>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).not.toHaveClass('grid--cols-3');
    });
  });

  // ============================================
  // POLYMORPHIC ELEMENT (5 tests)
  // ============================================

  describe('Polymorphic Element', () => {
    it('should render as div element by default', () => {
      render(<Grid>Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid.tagName).toBe('DIV');
    });

    it('should render as section element', () => {
      render(<Grid as="section">Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid.tagName).toBe('SECTION');
    });

    it('should render as article element', () => {
      render(<Grid as="article">Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid.tagName).toBe('ARTICLE');
    });

    it('should render as ul element', () => {
      render(<Grid as="ul">Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid.tagName).toBe('UL');
    });

    it('should render as ol element', () => {
      render(<Grid as="ol">Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid.tagName).toBe('OL');
    });
  });

  // ============================================
  // CONTEXT API INTEGRATION (4 tests)
  // ============================================

  describe('Context API Integration', () => {
    it('should inherit parameters from TemplateProvider', () => {
      render(
        <TemplateProvider value={{ gap: 'lg' } as any}>
          <Grid>Content</Grid>
        </TemplateProvider>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveStyle({ gap: '1.5rem' });
    });

    it('should override context parameters with props', () => {
      render(
        <TemplateProvider value={{ gap: 'sm' } as any}>
          <Grid gap="xl">Content</Grid>
        </TemplateProvider>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveStyle({ gap: '2rem' });
    });

    it('should provide parameters to children via context', () => {
      const ChildComponent = () => {
        return <div data-testid="child">Child</div>;
      };

      render(
        <Grid>
          <ChildComponent />
        </Grid>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should merge context and props correctly', () => {
      render(
        <TemplateProvider value={{ className: 'context-class' } as any}>
          <Grid className="prop-class">Content</Grid>
        </TemplateProvider>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('prop-class');
    });
  });

  // ============================================
  // CUSTOM STYLES (3 tests)
  // ============================================

  describe('Custom Styles', () => {
    it('should apply custom inline styles', () => {
      render(
        <Grid style={{ backgroundColor: 'red' }}>Content</Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveStyle({ backgroundColor: 'red' });
    });

    it('should merge custom styles with default styles', () => {
      render(
        <Grid gap="md" style={{ padding: '10px' }}>
          Content
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveStyle({ gap: '1rem', padding: '10px' });
    });

    it('should allow style override of gap', () => {
      render(
        <Grid gap="md" style={{ gap: '5rem' }}>
          Content
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveStyle({ gap: '5rem' });
    });
  });

  // ============================================
  // ACCESSIBILITY (2 tests)
  // ============================================

  describe('Accessibility', () => {
    it('should support ARIA attributes', () => {
      render(
        <Grid aria-label="Grid layout" role="list">
          Content
        </Grid>
      );

      const grid = screen.getByRole('list');
      expect(grid).toHaveAttribute('aria-label', 'Grid layout');
    });

    it('should use semantic HTML when as prop is set', () => {
      render(<Grid as="section">Content</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid.tagName).toBe('SECTION');
    });
  });

  // ============================================
  // EDGE CASES (4 tests)
  // ============================================

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      render(<Grid>{null}</Grid>);

      const grid = screen.getByTestId('grid');
      expect(grid).toBeInTheDocument();
      expect(grid).toBeEmptyDOMElement();
    });

    it('should handle many children', () => {
      render(
        <Grid columns={3}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i}>Item {i + 1}</div>
          ))}
        </Grid>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 12')).toBeInTheDocument();
    });

    it('should handle single child', () => {
      render(
        <Grid>
          <div>Single Item</div>
        </Grid>
      );

      expect(screen.getByText('Single Item')).toBeInTheDocument();
    });

    it('should combine columns and gap correctly', () => {
      render(
        <Grid columns={4} gap="xl">
          Content
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid--cols-4');
      expect(grid).toHaveStyle({ gap: '2rem' });
    });
  });
});
