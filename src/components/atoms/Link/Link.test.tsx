/**
 * Link Component Tests
 * God-Tier Development Protocol 2025
 *
 * Tests CSS Modules, Context API integration, and accessibility
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { Link } from './Link';
import { AtomProvider } from '@/context/parameters/ParameterContext';
import styles from './Link.module.css';

describe('Link', () => {
  describe('Rendering', () => {
    it('renders link correctly', () => {
      render(<Link href="/test">Test Link</Link>);
      expect(screen.getByTestId('link')).toBeInTheDocument();
    });

    it('renders children', () => {
      render(<Link href="/test">Click here</Link>);
      expect(screen.getByText('Click here')).toBeInTheDocument();
    });

    it('renders with correct href', () => {
      render(<Link href="/about">About</Link>);
      const link = screen.getByTestId('link');
      expect(link).toHaveAttribute('href', '/about');
    });
  });

  describe('Size Variants', () => {
    it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)(
      'applies %s size class',
      (size) => {
        render(
          <Link href="/test" size={size}>
            Link
          </Link>
        );
        const link = screen.getByTestId('link');
        expect(link).toHaveClass(styles[`link--${size}`]);
      }
    );

    it('uses md size by default', () => {
      render(<Link href="/test">Link</Link>);
      const link = screen.getByTestId('link');
      expect(link).toHaveClass(styles['link--md']);
    });
  });

  describe('Variant Styles', () => {
    it.each(['default', 'primary', 'secondary', 'muted', 'underline'] as const)(
      'applies %s variant class',
      (variant) => {
        render(
          <Link href="/test" variant={variant}>
            Link
          </Link>
        );
        const link = screen.getByTestId('link');
        expect(link).toHaveClass(styles[`link--${variant}`]);
      }
    );

    it('uses default variant by default', () => {
      render(<Link href="/test">Link</Link>);
      const link = screen.getByTestId('link');
      expect(link).toHaveClass(styles['link--default']);
    });
  });

  describe('External Links', () => {
    it('applies external link attributes when external is true', () => {
      render(
        <Link href="https://example.com" external>
          External Link
        </Link>
      );
      const link = screen.getByTestId('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('shows external icon when external is true', () => {
      const { container } = render(
        <Link href="https://example.com" external>
          External Link
        </Link>
      );
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('shows external icon when showIcon is true', () => {
      const { container } = render(
        <Link href="/test" showIcon>
          Link with Icon
        </Link>
      );
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('does not show icon by default for internal links', () => {
      const { container } = render(<Link href="/test">Internal Link</Link>);
      const icon = container.querySelector('svg');
      expect(icon).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('applies disabled class when disabled', () => {
      render(
        <Link href="/test" disabled>
          Disabled Link
        </Link>
      );
      const link = screen.getByTestId('link');
      expect(link).toHaveClass(styles['link--disabled']);
    });

    it('applies aria-disabled when disabled', () => {
      render(
        <Link href="/test" disabled>
          Disabled Link
        </Link>
      );
      const link = screen.getByTestId('link');
      expect(link).toHaveAttribute('aria-disabled', 'true');
    });

    it('prevents navigation when disabled', () => {
      const onClick = jest.fn();
      render(
        <Link href="/test" disabled onClick={onClick}>
          Disabled Link
        </Link>
      );
      const link = screen.getByTestId('link');
      fireEvent.click(link);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('removes href when disabled', () => {
      render(
        <Link href="/test" disabled>
          Disabled Link
        </Link>
      );
      const link = screen.getByTestId('link');
      expect(link).not.toHaveAttribute('href');
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(
        <Link href="/test" className="custom-class">
          Link
        </Link>
      );
      const link = screen.getByTestId('link');
      expect(link).toHaveClass('custom-class');
    });

    it('applies custom data-testid', () => {
      render(
        <Link href="/test" data-testid="custom-link">
          Link
        </Link>
      );
      expect(screen.getByTestId('custom-link')).toBeInTheDocument();
    });

    it('forwards HTML anchor props', () => {
      render(
        <Link href="/test" id="my-link" title="My Link">
          Link
        </Link>
      );
      const link = screen.getByTestId('link');
      expect(link).toHaveAttribute('id', 'my-link');
      expect(link).toHaveAttribute('title', 'My Link');
    });

    it('handles custom onClick', () => {
      const onClick = jest.fn();
      render(
        <Link href="/test" onClick={onClick}>
          Link
        </Link>
      );
      const link = screen.getByTestId('link');
      fireEvent.click(link);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Context API Integration', () => {
    it('inherits size from context', () => {
      render(
        <AtomProvider value={{ size: 'lg' }}>
          <Link href="/test">Context Link</Link>
        </AtomProvider>
      );
      const link = screen.getByTestId('link');
      expect(link).toHaveClass(styles['link--lg']);
    });

    it('inherits variant from context', () => {
      render(
        <AtomProvider value={{ variant: 'primary' }}>
          <Link href="/test">Context Link</Link>
        </AtomProvider>
      );
      const link = screen.getByTestId('link');
      expect(link).toHaveClass(styles['link--primary']);
    });

    it('props override context values', () => {
      render(
        <AtomProvider value={{ size: 'sm', variant: 'muted' }}>
          <Link href="/test" size="xl" variant="primary">
            Override Link
          </Link>
        </AtomProvider>
      );
      const link = screen.getByTestId('link');
      expect(link).toHaveClass(styles['link--xl']);
      expect(link).toHaveClass(styles['link--primary']);
      expect(link).not.toHaveClass(styles['link--sm']);
      expect(link).not.toHaveClass(styles['link--muted']);
    });
  });

  describe('CSS Modules', () => {
    it('applies base link class', () => {
      render(<Link href="/test">Link</Link>);
      const link = screen.getByTestId('link');
      expect(link).toHaveClass(styles.link);
    });

    it('applies multiple CSS module classes', () => {
      render(
        <Link href="/test" size="lg" variant="primary">
          Link
        </Link>
      );
      const link = screen.getByTestId('link');
      expect(link).toHaveClass(styles.link);
      expect(link).toHaveClass(styles['link--lg']);
      expect(link).toHaveClass(styles['link--primary']);
    });
  });

  describe('Accessibility', () => {
    it('is keyboard accessible', () => {
      render(<Link href="/test">Link</Link>);
      const link = screen.getByTestId('link');
      link.focus();
      expect(link).toHaveFocus();
    });

    it('external icon is hidden from screen readers', () => {
      const { container } = render(
        <Link href="https://example.com" external>
          External Link
        </Link>
      );
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
