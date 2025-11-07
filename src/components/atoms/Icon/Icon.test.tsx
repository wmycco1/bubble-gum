/**
 * Icon Component Tests
 * God-Tier Development Protocol 2025
 *
 * Tests CSS Modules, Context API integration, and accessibility
 */

import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';
import { AtomProvider } from '@/context/parameters/ParameterContext';
import styles from './Icon.module.css';

describe('Icon', () => {
  describe('Rendering', () => {
    it('renders icon correctly', () => {
      render(<Icon name="heart" />);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders with icon name in title', () => {
      const { container } = render(<Icon name="star" />);
      const title = container.querySelector('title');
      expect(title).toHaveTextContent('star');
    });
  });

  describe('Size Variants', () => {
    it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)(
      'applies %s size class',
      (size) => {
        render(<Icon name="heart" size={size} />);
        const icon = screen.getByTestId('icon');
        expect(icon).toHaveClass(styles[`icon--${size}`]);
      }
    );

    it('uses md size by default', () => {
      render(<Icon name="heart" />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveClass(styles['icon--md']);
    });
  });

  describe('Color Variants', () => {
    it.each(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'muted'] as const)(
      'applies %s color class',
      (color) => {
        render(<Icon name="heart" color={color} />);
        const icon = screen.getByTestId('icon');
        expect(icon).toHaveClass(styles[`icon--${color}`]);
      }
    );

    it('uses default color by default', () => {
      render(<Icon name="heart" />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveClass(styles['icon--default']);
    });
  });

  describe('Accessibility', () => {
    it('has role="img" when not decorative', () => {
      render(<Icon name="heart" aria-label="Like" />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('role', 'img');
    });

    it('has role="presentation" when decorative', () => {
      render(<Icon name="heart" aria-hidden={true} />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('role', 'presentation');
    });

    it('applies aria-label when provided', () => {
      render(<Icon name="heart" aria-label="Favorite" />);
      expect(screen.getByLabelText('Favorite')).toBeInTheDocument();
    });

    it('applies aria-hidden when decorative', () => {
      render(<Icon name="heart" aria-hidden={true} />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(<Icon name="heart" className="custom-class" />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveClass('custom-class');
    });

    it('applies custom data-testid', () => {
      render(<Icon name="heart" data-testid="custom-icon" />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('forwards SVG props', () => {
      render(<Icon name="heart" id="my-icon" />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('id', 'my-icon');
    });
  });

  describe('Context API Integration', () => {
    it('inherits size from context', () => {
      render(
        <AtomProvider value={{ size: 'lg' }}>
          <Icon name="heart" />
        </AtomProvider>
      );
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveClass(styles['icon--lg']);
    });

    it('inherits color from context', () => {
      render(
        <AtomProvider value={{ color: 'primary' }}>
          <Icon name="heart" />
        </AtomProvider>
      );
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveClass(styles['icon--primary']);
    });

    it('props override context values', () => {
      render(
        <AtomProvider value={{ size: 'sm', color: 'muted' }}>
          <Icon name="heart" size="xl" color="error" />
        </AtomProvider>
      );
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveClass(styles['icon--xl']);
      expect(icon).toHaveClass(styles['icon--error']);
      expect(icon).not.toHaveClass(styles['icon--sm']);
      expect(icon).not.toHaveClass(styles['icon--muted']);
    });
  });

  describe('CSS Modules', () => {
    it('applies base icon class', () => {
      render(<Icon name="heart" />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveClass(styles.icon);
    });

    it('applies multiple CSS module classes', () => {
      render(<Icon name="heart" size="lg" color="primary" />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveClass(styles.icon);
      expect(icon).toHaveClass(styles['icon--lg']);
      expect(icon).toHaveClass(styles['icon--primary']);
    });
  });
});
