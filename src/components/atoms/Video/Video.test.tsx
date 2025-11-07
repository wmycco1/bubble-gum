import { render, screen } from '@testing-library/react';
import { Video } from './Video';

describe('Video', () => {
  it('renders video element', () => {
    render(<Video src="test.mp4" aria-label="Test video" />);
    expect(screen.getByLabelText('Test video')).toBeInTheDocument();
  });

  it('has controls by default', () => {
    const { container } = render(<Video src="test.mp4" />);
    const video = container.querySelector('video');
    expect(video).toHaveAttribute('controls');
  });

  it('supports autoplay', () => {
    const { container } = render(<Video src="test.mp4" autoplay />);
    const video = container.querySelector('video');
    expect(video).toHaveAttribute('autoplay');
  });
});
