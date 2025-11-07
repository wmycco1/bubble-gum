/**
 * Form Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Form organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * Form field types
 */
export type FormFieldType = 'text' | 'email' | 'tel' | 'textarea' | 'checkbox' | 'select';

/**
 * Form layout orientations
 */
export type FormLayout = 'vertical' | 'horizontal';

/**
 * Select option for dropdown fields
 */
export interface SelectOption {
  /**
   * Option value
   */
  value: string;

  /**
   * Option label displayed to user
   */
  label: string;
}

/**
 * Form field configuration
 */
export interface FormField {
  /**
   * Unique field identifier
   */
  id: string;

  /**
   * Field name (for form submission)
   */
  name: string;

  /**
   * Field label
   */
  label: string;

  /**
   * Field type
   */
  type: FormFieldType;

  /**
   * Whether field is required
   * @default false
   */
  required?: boolean;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Options for select field
   */
  options?: SelectOption[];

  /**
   * Custom validation function
   * @returns Error message if invalid, undefined if valid
   */
  validation?: (value: string) => string | undefined;

  /**
   * Default value for field
   */
  defaultValue?: string;
}

/**
 * Form Props
 *
 * @example Basic form
 * ```tsx
 * <Form
 *   fields={[
 *     { id: '1', name: 'email', label: 'Email', type: 'email', required: true },
 *     { id: '2', name: 'message', label: 'Message', type: 'textarea' }
 *   ]}
 *   submitText="Send"
 *   onSubmit={(data) => console.log(data)}
 * />
 * ```
 *
 * @example Advanced form with validation
 * ```tsx
 * <Form
 *   title="Contact Us"
 *   description="Fill out the form below"
 *   fields={[
 *     {
 *       id: '1',
 *       name: 'email',
 *       label: 'Email',
 *       type: 'email',
 *       required: true,
 *       validation: (value) => {
 *         if (!value.includes('@')) return 'Invalid email';
 *       }
 *     }
 *   ]}
 *   submitText="Submit"
 *   successMessage="Form submitted successfully!"
 *   onSubmit={async (data) => {
 *     await api.submit(data);
 *   }}
 *   onFieldChange={(name, value) => {
 *     console.log(`${name}: ${value}`);
 *   }}
 * />
 * ```
 *
 * @example Horizontal layout
 * ```tsx
 * <Form
 *   fields={fields}
 *   layout="horizontal"
 *   onSubmit={handleSubmit}
 * />
 * ```
 */
export interface FormProps extends OrganismParameters {
  /**
   * Form title
   */
  title?: string;

  /**
   * Form description
   */
  description?: string;

  /**
   * Form fields configuration (required)
   */
  fields: FormField[];

  /**
   * Submit button text
   * @default 'Submit'
   */
  submitText?: string;

  /**
   * Success message to display after submission
   */
  successMessage?: string;

  /**
   * Error message to display on submission failure
   */
  errorMessage?: string;

  /**
   * Form submission handler (required)
   * Can be sync or async
   */
  onSubmit: (data: Record<string, string>) => void | Promise<void>;

  /**
   * Field change handler
   */
  onFieldChange?: (fieldName: string, value: string) => void;

  /**
   * Form layout orientation
   * @default 'vertical'
   */
  layout?: FormLayout;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'form'
   */
  'data-testid'?: string;
}

/**
 * Form component that supports Context API parameter inheritance
 */
export type FormComponent = React.FC<FormProps>;
