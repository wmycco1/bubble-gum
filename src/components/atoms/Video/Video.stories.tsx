import type { Meta, StoryObj } from '@storybook/react';
import { Video } from './Video';

const meta: Meta<typeof Video> = {
  title: 'Atoms/Video',
  component: Video,
};

export default meta;
type Story = StoryObj<typeof Video>;

export const Default: Story = {
  args: {
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    width: 640,
    height: 360,
  },
};

export const WithPoster: Story = {
  args: {
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://via.placeholder.com/640x360',
  },
};

export const Autoplay: Story = {
  args: {
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    autoplay: true,
    muted: true,
    loop: true,
  },
};
