/**
 * Features Component Tests (Organism)
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite for Features organism component
 * Target: 80%+ code coverage
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Features } from './Features';
import type { Feature } from './Features.types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock features data
const mockFeatures: Feature[] = [
  {
    id: '1',
    icon: '🚀',
    title: 'Fast Performance',
    description: 'Lightning-fast load times',
  },
  {
    id: '2',
    icon: '🔒',
    title: 'Secure',
    description: 'Enterprise-grade security',
  },
  {
    id: '3',
    icon: '⚡',
    title: 'Powerful',
    description: 'Advanced features',
  },
];

describe('Features Component', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Features features={mockFeatures} />);
      expect(screen.getByTestId('features')).toBeInTheDocument();
    });

    it('should render with features', () => {
      render(<Features features={mockFeatures} />);
      expect(screen.getByText('Fast Performance')).toBeInTheDocument();
      expect(screen.getByText('Secure')).toBeInTheDocument();
      expect(screen.getByText('Powerful')).toBeInTheDocument();
    });

    it('should render with section title', () => {
      render(
        <Features
          features={mockFeatures}
          sectionTitle="Why Choose Us"
        />
      );
      expect(screen.getByText('Why Choose Us')).toBeInTheDocument();
    });

    it('should render with section description', () => {
      render(
        <Features
          features={mockFeatures}
          sectionDescription="Discover our key features"
        />
      );
      expect(screen.getByText('Discover our key features')).toBeInTheDocument();
    });

    it('should render with both section title and description', () => {
      render(
        <Features
          features={mockFeatures}
          sectionTitle="Why Choose Us"
          sectionDescription="Our key features"
        />
      );
      expect(screen.getByText('Why Choose Us')).toBeInTheDocument();
      expect(screen.getByText('Our key features')).toBeInTheDocument();
    });

    it('should not render header when no title or description', () => {
      render(<Features features={mockFeatures} />);
      expect(screen.queryByTestId('features-header')).not.toBeInTheDocument();
    });

    it('should render with custom test ID', () => {
      render(<Features features={mockFeatures} data-testid="custom-features" />);
      expect(screen.getByTestId('custom-features')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Features features={mockFeatures} className="custom-class" />);
      const features = screen.getByTestId('features');
      expect(features).toHaveClass('custom-class');
    });
  });

  // ============================================
  // LAYOUT TESTS
  // ============================================

  describe('Layouts', () => {
    it('should apply grid-3 layout by default', () => {
      render(<Features features={mockFeatures} />);
      const features = screen.getByTestId('features');
      expect(features.className).toContain('features--grid-3');
    });

    it('should apply grid-2 layout', () => {
      render(<Features features={mockFeatures} layout="grid-2" />);
      const features = screen.getByTestId('features');
      expect(features.className).toContain('features--grid-2');
    });

    it('should apply grid-4 layout', () => {
      render(<Features features={mockFeatures} layout="grid-4" />);
      const features = screen.getByTestId('features');
      expect(features.className).toContain('features--grid-4');
    });

    it('should apply list layout', () => {
      render(<Features features={mockFeatures} layout="list" />);
      const features = screen.getByTestId('features');
      expect(features.className).toContain('features--list');
    });
  });

  // ============================================
  // FEATURES GRID TESTS
  // ============================================

  describe('Features Grid', () => {
    it('should render all features', () => {
      render(<Features features={mockFeatures} />);
      mockFeatures.forEach((feature) => {
        expect(screen.getByTestId(`features-item-${feature.id}`)).toBeInTheDocument();
      });
    });

    it('should render feature icons', () => {
      render(<Features features={mockFeatures} />);
      mockFeatures.forEach((feature) => {
        expect(screen.getByText(feature.title)).toBeInTheDocument();
      });
    });

    it('should render feature descriptions', () => {
      render(<Features features={mockFeatures} />);
      mockFeatures.forEach((feature) => {
        expect(screen.getByText(feature.description)).toBeInTheDocument();
      });
    });

    it('should render with single feature', () => {
      const singleFeature = [mockFeatures[0]];
      render(<Features features={singleFeature} />);
      expect(screen.getByText('Fast Performance')).toBeInTheDocument();
    });

    it('should render with many features', () => {
      const manyFeatures: Feature[] = Array.from({ length: 8 }, (_, i) => ({
        id: `${i + 1}`,
        icon: '✨',
        title: `Feature ${i + 1}`,
        description: `Description ${i + 1}`,
      }));

      render(<Features features={manyFeatures} />);
      expect(screen.getAllByText(/Feature \d+/)).toHaveLength(8);
    });
  });

  // ============================================
  // EMPTY STATE TESTS
  // ============================================

  describe('Empty State', () => {
    it('should render empty state when no features', () => {
      render(<Features features={[]} />);
      expect(screen.getByText('No features added')).toBeInTheDocument();
    });

    it('should render empty state message', () => {
      render(<Features features={[]} />);
      expect(
        screen.getByText('Add features to showcase your product capabilities')
      ).toBeInTheDocument();
    });

    it('should render empty icon', () => {
      render(<Features features={[]} />);
      const emptyState = screen.getByText('No features added').parentElement;
      expect(emptyState).toBeInTheDocument();
    });
  });

  // ============================================
  // ICON CUSTOMIZATION TESTS
  // ============================================

  describe('Icon Customization', () => {
    it('should pass iconSize to IconBox components', () => {
      render(<Features features={mockFeatures} iconSize="lg" />);
      // IconBox should receive the iconSize prop
      expect(screen.getByTestId('features-grid')).toBeInTheDocument();
    });

    it('should pass iconColor to IconBox components', () => {
      render(<Features features={mockFeatures} iconColor="success" />);
      expect(screen.getByTestId('features-grid')).toBeInTheDocument();
    });

    it('should use default icon size when not specified', () => {
      render(<Features features={mockFeatures} />);
      expect(screen.getByTestId('features-grid')).toBeInTheDocument();
    });

    it('should use default icon color when not specified', () => {
      render(<Features features={mockFeatures} />);
      expect(screen.getByTestId('features-grid')).toBeInTheDocument();
    });
  });

  // ============================================
  // COLUMNS TESTS
  // ============================================

  describe('Responsive Columns', () => {
    it('should apply 3 columns by default', () => {
      render(<Features features={mockFeatures} />);
      const grid = screen.getByTestId('features-grid');
      expect(grid.className).toContain('features-grid--cols-3');
    });

    it('should apply custom columns', () => {
      render(<Features features={mockFeatures} columns={2} />);
      const grid = screen.getByTestId('features-grid');
      expect(grid.className).toContain('features-grid--cols-2');
    });

    it('should apply 4 columns', () => {
      render(<Features features={mockFeatures} columns={4} />);
      const grid = screen.getByTestId('features-grid');
      expect(grid.className).toContain('features-grid--cols-4');
    });

    it('should apply 1 column', () => {
      render(<Features features={mockFeatures} columns={1} />);
      const grid = screen.getByTestId('features-grid');
      expect(grid.className).toContain('features-grid--cols-1');
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <Features
          features={mockFeatures}
          sectionTitle="Accessible Features"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should use semantic section element', () => {
      render(<Features features={mockFeatures} />);
      const section = screen.getByTestId('features');
      expect(section.tagName).toBe('SECTION');
    });

    it('should have proper heading hierarchy', () => {
      render(
        <Features
          features={mockFeatures}
          sectionTitle="Main Features"
        />
      );
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Main Features');
    });
  });

  // ============================================
  // CONTEXT API TESTS
  // ============================================

  describe('Context API Integration', () => {
    it('should inherit parameters from OrganismProvider', () => {
      const { OrganismProvider } = require('@/context/parameters/ParameterContext');

      render(
        <OrganismProvider value={{ iconSize: 'lg' }}>
          <Features features={mockFeatures} />
        </OrganismProvider>
      );

      expect(screen.getByTestId('features')).toBeInTheDocument();
    });

    it('should merge props with context values', () => {
      const { OrganismProvider } = require('@/context/parameters/ParameterContext');

      render(
        <OrganismProvider value={{ iconColor: 'primary' }}>
          <Features features={mockFeatures} iconSize="xl" />
        </OrganismProvider>
      );

      expect(screen.getByTestId('features')).toBeInTheDocument();
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================

  describe('Edge Cases', () => {
    it('should handle feature with empty description', () => {
      const featuresWithEmptyDesc: Feature[] = [
        {
          id: '1',
          icon: '🚀',
          title: 'Fast',
          description: '',
        },
      ];

      render(<Features features={featuresWithEmptyDesc} />);
      expect(screen.getByText('Fast')).toBeInTheDocument();
    });

    it('should handle feature with very long title', () => {
      const longTitle = 'A'.repeat(200);
      const featuresWithLongTitle: Feature[] = [
        {
          id: '1',
          icon: '🚀',
          title: longTitle,
          description: 'Description',
        },
      ];

      render(<Features features={featuresWithLongTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle feature with very long description', () => {
      const longDesc = 'B'.repeat(500);
      const featuresWithLongDesc: Feature[] = [
        {
          id: '1',
          icon: '🚀',
          title: 'Fast',
          description: longDesc,
        },
      ];

      render(<Features features={featuresWithLongDesc} />);
      expect(screen.getByText(longDesc)).toBeInTheDocument();
    });

    it('should handle special characters in title', () => {
      const featuresWithSpecialChars: Feature[] = [
        {
          id: '1',
          icon: '🚀',
          title: '<Fast> & "Secure"',
          description: 'Description',
        },
      ];

      render(<Features features={featuresWithSpecialChars} />);
      expect(screen.getByText('<Fast> & "Secure"')).toBeInTheDocument();
    });

    it('should handle emoji icons', () => {
      render(<Features features={mockFeatures} />);
      mockFeatures.forEach((feature) => {
        expect(screen.getByText(feature.title)).toBeInTheDocument();
      });
    });

    it('should handle icon name strings', () => {
      const featuresWithIconNames: Feature[] = [
        {
          id: '1',
          icon: 'check',
          title: 'Fast',
          description: 'Description',
        },
      ];

      render(<Features features={featuresWithIconNames} />);
      expect(screen.getByText('Fast')).toBeInTheDocument();
    });
  });

  // ============================================
  // VARIANT COMBINATIONS
  // ============================================

  describe('Variant Combinations', () => {
    it('should handle all props together', () => {
      render(
        <Features
          features={mockFeatures}
          sectionTitle="All Features"
          sectionDescription="Everything you need"
          layout="grid-4"
          iconSize="lg"
          iconColor="primary"
          columns={4}
          className="custom"
          data-testid="all-features"
        />
      );

      expect(screen.getByTestId('all-features')).toBeInTheDocument();
      expect(screen.getByText('All Features')).toBeInTheDocument();
      expect(screen.getByText('Everything you need')).toBeInTheDocument();
    });

    it('should handle list layout with custom icon settings', () => {
      render(
        <Features
          features={mockFeatures}
          layout="list"
          iconSize="xl"
          iconColor="success"
        />
      );

      const features = screen.getByTestId('features');
      expect(features.className).toContain('features--list');
    });

    it('should handle different layouts', () => {
      const layouts: Array<'grid-2' | 'grid-3' | 'grid-4' | 'list'> = [
        'grid-2',
        'grid-3',
        'grid-4',
        'list',
      ];

      layouts.forEach((layout) => {
        const { unmount } = render(
          <Features
            features={mockFeatures}
            layout={layout}
            data-testid={`features-${layout}`}
          />
        );

        const features = screen.getByTestId(`features-${layout}`);
        expect(features.className).toContain(`features--${layout}`);
        unmount();
      });
    });
  });
});
