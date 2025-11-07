import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: 'Badge' } };
export const Primary: Story = { args: { variant: 'primary', children: 'Primary' } };
export const Success: Story = { args: { variant: 'success', children: 'Success' } };
export const Warning: Story = { args: { variant: 'warning', children: 'Warning' } };
export const Error: Story = { args: { variant: 'error', children: 'Error' } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
    </div>
  ),
};
