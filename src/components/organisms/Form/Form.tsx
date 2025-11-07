/**
 * Form Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * A dynamic form component with validation, error handling, and accessibility.
 * Composed of Input, Textarea, Checkbox, Button, Text, and Heading atoms.
 *
 * @example Basic form
 * ```tsx
 * <Form
 *   fields={[
 *     { id: '1', name: 'email', label: 'Email', type: 'email', required: true }
 *   ]}
 *   onSubmit={(data) => console.log(data)}
 * />
 * ```
 *
 * @example Full-featured form
 * ```tsx
 * <Form
 *   title="Contact Form"
 *   description="Get in touch with us"
 *   fields={fields}
 *   submitText="Send Message"
 *   successMessage="Message sent!"
 *   onSubmit={handleSubmit}
 * />
 * ```
 */

'use client';

import React, { useState, FormEvent } from 'react';
import { useAtomContext, mergeParameters, AtomProvider } from '@/context/parameters/ParameterContext';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { Heading } from '@/components/atoms/Heading';
import type { FormProps, FormField } from './Form.types';
import styles from './Form.module.css';

export const Form: React.FC<FormProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as FormProps;

  // Destructure with defaults
  const {
    title,
    description,
    fields,
    submitText = 'Submit',
    successMessage,
    errorMessage,
    onSubmit,
    onFieldChange,
    layout = 'vertical',
    className = '',
    'data-testid': testId = 'form',
    style,
    ...rest
  } = params;

  // State
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach((field) => {
      initial[field.name] = field.defaultValue || '';
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Handle field change
  const handleChange = (field: FormField, value: string) => {
    setValues((prev) => ({ ...prev, [field.name]: value }));
    onFieldChange?.(field.name, value);

    // Clear error when user starts typing
    if (errors[field.name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field.name];
        return newErrors;
      });
    }
  };

  // Handle field blur (mark as touched)
  const handleBlur = (field: FormField) => {
    setTouched((prev) => ({ ...prev, [field.name]: true }));

    // Validate on blur
    const error = validateField(field, values[field.name]);
    if (error) {
      setErrors((prev) => ({ ...prev, [field.name]: error }));
    }
  };

  // Validate single field
  const validateField = (field: FormField, value: string): string | undefined => {
    // Required validation
    if (field.required && !value.trim()) {
      return `${field.label} is required`;
    }

    // Custom validation
    if (field.validation) {
      return field.validation(value);
    }

    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
      return 'Please enter a valid email address';
    }

    return undefined;
  };

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const error = validateField(field, values[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    fields.forEach((field) => {
      allTouched[field.name] = true;
    });
    setTouched(allTouched);

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Submit form
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await onSubmit(values);
      setSubmitStatus('success');

      // Reset form on success
      const resetValues: Record<string, string> = {};
      fields.forEach((field) => {
        resetValues[field.name] = field.defaultValue || '';
      });
      setValues(resetValues);
      setTouched({});
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute CSS classes
  const classes = [
    styles.form,
    styles[`form--${layout}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Render field based on type
  const renderField = (field: FormField) => {
    const fieldError = touched[field.name] ? errors[field.name] : undefined;
    const fieldId = `${testId}-field-${field.id}`;

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            name={field.name}
            placeholder={field.placeholder}
            value={values[field.name]}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            error={fieldError}
            required={field.required}
            rows={4}
            data-testid={fieldId}
          />
        );

      case 'checkbox':
        return (
          <Checkbox
            id={fieldId}
            name={field.name}
            label={field.label}
            checked={values[field.name] === 'true'}
            onChange={(e) => handleChange(field, e.target.checked ? 'true' : 'false')}
            onBlur={() => handleBlur(field)}
            required={field.required}
            data-testid={fieldId}
          />
        );

      case 'select':
        return (
          <select
            id={fieldId}
            name={field.name}
            value={values[field.name]}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            required={field.required}
            className={styles['form-select']}
            aria-invalid={!!fieldError}
            aria-describedby={fieldError ? `${fieldId}-error` : undefined}
            data-testid={fieldId}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <Input
            id={fieldId}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={values[field.name]}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            error={fieldError}
            required={field.required}
            data-testid={fieldId}
          />
        );
    }
  };

  return (
    <form
      className={classes}
      style={style as React.CSSProperties}
      onSubmit={handleSubmit}
      noValidate
      data-testid={testId}
      {...rest}
    >
      {/* Title */}
      {title && (
        <AtomProvider value={{ align: 'left' }}>
          <Heading
            level="h2"
            className={styles['form-title']}
            data-testid={`${testId}-title`}
          >
            {title}
          </Heading>
        </AtomProvider>
      )}

      {/* Description */}
      {description && (
        <AtomProvider value={{ align: 'left' }}>
          <Text
            className={styles['form-description']}
            data-testid={`${testId}-description`}
          >
            {description}
          </Text>
        </AtomProvider>
      )}

      {/* Fields */}
      <div className={styles['form-fields']} data-testid={`${testId}-fields`}>
        {fields.map((field) => (
          <div
            key={field.id}
            className={[
              styles['form-field'],
              field.type === 'checkbox' && styles['form-field--checkbox'],
            ]
              .filter(Boolean)
              .join(' ')}
            data-testid={`${testId}-field-wrapper-${field.id}`}
          >
            {/* Label (skip for checkbox as it's rendered by Checkbox component) */}
            {field.type !== 'checkbox' && (
              <label
                htmlFor={`${testId}-field-${field.id}`}
                className={styles['form-label']}
              >
                {field.label}
                {field.required && (
                  <span className={styles['form-label-required']} aria-label="required">
                    {' '}*
                  </span>
                )}
              </label>
            )}

            {/* Field input */}
            {renderField(field)}

            {/* Error message for select (Input/Textarea handle their own errors) */}
            {field.type === 'select' && touched[field.name] && errors[field.name] && (
              <p
                id={`${testId}-field-${field.id}-error`}
                className={styles['form-error']}
                role="alert"
              >
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Submit status messages */}
      {submitStatus === 'success' && successMessage && (
        <div
          className={styles['form-message-success']}
          role="status"
          data-testid={`${testId}-success-message`}
        >
          {successMessage}
        </div>
      )}

      {submitStatus === 'error' && errorMessage && (
        <div
          className={styles['form-message-error']}
          role="alert"
          data-testid={`${testId}-error-message`}
        >
          {errorMessage}
        </div>
      )}

      {/* Submit button */}
      <Button
        type="submit"
        text={submitText}
        variant="primary"
        size="md"
        disabled={isSubmitting}
        loading={isSubmitting}
        className={styles['form-submit']}
        data-testid={`${testId}-submit`}
      />
    </form>
  );
};

// Display name for React DevTools
Form.displayName = 'Form';

// Default export for convenience
export default Form;
