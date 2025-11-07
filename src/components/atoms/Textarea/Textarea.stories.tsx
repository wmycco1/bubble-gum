import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { placeholder: 'Enter your message...' },
};

export const WithError: Story = {
  args: { error: 'Message is required', placeholder: 'Enter message' },
};

export const WithHelperText: Story = {
  args: { helperText: 'Maximum 500 characters', rows: 6 },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Disabled content' },
};
