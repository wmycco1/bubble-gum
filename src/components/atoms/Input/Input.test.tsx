/**
 * Input Component Tests
 * God-Tier Development Protocol 2025
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  describe('Rendering', () => {
    it('renders input field', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders with value', () => {
      render(<Input value="test value" onChange={() => {}} />);
      expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
    });

    it('renders with default value', () => {
      render(<Input defaultValue="default" />);
      expect(screen.getByDisplayValue('default')).toBeInTheDocument();
    });
  });

  describe('Input Types', () => {
    it.each(['text', 'email', 'password', 'number', 'tel', 'url'] as const)(
      'renders %s type correctly',
      (type) => {
        render(<Input type={type} data-testid={`input-${type}`} />);
        const input = screen.getByTestId(`input-${type}`);
        expect(input).toHaveAttribute('type', type);
      }
    );
  });

  describe('Sizes', () => {
    it.each(['sm', 'md', 'lg'] as const)('renders %s size correctly', (size) => {
      const { container } = render(<Input size={size} />);
      const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('disables input when disabled prop is true', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('makes input readonly when readOnly prop is true', () => {
      render(<Input readOnly />);
      expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    });

    it('marks input as required', () => {
      render(<Input required />);
      expect(screen.getByRole('textbox')).toBeRequired();
    });
  });

  describe('Validation', () => {
    it('shows error message', () => {
      render(<Input id="test" error="This field is required" />);
      expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
    });

    it('shows helper text', () => {
      render(<Input id="test" helperText="Enter your email address" />);
      expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    });

    it('prioritizes error over helper text', () => {
      render(
        <Input
          id="test"
          error="Error message"
          helperText="Helper text"
        />
      );
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });

    it('sets aria-invalid when validation is invalid', () => {
      render(<Input validation="invalid" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('sets aria-describedby for error', () => {
      render(<Input id="test" error="Error" />);
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-describedby',
        expect.stringContaining('test-error')
      );
    });
  });

  describe('Interactions', () => {
    it('calls onChange when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'test');

      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus when focused', async () => {
      const user = userEvent.setup();
      const handleFocus = jest.fn();

      render(<Input onFocus={handleFocus} />);
      const input = screen.getByRole('textbox');

      await user.click(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();

      render(<Input onBlur={handleBlur} />);
      const input = screen.getByRole('textbox');

      await user.click(input);
      await user.tab();

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('does not call onChange when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Input disabled onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'test');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('uses aria-label', () => {
      render(<Input aria-label="Email address" />);
      expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    });

    it('uses custom aria-describedby', () => {
      render(<Input aria-describedby="custom-description" />);
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-describedby',
        expect.stringContaining('custom-description')
      );
    });

    it('supports maxLength attribute', () => {
      render(<Input maxLength={10} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '10');
    });

    it('supports pattern attribute', () => {
      render(<Input pattern="[0-9]*" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('pattern', '[0-9]*');
    });
  });

  describe('Number Input', () => {
    it('supports min attribute', () => {
      render(<Input type="number" min={0} />);
      expect(screen.getByRole('spinbutton')).toHaveAttribute('min', '0');
    });

    it('supports max attribute', () => {
      render(<Input type="number" max={100} />);
      expect(screen.getByRole('spinbutton')).toHaveAttribute('max', '100');
    });

    it('supports step attribute', () => {
      render(<Input type="number" step={0.01} />);
      expect(screen.getByRole('spinbutton')).toHaveAttribute('step', '0.01');
    });
  });

  describe('Data Attributes', () => {
    it('has default data-testid', () => {
      render(<Input />);
      expect(screen.getByTestId('input')).toBeInTheDocument();
    });

    it('uses custom data-testid', () => {
      render(<Input data-testid="custom-input" />);
      expect(screen.getByTestId('custom-input')).toBeInTheDocument();
    });
  });
});
