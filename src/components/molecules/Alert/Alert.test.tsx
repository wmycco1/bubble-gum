/**
 * Alert Component Tests (Molecule)
 * God-Tier Development Protocol 2025
 *
 * Tests CSS Modules, Context API integration, Atom composition, and accessibility
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from './Alert';
import { AtomProvider } from '@/context/parameters/ParameterContext';
import styles from './Alert.module.css';

describe('Alert', () => {
  describe('Rendering', () => {
    it('renders alert correctly', () => {
      render(<Alert message="Test message" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders message', () => {
      render(<Alert message="Test alert message" />);
      expect(screen.getByText('Test alert message')).toBeInTheDocument();
    });

    it('renders title when provided', () => {
      render(<Alert title="Alert Title" message="Message" />);
      expect(screen.getByText('Alert Title')).toBeInTheDocument();
    });

    it('does not render title when not provided', () => {
      const { container } = render(<Alert message="Message" />);
      const heading = container.querySelector('h4');
      expect(heading).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it.each(['info', 'success', 'warning', 'error'] as const)(
      'renders %s variant correctly',
      (variant) => {
        render(<Alert variant={variant} message="Test" />);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass(styles[`alert--${variant}`]);
      }
    );

    it('uses info variant by default', () => {
      render(<Alert message="Test" />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass(styles['alert--info']);
    });
  });

  describe('Dismissible Functionality', () => {
    it('shows dismiss button when dismissible is true', () => {
      render(<Alert message="Test" dismissible />);
      expect(screen.getByLabelText('Dismiss alert')).toBeInTheDocument();
    });

    it('shows dismiss button by default', () => {
      render(<Alert message="Test" />);
      expect(screen.getByLabelText('Dismiss alert')).toBeInTheDocument();
    });

    it('hides dismiss button when dismissible is false', () => {
      render(<Alert message="Test" dismissible={false} />);
      expect(screen.queryByLabelText('Dismiss alert')).not.toBeInTheDocument();
    });

    it('hides alert when dismiss button is clicked', () => {
      render(<Alert message="Test" dismissible />);
      const dismissButton = screen.getByLabelText('Dismiss alert');
      fireEvent.click(dismissButton);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('calls onDismiss callback when dismissed', () => {
      const onDismiss = jest.fn();
      render(<Alert message="Test" dismissible onDismiss={onDismiss} />);
      const dismissButton = screen.getByLabelText('Dismiss alert');
      fireEvent.click(dismissButton);
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not crash if onDismiss is not provided', () => {
      render(<Alert message="Test" dismissible />);
      const dismissButton = screen.getByLabelText('Dismiss alert');
      expect(() => fireEvent.click(dismissButton)).not.toThrow();
    });
  });

  describe('Atom Composition', () => {
    it('renders Icon atom', () => {
      const { container } = render(<Alert message="Test" />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders Text atom for message', () => {
      render(<Alert message="Test message" />);
      const text = screen.getByText('Test message');
      expect(text).toBeInTheDocument();
    });

    it('renders Heading atom for title', () => {
      render(<Alert title="Test Title" message="Message" />);
      const heading = screen.getByText('Test Title');
      expect(heading.tagName).toBe('H4');
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(<Alert message="Test" className="custom-class" />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('custom-class');
    });

    it('applies custom data-testid', () => {
      render(<Alert message="Test" data-testid="custom-alert" />);
      expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
    });

    it('dismiss button has correct testid', () => {
      render(<Alert message="Test" data-testid="my-alert" />);
      expect(screen.getByTestId('my-alert-dismiss')).toBeInTheDocument();
    });
  });

  describe('Context API Integration', () => {
    it('inherits parameters from context', () => {
      render(
        <AtomProvider value={{ size: 'lg' }}>
          <Alert message="Context test" />
        </AtomProvider>
      );
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('props override context values', () => {
      render(
        <AtomProvider value={{ variant: 'info' }}>
          <Alert variant="error" message="Override test" />
        </AtomProvider>
      );
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass(styles['alert--error']);
      expect(alert).not.toHaveClass(styles['alert--info']);
    });
  });

  describe('CSS Modules', () => {
    it('applies base alert class', () => {
      render(<Alert message="Test" />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass(styles.alert);
    });

    it('applies variant-specific class', () => {
      render(<Alert variant="success" message="Test" />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass(styles.alert);
      expect(alert).toHaveClass(styles['alert--success']);
    });

    it('applies alert-icon class to icon container', () => {
      const { container } = render(<Alert message="Test" />);
      const iconContainer = container.querySelector(`.${styles['alert-icon']}`);
      expect(iconContainer).toBeInTheDocument();
    });

    it('applies alert-content class to content container', () => {
      const { container } = render(<Alert message="Test" />);
      const contentContainer = container.querySelector(`.${styles['alert-content']}`);
      expect(contentContainer).toBeInTheDocument();
    });

    it('applies alert-dismiss class to dismiss button', () => {
      const { container } = render(<Alert message="Test" dismissible />);
      const dismissButton = container.querySelector(`.${styles['alert-dismiss']}`);
      expect(dismissButton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has role="alert"', () => {
      render(<Alert message="Test" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('dismiss button has aria-label', () => {
      render(<Alert message="Test" dismissible />);
      expect(screen.getByLabelText('Dismiss alert')).toBeInTheDocument();
    });

    it('dismiss button is keyboard accessible', () => {
      render(<Alert message="Test" dismissible />);
      const dismissButton = screen.getByLabelText('Dismiss alert');
      dismissButton.focus();
      expect(dismissButton).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty message gracefully', () => {
      render(<Alert message="" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('handles very long message', () => {
      const longMessage = 'A'.repeat(500);
      render(<Alert message={longMessage} />);
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('handles special characters in message', () => {
      const message = '<script>alert("XSS")</script>';
      render(<Alert message={message} />);
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });
});
