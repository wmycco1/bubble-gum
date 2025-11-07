/**
 * Input Component Stories
 * God-Tier Development Protocol 2025
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    validation: {
      control: 'select',
      options: [undefined, 'valid', 'invalid', 'warning'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// Basic variants
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: 'Example text',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter a number',
    min: 0,
    max: 100,
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    placeholder: 'Medium input',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input',
  },
};

// States
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    value: 'Read-only value',
    readOnly: true,
  },
};

export const Required: Story = {
  args: {
    placeholder: 'Required field',
    required: true,
  },
};

// Validation
export const Valid: Story = {
  args: {
    validation: 'valid',
    defaultValue: 'valid@email.com',
  },
};

export const Invalid: Story = {
  args: {
    validation: 'invalid',
    defaultValue: 'invalid-email',
  },
};

export const Warning: Story = {
  args: {
    validation: 'warning',
    defaultValue: 'This might be incorrect',
  },
};

// With messages
export const WithError: Story = {
  args: {
    id: 'email-input',
    validation: 'invalid',
    error: 'Please enter a valid email address',
    defaultValue: 'invalid-email',
  },
};

export const WithHelperText: Story = {
  args: {
    id: 'password-input',
    helperText: 'Password must be at least 8 characters',
    type: 'password',
  },
};

// All sizes comparison
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
};

// All types
export const AllTypes: Story = {
  render: () => (
    <div className="space-y-4">
      <Input type="text" placeholder="Text" />
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Input type="number" placeholder="Number" />
      <Input type="tel" placeholder="Telephone" />
      <Input type="url" placeholder="URL" />
      <Input type="search" placeholder="Search" />
    </div>
  ),
};
