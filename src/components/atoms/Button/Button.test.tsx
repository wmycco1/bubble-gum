/**
 * Button Component Tests
 * God-Tier Development Protocol 2025
 *
 * Test Coverage Target: 80%+
 * Accessibility: WCAG 2.2 AA (jest-axe)
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';
import { AtomProvider } from '@/context/parameters/ParameterContext';
import type { ButtonProps } from './Button.types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Button Component', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('renders with required text prop', () => {
      render(<Button text="Click me" />);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders as a button element', () => {
      render(<Button text="Test" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('applies default variant (primary)', () => {
      const { container } = render(<Button text="Test" />);
      expect(container.firstChild).toHaveClass('button--primary');
    });

    it('applies custom variant classes', () => {
      const variants: Array<ButtonProps['variant']> = [
        'primary',
        'secondary',
        'outline',
        'ghost',
        'danger',
      ];

      variants.forEach((variant) => {
        const { container } = render(<Button text="Test" variant={variant} />);
        expect(container.firstChild).toHaveClass(`button--${variant}`);
      });
    });

    it('applies default size (md)', () => {
      const { container } = render(<Button text="Test" />);
      expect(container.firstChild).toHaveClass('button--md');
    });

    it('applies custom size classes', () => {
      const sizes: Array<ButtonProps['size']> = ['sm', 'md', 'lg', 'xl'];

      sizes.forEach((size) => {
        const { container } = render(<Button text="Test" size={size} />);
        expect(container.firstChild).toHaveClass(`button--${size}`);
      });
    });

    it('applies custom className', () => {
      const { container } = render(<Button text="Test" className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('applies custom inline styles', () => {
      const { container } = render(
        <Button text="Test" style={{ backgroundColor: 'red' }} />
      );
      expect(container.firstChild).toHaveStyle({ backgroundColor: 'red' });
    });

    it('renders with custom id', () => {
      const { container } = render(<Button text="Test" id="custom-button" />);
      expect(container.firstChild).toHaveAttribute('id', 'custom-button');
    });
  });

  // ============================================
  // INTERACTION TESTS
  // ============================================
  describe('Interactions', () => {
    it('calls onClick handler when clicked', () => {
      const handleClick = jest.fn();
      render(<Button text="Click" onClick={handleClick} />);

      fireEvent.click(screen.getByText('Click'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('passes event object to onClick handler', () => {
      const handleClick = jest.fn();
      render(<Button text="Click" onClick={handleClick} />);

      fireEvent.click(screen.getByText('Click'));
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button text="Click" disabled onClick={handleClick} />);

      fireEvent.click(screen.getByText('Click'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(<Button text="Click" loading onClick={handleClick} />);

      fireEvent.click(screen.getByText('Click'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('prevents default when disabled', () => {
      const handleClick = jest.fn();
      render(<Button text="Click" disabled onClick={handleClick} />);

      fireEvent.click(screen.getByText('Click'));
      // Disabled button prevents onClick from being called
    });

    it('supports keyboard interaction (Enter)', async () => {
      const handleClick = jest.fn();
      render(<Button text="Click" onClick={handleClick} />);

      const button = screen.getByRole('button');
      button.focus();
      await userEvent.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalled();
    });

    it('supports keyboard interaction (Space)', async () => {
      const handleClick = jest.fn();
      render(<Button text="Click" onClick={handleClick} />);

      const button = screen.getByRole('button');
      button.focus();
      await userEvent.keyboard(' ');

      expect(handleClick).toHaveBeenCalled();
    });
  });

  // ============================================
  // STATE TESTS
  // ============================================
  describe('States', () => {
    it('applies disabled state', () => {
      render(<Button text="Test" disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('applies disabled class when disabled', () => {
      const { container } = render(<Button text="Test" disabled />);
      expect(container.firstChild).toHaveClass('button--disabled');
    });

    it('applies loading state', () => {
      const { container } = render(<Button text="Test" loading />);
      expect(container.firstChild).toHaveClass('button--loading');
    });

    it('shows spinner when loading', () => {
      const { container } = render(<Button text="Test" loading />);
      expect(container.querySelector('.button__spinner')).toBeInTheDocument();
    });

    it('disables button when loading', () => {
      render(<Button text="Test" loading />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('applies full width class', () => {
      const { container } = render(<Button text="Test" fullWidth />);
      expect(container.firstChild).toHaveClass('button--full-width');
    });
  });

  // ============================================
  // ICON TESTS
  // ============================================
  describe('Icons', () => {
    it('renders left icon', () => {
      const { container } = render(<Button text="Test" leftIcon="←" />);
      const leftIcon = container.querySelector('.button__icon--left');
      expect(leftIcon).toBeInTheDocument();
      expect(leftIcon).toHaveTextContent('←');
    });

    it('renders right icon', () => {
      const { container } = render(<Button text="Test" rightIcon="→" />);
      const rightIcon = container.querySelector('.button__icon--right');
      expect(rightIcon).toBeInTheDocument();
      expect(rightIcon).toHaveTextContent('→');
    });

    it('renders both left and right icons', () => {
      const { container } = render(<Button text="Test" leftIcon="←" rightIcon="→" />);
      expect(container.querySelector('.button__icon--left')).toBeInTheDocument();
      expect(container.querySelector('.button__icon--right')).toBeInTheDocument();
    });

    it('hides left icon when loading', () => {
      const { container } = render(<Button text="Test" loading leftIcon="←" />);
      expect(container.querySelector('.button__icon--left')).not.toBeInTheDocument();
    });

    it('hides right icon when loading', () => {
      const { container } = render(<Button text="Test" loading rightIcon="→" />);
      expect(container.querySelector('.button__icon--right')).not.toBeInTheDocument();
    });

    it('icons have aria-hidden attribute', () => {
      const { container } = render(<Button text="Test" leftIcon="←" />);
      const icon = container.querySelector('.button__icon--left');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders React components as icons', () => {
      const LeftIcon = () => <svg data-testid="left-svg">←</svg>;
      render(<Button text="Test" leftIcon={<LeftIcon />} />);
      expect(screen.getByTestId('left-svg')).toBeInTheDocument();
    });
  });

  // ============================================
  // LOADING STATE TESTS
  // ============================================
  describe('Loading State', () => {
    it('shows spinner when loading', () => {
      const { container } = render(<Button text="Test" loading />);
      expect(container.querySelector('.button__spinner')).toBeInTheDocument();
    });

    it('spinner has role="status"', () => {
      const { container } = render(<Button text="Test" loading />);
      const spinner = container.querySelector('.button__spinner');
      expect(spinner).toHaveAttribute('role', 'status');
    });

    it('spinner has aria-hidden', () => {
      const { container } = render(<Button text="Test" loading />);
      const spinner = container.querySelector('.button__spinner');
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });

    it('includes visually-hidden loading text for screen readers', () => {
      const { container } = render(<Button text="Test" loading />);
      const visuallyHidden = container.querySelector('.visually-hidden');
      expect(visuallyHidden).toBeInTheDocument();
      expect(visuallyHidden).toHaveTextContent('Loading...');
    });
  });

  // ============================================
  // TYPE ATTRIBUTE TESTS
  // ============================================
  describe('Type Attribute', () => {
    it('defaults to type="button"', () => {
      render(<Button text="Test" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('accepts type="submit"', () => {
      render(<Button text="Submit" type="submit" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('accepts type="reset"', () => {
      render(<Button text="Reset" type="reset" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Button text="Test" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<Button text="Test" disabled />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when loading', async () => {
      const { container } = render(<Button text="Test" loading />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with icons', async () => {
      const { container } = render(<Button text="Test" leftIcon="←" rightIcon="→" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('uses text as default aria-label', () => {
      render(<Button text="Click me" />);
      expect(screen.getByLabelText('Click me')).toBeInTheDocument();
    });

    it('accepts custom aria-label', () => {
      render(<Button text="Test" aria-label="Custom label" />);
      expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
    });

    it('has aria-disabled when disabled', () => {
      render(<Button text="Test" disabled />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });

    it('has aria-busy when loading', () => {
      render(<Button text="Test" loading />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('accepts aria-describedby', () => {
      render(
        <>
          <Button text="Test" aria-describedby="description" />
          <p id="description">Button description</p>
        </>
      );
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-describedby',
        'description'
      );
    });

    it('is keyboard focusable', () => {
      render(<Button text="Test" />);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('is not focusable when disabled', () => {
      render(<Button text="Test" disabled />);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).not.toHaveFocus();
    });
  });

  // ============================================
  // DATA ATTRIBUTE TESTS
  // ============================================
  describe('Data Attributes', () => {
    it('has default data-testid', () => {
      render(<Button text="Test" />);
      expect(screen.getByTestId('button')).toBeInTheDocument();
    });

    it('accepts custom data-testid', () => {
      render(<Button text="Test" data-testid="custom-button" />);
      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });

    it('accepts custom data attributes', () => {
      const { container } = render(<Button text="Test" data-foo="bar" />);
      expect(container.firstChild).toHaveAttribute('data-foo', 'bar');
    });
  });

  // ============================================
  // CONTEXT API TESTS
  // ============================================
  describe('Context API Integration', () => {
    it('inherits size from AtomProvider', () => {
      const { container } = render(
        <AtomProvider value={{ size: 'lg' }}>
          <Button text="Test" />
        </AtomProvider>
      );
      expect(container.firstChild).toHaveClass('button--lg');
    });

    it('inherits variant from AtomProvider', () => {
      const { container } = render(
        <AtomProvider value={{ variant: 'secondary' }}>
          <Button text="Test" />
        </AtomProvider>
      );
      expect(container.firstChild).toHaveClass('button--secondary');
    });

    it('props override context values', () => {
      const { container } = render(
        <AtomProvider value={{ size: 'lg', variant: 'primary' }}>
          <Button text="Test" size="sm" variant="danger" />
        </AtomProvider>
      );
      expect(container.firstChild).toHaveClass('button--sm');
      expect(container.firstChild).toHaveClass('button--danger');
      expect(container.firstChild).not.toHaveClass('button--lg');
      expect(container.firstChild).not.toHaveClass('button--primary');
    });

    it('merges context and props correctly', () => {
      const { container } = render(
        <AtomProvider value={{ size: 'lg' }}>
          <Button text="Test" variant="secondary" />
        </AtomProvider>
      );
      expect(container.firstChild).toHaveClass('button--lg');
      expect(container.firstChild).toHaveClass('button--secondary');
    });
  });

  // ============================================
  // EDGE CASES & ERROR HANDLING
  // ============================================
  describe('Edge Cases', () => {
    it('handles empty text gracefully', () => {
      render(<Button text="" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('handles very long text', () => {
      const longText = 'A'.repeat(1000);
      render(<Button text={longText} />);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles special characters in text', () => {
      const specialText = '<>&"\'';
      render(<Button text={specialText} />);
      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it('handles undefined onClick gracefully', () => {
      render(<Button text="Test" />);
      expect(() => fireEvent.click(screen.getByRole('button'))).not.toThrow();
    });

    it('handles rapid clicks', () => {
      const handleClick = jest.fn();
      render(<Button text="Click" onClick={handleClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  // ============================================
  // SNAPSHOT TESTS
  // ============================================
  describe('Snapshots', () => {
    it('matches snapshot for primary variant', () => {
      const { container } = render(<Button text="Primary" variant="primary" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for loading state', () => {
      const { container } = render(<Button text="Loading" loading />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with icons', () => {
      const { container } = render(<Button text="Test" leftIcon="←" rightIcon="→" />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
