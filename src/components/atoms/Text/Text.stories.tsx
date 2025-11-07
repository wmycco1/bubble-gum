/**
 * Text Component Stories
 * God-Tier Development Protocol 2025
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Atoms/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['p', 'span', 'div', 'label'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
    },
    color: {
      control: 'select',
      options: [
        'default',
        'muted',
        'primary',
        'secondary',
        'success',
        'warning',
        'error',
      ],
    },
    italic: { control: 'boolean' },
    underline: { control: 'boolean' },
    lineThrough: { control: 'boolean' },
    truncate: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

// Basic variants
export const Default: Story = {
  args: {
    children: 'This is default text',
  },
};

export const Paragraph: Story = {
  args: {
    as: 'p',
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
};

export const Span: Story = {
  args: {
    as: 'span',
    children: 'This is inline text',
  },
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Text size="xs">Extra small text</Text>
      <Text size="sm">Small text</Text>
      <Text size="md">Medium text (default)</Text>
      <Text size="lg">Large text</Text>
      <Text size="xl">Extra large text</Text>
      <Text size="2xl">2XL text</Text>
      <Text size="3xl">3XL text</Text>
    </div>
  ),
};

// Weights
export const Weights: Story = {
  render: () => (
    <div className="space-y-4">
      <Text weight="normal">Normal weight</Text>
      <Text weight="medium">Medium weight</Text>
      <Text weight="semibold">Semibold weight</Text>
      <Text weight="bold">Bold weight</Text>
    </div>
  ),
};

// Alignment
export const Alignment: Story = {
  render: () => (
    <div className="space-y-4">
      <Text align="left">Left aligned text</Text>
      <Text align="center">Center aligned text</Text>
      <Text align="right">Right aligned text</Text>
      <Text align="justify">
        Justified text. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
        aliqua.
      </Text>
    </div>
  ),
};

// Colors
export const Colors: Story = {
  render: () => (
    <div className="space-y-4">
      <Text color="default">Default color</Text>
      <Text color="muted">Muted color</Text>
      <Text color="primary">Primary color</Text>
      <Text color="secondary">Secondary color</Text>
      <Text color="success">Success color</Text>
      <Text color="warning">Warning color</Text>
      <Text color="error">Error color</Text>
    </div>
  ),
};

// Text Styles
export const Italic: Story = {
  args: {
    italic: true,
    children: 'Italic text',
  },
};

export const Underline: Story = {
  args: {
    underline: true,
    children: 'Underlined text',
  },
};

export const LineThrough: Story = {
  args: {
    lineThrough: true,
    children: 'Strikethrough text',
  },
};

export const CombinedStyles: Story = {
  args: {
    weight: 'bold',
    italic: true,
    underline: true,
    children: 'Bold, italic, and underlined',
  },
};

// Truncation
export const Truncate: Story = {
  args: {
    truncate: true,
    children:
      'This is a very long text that will be truncated with an ellipsis when it exceeds the available width',
  },
};

export const MaxLines: Story = {
  args: {
    maxLines: 2,
    children:
      'This text will be clamped to 2 lines maximum. Any additional content beyond that will be hidden with an ellipsis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
};

// Composition examples
export const ComplexExample: Story = {
  render: () => (
    <div className="space-y-4">
      <Text size="3xl" weight="bold" align="center" color="primary">
        Main Heading
      </Text>
      <Text size="lg" weight="medium" align="center" color="muted">
        Subheading text
      </Text>
      <Text align="justify">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        ad minim veniam, quis nostrud exercitation ullamco laboris.
      </Text>
      <Text size="sm" color="success" weight="semibold">
        ✓ Success message
      </Text>
      <Text size="sm" color="error" weight="semibold">
        ✗ Error message
      </Text>
    </div>
  ),
};
