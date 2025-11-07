/**
 * Heading Component Tests
 * God-Tier Development Protocol 2025
 *
 * Tests CSS Modules, Context API integration, and accessibility
 */

import { render, screen } from '@testing-library/react';
import { Heading } from './Heading';
import { AtomProvider } from '@/context/parameters/ParameterContext';
import styles from './Heading.module.css';

describe('Heading', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(<Heading>Test Heading</Heading>);
      expect(screen.getByText('Test Heading')).toBeInTheDocument();
    });

    it('renders as h2 by default', () => {
      const { container } = render(<Heading>Heading</Heading>);
      expect(container.querySelector('h2')).toBeInTheDocument();
    });
  });

  describe('Heading Levels', () => {
    it.each(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const)(
      'renders as %s element',
      (level) => {
        const { container } = render(<Heading level={level}>Heading</Heading>);
        expect(container.querySelector(level)).toBeInTheDocument();
        expect(container.querySelector(level)).toHaveClass(styles[`heading--${level}`]);
      }
    );
  });

  describe('Alignment', () => {
    it.each(['left', 'center', 'right'] as const)(
      'applies %s alignment',
      (align) => {
        const { container } = render(<Heading align={align}>Heading</Heading>);
        const heading = container.querySelector('h2');
        expect(heading).toHaveClass(styles[`heading--${align}`]);
      }
    );
  });

  describe('Colors', () => {
    it.each(['default', 'muted', 'primary'] as const)(
      'applies %s color',
      (color) => {
        const { container } = render(<Heading color={color}>Heading</Heading>);
        const heading = container.querySelector('h2');
        expect(heading).toHaveClass(styles[`heading--${color}`]);
      }
    );
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Heading className="custom-class">Heading</Heading>);
      const heading = container.querySelector('h2');
      expect(heading).toHaveClass('custom-class');
    });

    it('applies id attribute', () => {
      render(<Heading id="custom-id">Heading</Heading>);
      expect(screen.getByText('Heading')).toHaveAttribute('id', 'custom-id');
    });

    it('applies aria-label', () => {
      render(<Heading aria-label="Custom label">Heading</Heading>);
      expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
    });
  });

  describe('Data Attributes', () => {
    it('has default data-testid', () => {
      render(<Heading>Content</Heading>);
      expect(screen.getByTestId('heading')).toBeInTheDocument();
    });

    it('uses custom data-testid', () => {
      render(<Heading data-testid="custom-heading">Content</Heading>);
      expect(screen.getByTestId('custom-heading')).toBeInTheDocument();
    });
  });

  describe('Context API Integration', () => {
    it('inherits align from context', () => {
      const { container } = render(
        <AtomProvider value={{ align: 'center' }}>
          <Heading>Context heading</Heading>
        </AtomProvider>
      );
      const heading = container.querySelector('h2');
      expect(heading).toHaveClass(styles['heading--center']);
    });

    it('inherits color from context', () => {
      const { container } = render(
        <AtomProvider value={{ color: 'primary' }}>
          <Heading>Context heading</Heading>
        </AtomProvider>
      );
      const heading = container.querySelector('h2');
      expect(heading).toHaveClass(styles['heading--primary']);
    });

    it('props override context values', () => {
      const { container } = render(
        <AtomProvider value={{ align: 'left', color: 'muted' }}>
          <Heading align="right" color="primary">Override heading</Heading>
        </AtomProvider>
      );
      const heading = container.querySelector('h2');
      expect(heading).toHaveClass(styles['heading--right']);
      expect(heading).toHaveClass(styles['heading--primary']);
      expect(heading).not.toHaveClass(styles['heading--left']);
      expect(heading).not.toHaveClass(styles['heading--muted']);
    });
  });

  describe('CSS Modules', () => {
    it('applies base heading class', () => {
      const { container } = render(<Heading>Heading</Heading>);
      const heading = container.querySelector('h2');
      expect(heading).toHaveClass(styles.heading);
    });

    it('applies multiple CSS module classes', () => {
      const { container } = render(
        <Heading level="h1" align="center" color="primary">
          Heading
        </Heading>
      );
      const heading = container.querySelector('h1');
      expect(heading).toHaveClass(styles.heading);
      expect(heading).toHaveClass(styles['heading--h1']);
      expect(heading).toHaveClass(styles['heading--center']);
      expect(heading).toHaveClass(styles['heading--primary']);
    });
  });
});
