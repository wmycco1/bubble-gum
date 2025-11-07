import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: 'Accept terms and conditions' },
};

export const Checked: Story = {
  args: { defaultChecked: true, label: 'Checked by default' },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'Disabled checkbox' },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox size="sm" label="Small" />
      <Checkbox size="md" label="Medium" />
      <Checkbox size="lg" label="Large" />
    </div>
  ),
};
