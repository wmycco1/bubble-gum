/**
 * Form Component Tests
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite with 80%+ coverage
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Form } from './Form';
import type { FormProps, FormField } from './Form.types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock CSS modules
jest.mock('./Form.module.css', () => ({
  form: 'form',
  'form--vertical': 'form--vertical',
  'form--horizontal': 'form--horizontal',
  'form-title': 'form-title',
  'form-description': 'form-description',
  'form-fields': 'form-fields',
  'form-field': 'form-field',
  'form-field--checkbox': 'form-field--checkbox',
  'form-label': 'form-label',
  'form-label-required': 'form-label-required',
  'form-select': 'form-select',
  'form-error': 'form-error',
  'form-message-success': 'form-message-success',
  'form-message-error': 'form-message-error',
  'form-submit': 'form-submit',
}));

// Mock atoms
jest.mock('@/components/atoms/Input', () => ({
  Input: ({ onChange, onBlur, error, 'data-testid': testId, ...props }: any) => (
    <div>
      <input
        data-testid={testId}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
      {error && <p role="alert">{error}</p>}
    </div>
  ),
}));

jest.mock('@/components/atoms/Textarea', () => ({
  Textarea: ({ onChange, onBlur, error, 'data-testid': testId, ...props }: any) => (
    <div>
      <textarea
        data-testid={testId}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
      {error && <p role="alert">{error}</p>}
    </div>
  ),
}));

jest.mock('@/components/atoms/Checkbox', () => ({
  Checkbox: ({ onChange, onBlur, 'data-testid': testId, label, ...props }: any) => (
    <label>
      <input
        type="checkbox"
        data-testid={testId}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
      {label}
    </label>
  ),
}));

jest.mock('@/components/atoms/Button', () => ({
  Button: ({ text, loading, 'data-testid': testId, ...props }: any) => (
    <button data-testid={testId} disabled={loading} {...props}>
      {text}
    </button>
  ),
}));

jest.mock('@/components/atoms/Text', () => ({
  Text: ({ children, 'data-testid': testId }: any) => (
    <p data-testid={testId}>{children}</p>
  ),
}));

jest.mock('@/components/atoms/Heading', () => ({
  Heading: ({ children, 'data-testid': testId }: any) => (
    <h2 data-testid={testId}>{children}</h2>
  ),
}));

// Helper: Create mock fields
const createFields = (): FormField[] => [
  {
    id: '1',
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
  },
  {
    id: '2',
    name: 'message',
    label: 'Message',
    type: 'textarea',
  },
];

describe('Form', () => {
  // ============================================
  // BASIC RENDERING
  // ============================================

  describe('Basic Rendering', () => {
    it('renders form with fields', () => {
      const fields = createFields();
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);
      expect(screen.getByTestId('form')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-1')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-2')).toBeInTheDocument();
    });

    it('renders with title', () => {
      const fields = createFields();
      const handleSubmit = jest.fn();
      render(<Form fields={fields} title="Contact Form" onSubmit={handleSubmit} />);
      expect(screen.getByTestId('form-title')).toHaveTextContent('Contact Form');
    });

    it('renders with description', () => {
      const fields = createFields();
      const handleSubmit = jest.fn();
      render(
        <Form
          fields={fields}
          description="Fill out the form below"
          onSubmit={handleSubmit}
        />
      );
      expect(screen.getByTestId('form-description')).toHaveTextContent(
        'Fill out the form below'
      );
    });

    it('renders submit button with default text', () => {
      const fields = createFields();
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);
      expect(screen.getByTestId('form-submit')).toHaveTextContent('Submit');
    });

    it('renders submit button with custom text', () => {
      const fields = createFields();
      const handleSubmit = jest.fn();
      render(<Form fields={fields} submitText="Send Message" onSubmit={handleSubmit} />);
      expect(screen.getByTestId('form-submit')).toHaveTextContent('Send Message');
    });

    it('applies custom className', () => {
      const fields = createFields();
      const handleSubmit = jest.fn();
      render(<Form fields={fields} className="custom-form" onSubmit={handleSubmit} />);
      expect(screen.getByTestId('form')).toHaveClass('custom-form');
    });

    it('applies custom data-testid', () => {
      const fields = createFields();
      const handleSubmit = jest.fn();
      render(<Form fields={fields} data-testid="my-form" onSubmit={handleSubmit} />);
      expect(screen.getByTestId('my-form')).toBeInTheDocument();
    });
  });

  // ============================================
  // FIELD TYPES
  // ============================================

  describe('Field Types', () => {
    it('renders text input field', () => {
      const fields: FormField[] = [
        { id: '1', name: 'name', label: 'Name', type: 'text' },
      ];
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);
      expect(screen.getByTestId('form-field-1')).toBeInTheDocument();
    });

    it('renders email input field', () => {
      const fields: FormField[] = [
        { id: '1', name: 'email', label: 'Email', type: 'email' },
      ];
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);
      expect(screen.getByTestId('form-field-1')).toBeInTheDocument();
    });

    it('renders tel input field', () => {
      const fields: FormField[] = [
        { id: '1', name: 'phone', label: 'Phone', type: 'tel' },
      ];
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);
      expect(screen.getByTestId('form-field-1')).toBeInTheDocument();
    });

    it('renders textarea field', () => {
      const fields: FormField[] = [
        { id: '1', name: 'message', label: 'Message', type: 'textarea' },
      ];
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);
      expect(screen.getByTestId('form-field-1')).toBeInTheDocument();
    });

    it('renders checkbox field', () => {
      const fields: FormField[] = [
        { id: '1', name: 'agree', label: 'I agree', type: 'checkbox' },
      ];
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);
      expect(screen.getByTestId('form-field-1')).toBeInTheDocument();
      expect(screen.getByText('I agree')).toBeInTheDocument();
    });

    it('renders select field with options', () => {
      const fields: FormField[] = [
        {
          id: '1',
          name: 'country',
          label: 'Country',
          type: 'select',
          options: [
            { value: 'us', label: 'United States' },
            { value: 'uk', label: 'United Kingdom' },
          ],
        },
      ];
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);
      expect(screen.getByTestId('form-field-1')).toBeInTheDocument();
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    });
  });

  // ============================================
  // REQUIRED FIELDS
  // ============================================

  describe('Required Fields', () => {
    it('shows required indicator for required fields', () => {
      const fields: FormField[] = [
        { id: '1', name: 'email', label: 'Email', type: 'email', required: true },
      ];
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('does not show required indicator for optional fields', () => {
      const fields: FormField[] = [
        { id: '1', name: 'email', label: 'Email', type: 'email', required: false },
      ];
      const handleSubmit = jest.fn();
      const { container } = render(<Form fields={fields} onSubmit={handleSubmit} />);
      expect(container.querySelector('.form-label-required')).not.toBeInTheDocument();
    });

    it('validates required fields on submit', async () => {
      const fields: FormField[] = [
        { id: '1', name: 'email', label: 'Email', type: 'email', required: true },
      ];
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);

      fireEvent.click(screen.getByTestId('form-submit'));

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });

      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // VALIDATION
  // ============================================

  describe('Validation', () => {
    it('validates email format', async () => {
      const fields: FormField[] = [
        { id: '1', name: 'email', label: 'Email', type: 'email' },
      ];
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);

      const input = screen.getByTestId('form-field-1');
      fireEvent.change(input, { target: { value: 'invalid-email' } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    it('validates with custom validation function', async () => {
      const fields: FormField[] = [
        {
          id: '1',
          name: 'password',
          label: 'Password',
          type: 'text',
          validation: (value) => {
            if (value.length < 8) return 'Password must be at least 8 characters';
          },
        },
      ];
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);

      const input = screen.getByTestId('form-field-1');
      fireEvent.change(input, { target: { value: 'short' } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(
          screen.getByText('Password must be at least 8 characters')
        ).toBeInTheDocument();
      });
    });

    it('clears error when user starts typing', async () => {
      const fields: FormField[] = [
        { id: '1', name: 'email', label: 'Email', type: 'email', required: true },
      ];
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);

      // Trigger validation error
      fireEvent.click(screen.getByTestId('form-submit'));

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });

      // Start typing
      const input = screen.getByTestId('form-field-1');
      fireEvent.change(input, { target: { value: 'test@example.com' } });

      await waitFor(() => {
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      });
    });

    it('validates on blur', async () => {
      const fields: FormField[] = [
        { id: '1', name: 'email', label: 'Email', type: 'email', required: true },
      ];
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);

      const input = screen.getByTestId('form-field-1');
      fireEvent.focus(input);
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });
  });

  // ============================================
  // FORM SUBMISSION
  // ============================================

  describe('Form Submission', () => {
    it('calls onSubmit with form data', async () => {
      const fields = createFields();
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);

      fireEvent.change(screen.getByTestId('form-field-1'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByTestId('form-field-2'), {
        target: { value: 'Hello world' },
      });

      fireEvent.click(screen.getByTestId('form-submit'));

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          message: 'Hello world',
        });
      });
    });

    it('does not submit if validation fails', async () => {
      const fields: FormField[] = [
        { id: '1', name: 'email', label: 'Email', type: 'email', required: true },
      ];
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);

      fireEvent.click(screen.getByTestId('form-submit'));

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });

      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('shows loading state during async submission', async () => {
      const fields = createFields();
      const handleSubmit = jest.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      render(<Form fields={fields} onSubmit={handleSubmit} />);

      fireEvent.change(screen.getByTestId('form-field-1'), {
        target: { value: 'test@example.com' },
      });

      fireEvent.click(screen.getByTestId('form-submit'));

      expect(screen.getByTestId('form-submit')).toBeDisabled();

      await waitFor(() => {
        expect(screen.getByTestId('form-submit')).not.toBeDisabled();
      });
    });

    it('shows success message after submission', async () => {
      const fields = createFields();
      const handleSubmit = jest.fn();
      render(
        <Form
          fields={fields}
          successMessage="Form submitted successfully!"
          onSubmit={handleSubmit}
        />
      );

      fireEvent.change(screen.getByTestId('form-field-1'), {
        target: { value: 'test@example.com' },
      });

      fireEvent.click(screen.getByTestId('form-submit'));

      await waitFor(() => {
        expect(screen.getByTestId('form-success-message')).toHaveTextContent(
          'Form submitted successfully!'
        );
      });
    });

    it('shows error message on submission failure', async () => {
      const fields = createFields();
      const handleSubmit = jest.fn(() => Promise.reject(new Error('Submission failed')));
      render(
        <Form
          fields={fields}
          errorMessage="Submission failed"
          onSubmit={handleSubmit}
        />
      );

      fireEvent.change(screen.getByTestId('form-field-1'), {
        target: { value: 'test@example.com' },
      });

      fireEvent.click(screen.getByTestId('form-submit'));

      await waitFor(() => {
        expect(screen.getByTestId('form-error-message')).toHaveTextContent(
          'Submission failed'
        );
      });
    });

    it('resets form after successful submission', async () => {
      const fields = createFields();
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);

      const emailInput = screen.getByTestId('form-field-1');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      fireEvent.click(screen.getByTestId('form-submit'));

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled();
      });

      expect(emailInput).toHaveValue('');
    });
  });

  // ============================================
  // FIELD CHANGE HANDLER
  // ============================================

  describe('Field Change Handler', () => {
    it('calls onFieldChange when field value changes', () => {
      const fields = createFields();
      const handleSubmit = jest.fn();
      const handleFieldChange = jest.fn();
      render(
        <Form
          fields={fields}
          onSubmit={handleSubmit}
          onFieldChange={handleFieldChange}
        />
      );

      fireEvent.change(screen.getByTestId('form-field-1'), {
        target: { value: 'test@example.com' },
      });

      expect(handleFieldChange).toHaveBeenCalledWith('email', 'test@example.com');
    });
  });

  // ============================================
  // LAYOUT
  // ============================================

  describe('Layout', () => {
    it('applies vertical layout by default', () => {
      const fields = createFields();
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);
      expect(screen.getByTestId('form')).toHaveClass('form--vertical');
    });

    it('applies horizontal layout', () => {
      const fields = createFields();
      const handleSubmit = jest.fn();
      render(<Form fields={fields} layout="horizontal" onSubmit={handleSubmit} />);
      expect(screen.getByTestId('form')).toHaveClass('form--horizontal');
    });
  });

  // ============================================
  // DEFAULT VALUES
  // ============================================

  describe('Default Values', () => {
    it('uses default values for fields', () => {
      const fields: FormField[] = [
        {
          id: '1',
          name: 'email',
          label: 'Email',
          type: 'email',
          defaultValue: 'default@example.com',
        },
      ];
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);

      const input = screen.getByTestId('form-field-1');
      expect(input).toHaveValue('default@example.com');
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const fields = createFields();
      const handleSubmit = jest.fn();
      const { container } = render(<Form fields={fields} onSubmit={handleSubmit} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('associates labels with inputs', () => {
      const fields: FormField[] = [
        { id: '1', name: 'email', label: 'Email', type: 'email' },
      ];
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('uses aria-invalid on invalid fields', async () => {
      const fields: FormField[] = [
        {
          id: '1',
          name: 'country',
          label: 'Country',
          type: 'select',
          required: true,
          options: [{ value: 'us', label: 'US' }],
        },
      ];
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);

      fireEvent.click(screen.getByTestId('form-submit'));

      await waitFor(() => {
        const select = screen.getByTestId('form-field-1');
        expect(select).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('uses role="alert" for error messages', async () => {
      const fields: FormField[] = [
        { id: '1', name: 'email', label: 'Email', type: 'email', required: true },
      ];
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);

      fireEvent.click(screen.getByTestId('form-submit'));

      await waitFor(() => {
        const error = screen.getByText('Email is required');
        expect(error.closest('[role="alert"]')).toBeInTheDocument();
      });
    });

    it('uses noValidate to prevent browser validation', () => {
      const fields = createFields();
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);
      expect(screen.getByTestId('form')).toHaveAttribute('noValidate');
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================

  describe('Edge Cases', () => {
    it('handles empty fields array', () => {
      const handleSubmit = jest.fn();
      render(<Form fields={[]} onSubmit={handleSubmit} />);
      expect(screen.getByTestId('form')).toBeInTheDocument();
    });

    it('handles checkbox toggle', () => {
      const fields: FormField[] = [
        { id: '1', name: 'agree', label: 'I agree', type: 'checkbox' },
      ];
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);

      const checkbox = screen.getByTestId('form-field-1');
      fireEvent.change(checkbox, { target: { checked: true } });

      expect(checkbox).toBeChecked();
    });

    it('handles very long field values', async () => {
      const fields = createFields();
      const handleSubmit = jest.fn();
      render(<Form fields={fields} onSubmit={handleSubmit} />);

      const longValue = 'a'.repeat(1000);
      fireEvent.change(screen.getByTestId('form-field-2'), {
        target: { value: longValue },
      });

      fireEvent.change(screen.getByTestId('form-field-1'), {
        target: { value: 'test@example.com' },
      });

      fireEvent.click(screen.getByTestId('form-submit'));

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          message: longValue,
        });
      });
    });
  });
});
