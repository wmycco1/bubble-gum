/**
 * Heading Component Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from './Heading';

const meta: Meta<typeof Heading> = {
  title: 'Atoms/Heading',
  component: Heading,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const H1: Story = {
  args: { level: 'h1', children: 'Heading 1' },
};

export const H2: Story = {
  args: { level: 'h2', children: 'Heading 2' },
};

export const H3: Story = {
  args: { level: 'h3', children: 'Heading 3' },
};

export const AllLevels: Story = {
  render: () => (
    <div className="space-y-4">
      <Heading level="h1">Heading 1</Heading>
      <Heading level="h2">Heading 2</Heading>
      <Heading level="h3">Heading 3</Heading>
      <Heading level="h4">Heading 4</Heading>
      <Heading level="h5">Heading 5</Heading>
      <Heading level="h6">Heading 6</Heading>
    </div>
  ),
};
