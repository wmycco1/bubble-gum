import type { Meta, StoryObj } from '@storybook/react';
import { HTML } from './HTML';

const meta: Meta<typeof HTML> = {
  title: 'Atoms/HTML',
  component: HTML,
};

export default meta;
type Story = StoryObj<typeof HTML>;

export const Default: Story = {
  args: { content: '<p>Basic HTML content</p>' },
};

export const RichContent: Story = {
  args: { content: '<h2>Title</h2><p>Paragraph with <strong>bold</strong> and <em>italic</em>.</p>' },
};
