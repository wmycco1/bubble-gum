import { render } from '@testing-library/react';
import { Divider } from './Divider';

describe('Divider', () => {
  it('renders horizontal by default', () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('[role="separator"]')).toBeInTheDocument();
  });

  it('renders vertical', () => {
    const { container } = render(<Divider orientation="vertical" />);
    const divider = container.querySelector('[role="separator"]');
    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
  });
});
