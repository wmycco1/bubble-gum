import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Atoms/Divider',
  component: Divider,
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => <div style={{ height: '100px' }}><Divider {...args} /></div>,
};

export const Thick: Story = {
  args: { thickness: 'thick' },
};
