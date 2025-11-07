import type { Meta, StoryObj } from '@storybook/react';
import { Submit } from './Submit';

const meta: Meta<typeof Submit> = {
  title: 'Atoms/Submit',
  component: Submit,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Submit>;

export const Default: Story = {};

export const CustomValue: Story = {
  args: { value: 'Send Message' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { loading: true },
};
